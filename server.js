const express = require("express");
const BodyParser = require("body-parser");

var app = express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.all("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

const cors = require('cors');
app.use(cors());

const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Daeseob:trackie400@pickupmeetup-b0afy.mongodb.net/test?retryWrites=true&w=majority";

const client = new MongoClient(uri, { 
	useNewUrlParser: true,
	useUnifiedTopology: true
});

var database, locations, users;

app.listen(3000, () => {
	client.connect(function(err, db) {
		if (err) throw err;
		console.log("Connection Successful");

		database = db.db("PickUpDatabase");
		console.log("Database created PickUpDatabase");

		database.createCollection('Locations',  function(err, collection) {
			if (err) throw err;
			console.log("Location collection created");
		});
		database.createCollection('Users', function(err, collection) {
			if (err) throw err;
			console.log("Users collection created");
		})
		
		locations = database.collection("Locations");
		users = database.collection("Users");
	});
});

// Locations API
app.get("/Locations", (req, res) => {
	locations.find({}).toArray((error, result) => {
		if (error) {
			return res.status(500).send(error);
		}
		res.send(JSON.stringify(result));
	});
});

app.post("/Locations", (req, res) => {
	console.log("posting");
	locations.insertOne(req.body, (error, result) => {
		if (error) {
			return res.status(500).send(error);
		}
		res.send(JSON.stringify({ status:"Posting Successful" }));
	});
})

app.put("/join/Locations/:gameID", async (req, res) => {
	console.log("putting");
	const requestID = req.params.id;
	let newNum = parseInt(req.body.pickUpInfo.numOfPlayers) + 1;

	try {
		await locations.findOneAndUpdate(
			{ "gameId" : requestID },
			{ $set : { "pickUpInfo.numOfPlayers" : newNum.toString() } },
			{ upsert:true, returnNewDocument : true } );
		res.send({ status:"Putting Successful" });
	}
	catch (e){
		res.send({status:e});
		console.log(e);
	}
})

app.put("/leave/Locations/:gameID", async (req, res) => {
	console.log("putting");
	const requestID = req.params.id;
	let newNum = parseInt(req.body.pickUpInfo.numOfPlayers) - 1;

	try {
		let doc = await locations.findOneAndUpdate(
			{ "gameId" : requestID },
			{ $set : { "pickUpInfo.numOfPlayers" : newNum.toString() } },
			{ upsert:true, returnNewDocument : true } );
		res.send({ status:"Putting Successful" });
	}
	catch (e){
		res.send({status:e});
		console.log(e);
	}
})

// Users API
app.get("/Users", async (req, res)=> {
	const username = req.query.username;
	console.log("password " + req.query.password);
	console.log("getting user " + username);
	let user = await users.findOne({ username:req.query.username }, { password:req.query.password });
	res.send(user);
})

app.post("/Users", (req, res)=> {
	users.insertOne(req.body, (error, result)=> {
		if (error) {
			return res.status(500).send(error);
		}
		res.send(JSON.stringify({ status:"New user posting successful" }));
	});
})
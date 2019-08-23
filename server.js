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

var database, collection;

app.get("/Locations", (req, res) => {
	collection.find({}).toArray((error, result) => {
		if (error) {
			return res.status(500).send(error);
		}
		res.send(JSON.stringify(result));
	});
});

app.post("/Locations", (req, res) => {
	console.log("posting");
	collection.insertOne(req.body, (error, result) => {
		if (error) {
			return res.status(500).send(error);
		}

		res.send(JSON.stringify({ status:"Successful" }));
	})
})

app.listen(3000, () => {
	client.connect(function(err, db) {
		if (err) throw err;
		console.log("Connection Successful");

		database = db.db("PickUpDatabase");
		console.log("Database created PickUpDatabase");

		database.createCollection('Locations',  function(err, collection) {
			if (err) throw err;
			console.log("Collection created");
		});
		collection = database.collection("Locations");
	});
});

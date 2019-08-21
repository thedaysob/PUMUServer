const express = require("express");
const BodyParser = require("body-parser");

var app = express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

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
			return response.status(500).send(error);
		}
		reponse.send(result);
	});
});

app.post("/Location", (req, res) => {
	collection.insert(req.body, (error, result) => {
		if (error) {
			return response.status(500).send(error);
		}
		response.send(result.result);
	})
})

app.listen(3000, () => {
	client.connect(function(err, db) {
		if (err) throw err;
		console.log("Connection Successful");

		database = db.db("PickUpDatabase");
		console.log("Database created PickUpDatabase");

		collection = database.createCollection('Locations',  function(err, collection) {
			if (err) throw err;
			console.log("Collection created");
		});
	});
});

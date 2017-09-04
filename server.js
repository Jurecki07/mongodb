const express = require('express')
const app = express();
const bodyParser = require("body-parser");
const data = require("./data.js");
const mustacheExpress = require("mustache-express");
const logger = require("morgan");
const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const dbUrl = "mongodb://localhost:27017/User_Robots";
const ObjectId = mongo.ObjectID;

let DB;
let Robots;

MongoClient.connect(dbUrl, (err, db) => {
    if (err) {
        return console.log("Error connecting to the database:", err);
    }

    DB = db;
    Robots = db.collection("robots");
});

app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use(logger("dev"));
app.use(express.static("./public"));


app.get("/", (req, res) => {
    Robots.find({}).toArray((err, foundRobots) => {
        if (err) res.status(500).send(err);
        res.render("employee", {
            zach: foundRobots
        });

    })
})

app.get("/profile/:id", (req, res) => {
    Robots.findOne({
        _id: ObjectId(req.params.id)
    }, (err, foundRobot) => {
        if (err) res.status(500).send(err);
        if (!foundRobot) res.send("No user found");
        res.render("profile", {
            data: foundRobot
        });
    });

});



    app.get("/forhire", (req, res) => {
        Robots.find({ job: null }).toArray((err, forHireBots) => {
            if (err) res.status(500).send(err);
            res.render("employee", { zach: forHireBots });
    
       });
    
    
    });
    app.get("/employed", (req, res) => {
        Robots.find({ job: { $ne: null } }).toArray((err, employedBots) => {
            if (err) res.status(500).send(err);
            res.render("employee", { zach: employedBots })
        })
    })




app.listen(3000, function () {
    console.log('Successfully started express application!');
});
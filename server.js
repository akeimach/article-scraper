var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

var app = express();

// mongo configuration
var databaseUrl = "article_scraper";
var collections = ["articles"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) { // hook mongo config into db variable
  console.log("Database Error:", error);
});

app.get("/", function(req, res) {
  res.send("Test");
});

app.get("/all", function(req, res) {
  db.collections.find({}, function(error, found) {
    res.json(found);
  });
});

app.get("/scrape", function(req, res) {
    request("http://www.awwwards.com/websites/clean/", function(error, response, html) {
      // Load the HTML into cheerio
      var $ = cheerio.load(html);
      // Make an empty array for saving our scraped info
      var results = [];
      // With cheerio, look at each award-winning site, enclosed in "figure" tags with the class name "rollover"
      $("figure.rollover").each(function(i, element) {
        var imgLink = $(element).find("a").find("img").attr("srcset").split(",")[0].split(" ")[0];
        // Push the image's URL (saved to the imgLink var) into the results array
        results.push({ link: imgLink });
        db.collections.insert({link: imgLink});
      });
      // After looping through each element found, log the results to the console
      console.log(results);
    });
    res.send("scrape");
});

app.listen(8080, function() {
  console.log("App running on port 8080!");
});
var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var db = require("../models");
var router = express.Router();

router.get("/api/scrape", function(req, res) {

  // request for nyt articles
  request("https://www.nytimes.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    $("h2.story-heading a").each(function(i, element) {
      var result = {};
      result.link = $(this).attr("href");
      result.title = $(this).text();
      result.saved = false;
      result.summary = "todo";
      if (result.title && result.link) {
        db.Article
          .create(result)
          .then(function(dbArticle) {
            // terminal res moved to bottom
            // console.log(dbArticle);
          })
          .catch(function(err) {
            res.json(err);
          });
        }
    });
  });
  res.json("Scrape Complete");
});

router.get("/api/articles/:saved", function(req, res) {
  db.Article
    .find( { "saved": req.params.saved } )
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
  });
});

router.get("/api/articles/:id", function(req, res) {
  db.Article
    .findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
  });
});

router.put("/api/articles/:id", function(req, res) {
  db.Article
    .findOneAndUpdate({ _id: req.params.id }, { saved: true })
    // .findOne({ _id: req.params.id })
    // .update({ $set: { saved: true }})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
  });
});

router.post("/api/articles/:id", function(req, res) {
  db.Note
    .create(req.body) //the note text contains the title and content
    .then(function(dbNote) {
      return db.Article
               .findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
  });
});

module.exports = router;
var express = require("express");
var db = require("../models");
var router = express.Router();

router.get("/", function(req, res) {
  db.Article
    .find( { "saved": false } )
    .then(function(dbArticle) {
      res.render("scraped", { articles: dbArticle });
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get("/saved", function(req, res) {
  db.Article
    .find( { "saved": true } )
    .then(function(dbArticle) {
      res.render("saved", { articles: dbArticle });
    })
    .catch(function(err) {
      res.json(err);
    });
});

module.exports = router;
var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  res.render("index", { "test": "test" });
});

router.get("/saved", function(req, res) {
  res.render("saved", { "test": "test" });
});

module.exports = router;
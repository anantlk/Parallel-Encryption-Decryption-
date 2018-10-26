var express = require("express");
var router = express.Router();
const path = require("path");
const multicore = require("../multicore");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/encrypt", async (req, res, next) => {
  await multicore.encryptImage(res);
  // console.log("image encryption complete", value);
});

module.exports = router;

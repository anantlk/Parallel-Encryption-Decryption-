var express = require("express");
var router = express.Router();
const path = require("path");
const fs = require("fs");
const multicore = require("../multicore");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/encrypt", (req, res, next) => {
  const fpath = path.join(__dirname, "..", "out", "output.jpeg");
  return multicore.encryptImage(() => {
    console.log("done encrypting");
    res.download(fpath, err => {
      if (err) console.log(err);
      fs.unlinkSync(fpath);
    });
  });
});

module.exports = router;

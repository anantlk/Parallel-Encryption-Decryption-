var express = require("express");
var router = express.Router();
const path = require("path");
const fs = require("fs");
const multicore = require("../multicore");
const computeImage = require("../services/image");
/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/encrypt", async (req, res, next) => {
  let image = await computeImage.read();
  let pixelArray = Array.prototype.slice.call(image.bitmap.data, 0);
  let numOfPixels = pixelArray.length;
  const fpath = path.join(__dirname, "..", "out", "output.jpeg");
  return multicore.encryptImage(0, parseInt(numOfPixels / 2), () => {
    console.log("done encrypting");
    res.download(fpath, err => {
      if (err) console.log(err);
      fs.unlinkSync(fpath);
    });
  });
});

module.exports = router;

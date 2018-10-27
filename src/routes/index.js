var express = require("express");
var router = express.Router();
const path = require("path");
const fs = require("fs");
const multicore = require("../multicore");
const computeImage = require("../services/image");
const Async = require("async");
const request = require("request");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/receive/:startIndex", async (req, res, next) => {
  let image = await computeImage.read();
  let pixelArray = Array.prototype.slice.call(image.bitmap.data, 0);
  let numOfPixels = pixelArray.length;
  const startIndex = parseInt(req.params.startIndex) + 1;
  return multicore.encryptImage(
    Array.prototype.slice.call(image.bitmap.data, startIndex, numOfPixels),
    encryptedData => {
      return res.json({
        data: encryptedData
      });
    }
  );
});

router.get("/encrypt", async (req, res, next) => {
  let image = await computeImage.read();
  let pixelArray = Array.prototype.slice.call(image.bitmap.data, 0);
  let numOfPixels = pixelArray.length;
  // const fpath = path.join(__dirname, "..", "out", "output.jpeg");
  Async.parallel(
    {
      one: cb => {
        multicore.encryptImage(
          Array.prototype.slice.call(
            image.bitmap.data,
            0,
            parseInt(numOfPixels / 2)
          ),
          encryptedData => {
            return cb(null, encryptedData);
          }
        );
      },
      two: cb => {
        return request(
          "http://anant_server.example.com:3000/receive/" +
            (numOfPixels / 2).toString(),
          (err, response, body) => {
            if (err) console.log(err);
            return cb(null, body.data);
          }
        );
      }
    },
    (err, results) => {
      if (err) console.log(err);
      console.log(results);
    }
  );
});

module.exports = router;

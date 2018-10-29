const Jimp = require("jimp");
const path = require("path");
const des = require("./des/des");
const key = "10101010";

function stringToHex(s) {
  var r = "0x";
  var hexes = new Array(
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f"
  );
  for (var i = 0; i < s.length; i++) {
    r += hexes[s.charCodeAt(i) >> 4] + hexes[s.charCodeAt(i) & 0xf];
  }
  return r;
}

if (process.pid) {
  console.log("Script running on process id:", process.pid);
}
Jimp.read(path.join(__dirname, "..", "data", "original.jpeg"))
  .then(image => {
    console.log("Width Of The image:", image.bitmap.width);
    console.log("Height Of The image:", image.bitmap.height);
    let startTime = Date.now();
    console.log("Encrypting the image...");
    for (let i = 0; i < image.bitmap.data.length; i++) {
      let cipherText = des.des(key, image.bitmap.data[i].toString(), 1);
      let str = stringToHex(cipherText);
      image.bitmap.data[i] = parseInt(str, 16) % 255;
    }
    console.log("Image Encryption Successful!!");
    image.write(path.join(__dirname, "..", "out", "output.jpeg"));
    let endTime = Date.now();
    console.log(
      "Time taken for encryption:",
      (endTime - startTime) / 1000,
      "seconds"
    );
    return image.bitmap.data;
  })
  .catch(err => {
    console.error(err);
  });

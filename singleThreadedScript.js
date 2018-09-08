const Jimp = require("jimp");
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

Jimp.read("download.jpeg")
  .then(image => {
    for (let i = 0; i < image.bitmap.data.length; i++) {
      let cipherText = des.des(key, image.bitmap.data[i].toString(), 1);
      let str = stringToHex(cipherText);
      image.bitmap.data[i] = parseInt(str, 16) % 255;
      console.log("The encrypted pixel value:", parseInt(str, 16) % 255);
    }
    image.write("lena-small-bw.jpg");
    return image.bitmap.data;
  })
  .catch(err => {
    console.error(err);
  });

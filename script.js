let Jimp = require("jimp");
let des = require("./des/des.js");
let key = "10101010";
let message = "101010100";

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

Jimp.read("image.png")
  .then(lenna => {
    console.log(lenna.bitmap.data);
    let cipherText = des.des(key, lenna.bitmap.data[0].toString(), 1, 0);
    console.log(cipherText);
    let str = stringToHex(cipherText);
    console.log(str);
    console.log((parseInt(str, 16) % 255).toString(2));
    return lenna
      .resize(256, 256) // resize
      .write("lena-small-bw.jpg"); // save
  })
  .catch(err => {
    console.error(err);
  });

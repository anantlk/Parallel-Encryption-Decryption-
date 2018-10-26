const des = require("./des/des.js");
const key = "10101010";
let arr = [];

module.exports.encrypt = data => {
  // console.log("Encrypting the data");
  for (let i = 0; i < data.length; i++) {
    let cipherText = des.des(key, data[i].toString(), 1);
    let str = stringToHex(cipherText);
    arr.push(parseInt(str, 16) % 255);
    //console.log("Encrypted Color Code:", parseInt(str, 16) % 255);
  }
  return arr;
};

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

let Jimp = require("jimp");
const path = require("path");

const FILENAME = "original.jpeg";
module.exports.read = async () => {
  let image = await Jimp.read(path.join(__dirname, "..", "data", FILENAME));
  return image;
};

module.exports.write = async (encryptedData1, encryptedData2, callback) => {
  let image = await Jimp.read(path.join(__dirname, "..", "data", FILENAME));
  const height = image.bitmap.height;
  const width = image.bitmap.width;
  const data2StartPos = encryptedData2.length + 1;

  image = await new Jimp(width, height);
  for (let pos = 0; pos < encryptedData1.length; pos = pos + 4) {
    image.bitmap.data[pos] = encryptedData1[pos];
    image.bitmap.data[pos + 1] = encryptedData1[pos + 1];
    image.bitmap.data[pos + 2] = encryptedData1[pos + 2];
    image.bitmap.data[pos + 3] = encryptedData1[pos + 3];
  }
  for (let pos = 0; pos < encryptedData2.length; pos = pos + 4) {
    image.bitmap.data[data2StartPos + pos] = encryptedData2[pos];
    image.bitmap.data[data2StartPos + pos + 1] = encryptedData2[pos + 1];
    image.bitmap.data[data2StartPos + pos + 2] = encryptedData2[pos + 2];
    image.bitmap.data[data2StartPos + pos + 3] = encryptedData2[pos + 3];
  }
  return image.write(path.join("/tmp/output.jpeg"), () => {
    console.log("written successfully");
    return callback();
  });
};

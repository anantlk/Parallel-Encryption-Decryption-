let Jimp = require("jimp");
const path = require("path");

const FILENAME = "download.jpeg";
module.exports.read = async () => {
  let image = await Jimp.read(path.join(__dirname, "..", "data", FILENAME));
  return image;
};

module.exports.write = async (encryptedData, callback) => {
  let image = await Jimp.read(path.join(__dirname, "..", "data", FILENAME));
  const height = image.bitmap.height;
  const width = image.bitmap.width;
  image = await new Jimp(width, height);
  for (let pos = 0; pos < encryptedData.length; pos = pos + 4) {
    image.bitmap.data[pos] = encryptedData[pos];
    image.bitmap.data[pos + 1] = encryptedData[pos + 1];
    image.bitmap.data[pos + 2] = encryptedData[pos + 2];
    image.bitmap.data[pos + 3] = encryptedData[pos + 3];
  }
  return image.write(path.join(__dirname, "..", "out", "output.jpeg"), () => {
    console.log("written successfully");
    return callback();
  });
};

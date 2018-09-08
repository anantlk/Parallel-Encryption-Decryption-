let Jimp = require("jimp");

module.exports.read = async () => {
  let image = await Jimp.read("download.jpeg");
  height = image.bitmap.height;
  width = image.bitmap.width;
  return image;
};

module.exports.write = async encryptedData => {
  console.log(width, height);
  let image = await new Jimp(width, height);
  for (let pos = 0; pos < encryptedData.length; pos = pos + 4) {
    image.bitmap.data[pos] = encryptedData[pos];
    image.bitmap.data[pos + 1] = encryptedData[pos + 1];
    image.bitmap.data[pos + 2] = encryptedData[pos + 2];
    image.bitmap.data[pos + 3] = encryptedData[pos + 3];
  }
  image.write("abc.jpg");
};

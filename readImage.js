let Jimp = require("jimp");

module.exports.read = async () => {
  let image = await Jimp.read("download.jpeg");
  image.resize(50, 50);
  return image;
};

function imageRead() {
  Jimp.read("download.jpeg")
    .then(image => {
      image.resize(50, 50);
      for (let i = 0; i < image.bitmap.data.length; i++) {
        let cipherText = des.des(key, image.bitmap.data[i].toString(), 1);
        let str = stringToHex(cipherText);
        image.bitmap.data[i] = parseInt(str, 16) % 255;
      }
      image.write("lena-small-bw.jpg");
      return image.bitmap.data;
    })
    .catch(err => {
      console.error(err);
    });
}

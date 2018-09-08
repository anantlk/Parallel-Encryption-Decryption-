const readImage = require("./readImage");
const task = require("./task");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
let workers = [];
let pos = 0;
let encryptedData = [];
let temp = [];
if (cluster.isMaster) {
  console.log(`Number of processors are ${numCPUs}`);
  masterProcess();
} else {
  childProcess();
}

function childProcess() {
  process.on("message", obj => {
    console.log(
      `Message recieved by child process Id ${process.pid} is ${
        obj.data.pixels.length
      }`
    );
    let encryptedPixels = task.encrypt(obj.data.pixels);
    console.log(
      `Process ${process.pid} recieves pixel data of length ${
        encryptedPixels.length
      }`
    );
    process.send({ id: obj.data.id, data: encryptedPixels });
  });
}

async function masterProcess() {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    console.log(`Forking process number ${i}`);
    const worker = cluster.fork();
    workers.push(worker);
    worker.on("message", msg => {
      console.log(
        `Master with process id ${msg.id} recieves msg ${
          msg.data.length
        } from worker ${worker.process.pid}`
      );
      temp.push(msg);
    });
  }
  let image = await readImage.read();
  let pixelArray = Array.prototype.slice.call(image.bitmap.data, 0);
  let numOfPixels = pixelArray.length;
  console.log(numOfPixels);
  workers.forEach((worker, index) => {
    worker.send({
      data: {
        id: index + 1,
        pixels: pixelArray.slice(
          pos,
          pos + parseInt(numOfPixels / workers.length)
        )
      }
    });
    pos = pos + parseInt(numOfPixels / workers.length);
  });
}

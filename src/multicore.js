const computeImage = require("./services/image");
const task = require("./services/task");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const server = require("./services/create-server");

let numberOfActiveChildProcesses = 0;
let workers = [];
let pos = 0;
let encryptedData = [];
let temp = [];
let endTime, startTime;
if (cluster.isMaster) {
  console.log(`Number of processors are ${numCPUs}`);
  masterProcess();
} else {
  childProcess();
}

cluster.on("exit", worker => {
  console.log(`\nWoker ${worker.id} exited\n`);
  numberOfActiveChildProcesses--;
  // console.log(
  //   "Number of active child processes:",
  //   numberOfActiveChildProcesses
  // );
  // if (numberOfActiveChildProcesses === 0) {
  //   mergeData(temp);
  //   // worker.data.response();
  //   // console.log("done");
  // }
});

function mergeData(tempArray) {
  // console.log(tempArray.length);
  tempArray.sort(function(a, b) {
    return a.id - b.id;
  });
  for (let obj of tempArray) {
    for (let pixel of obj.data) {
      encryptedData.push(pixel);
    }
  }
  computeImage.write(encryptedData);
  console.log("Image Encryption Successful!!");
  // console.log(encryptedData.length);
  endTime = Date.now();
  console.log(
    "Time taken for encryption",
    (endTime - startTime) / 1000,
    "seconds"
  );
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
    process.send({ id: obj.data.id, data: encryptedPixels }, () => {
      process.exit();
    });
  });
}

module.exports.encryptImage = async function(res) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    console.log(`Forking process number ${i}`);
    const worker = cluster.fork();
    numberOfActiveChildProcesses++;
    workers.push(worker);
    worker.on("message", msg => {
      console.log(
        `Master recieves msg ${msg.data.length} from worker ${msg.id}`
      );

      if (numberOfActiveChildProcesses === 0) {
        mergeData(temp);
        res.send("Done");
        // worker.data.response();
        // console.log("done");
      }

      temp.push(msg);
    });
  }
  let image = await computeImage.read();
  let pixelArray = Array.prototype.slice.call(image.bitmap.data, 0);
  let numOfPixels = pixelArray.length;
  console.log("Width of the image:", image.bitmap.width);
  console.log("Height of the image:", image.bitmap.height);
  startTime = Date.now();
  console.log("Encrypting the image...");
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
  return "Done";
};

function masterProcess() {
  server.initiate(() => console.log("Listening on http://localhost:3000"));
  // encryptImage();
}

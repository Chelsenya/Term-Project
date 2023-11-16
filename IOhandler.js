/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs").promises,
  { createReadStream, createWriteStream } = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path"),
  { pipeline } = require("stream");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return pipeline(
    createReadStream(pathIn),
    unzipper.Extract({ path: pathOut }),
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Extraction complete");
      }
    }
  ).promise();
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return fs.readdir(dir).then((imgArr) => {
    const pngArr = [];
    imgArr.forEach((img) => {
      if (path.extname(img) === ".png") {
        pngArr.push(path.join("unzipped", img));
      }
    });
    return pngArr;
  });
};

function grayScaleCalc(d) {
  for (let y = 0; y < d.height; y++) {
    for (let x = 0; x < d.width; x++) {
      let idx = (d.width * y + x) << 2;
      let r = d.data[idx];
      let g = d.data[idx + 1];
      let b = d.data[idx + 2];

      d.data[idx] = (Math.min(r, g, b) + Math.max(r, g, b)) / 2;
      d.data[idx + 1] = (Math.min(r, g, b) + Math.max(r, g, b)) / 2;
      d.data[idx + 2] = (Math.min(r, g, b) + Math.max(r, g, b)) / 2;
    }
  }
  return d.data;
}

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return fs.mkdir(pathOut, { recursive: true }).then(() => {
    const imgName = path.basename(pathIn);
    pipeline(
      createReadStream(pathIn),
      new PNG().on("parsed", function () {
        this.data = grayScaleCalc(this);
        this.pack().pipe(createWriteStream(path.join(pathOut, imgName)));
      }),
      (err) => {
        if (err) console.log(err);
      }
    );
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};

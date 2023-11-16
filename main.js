const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

IOhandler.unzip(zipFilePath, pathUnzipped)
  .then(() => IOhandler.readDir(pathUnzipped))
  .then((pngArr) =>
    Promise.all([
      IOhandler.grayScale(pngArr[0], pathProcessed),
      IOhandler.grayScale(pngArr[1], pathProcessed),
      IOhandler.grayScale(pngArr[2], pathProcessed),
    ])
  )
  .then(() => console.log("Grayscale filter applied to all images"))
  .catch((err) => console.log(err));

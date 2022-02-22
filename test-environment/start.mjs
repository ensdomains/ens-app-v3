import colors from "ansi-colors";
import cliProgress from "cli-progress";
import "dotenv/config";
import fs from "fs-extra";
import got from "got";
import lz4 from "lz4";
import progress from "progress-stream";
import { pipeline } from "stream";
import tar from "tar-fs";
import { URL as URLClass } from "url";
import { promisify } from "util";

const __dirname = new URLClass(".", import.meta.url).pathname;

const createProgressBar = (name, hasSpeed) =>
  new cliProgress.SingleBar({
    format:
      `${name} Progress |` +
      colors.cyan("{bar}") +
      "| {percentage}% || {value}/{total} GB" +
      (hasSpeed ? " || Speed: {speed} MB/s" : ""),
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
    fps: 5,
    formatValue: (value, options, type) => {
      switch (type) {
        case "value":
          return bytesToGb(value).toFixed(2);
        case "total":
          return bytesToGb(value).toFixed(2);
        default:
          return value;
      }
    },
  });

const progressBar = createProgressBar("Download", true);
const extractProgressBar = createProgressBar("Extract", true);
const compressProgressBar = createProgressBar("Compress", false);

const { BLOCK_HEIGHT, SUBGRAPH_ID, EPOCH_TIME, BASE_URL } = process.env;
const fileName = `data_${BLOCK_HEIGHT}_${SUBGRAPH_ID}_${EPOCH_TIME}.archive`;
const URL = `${BASE_URL}/${fileName}.tar.lz4`;
const localURL = `${__dirname}/archives/${fileName}`;
const outPath = `${__dirname}/data`;

const streamPipeline = promisify(pipeline);
const streamOpts = {
  highWaterMark: 67108864, // 64MB
};

const bytesToGb = (bytes) => bytes * 9.3132257461548e-10;
const bytesToMb = (bytes) => bytes * 9.5367431640625e-7;

async function compressToArchive() {
  return new Promise(async (resolve, reject) => {
    let initial = true;
    const encoder = lz4.createEncoderStream({});
    const output = fs.createWriteStream(localURL + ".tar.lz4", streamOpts);
    const archive = tar.pack(outPath);
    const progressStream = progress({});

    progressStream.on("progress", (progress) => {
      if (initial) {
        compressProgressBar.start(progress.length, 0, {
          speed: "N/A",
        });
        initial = false;
      } else {
        compressProgressBar.update(progress.transferred, {
          speed: bytesToMb(progress.speed).toFixed(2),
        });
      }
    });

    compressProgressBar.start();
    await streamPipeline(archive, encoder, output)
      .then(() => {
        compressProgressBar.stop();
        resolve();
      })
      .catch((err) => {
        compressProgressBar.stop();
        reject(err.message);
      });
  });
}

async function decompressToOutput() {
  return new Promise(async (resolve, reject) => {
    if (fs.existsSync(outPath))
      await fs.rm(outPath, { recursive: true, force: true });

    const archiveSize = fs.statSync(localURL + ".tar.lz4").size;
    const unarchiver = tar.extract(outPath);
    const decoder = lz4.createDecoderStream();
    const input = fs.createReadStream(localURL + ".tar.lz4", streamOpts);
    const progressStream = progress({});

    extractProgressBar.start(archiveSize, 0, {
      speed: "N/A",
    });

    progressStream.on("progress", (progress) => {
      extractProgressBar.update(progress.transferred, {
        speed: bytesToMb(progress.speed).toFixed(2),
      });
    });

    await streamPipeline(input, progressStream, decoder, unarchiver)
      .then(() => {
        extractProgressBar.stop();
        resolve();
      })
      .catch((err) => {
        extractProgressBar.stop();
        reject(err.message);
      });
  });
}

async function downloadFile(path, extract = false) {
  return new Promise(async (resolve, reject) => {
    if (path.includes("archives") && !fs.existsSync(`${__dirname}/archives`))
      await fs.mkdir("archives");
    if (fs.existsSync(path))
      await fs.rm(path, { recursive: true, force: true });

    const input = got.stream(URL);
    const progressStream = progress({});

    input.on("response", (response) => {
      progressBar.start(parseInt(response.headers["content-length"]), 0, {
        speed: "N/A",
      });
    });

    input.on("error", (err) => {
      progressBar.stop();
      reject(err.message);
    });

    input.on("downloadProgress", (progress) => {
      progressBar.update(progress.transferred, {
        speed: bytesToMb(progressStream.progress().speed).toFixed(2),
      });
    });

    if (extract) {
      const unarchiver = tar.extract(path);
      const decoder = lz4.createDecoderStream();

      await streamPipeline(input, progressStream, decoder, unarchiver).catch(
        (err) => reject(err)
      );
    } else {
      const output = fs.createWriteStream(path, streamOpts);

      await streamPipeline(input, progressStream, output).catch((err) =>
        reject(err)
      );
    }

    progressBar.stop();
    resolve();
  });
}

const args = process.argv.slice(2);
let time = Date.now();

const logTime = (message) =>
  console.log(`${message} ${(Date.now() - time) / 1000}s`);

switch (args[0]) {
  case "ci": {
    console.log("Running in CI mode, skipping cache");
    await downloadFile(outPath, true).then(() =>
      logTime("Downloaded archive in")
    );
    break;
  }
  case "load": {
    if (!fs.existsSync(localURL + ".tar.lz4")) {
      console.log("Downloading archive...");
      await downloadFile(localURL + ".tar.lz4").then(() =>
        logTime("Downloaded archive in")
      );
      time = Date.now();
    } else {
      console.log("Archive already exists, skipping download");
    }
    console.log("Copying data to /data...");
    await decompressToOutput().then(() =>
      logTime("Copied archive to /data in")
    );
    break;
  }
  case "compress": {
    console.log("Compressing /data to archive...");
    await compressToArchive().then(() => logTime("Compressed archive in"));
    break;
  }
  default: {
    console.log("Invalid command");
    break;
  }
}

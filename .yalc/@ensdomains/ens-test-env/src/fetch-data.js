#!/usr/bin/env node

/* eslint-disable */
import colors from 'ansi-colors'
import cliProgress from 'cli-progress'
import 'dotenv/config'
import fs from 'fs-extra'
import lz4 from 'lz4'
import progress from 'progress-stream'
import { pipeline } from 'stream'
import tar from 'tar-fs'
import { promisify } from 'util'

const __dirname = process.env.INIT_CWD

const createProgressBar = (name, hasSpeed) =>
  new cliProgress.SingleBar({
    format:
      `${name} Progress |` +
      colors.cyan('{bar}') +
      '| {percentage}% || {value}/{total} GB' +
      (hasSpeed ? ' || Speed: {speed} MB/s' : ''),
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
    fps: 5,
    formatValue: (value, _, type) => {
      switch (type) {
        case 'value':
          return bytesToGb(value).toFixed(2)
        case 'total':
          return bytesToGb(value).toFixed(2)
        default:
          return value
      }
    },
  })

const extractProgressBar = createProgressBar('Extract', true)
const compressProgressBar = createProgressBar('Compress', false)

let localPath, dataPath

const streamPipeline = promisify(pipeline)
const streamOpts = {
  highWaterMark: 67108864, // 64MB
}

const bytesToGb = (bytes) => bytes * 9.3132257461548e-10
const bytesToMb = (bytes) => bytes * 9.5367431640625e-7

async function compressToArchive() {
  return new Promise(async (resolve, reject) => {
    let initial = true
    const encoder = lz4.createEncoderStream({})
    const output = fs.createWriteStream(localPath + '.tar.lz4', streamOpts)
    const archive = tar.pack(dataPath)
    const progressStream = progress({})

    progressStream.on('progress', (progress) => {
      if (initial) {
        compressProgressBar.start(progress.length, 0, {
          speed: 'N/A',
        })
        initial = false
      } else {
        compressProgressBar.update(progress.transferred, {
          speed: bytesToMb(progress.speed).toFixed(2),
        })
      }
    })

    compressProgressBar.start()
    await streamPipeline(archive, encoder, output)
      .then(() => {
        compressProgressBar.stop()
        resolve()
      })
      .catch((err) => {
        compressProgressBar.stop()
        reject(err.message)
      })
  })
}

async function decompressToOutput() {
  return new Promise(async (resolve, reject) => {
    if (fs.existsSync(dataPath))
      await fs.rm(dataPath, { recursive: true, force: true })

    const archiveSize = fs.statSync(localPath + '.tar.lz4').size
    const unarchiver = tar.extract(dataPath)
    const decoder = lz4.createDecoderStream()
    const input = fs.createReadStream(localPath + '.tar.lz4', streamOpts)
    const progressStream = progress({})

    extractProgressBar.start(archiveSize, 0, {
      speed: 'N/A',
    })

    progressStream.on('progress', (progress) => {
      extractProgressBar.update(progress.transferred, {
        speed: bytesToMb(progress.speed).toFixed(2),
      })
    })

    await streamPipeline(input, progressStream, decoder, unarchiver)
      .then(() => {
        extractProgressBar.stop()
        resolve()
      })
      .catch((err) => {
        extractProgressBar.stop()
        reject(err.message)
      })
  })
}

export const main = async (arg, config) => {
  let time = Date.now()

  localPath = config.paths.archive
  dataPath = config.paths.data

  const logTime = (message) =>
    console.log(`${message} ${(Date.now() - time) / 1000}s`)

  switch (arg) {
    case 'load': {
      await decompressToOutput().then(() =>
        logTime('Decompressed and copied in'),
      )
      return
    }
    case 'compress': {
      console.log('Compressing /data to archive.tar.lz4...')
      await compressToArchive().then(() => logTime('Compressed archive in'))
      return
    }
    case 'clean': {
      console.log('Cleaning data directory...')
      await fs.rm(dataPath, { force: true, recursive: true })
      await fs.mkdir(dataPath)
      return
    }
  }
}

#!/usr/bin/env node
import colors from 'ansi-colors'
import { exec as _exec } from 'child_process'
import cliProgress from 'cli-progress'
import 'dotenv/config'
import fs from 'fs-extra'
import got from 'got'
import lz4 from 'lz4'
import path from 'path'
import progress from 'progress-stream'
import { PassThrough, pipeline } from 'stream'
import tar from 'tar-fs'
import { promisify } from 'util'

const exec = promisify(_exec)
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
    formatValue: (value, options, type) => {
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

const progressBar = createProgressBar('Download', true)
const extractProgressBar = createProgressBar('Extract', true)
const compressProgressBar = createProgressBar('Compress', false)

let BLOCK_HEIGHT,
  SUBGRAPH_ID,
  EPOCH_TIME,
  BASE_URL,
  NETWORK,
  localURL,
  outPath,
  archiveURL,
  fileName,
  URL

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
    const output = fs.createWriteStream(localURL + '.tar.lz4', streamOpts)
    const archive = tar.pack(outPath)
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
    if (fs.existsSync(outPath))
      await fs.rm(outPath, { recursive: true, force: true })

    const archiveSize = fs.statSync(localURL + '.tar.lz4').size
    const unarchiver = tar.extract(outPath)
    const decoder = lz4.createDecoderStream()
    const input = fs.createReadStream(localURL + '.tar.lz4', streamOpts)
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

async function downloadFile() {
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(archiveURL)) await fs.mkdir(archiveURL)
    if (fs.existsSync(outPath)) {
      console.log('Data directory exists')
      await exec(`rm -rf ${outPath}/*`).catch(() => {
        console.log('Needs sudo to remove files')
        return exec(`sudo rm -rf ${outPath}/*`)
      })
    }

    console.log(URL)

    const input = got.stream(URL)
    const progressStream = progress({})
    const archiveOutput = fs.createWriteStream(
      localURL + '.tar.lz4',
      streamOpts,
    )
    const unarchiver = tar.extract(outPath)
    const decoder = lz4.createDecoderStream()
    const tunnel = new PassThrough()

    input.on('response', (response) => {
      progressBar.start(parseInt(response.headers['content-length']), 0, {
        speed: 'N/A',
      })
    })

    input.on('error', (err) => {
      progressBar.stop()
      reject(err.message)
    })

    input.on('downloadProgress', (progress) => {
      progressBar.update(progress.transferred, {
        speed: bytesToMb(progressStream.progress().speed).toFixed(2),
      })
    })

    tunnel.on('data', (chunk) => decoder.write(chunk))
    tunnel.on('close', () => decoder.end())

    await Promise.all([
      streamPipeline(input, tunnel, progressStream, archiveOutput),
      streamPipeline(decoder, unarchiver),
    ]).catch((err) => reject(err))

    progressBar.stop()
    resolve()
  })
}

export const main = async (arg, config) => {
  let time = Date.now()

  BLOCK_HEIGHT = config.archive.block
  SUBGRAPH_ID = config.archive.subgraphId
  EPOCH_TIME = config.archive.epochTime
  BASE_URL = config.archive.baseUrl
  NETWORK = config.docker.network

  fileName = `data_${BLOCK_HEIGHT}_${SUBGRAPH_ID}_${EPOCH_TIME}_${NETWORK}.archive`
  URL = `${BASE_URL}/${fileName}.tar.lz4`

  localURL = path.resolve(__dirname, config.paths.archives, fileName)
  outPath = path.resolve(__dirname, config.paths.data)
  archiveURL = path.resolve(__dirname, config.paths.archives)

  const logTime = (message) =>
    console.log(`${message} ${(Date.now() - time) / 1000}s`)

  switch (arg) {
    case '--load': {
      if (!fs.existsSync(localURL + '.tar.lz4')) {
        console.log('Downloading archive...')
        await downloadFile(localURL + '.tar.lz4').then(() =>
          logTime('Downloaded archive in'),
        )
        time = Date.now()
      } else {
        console.log('Archive already exists, skipping download')
        await decompressToOutput().then(() =>
          logTime('Decompressed and copied in'),
        )
      }
      return
    }
    case '--compress': {
      console.log('Compressing /data to archive...')
      await compressToArchive().then(() => logTime('Compressed archive in'))
      return
    }
  }
}

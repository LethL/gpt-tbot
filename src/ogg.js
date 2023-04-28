import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import installer from '@ffmpeg-installer/ffmpeg';
import { createWriteStream } from 'fs';
import { dirname, resolve } from 'path';
import { __dirname } from './constans/constans.js';
import { removeFile } from './utils/utils.js';

class oggConverter {
  constructor() {
    ffmpeg.setFfmpegPath(installer.path);
  }

  toMp3(input, output) {
    try {
      const outputPath = resolve(dirname(input), `${output}.mp3`);
      return new Promise((resolve, reject) => {
        ffmpeg(input)
          .inputOption('-t 30')
          .output(outputPath)
          .on('end', () => {
            resolve(outputPath);
            removeFile(input);
          })
          .on('error', (err) => reject(err.message))
          .run();
      });
    } catch (e) {
      console.log('Error while converting ogg to mp3 file', e.message);
    }
  }

  async create(url, filename) {
    try {
      const oggPath = resolve(__dirname, '../temporary_voices', `${filename}.ogg`);
      const response = await axios({
        method: 'GET',
        url,
        responseType: 'stream',
      });
      return new Promise((resolve) => {
        const stream = createWriteStream(oggPath);
        response.data.pipe(stream);
        stream.on('finish', () => resolve(oggPath));
      });
    } catch (e) {
      console.log('Error while creating ogg file', e.message);
    }
  }
}

export const ogg = new oggConverter();

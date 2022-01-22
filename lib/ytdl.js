let ytdl = require('ytdl-core')
let fs = require('fs')
const getAudio = (url, options) => new Promise(async (resolve, reject) => {
audio_file = await './ytdl/tmp.mp3';
      await ytdl(url, {filename: options.title, quality: "highestaudio", filter: "audioonly"})
       .on('info', async (info) => {
       judul = await info.videoDetails.title
       })
        .pipe(fs.createWriteStream(audio_file).on('finish', async ()=>{
        hasil = await fs.promises.readFile(audio_file)
        fs.promises.unlink(audio_file)
          resolve(hasil)
        }));
          });
  const getVideo = (url, options) => new Promise(async (resolve, reject) => {
audio_file = await './ytdl/tmp.mp4';
      await ytdl(url, {filename: options.title, quality: "highestvideo", filter: "videoandaudio"})
       .on('info', async (info) => {
       judul = await info.videoDetails.title
       })
        .pipe(fs.createWriteStream(audio_file).on('finish', async ()=>{
        hasil = await fs.promises.readFile(audio_file)
        fs.promises.unlink(audio_file)
          resolve(hasil)
        }));
          });
          
module.exports = { mp3: getAudio, mp4: getVideo }
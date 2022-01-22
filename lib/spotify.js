const Spotify = require('spotifydl-core').default

const client = new Spotify({
    clientId: 'acc6302297e040aeb6e4ac1fbdfd62c3',
    clientSecret: '0e8439a1280a43aba9a5bc0a16f3f009'
})

const spotify = (url) => new Promise(async (resolve, reject) => {
    try {
     let hasil = {}
      hasil = await client.getTrack(url)
      hasil.mp3 = await client.downloadTrack(url)
      resolve(hasil)
      } catch (e) {
      reject(e)
      }
          });
  
          
module.exports = spotify

const { loadImage } = require('canvas');

const cachedTwemojiImages = new Map();

module.exports =  async function loadTwemojiImageByUrl (url) {
  return new Promise(async (res) => {
    if (cachedTwemojiImages.has(url)) {
      return res(cachedTwemojiImages.get(url));
    }

    const image = await loadImage(url);
    if (!url.includes("discord")) cachedTwemojiImages.set(url, image);

    return res(image);
  });
}

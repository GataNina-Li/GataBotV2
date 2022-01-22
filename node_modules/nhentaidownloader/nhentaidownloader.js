const AdmZip = require('adm-zip');
const axios = require('axios');
const get = require('axios-retry');
get(axios, { retries: 10 });

module.exports = function (ID) {
    return new Promise(async (Resolve, Reject) => {
        axios.get("https://nhentai.net/api/gallery/" + ID)
            .then(result => {
                var zip = new AdmZip();
                var promiseImages = [];
                
                for (let i = 1; i < result.data.images.pages.length; i++) {
                    var data = result.data.images.pages[i];
                    let extension;
                    if (data.t === "j") extension = 'jpg';
                    if (data.t === "p") extension = 'png';
                    if (data.t === "g") extension = 'gif';
                    promiseImages.push(new Promise((resolve, reject) => {
                        axios.get(`https://i.nhentai.net/galleries/${result.data.media_id}/${i + 1}.${extension}`, {
                            responseType: 'arraybuffer'
                        }).then(raw_image => resolve({
                            raw_image: Buffer.from(raw_image.data, 'binary'),
                            id: i + 1,
                            extension: extension
                        })).catch(err => console.error(err));
                    }));

                };
                Promise.all(promiseImages).then(images => {
                    for (const image of images) {
                        zip.addFile(image.id + "." + image.extension, Buffer.alloc(image.raw_image.length, image.raw_image));
                    }
                    var BufferFile = zip.toBuffer();
                    Resolve(BufferFile)
                });
            });
    });
};
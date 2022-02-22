const axios = require('axios') 
const cheerio = require('cheerio')

async function ramalJodoh(nama1, nama2) {
  return new Promise(async (resolve, reject) => {
    axios
    .get(`https://www.primbon.com/kecocokan_nama_pasangan.php?nama1=${nama1}&nama2=${nama2}&proses=+Submit%21+`)
    .then(({ data }) => {
     const $ =  cheerio.load(data);
     const thumbnail = 'https://www.primbon.com/'+$('#body > img').attr('src');
     const res = $('#body').text().split(nama2)[1].replace('< Hitung Kembali','').split('\n')[0];
     const positif = res.split('Sisi Negatif Anda: ')[0].replace('Sisi Positif Anda: ','')
     const negatif = res.split('Sisi Negatif Anda: ')[1]
     const result = {
          namaKamu: nama1,
          namaPasangan: nama2,
          thumbnail: thumbnail,
          positif: positif,
          negatif: negatif
     }
     resolve(result);
    })
    .catch(reject);
  });
};


module.exports = ramalJodoh

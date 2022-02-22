const axios = require('axios') 
const { transform } = require('camaro')

const Gempa = () => new Promise((resolve, reject) => {
  const urlGempa = 'https://data.bmkg.go.id/DataMKG/TEWS/autogempa.xml'
        const urlImage = 'https://data.bmkg.go.id/DataMKG/TEWS/'
    let res = {}
        axios({
            url: urlGempa,
            responseType: 'text',
        }).then(async (result) => {
            const template = ['Infogempa/gempa', {
                tanggal: 'Tanggal',
                jam: 'Jam',
                lintang: 'Lintang',
                bujur: 'Bujur',
                magnitude: 'Magnitude',
                kedalaman: 'Kedalaman',
                potensi: 'Potensi',
                wilayah: 'Wilayah',
                image: 'Shakemap'
            }]
            let tr = await transform(result.data, template)
            tr[0].image = urlImage + tr[0].image
            res.status = result.status
            res.result = tr[0]
             resolve(res)
      })
})

module.exports = Gempa

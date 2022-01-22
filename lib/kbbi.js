/**
 * @author Zahir Hadi Athallah <zhirrrstudio@gmail.com>
 * @license MIT
 */

const scrapy = require('node-scrapy')
const fetch = require("node-fetch");
const url = 'https://kbbi.kemdikbud.go.id/entri/';
const KBBI = (kata) => new Promise((resolve, reject) => {
	try{
		var  model = {
			lema: 'h2',
			arti: ['ol li', 'ul.adjusted-par']
		}
    var kata2 = kata;
		fetch(url +kata)
			.then((res) => res.text())
			.then((body) => {
				var log = scrapy.extract(body, model)
				if(log.arti == null){
					model = {
            lema: 'h2',
						arti: ['ul.adjusted-par']
					}
					fetch(url + kata2)
						.then((res) => res.text())
						.then((body) => {
							log = scrapy.extract(body, model)
							if(log.arti != null)
								{
                  var kata3 = log.arti.map(s => s.slice(1).split("  ").join(""));
                  resolve({
                    lema: log.lema,
                    arti: kata3
                  })
                }
							else{reject("Arti Tidak Ada Atau IP Terkena Limit");}
						})
				}
				else
        {
          var kata =  log.arti.map(s => s.slice(1).split("  ").join(""));
          resolve({
            lema: log.lema,
            arti: kata
          })
        }
			})
	} catch(err){
		reject(err)
	}
})

module.exports = KBBI;
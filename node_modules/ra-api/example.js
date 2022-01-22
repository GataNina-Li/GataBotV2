const RA = require(".")



(async () => {
	await RA.Musikmatch(`Surat cinta untuk starla`).then(respon => {
		console.log(respon)
	})
})()
const fs = require('fs')
const { spawn } = require('child_process')
async function getRandom(ext) {
return Math.floor(Math.random() * 99999) + ext)
}
const ff = require('fluent-ffmpeg')

exports.createExif = (pack, auth) => {
	const code = [0x00,0x00,0x16,0x00,0x00,0x00]
	const exif = {"sticker-pack-id": "com.barbar.tech", "sticker-pack-name": pack, "sticker-pack-publisher": auth}
	let len = JSON.stringify(exif).length
	if (len > 256) {
		len = len - 256
		code.unshift(0x01)
	} else {
		code.unshift(0x00)
	}
	if (len < 16) {
		len = len.toString(16)
		len = "0" + len
	} else {
		len = len.toString(16)
	}
	//len = len < 16 ? `0${len.toString(16)}` : len.toString(16)
	const _ = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00]);
	const __ = Buffer.from(len, "hex")
	const ___ = Buffer.from(code)
	const ____ = Buffer.from(JSON.stringify(exif))
	fs.writeFileSync('./sticker/data.exif', Buffer.concat([_, __, ___, ____]), function (err) {
		console.log(err)
		if (err) return console.error(err)
		return `./sticker/data.exif`
	})

}

exports.modStick = (media, BarBar, mek, from) => {
	out = getRandom('.webp')
	try {
		console.log(media)
		spawn('webpmux', ['-set','exif', './sticker/data.exif', media, '-o', out])
		.on('exit', () => {
			BarBar.sendMessage(from, fs.readFileSync(out), 'stickerMessage', {quoted: mek})
			fs.unlinkSync(out)
			fs.unlinkSync(media)
		})
	} catch (e) {
		console.log(e)
		BarBar.sendMessage(from, 'Terjadi keslahan', 'conversation', { quoted: mek })
		fs.unlinkSync(media)
	}
}

exports.modMedia = (media, BarBar, mek, from, fps) => {
	out = getRandom('.webp')
	try {
		ff(media)
		.on('error', (e) => {
			console.log(e)
			BarBar.sendMessage(from, 'Terjadi kesalahan', 'conversation', { quoted: mek })
			fs.unlinkSync(media)
		})
		.on('end', () => {
			_out = getRandom('.webp')
			spawn('webpmux', ['-set','exif','./sticker/data.exif', out, '-o', _out])
			.on('exit', () => {
				BarBar.sendMessage(from, fs.readFileSync(_out), 'stickerMessage', { quoted: mek })
				fs.unlinkSync(out)
				fs.unlinkSync(_out)
				fs.unlinkSync(media)
			})
		})
		.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=${fps}, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
		.toFormat('webp')
		.save(out)
	} catch (e) {
		console.log(e)
		BarBar.sendMessage(from, 'Terjadi kesalahan', 'conversation', { quoted: mek })
		fs.unlinkSync(media)
	}
}
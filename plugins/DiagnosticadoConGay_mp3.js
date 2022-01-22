let util = require('util')
let path = require('path')

let handler = async (m, { conn }) => {
let vn = './media/DiagnosticadoConGay.mp3'
conn.sendFile(m.chat, vn, 'DiagnosticadoConGay.mp3', null, m, true, {
type: 'audioMessage', // paksa tanpa convert di ffmpeg
ptt: true // true diatas ga work, sebab dipaksa tanpa convert ;v
})
}
handler.customPrefix = /giagnosticadocongay|diagnosticado con gay|diagnosticado gay|te diagnóstico con gay|diagnóstico gay|te diagnostico con gay|te diagnóstico con gay|te diagnosticó con gay|te diagnostico con gay/i
handler.command = new RegExp

handler.fail = null
handler.exp = 100
module.exports = handler

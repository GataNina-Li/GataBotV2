const { WAConnection } = require("@adiwajshing/baileys") 
const chalk = require('chalk')
const fs = require("fs")
const exec = require('child_process')

const samu330 = new WAConnection()
exports.samu330 = samu330

exports.connect = async() => {
    samu330.version = [2, 2143, 3]
    console.log(chalk.keyword("blue")('◦ Conectando ◦'))
    let auth = './Samu330.json'
    samu330.logger.level = 'warn'
    samu330.on("qr", () => {
        console.log(chalk.keyword("yellow")('💎   Escanea el codigo...'))
    })
    fs.existsSync(auth) && samu330.loadAuthInfo(auth)
    samu330.on('connecting', () => {
        console.log(chalk.whiteBright("⌛"), chalk.keyword("red")("□ Estado de NyanBot"), chalk.keyword("aqua")("Connecting..."))
    })
        samu330.on('open', () => {
        console.log(chalk.keyword("green")('╒═══ '), chalk.keyword("blue")('⌈ '), chalk.keyword("aqua")('CONECTADO'), chalk.keyword("blue")(' ⌉'), chalk.keyword("green")(' ═══'))
        console.log(chalk.keyword("green")("├"), chalk.keyword("aqua")("WA Version : "), chalk.whiteBright(samu330.user.phone.wa_version))
        console.log(chalk.keyword("green")("├"), chalk.keyword("aqua")("OS Version : "), chalk.whiteBright(samu330.user.phone.os_version))
        console.log(chalk.keyword("green")("├"), chalk.keyword("aqua")("Device : "), chalk.whiteBright(samu330.user.phone.device_manufacturer))
        console.log(chalk.keyword("green")("├"), chalk.keyword("aqua")("Model : "), chalk.whiteBright(samu330.user.phone.device_model))
        console.log(chalk.keyword("green")("├"), chalk.keyword("aqua")("OS Build Number : "), chalk.whiteBright(samu330.user.phone.os_build_number))
        console.log(chalk.keyword("green")("│"), chalk.keyword("red")('╭╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╮'))
        console.log(chalk.keyword("green")("│"), chalk.keyword("red")('│'), chalk.keyword("yellow")('       BIENVENIDO'))
        console.log(chalk.keyword("green")("│"), chalk.keyword("red")('│'), chalk.keyword("aqua")(' Creditos:'))
        console.log(chalk.keyword("green")("│"), chalk.keyword("red")('│'), chalk.keyword("magenta")(' Samu330 | MankBarBar'))
        console.log(chalk.keyword("green")("│"), chalk.keyword("red")('╰╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╯'))
        const authInfo = samu330.base64EncodedAuthInfo()
        fs.writeFileSync(auth, JSON.stringify(authInfo, null, '\t'))
    })
    await samu330.connect({ timeoutMs: 30 * 1000 })
    return samu330
}

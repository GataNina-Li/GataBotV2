import { fetchText } from './fetch.js'

/**
 * Create shorturl
 *
 * @param  {String} url
 */
const urlShortener = (url) => new Promise((resolve, reject) => {
    console.log(chalk.greenBright("├"), chalk.keyword("yellow")("[LOGS]"), chalk.keyword("cyan")('Creating short url...'))
    fetchText(`https://tinyurl.com/api-create.php?url=${url}`)
        .then((text) => resolve(text))
        .catch((err) => reject(err))
})

export default urlShortener

let axios = require('axios')
let cheerio = require('cheerio')


let userAgent = () => {
let os = [
'Macintosh; Intel Mac OS X 10_15_7',
'Macintosh; Intel Mac OS X 10_15_5',
'Macintosh; Intel Mac OS X 10_11_6',
'Macintosh; Intel Mac OS X 10_6_6',
'Macintosh; Intel Mac OS X 10_9_5',
'Macintosh; Intel Mac OS X 10_10_5',
'Macintosh; Intel Mac OS X 10_7_5',
'Macintosh; Intel Mac OS X 10_11_3',
'Macintosh; Intel Mac OS X 10_10_3',
'Macintosh; Intel Mac OS X 10_6_8',
'Macintosh; Intel Mac OS X 10_10_2',
'Macintosh; Intel Mac OS X 10_10_3',
'Macintosh; Intel Mac OS X 10_11_5',
'Windows NT 10.0; Win64; x64',
'Windows NT 10.0; WOW64',
'Windows NT 10.0',
];
return `Mozilla/5.0 (${os[Math.floor(Math.random() * os.length)]}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${Math.floor(
Math.random() * 3,
) + 87}.0.${Math.floor(Math.random() * 190) + 4100}.${Math.floor(Math.random() * 50) + 140} Safari/537.36`;
}
function ttaudio(url) {
return new Promise(async (resolve, reject) => {
const getDataFirst = await axios.get('https://www.tiktok.com')
const newCookie = getDataFirst.headers['set-cookie'].join('')
axios.get(url, {
headers: {
'user-agent': userAgent(),
'Cookie': newCookie
}
})
.then(({ data }) => {
const $ = cheerio.load(data)
const ttdata = JSON.parse($('script#__NEXT_DATA__').get()[0].children[0].data)
const meta = ttdata.props.pageProps.itemInfo.itemStruct
resolve({
status: true,
message: 'success',
profile: {
username: meta.author.uniqueId,
nickname: meta.author.nickname,
pp: meta.author.avatarLarger,
},
statistic: {
viewers: meta.stats.playCount,
comment: meta.stats.commentCount,
shared: meta.stats.shareCount,
},
result: {
description: meta.desc,
duration: meta.video.duration,
resolution: meta.video.width + 'x' + meta.video.height,
jpeg_thumb: meta.video.originCover,
gif_thumb: meta.video.dynamicCover,
audio: meta.music.playUrl,
},
author: {
name: 'Ivanzz_',
partner: 'Sanzz'
}
})
})
.catch((response) => {
reject({ status: false, message: response })
})
})
}


module.exports = ttaudio

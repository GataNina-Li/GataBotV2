const ig = require('insta-fetcher')
sesi = 'sessionid=48736705854:2Tq6joffmVDzaS:24'

async function user(username) {
 let a = await ig.fetchUser(username, sesi)
 return a
}

async function post(url) {
let z = await ig.fetchPost(url,sesi)
return z
}

module.exports = { user, post }
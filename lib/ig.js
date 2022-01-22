const ig = require('insta-fetcher')
sesi = "sessionid=29895733743:yJbOfjmWoBGPn2:26"

async function user(username) {
 let a = await ig.fetchUser(username, sesi)
 return a
}

async function post(url) {
let z = await ig.fetchPost(url,sesi)
return z
}

module.exports = { user, post }

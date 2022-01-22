const request = require("request");
const cheerio = require("cheerio");
const xznphoto = {
cemetery: "https://photooxy.com/logo-and-text-effects/text-on-scary-cemetery-gate-172.html",
wolf: "https://photooxy.com/logo-and-text-effects/create-a-wolf-metal-text-effect-365.html",
woodblock: "https://photooxy.com/logo-and-text-effects/carved-wood-effect-online-171.html",
under: "https://photooxy.com/logo-and-text-effects/make-quotes-under-grass-376.html",
pubg: "https://photooxy.com/battlegrounds/make-wallpaper-battlegrounds-logo-text-146.html",
nightsky: "https://photooxy.com/logo-and-text-effects/write-stars-text-on-the-night-sky-200.html",
cover: "https://photooxy.com/banner-cover/graffiti-text-cover-222.html",
hary: "https://photooxy.com/logo-and-text-effects/create-harry-potter-text-on-horror-background-178.html",
rainbow: "https://photooxy.com/logo-and-text-effects/rainbow-shine-text-223.html",
fabric: "https://photooxy.com/logo-and-text-effects/army-camouflage-fabric-text-effect-221.html",
typography: "https://photooxy.com/logo-and-text-effects/smoke-typography-text-effect-170.html",
gradient: "https://photooxy.com/logo-and-text-effects/gradient-avatar-text-effect-207.html",
battlefield: "https://photooxy.com/fps-game-effect/create-battlefield-4-rising-effect-152.html",
}
//2txt
async function pubg(text1, text2) {
  return new Promise((resolve, reject) => {
    const options = { method: 'POST',
      url: xznphoto.pubg,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      formData: { text_1: text1, text_2: text2, login: 'OK' } };
    
    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body)
      const result = {
           url: $('div.btn-group > a').attr('href')
      }
      resolve(result);
    });
  })
}

async function battlefield(text1, text2) {
  return new Promise((resolve, reject) => {
    const options = { method: 'POST',
      url: xznphoto.battlefield,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      formData: { text_1: text1, text_2: text2, login: 'OK' } };
    
    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body)
      const result = {
           url: $('div.btn-group > a').attr('href')
      }
      resolve(result);
    });
  })
}
//1txt
async function rainbow(text1) {
  return new Promise((resolve, reject) => {
    const options = { method: 'POST',
      url: xznphoto.rainbow,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      formData: { text_1: text1, login: 'OK' } };
    
    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body)
      const result = {
           url: $('div.btn-group > a').attr('href')
      }
      resolve(result);
    }); 
  })
}
async function fabric(text1) {
  return new Promise((resolve, reject) => {
    const options = { method: 'POST',
      url: xznphoto.fabric,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      formData: { text_1: text1, login: 'OK' } };
    
    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body)
      const result = {
           url: $('div.btn-group > a').attr('href')
      }
      resolve(result);
    }); 
  })
}
async function typography(text1) {
  return new Promise((resolve, reject) => {
    const options = { method: 'POST',
      url: xznphoto.typography,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      formData: { text_1: text1, login: 'OK' } };
    
    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body)
      const result = {
           url: $('div.btn-group > a').attr('href')
      }
      resolve(result);
    }); 
  })
}
async function gradient(text1) {
  return new Promise((resolve, reject) => {
    const options = { method: 'POST',
      url: xznphoto.gradient,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      formData: { text_1: text1, login: 'OK' } };
    
    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body)
      const result = {
           url: $('div.btn-group > a').attr('href')
      }
      resolve(result);
    }); 
  })
}
async function hary(text1) {
  return new Promise((resolve, reject) => {
    const options = { method: 'POST',
      url: xznphoto.hary,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      formData: { text_1: text1, login: 'OK' } };
    
    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body)
      const result = {
           url: $('div.btn-group > a').attr('href')
      }
      resolve(result);
    }); 
  })
}

async function cover(text1) {
  return new Promise((resolve, reject) => {
    const options = { method: 'POST',
      url: xznphoto.cover,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      formData: { text_1: text1, login: 'OK' } };
    
    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body)
      const result = {
           url: $('div.btn-group > a').attr('href')
      }
      resolve(result);
    }); 
  })
}

async function cemetery(text1) {
  return new Promise((resolve, reject) => {
    const options = { method: 'POST',
      url: xznphoto.cemetery,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      formData: { text_1: text1, login: 'OK' } };
    
    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body)
      const result = {
           url: $('div.btn-group > a').attr('href')
      }
      resolve(result);
    }); 
  })
}

async function wolf(text1) {
  return new Promise((resolve, reject) => {
    const options = { method: 'POST',
      url: xznphoto.wolf,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      formData: { text_1: text1, login: 'OK' } };
    
    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body)
      const result = {
           url: $('div.btn-group > a').attr('href')
      }
      resolve(result);
    }); 
  })
}

async function nightsky(text1) {
  return new Promise((resolve, reject) => {
    const options = { method: 'POST',
      url: xznphoto.nightsky,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      formData: { text_1: text1, login: 'OK' } };
    
    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body)
      const result = {
           url: $('div.btn-group > a').attr('href')
      }
      resolve(result);
    }); 
  })
}

async function under(text1) {
  return new Promise((resolve, reject) => {
    const options = { method: 'POST',
      url: xznphoto.under,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      formData: { text_1: text1, login: 'OK' } };
    
    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body)
      const result = {
           url: $('div.btn-group > a').attr('href')
      }
      resolve(result);
    }); 
  })
}

async function woodblock(text1) {
  return new Promise((resolve, reject) => {
    const options = { method: 'POST',
      url: xznphoto.woodblock,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      formData: { text_1: text1, login: 'OK' } };
    
    request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      const $ = cheerio.load(body)
      const result = {
           url: $('div.btn-group > a').attr('href')
      }
      resolve(result);
    }); 
  })
}

module.exports = {
cemetery,
wolf,
woodblock,
under,
pubg,
nightsky,
cover,
hary,
rainbow,
fabric,
typography,
gradient,
battlefield
};
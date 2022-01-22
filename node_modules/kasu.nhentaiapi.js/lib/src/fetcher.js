"use strict";
/*
For those who are using this but the Nhentai website is blocked on the country feel free
to add some idk proxy or other that would help.

I'm kinda busy and away from coding at this time of typing this.
*/
const fetch = require("isomorphic-fetch");
async function fetcher(arg) {
  const response = await fetch(arg, {
    "headers": {
      "accept": "text/html",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors"
  });
  const data = await response.text();
  return data;
}
module.exports = fetcher;
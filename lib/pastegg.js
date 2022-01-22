const PasteGG = require("paste.gg");
const moment = require("moment-timezone");
const pasteGg = new PasteGG();
const exp = moment().tz("Asia/Jakarta").add(60, "minutes").format();

/**
 * PasteGG
 * @function
 * @param {String} code - Your code.
 * @param {Object} options - Options (optional) example {"title": "ZRapi", "description": "Source code", "nameFile": "hasil.txt"}.
 */

async function pasteGG(code, options = {}) {
  if (!code) {
    throw new Error("Input code !!");
    return false;
  }
  if (options[0]) {
    throw new Error("Options not object");
  }
  if (options) {
    if (typeof options !== "object") {
      throw new Error("Options not object !!");
    }
  }
  !options.title ? (options.title = "Unknown Files") : options.title;
  !options.description
    ? (options.description = "Uploaded By Rikka-Bot")
    : options.description;
  !options.nameFile ? (options.nameFile = "uknown.txt") : options.nameFile;

  let hasilPost = await pasteGg.post({
    name: options.title, // Optional
    description: options.description,
    files: [
      {
        name: options.nameFile,
        content: {
          format: "text",
          value: `${code}`,
        },
      },
    ],
  });

  return hasilPost;
}

module.exports = pasteGG;
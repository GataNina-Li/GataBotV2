let fetch = require("node-fetch");

let axios = require("axios");

let handler = async (m, { conn, args, usedPrefix, command }) => {

  if (!args[0]) throw `*_Ingrese un enlace de la página https://xnxx.com_*\n\n*_Pude usar el comando #xnxxsearcho texto para buscar videos sobre el texto puesto_*`;

conn.reply(m.chat, `
*_🔰 Aguarde un momento.. 🔰_*

*_✅ Estoy descargando su video, esto puede demorar de 5 a 10 minutos, por favor sea paciente ✅_*
`.trim(), m);

  let vidurl = args[0].replace("xnxx", "onlineonlineoxnn");

  let res = axios

    .get(

      API("https://www.online-downloader.com", "/DL/YT.php", {

        videourl: vidurl,

        mstr: "9773",

        _: "1633710434836",

      })

    )

    .then((res) => {

      if (res.status != 200) throw `${res.status} ${res.statusText}`;

      let data = JSON.parse(res.data.replace(/[()]/g, ""));

      conn.sendFile(m.chat, data.Video_6_Url, "Error.mp4", "*_Aqui tiene 😏🔥_*", m);

    });

};

handler.help = ["xnxx"].map((v) => v + " <Link>");

handler.tags = ["nsfw"];

handler.command = /^(xnxx)$/i;

handler.limit = false;

handler.nsfw = false

module.exports = handler;
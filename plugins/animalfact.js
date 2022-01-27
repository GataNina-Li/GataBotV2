let fetch = require("node-fetch");

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    throw `
*[❗] Uso correcto:*    
*${usedPrefix}${command} opción*

*Ejemplo de uso:*
*${usedPrefix}${command} dog*\n
*┌〔 OPCIONES 〕*
*├* _dog_
*├* _cat_
*├* _panda_
*├* _fox_
*├* _red_panda_
*├* _koala_
*├* _birb_
*├* _raccoon_
*├* _kangaroo_
*└────*
`.trim();
  let res = await fetch(
    API("https://some-random-api.ml", "/animal/" + text, {})
  );
  if (!res.ok) throw `${res.status} ${res.statusText}`;
  let json = await res.json();
  if (json.image) await conn.sendFile(m.chat, json.image, "", `${json.fact}\n\n~The Shadow Brokers - Bot`, m);
  else throw json;
};
handler.help = ["animal"].map((v) => v + " <hewan>");
handler.tags = ["internet"];
handler.command = /^(animal|animalfact)$/i;

module.exports = handler;

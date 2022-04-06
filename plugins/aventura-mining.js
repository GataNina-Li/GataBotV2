let handler = async (m, { conn, usedPrefix }) => {
	
	let user = global.DATABASE._data.users[m.sender]
	let pickaxe = global.DATABASE._data.users[m.sender].pickaxe
	let pdurability = global.DATABASE._data.users[m.sender].pickaxedurability
    let __waktur = (new Date - global.DATABASE._data.users[m.sender].lastmining)
    let _waktur = (180000 - __waktur)
    let waktur = clockString(_waktur)
    let hasil = (pickaxe == 1 ? Math.floor(Math.random() * 5) : '' || pickaxe == 2 ? Math.floor(Math.random() * 7) : '' || pickaxe == 3 ? Math.floor(Math.random() * 10) : '' || pickaxe == 4 ? Math.floor(Math.random() * 20) : '' || pickaxe == 5 ? Math.floor(Math.random() * 30) : '' )
    let hasiiil = (pickaxe == 1 ? Math.floor(Math.random() * 20) : '' || pickaxe == 2 ? Math.floor(Math.random() * 30) : '' || pickaxe == 3 ? Math.floor(Math.random() * 40) : '' || pickaxe == 4 ? Math.floor(Math.random() * 50) : '' || pickaxe == 5 ? Math.floor(Math.random() * 60) : '' )
    let hasiil = (pickaxe == 1 ? Math.ceil(Math.random() * 200) : '' || pickaxe == 2 ? Math.ceil(Math.random() * 250) : '' || pickaxe == 3 ? Math.ceil(Math.random() * 300) : '' || pickaxe == 4 ? Math.ceil(Math.random() * 350) : '' || pickaxe == 5 ? Math.ceil(Math.random() * 500) : '' )
    let hasiiiil = (pickaxe == 1 ? Math.ceil(Math.random() * 200) : '' || pickaxe == 2 ? Math.ceil(Math.random() * 400) : '' || pickaxe == 3 ? Math.ceil(Math.random() * 600) : '' || pickaxe == 4 ? Math.ceil(Math.random() * 800) : '' || pickaxe == 5 ? Math.ceil(Math.random() * 1000) : '' )
    let konz = Math.floor(Math.random() * 100)
    let exp = (Math.floor(Math.random() * 200) + (pickaxe * 70))
    let goa = (pickRandom(['una cueva', 'un volcan', 'jupiter', 'saturno']))
    let selesai = (pickRandom(['huuh', 'Selesai Juga', 'Kayaknya Sampah', 'Kayaknya Bagus', 'Perlu Upgrade pickaxe nih biar hasilnya bagus', 'Trash!', 'GG', 'Banyak Batu doang', 'Iron nya dikit', 'Diamond nya dikit', 'Bjir banyak Diamond', 'Bjir banyak Iron']))
     
    if (pickaxe > 0) {
    if (global.DATABASE._data.users[m.sender].pickaxedurability > 99) {
    if (new Date - global.DATABASE._data.users[m.sender].lastmining > 180000) {
       
global.DATABASE._data.users[m.sender].lastmining = new Date * 1
global.DATABASE._data.users[m.sender].diamond += hasil * 1 
global.DATABASE._data.users[m.sender].iron += hasiiil * 1 
global.DATABASE._data.users[m.sender].batu += hasiil * 1 
global.DATABASE._data.users[m.sender].pickaxedurability -= konz * 1
global.DATABASE._data.users[m.sender].exp += hasiiiil * 1

          setTimeout(() => {
          	m.reply(`Minaste en *${goa}* y obtienes:
          
- Diamante: ${hasil}
- Hiero: ${hasiiil}
- Piedra: ${hasiil}
- Exp: ${hasiiiil}`)
          }, 0)
          
            } else m.reply(`Te quedaste sin energía vuelve dentro de *${waktur}*`)
         } else m.reply(`Repara tu pico, escribiendo ${usedPrefix}shop up pico`)
     } else m.reply(`Todavía no tienes un pico, compralo escribiendo ${usedPrefix}shop buy pico`)
 }

handler.help = ['mining']
handler.tags = ['rpg']

handler.command = /^(mining|minar)$/i
handler.disabled = false

module.exports = handler

function clockString(seconds) {
  d = Math.floor(seconds / (1000 * 60 * 60 * 24));
  h = Math.floor((seconds / (1000 * 60 * 60)) % 24);
  m = Math.floor((seconds / (1000 * 60)) % 60);
  s = Math.floor((seconds / 1000) % 60);
  
  dDisplay = d > 0 ? d + (d == 1 ? " dia," : " Dias,") : "";
  hDisplay = h > 0 ? h + (h == 1 ? " hora, " : " Horas, ") : "";
  mDisplay = m > 0 ? m + (m == 1 ? " minuto, " : " Minutos, ") : "";
  sDisplay = s > 0 ? s + (s == 1 ? " segundo" : " Segundos") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
};

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
} 

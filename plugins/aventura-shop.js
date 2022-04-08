let fs = require('fs')
const potion = 500
const Spotion = 150 
const Bdiamond = 900
const Sdiamond = 750
const Sbatu = 2
const Siron = 50
const Bcommon = 200
const Scommon = 20
const Suncommon = 100
const Buncommon = 600
const Bmythic = 2000 
const Smythic = 500
const Blegendary = 7500 
const Slegendary = 3000
const Bsampah = 10
const Ssampah = 2
let handler  = async (m, { conn, text, command, args, usedPrefix, DevMode }) => {
    const _armor = global.DATABASE._data.users[m.sender].armor
    const armor = (_armor == 0 ? 20000 : '' || _armor == 1 ? 49999 : '' || _armor == 2 ? 99999 : '' || _armor == 3 ? 149999 : '' || _armor == 4 ? 299999 : '')
    const _pickaxe = global.DATABASE._data.users[m.sender].pickaxe
   const pickaxe = (_pickaxe == 0 ? 20000 : '' || _pickaxe == 1 ? 49999 : '' || _pickaxe == 2 ? 99999 : '' || _pickaxe == 3 ? 149999 : '' || _pickaxe == 4 ? 299999 : '')
    let type = (args[0] || '').toLowerCase()
    let _type = (args[1] || '').toLowerCase()
    let jualbeli = (args[0] || '').toLowerCase()
    let shoprpg = fs.readFileSync('./src/shop.png')
    const Kchat = `
*🛒 ARTÍCULOS PARA COMPRAR 🛍️*

🔮 Pocion: _$${potion}_
💎 Diamante: _$${Bdiamond}_
🚮 Basura: _$${Bsampah}_
🦾 Armadura: _$${armor}_
⛏️ Pico: _$${pickaxe}_

*Cajas 📦*
😃 Comun: _$${Bcommon}_
😁 Normal: _$${Buncommon}_
😌 Mitico: _$${Bmythic}_
🤩 Legendario: _$${Blegendary}_

✅ *Ejemplo se uso* :
${usedPrefix}tienda comprar pocion 1

━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━ ━

*🛒 ARTÍCULOS PARA VENDER 🛍️*

🔮 Pocion: _$${Spotion}_
💎 Diamante: _$${Sdiamond}_
🪨 Piedra: _$${Sbatu}_
⚕️ Hierro: _$${Siron}_
🚮 Basura: _$${Ssampah}_

*Cajas 📦*
😺 Comun: _$${Scommon}_
😸 Normal: _$${Suncommon}_
😼 Mitico: _$${Smythic}_
😽 Legendario: _$${Slegendary}_

✅ *Ejemplo se uso* :
${usedPrefix}tienda vender basura 10
`.trim()
    try {
        if (/shop|toko|tienda/i.test(command)) {
            const count = args[2] && args[2].length > 0 ? Math.min(99999999, Math.max(parseInt(args[2]), 1)) : !args[2] || args.length < 4 ? 1 :Math.min(1, count)
            const sampah = global.DATABASE._data.users[m.sender].sampah
            switch (jualbeli) {
            case 'buy':
                switch (_type) {
                    case 'pocion':
                            if (global.DATABASE._data.users[m.sender].money >= potion * count) {
                                global.DATABASE._data.users[m.sender].money -= potion * count
                                global.DATABASE._data.users[m.sender].potion += count * 1
                                conn.reply(m.chat, `Compraste ${count} pociones por ${potion * count} de dinero\n\nUse la pocion escribiendo: *${usedPrefix}use pocion <cantidad>*`, m)
                            } else conn.reply(m.chat, `No tienes suficiente dinero para comprar ${count} pociones por ${potion * count} de dinero`,)
                        break
                    case 'diamante':
                            if (global.DATABASE._data.users[m.sender].money >= Bdiamond * count) {
                                global.DATABASE._data.users[m.sender].diamond += count * 1
                                global.DATABASE._data.users[m.sender].money -= Bdiamond * count
                                conn.reply(m.chat, `Compraste ${count} diamantes por ${Bdiamond * count} de dinero`, m)
                            } else conn.reply(m.chat, `No tienes suficiente dinero para comprar diamantes`, m)
                        
                        break
                    case 'comun':
                            if (global.DATABASE._data.users[m.sender].money >= Bcommon * count) {
                                global.DATABASE._data.users[m.sender].common += count * 1
                                global.DATABASE._data.users[m.sender].money -= Bcommon * count
                                conn.reply(m.chat, `Compraste ${count} caja comun por ${Bcommon * count} de dinero`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Common crate dengan harga ${Bcommon * count} money\n\nBuka crate dengan ketik: *${usedPrefix}open common*`, m)
                        
                        break
                    case 'normal':
                            if (global.DATABASE._data.users[m.sender].money >= Buncommon * count) {
                                global.DATABASE._data.users[m.sender].uncommon += count * 1
                                global.DATABASE._data.users[m.sender].money -= Buncommon * count
                                conn.reply(m.chat, `Compraste ${count} caja normal por ${Buncommon * count} de dinero`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Uncommon crate dengan harga ${Buncommon * count} money\n\nBuka crate dengan ketik: *${usedPrefix}open uncommon*`, m)
                        
                        break
                    case 'mitico':
                            if (global.DATABASE._data.users[m.sender].money >= Bmythic * count) {
                                    global.DATABASE._data.users[m.sender].mythic += count * 1
                                global.DATABASE._data.users[m.sender].money -= Bmythic * count
                                conn.reply(m.chat, `Compraste ${count} caja mÃ­tica por ${Bmythic * count} de dinero`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Mythic crate dengan harga ${Bmythic* count} money\n\nBuka crate dengan ketik: *${usedPrefix}open mythic*`, m)
                        
                        break
                    case 'legendario':
                            if (global.DATABASE._data.users[m.sender].money >= Blegendary * count) {
                                global.DATABASE._data.users[m.sender].legendary += count * 1
                                global.DATABASE._data.users[m.sender].money -= Blegendary * count
                                conn.reply(m.chat, `Compraste ${count} caja legendaria por ${Blegendary * count} de dinero`, m)
                            } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Legendary crate dengan harga ${Blegendary * count} money\n\nBuka crate dengan ketik: *${usedPrefix}open legendary*`, m)
                        
                        break
                    case 'basura':
                            if (global.DATABASE._data.users[m.sender].money >= Bsampah * count) {
                                global.DATABASE._data.users[m.sender].sampah += count * 1
                                global.DATABASE._data.users[m.sender].money -= Bsampah * count
                                conn.reply(m.chat, `Compraste ${count} de basura por ${Bsampah * count} de dinero`, m)
                            } else conn.reply(m.chat, `Tu dinero no es suficiente para comprar ${count} de basura por ${Bsampah * count} de dinero`.trim(), m)
                        
                        break
                    case 'armadura':
                            if (global.DATABASE._data.users[m.sender].armor == 5) return conn.reply(m.chat, 'Tu armadura esta al nivel máximo', m)
                            if (global.DATABASE._data.users[m.sender].money > armor) {
                                global.DATABASE._data.users[m.sender].armor += 1
                                global.DATABASE._data.users[m.sender].money -= armor * 1
                                conn.reply(m.chat, `Compraste una armadura por ${armor} de dinero` ,m)
                            } else conn.reply(m.chat, `Tu dinero no es suficiente para comprar una armadura que cuesta ${armor} de dinero`, m)
                        
                        break
                    case 'pico':
                        if (global.DATABASE._data.users[m.sender].pickaxe == 5) return conn.reply(m.chat, 'Tu pico esa al nivel máximo', m)
                        if (global.DATABASE._data.users[m.sender].money > pickaxe * 1) {
                            global.DATABASE._data.users[m.sender].pickaxe += 1
                            global.DATABASE._data.users[m.sender].pickaxedurability += ( 0 ? 500 : '' || 1 ? 1000 : '' || 2 ? 1500 : '' || 3 ? 2000 : '' || 4 ? 2500 : '' || 5 ? 3000 : '')
                            global.DATABASE._data.users[m.sender].money -= pickaxe * 1
                            conn.reply(m.chat, `Compraste un pico por ${pickaxe} de dinero` ,m)
                                                      
                        } else conn.reply(m.chat, `Tu dinero no es suficiente para comprar un pico que cuesta ${pickaxe} de dinero`, m)
                        break
                    default:
                        return conn.reply(m.chat, Kchat, text, { quoted: m, contextInfo: { externalAdReply:{title: `\t\t\t\tTIENDA RPG`, previewType:"PHOTO",thumbnail: shoprpg, sourceUrl:``}}})
                }
                break
            case 'up':
               switch (_type) {
               	case 'pico':
                        if (global.DATABASE._data.users[m.sender].pickaxedurability >= 5000) return conn.reply(m.chat, 'Tu pico tiene la durabilidad máxima', m)
                        if (global.DATABASE._data.users[m.sender].money > Upickaxe * 1) {
                            global.DATABASE._data.users[m.sender].pickaxedurability += 500
                            global.DATABASE._data.users[m.sender].money -= Upickaxe * 1
                            conn.reply(m.chat, `Se aumento la *durabilidad del pico* por ${Upickaxe} de dinero` ,m)
                        } else conn.reply(m.chat, `Tu dinero no es suficiente para aumentar la durabilidad del pico que cuesta ${Upickaxe} de dinero`, m)
                        break
                     default:
                        return conn.reply(m.chat, Kchat, m)
                }
                break
            case 'sell': 
                switch (_type) {
                    case 'pocion':
                        if (global.DATABASE._data.users[m.sender].potion >= count * 1) {
                            global.DATABASE._data.users[m.sender].money += Spotion * count
                            global.DATABASE._data.users[m.sender].potion -= count * 1
                            conn.reply(m.chat, `Vendiste ${count} de pocion por ${Spotion * count} de dinero`.trim(), m)
                        } else conn.reply(m.chat, `No tienes suficientes opciones para vender`.trim(), m)
                        break
                    case 'comun':
                        if (global.DATABASE._data.users[m.sender].common >= count * 1) {
                            global.DATABASE._data.users[m.sender].money += Scommon * count
                            global.DATABASE._data.users[m.sender].common -= count * 1
                            conn.reply(m.chat, `Vendiste ${count} de caja comun por ${Scommon * count} de dinero`.trim(), m)
                        } else conn.reply(m.chat, `No tienes suficientes cajas comunes para vender`.trim(), m)
                        break
                    case 'normal':
                        if (global.DATABASE._data.users[m.sender].uncommon >= count * 1) {
                            global.DATABASE._data.users[m.sender].money += Suncommon * count
                            global.DATABASE._data.users[m.sender].uncommon -= count * 1
                            conn.reply(m.chat, `Vendiste ${count} de caja normal por ${Suncommon * count} de dinero`.trim(), m)
                        } else conn.reply(m.chat, `No tienes suficientes cajas normales para vender`.trim(), m)
                        break
                    case 'mitico':
                        if (global.DATABASE._data.users[m.sender].mythic >= count * 1) {
                            global.DATABASE._data.users[m.sender].money += Smythic * count
                            global.DATABASE._data.users[m.sender].mythic -= count * 1
                            conn.reply(m.chat, `Vendiste ${count} de caja mitico por ${Smythic * count} de dinero`.trim(), m)
                        } else conn.reply(m.chat, `No tienes suficientes cajas miticas para vender`.trim(), m)
                        break
                    case 'legendario':
                        if (global.DATABASE._data.users[m.sender].legendary >= count * 1) {
                            global.DATABASE._data.users[m.sender].money += Slegendary * count
                            global.DATABASE._data.users[m.sender].legendary -= count * 1
                            conn.reply(m.chat, `Vendiste ${count} de caja legendario por ${Slegendary * count} de dinero`.trim(), m)
                        } else conn.reply(m.chat, `No tienes suficientes cajas legendarias para vender`.trim(), m)
                        break
                    case 'basura':
                        if (global.DATABASE._data.users[m.sender].sampah >= count * 1) {
                            global.DATABASE._data.users[m.sender].sampah -= count * 1
                            global.DATABASE._data.users[m.sender].money += Ssampah * count
                            conn.reply(m.chat, `Vendiste ${count} de basura por ${Ssampah * count} de dinero`, m)
                        } else conn.reply(m.chat, `No tiene suficiente basura para vender`, m)
                        break
                    case 'diamante':
                        if (global.DATABASE._data.users[m.sender].diamond >= count * 1) {
                            global.DATABASE._data.users[m.sender].diamond -= count * 1
                            global.DATABASE._data.users[m.sender].money += Sdiamond * count
                            conn.reply(m.chat, `Vendiste ${count} de diamante por ${Sdiamond * count} de dinero`, m)
                        } else conn.reply(m.chat, `No tienes suficientes diamantes para vender`, m)
                        break
                    default:
                        return conn.reply(m.chat, Kchat, text, { quoted: m, contextInfo: { externalAdReply:{title: `\t\t\t\tTIENDA RPG`, previewType:"PHOTO",thumbnail: shoprpg, sourceUrl:``}}})
                }
                break
            default:
                return conn.reply(m.chat, Kchat, text, { quoted: m, contextInfo: { externalAdReply:{title: `\t\t\t\tTIENDA RPG`, previewType:"PHOTO",thumbnail: shoprpg, sourceUrl:``}}})
            }
        } else if (/beli|buy|comprar/i.test(command)) {
            const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
            switch (type) {
                case 'pocion':
                        if (global.DATABASE._data.users[m.sender].money >= potion * count) {
                            global.DATABASE._data.users[m.sender].money -= potion * count
                            global.DATABASE._data.users[m.sender].potion += count * 1
                            conn.reply(m.chat, `Compraste ${count} pociones por ${potion * count} de dinero\n\nUse la pocion escribiendo: *${usedPrefix}use pocion <cantidad>*`, m)
                        } else conn.reply(m.chat, `No tienes suficiente dinero para comprar ${count} pociones por ${potion * count} de dinero`,m)
                    
                    break
                case 'diamante':
                        if (global.DATABASE._data.users[m.sender].money >= Bdiamond * count) {
                            global.DATABASE._data.users[m.sender].diamond += count * 1
                            global.DATABASE._data.users[m.sender].money -= Bdiamond * count
                            conn.reply(m.chat, `Compraste ${count} diamantes por ${Bdiamond * count} de dinero`, m)
                        } else conn.reply(m.chat, `No tienes suficiente dinero para comprar diamantes`, m)
                    
                    break
                case 'comun':
                        if (global.DATABASE._data.users[m.sender].money >= Bcommon * count) {
                            global.DATABASE._data.users[m.sender].common += count * 1
                            global.DATABASE._data.users[m.sender].money -= Bcommon * count
                            conn.reply(m.chat, `Compraste ${count} caja comun por ${Bcommon * count} de dinero`, m)
                        } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Common crate dengan harga ${Bcommon * count} money\n\nBuka crate dengan ketik: *${usedPrefix}open common*`, m)
                    
                    break
                case 'normal':
                        if (global.DATABASE._data.users[m.sender].money >= Buncommon * count) {
                            global.DATABASE._data.users[m.sender].uncommon += count * 1
                            global.DATABASE._data.users[m.sender].money -= Buncommon * count
                            conn.reply(m.chat, `Compraste ${count} caja normal por ${Buncommon * count} de dinero`, m)
                        } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Uncommon crate dengan harga ${Buncommon * count} money\n\nBuka crate dengan ketik: *${usedPrefix}open uncommon*`, m)
                   
                    break
                case 'mitico':
                        if (global.DATABASE._data.users[m.sender].money >= Bmythic * count) {
                            global.DATABASE._data.users[m.sender].mythic += count * 1
                            global.DATABASE._data.users[m.sender].money -= Bmythic * count
                            conn.reply(m.chat, `Compraste ${count} caja mÃ­tica por ${Bmythic * count} de dinero`, m)
                        } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Mythic crate dengan harga ${Bmythic* count} money\n\nBuka crate dengan ketik: *${usedPrefix}open mythic*`, m)
                    
                    break
                case 'legendario':
                        if (global.DATABASE._data.users[m.sender].money >= Blegendary * count) {
                            global.DATABASE._data.users[m.sender].legendary += count * 1
                            global.DATABASE._data.users[m.sender].money -= Blegendary * count
                            conn.reply(m.chat, `Compraste ${count} caja legendaria por ${Blegendary * count} de dinero`, m)
                        } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Legendary crate dengan harga ${Blegendary * count} money\n\nBuka crate dengan ketik: *${usedPrefix}open legendary*`, m)
                    
                    break
                case 'basura':
                        if (global.DATABASE._data.users[m.sender].money >= Bsampah * count) {
                            global.DATABASE._data.users[m.sender].sampah += count * 1
                            global.DATABASE._data.users[m.sender].money -= Bsampah * count
                            conn.reply(m.chat, `Compraste ${count} de basura por ${Bsampah * count} de dinero`, m)
                        } else conn.reply(m.chat, `Uang anda tidak cukup untuk membeli ${count} Sampah dengan harga ${Bsampah * count} money`.trim(), m)
                    
                    break
                case 'armadura':
                        if (global.DATABASE._data.users[m.sender].armor == 5) return conn.reply(m.chat, 'Armormu sudah *Level Max*', m)
                        if (global.DATABASE._data.users[m.sender].money > armor * 1) {
                            global.DATABASE._data.users[m.sender].armor += 1
                            global.DATABASE._data.users[m.sender].money -= armor * 1
                            conn.reply(m.chat, `Compraste una armadura por ${armor} de dinero` ,m)
                          
                        } else conn.reply(m.chat, `Tu dinero no es suficiente para comprar una armadura, costo ${armor} de dinero`, m)
                    
                    break
             case 'pickaxe':
                        if (lobal.DATABASE._data.users[m.sender].pickaxe == 5) return conn.reply(m.chat, 'Tu pico esta a nivel maximo', m)
                        if (lobal.DATABASE._data.users[m.sender].money > pickaxe * 1) {
                            lobal.DATABASE._data.users[m.sender].pickaxe += 1
                            lobal.DATABASE._data.users[m.sender].pickaxedurability += ( 0 ? 500 : '' || 1 ? 1000 : '' || 2 ? 1500 : '' || 3 ? 2000 : '' || 4 ? 2500 : '' || 5 ? 3000 : '')
                            lobal.DATABASE._data.users[m.sender].money -= pickaxe * 1
                            conn.reply(m.chat, `Compraste un pico por ${pickaxe} de dinero` ,m)
                          
                        } else conn.reply(m.chat, `Tu dinero no es suficiente para comprar un pico que cuesta ${pickaxe} de dinero`, m)
                        break
                default:
                    return conn.reply(m.chat, Kchat, text, { quoted: m, contextInfo: { externalAdReply:{title: `\t\t\t\tTIENDA RPG`, previewType:"PHOTO",thumbnail: shoprpg, sourceUrl:``}}})
            }
        } else if (/sell|jual|vender/i.test(command)) {
            const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : !args[1] || args.length < 3 ? 1 : Math.min(1, count)
            switch (type) {
                case 'pocion':
                    if (global.DATABASE._data.users[m.sender].potion >= count * 1) {
                        global.DATABASE._data.users[m.sender].money += Spotion * count
                        global.DATABASE._data.users[m.sender].potion -= count * 1
                        conn.reply(m.chat, `Succes menjual ${count} Potion dengan harga ${Spotion * count} money`.trim(), m)
                    } else conn.reply(m.chat, `No tienes suficiente pociones para vender`.trim(), m)
                    break
                case 'comun':
                    if (global.DATABASE._data.users[m.sender].common >= count * 1) {
                        global.DATABASE._data.users[m.sender].money += Scommon * count
                        global.DATABASE._data.users[m.sender].common -= count * 1
                        conn.reply(m.chat, `Succes menjual ${count} Common Crate dengan harga ${Scommon * count} money`.trim(), m)
                    } else conn.reply(m.chat, `No tienes suficiente cajas comunes para vender`.trim(), m)
                    break
                case 'normal':
                    if (global.DATABASE._data.users[m.sender].uncommon >= count * 1) {
                        global.DATABASE._data.users[m.sender].money += Suncommon * count
                        global.DATABASE._data.users[m.sender].uncommon -= count * 1
                        conn.reply(m.chat, `Succes menjual ${count} Uncommon Crate dengan harga ${Suncommon * count} money`.trim(), m)
                    } else conn.reply(m.chat, `No tienes suficiente cajas normales para vender`.trim(), m)
                    break
                case 'mitico':
                    if (global.DATABASE._data.users[m.sender].mythic >= count * 1) {
                        global.DATABASE._data.users[m.sender].money += Smythic * count
                        global.DATABASE._data.users[m.sender].mythic -= count * 1
                        conn.reply(m.chat, `Succes menjual ${count} Mythic Crate dengan harga ${Smythic * count} money`.trim(), m)
                    } else conn.reply(m.chat, `No tienes suficiente cajas mÃ­ticas para vender`.trim(), m)
                    break
                case 'legendario':
                    if (global.DATABASE._data.users[m.sender].legendary >= count * 1) {
                        global.DATABASE._data.users[m.sender].money += Slegendary * count
                        global.DATABASE._data.users[m.sender].legendary -= count * 1
                        conn.reply(m.chat, `Succes menjual ${count} Legendary Crate dengan harga ${Slegendary * count} money`.trim(), m)
                    } else conn.reply(m.chat, `No tienes suficiente cajas legendarias para vender`.trim(), m)
                    break
                case 'basura':
                    if (global.DATABASE._data.users[m.sender].sampah >= count * 1) {
                        global.DATABASE._data.users[m.sender].sampah -= count * 1
                        global.DATABASE._data.users[m.sender].money += Ssampah * count
                        conn.reply(m.chat, `Vendiste ${count} de basura por ${Ssampah * count} de dinero`.trim(), m)
                    } else conn.reply(m.chat, `No tienes suficiente basura para vender`.trim(), m)
                    break
                case 'piedra':
                    if (global.DATABASE._data.users[m.sender].batu >= count * 1) {
                        global.DATABASE._data.users[m.sender].batu -= count * 1
                        global.DATABASE._data.users[m.sender].money += Sbatu * count
                        conn.reply(m.chat, `Vendiste ${count} de piedra por ${Sbatu * count} de dinero`.trim(), m)
                    } else conn.reply(m.chat, `No tienes suficiente piedra para vender`.trim(), m)
                    break
                case 'diamante':
                    if (global.DATABASE._data.users[m.sender].diamond >= count * 1) {
                        global.DATABASE._data.users[m.sender].diamond -= count * 1
                        global.DATABASE._data.users[m.sender].money += Sdiamond * count
                        conn.reply(m.chat, `Vendiste ${count} de diamante por ${Sdiamond * count} de dinero`, m)
                    } else conn.reply(m.chat, `No tienes suficiente diamantes para vender`, m)
                    break
                case 'hierro':
                        if (global.DATABASE._data.users[m.sender].iron >= count * 1) {
                            global.DATABASE._data.users[m.sender].iron -= count * 1
                            global.DATABASE._data.users[m.sender].money += Siron * count
                            conn.reply(m.chat, `Vendiste ${count} de hierro por ${Siron * count} de dinero`, m)
                        } else conn.reply(m.chat, `No tienes suficiente hierro para vender`, m)
                        break
                default:
                    return conn.reply(m.chat, Kchat, text, { quoted: m, contextInfo: { externalAdReply:{title: `\t\t\t\tTIENDA GATABOT`, previewType:"PHOTO",thumbnail: shoprpg, sourceUrl:``}}})
            }
        }
    } catch (e) {
        conn.reply(m.chat, Kchat, m)
        console.log(e)
        if (DevMode) {
            for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
                conn.sendMessage(jid, 'shop.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
            }
        }
    }
}

handler.help = ['shop']
handler.tags = ['rpg']
    
handler.command = /^(shop|toko|tienda|buy|beli|comprar|sell|jual|vender)$/i
module.exports = handler

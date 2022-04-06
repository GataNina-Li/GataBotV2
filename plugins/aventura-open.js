let { MessageType } = require('@adiwajshing/baileys')
let handler = async (m, { conn, command, args, text, usedPrefix, DevMode }) => {
  try {
    let bruh = `*Ingrese el nombre & la cantidad*

- Ejemplo: ${usedPrefix + command} comun 10

*Cajas disponibles:*

- Comun
- Normal
- Mitico
- Legendario
- Mascota
`.trim()
    let _lmao = args[0]
    let Lmao = `Solo están disponible estas cantidades 1, 10, 100, 1000`
    let type = (args[0] || '').toLowerCase()
    let jumlah = (args[1] || '').toLowerCase()
    switch (type) {
        case 'comun':
            switch (jumlah) {
                case '1':
                case 'crate':
                    let _cm = `${Math.floor(Math.random() * 50)}`.trim()
                    let _cc = `${Math.floor(Math.random() * 2)}`.trim()
                    let _cp = `${Math.floor(Math.random() * 1)}`.trim()
                    let _ce = `${Math.floor(Math.random() * 100)}`.trim()
                    let _cu = `${Math.floor(Math.random() * 1)}`.trim()
                    let cm = (_cm * 1)
                    let cc = (_cc * 1)
                    let cp = (_cp * 1)
                    let ce = (_ce * 1)
                    let cu = (_cu * 1)
                    let Hcom = `
Abriste *una caja comun* y obtienes:
${cm > 0 ? `\n- Dinero: ${cm}` : ''}${ce > 0 ? `\n- Exp: ${ce}` : ''}${cp > 0 ? `\n- Pocion: ${cp}` : ''}${cc > 0 ? `\n- Caja comun: ${cc}` : ''}${cu > 0 ? `\n- Caja normal: ${cu}` : ''}
`.trim()
                    if (global.DATABASE._data.users[m.sender].common >= 1) {
                        global.DATABASE._data.users[m.sender].common -= 1
                        global.DATABASE._data.users[m.sender].money += cm * 1
                        global.DATABASE._data.users[m.sender].exp += ce * 1
                        global.DATABASE._data.users[m.sender].potion += cp * 1
                        global.DATABASE._data.users[m.sender].uncommon += cu * 1
                        global.DATABASE._data.users[m.sender].common += cc * 1
                        conn.reply(m.chat, Hcom, m)
                    } else conn.reply(m.chat, 'No tienes suficientes cajas comunes', m)
                    break
                case '10':
                    let _cm1 = `${Math.floor(Math.random() * 500)}`.trim()
                    let _cc1 = `${Math.floor(Math.random() * 5)}`.trim()
                    let _cp1 = `${Math.floor(Math.random() * 3)}`.trim()
                    let _ce1 = `${Math.floor(Math.random() * 700)}`.trim()
                    let _cu1 = `${Math.floor(Math.random() * 3)}`.trim()
                    let cm1 = (_cm1 * 1)
                    let cc1 = (_cc1 * 1)
                    let cp1 = (_cp1 * 1)
                    let ce1 = (_ce1 * 1)
                    let cu1 = (_cu1 * 1)
                    let Hcom1 = `
Abriste *10 cajas comunes* y obtienes:
${cm1 > 0 ? `\n- Dinero: ${cm1}` : ''}${ce1 > 0 ? `\n- Exp: ${ce1}` : ''}${cp1 > 0 ? `\n- Pocion: ${cp1}` : ''}${cc1 > 0 ? `\n- Normal: ${cc1}` : ''}${cu1 > 0 ? `\n- Caja normal: ${cu1}` : ''}
`.trim()
                    if (global.DATABASE._data.users[m.sender].common >= 10) {
                        global.DATABASE._data.users[m.sender].common -= 10
                        global.DATABASE._data.users[m.sender].money += cm1 * 1
                        global.DATABASE._data.users[m.sender].exp += ce1 * 1
                        global.DATABASE._data.users[m.sender].potion += cp1 * 1
                        global.DATABASE._data.users[m.sender].uncommon += cu1 * 1
                        global.DATABASE._data.users[m.sender].common += cc1 * 1
                        conn.reply(m.chat, Hcom1, m)
                    } else conn.reply(m.chat, 'No tienes suficientes cajas comunes', m)
                    break
                case '100':
                    let _cm2 = `${Math.floor(Math.random() * 5000)}`.trim()
                    let _cc2 = `${Math.floor(Math.random() * 50)}`.trim()
                    let _cp2 = `${Math.floor(Math.random() * 20)}`.trim()
                    let _ce2 = `${Math.floor(Math.random() * 7500)}`.trim()
                    let _cu2 = `${Math.floor(Math.random() * 30)}`.trim()
                    let cm2 = (_cm2 * 1)
                    let cc2 = (_cc2 * 1)
                    let cp2 = (_cp2 * 1)
                    let ce2 = (_ce2 * 1)
                    let cu2 = (_cu2 * 1)
                    let Hcom2 = `
Abriste *100 cajas comunes* y obtienes:
${cm2 > 0 ? `\n- Dinero: ${cm2}` : ''}${ce2 > 0 ? `\n- Exp: ${ce2}` : ''}${cp2 > 0 ? `\n- Pocion: ${cp2}` : ''}${cc2 > 0 ? `\n- Normal: ${cc2}` : ''}${cu2 > 0 ? `\n- Caja normal: ${cu2}` : ''}
`.trim()
                    if (global.DATABASE._data.users[m.sender].common >= 100) {
                        global.DATABASE._data.users[m.sender].common -= 100
                        global.DATABASE._data.users[m.sender].money += cm2 * 1
                        global.DATABASE._data.users[m.sender].exp += ce2 * 1
                        global.DATABASE._data.users[m.sender].potion += cp2 * 1
                        global.DATABASE._data.users[m.sender].uncommon += cu2 * 1
                        global.DATABASE._data.users[m.sender].common += cc2 * 1
                        conn.reply(m.chat, Hcom2, m)
                    } else conn.reply(m.chat, 'No tienes suficientes cajas comunes', m)
                    break
                case '1000':
                    let _cm3 = `${Math.floor(Math.random() * 50000)}`.trim()
                    let _cc3 = `${Math.floor(Math.random() * 350)}`.trim()
                    let _cp3 = `${Math.floor(Math.random() * 100)}`.trim()
                    let _ce3 = `${Math.floor(Math.random() * 80000)}`.trim()
                    let _cu3 = `${Math.floor(Math.random() * 200)}`.trim()
                    let cm3 = (_cm3 * 1)
                    let cc3 = (_cc3 * 1)
                    let cp3 = (_cp3 * 1)
                    let ce3 = (_ce3 * 1)
                    let cu3 = (_cu3 * 1)
                    let Hcom3 = `
Abriste *1000 cajas comunes* y obtienes:
${cm3 > 0 ? `\n- Dinero: ${cm3}` : ''}${ce3 > 0 ? `\n- Exp: ${ce3}` : ''}${cp3 > 0 ? `\n- Pocion: ${cp3}` : ''}${cc3 > 0 ? `\n- Normal: ${cc3}` : ''}${cu3 > 0 ? `\n- Caja normal: ${cu3}` : ''}
`.trim()
                    if (global.DATABASE._data.users[m.sender].common >= 1000) {
                        global.DATABASE._data.users[m.sender].common -= 1000
                        global.DATABASE._data.users[m.sender].money += cm3 * 1
                        global.DATABASE._data.users[m.sender].exp += ce3 * 1
                        global.DATABASE._data.users[m.sender].potion += cp3 * 1
                        global.DATABASE._data.users[m.sender].uncommon += cu3 * 1
                        global.DATABASE._data.users[m.sender].common += cc3 * 1
                        conn.reply(m.chat, Hcom3, m)
                    } else conn.reply(m.chat, 'No tienes suficientes cajas comunes', m)
                    break
                default:
                    return conn.reply(m.chat, Lmao, m)
            }
            break
        case 'normal':
            switch (jumlah) {
                case '1':
                case 'crate':
                    let _ud = `${Math.floor(Math.random() * 2)}`.trim()
                    let _ue = `${Math.floor(Math.random() * 100)}`.trim()
                    let _um = `${Math.floor(Math.random() * 150)}`.trim()
                    let _up = `${Math.floor(Math.random() * 2)}`.trim()
                    let _umc = `${Math.floor(Math.random() * 1)}`.trim()
                    let _uu = `${Math.floor(Math.random() * 2)}`.trim()
                    let _uc = `${Math.floor(Math.random() * 3)}`.trim()
                    let ud = (_ud * 1)
                    let ue = (_ue * 1)
                    let um = (_um * 1)
                    let up = (_up * 1)
                    let umc = (_umc * 1)
                    let uu = (_uu * 1)
                    let uc = (_uc * 1)
                    let Hun = `
Abriste *un caja normal* y obtienes:
${um > 0 ? `\n- Dinero: ${um}` : ''}${ue > 0 ? `\n- Exp: ${ue}` : ''}${ud > 0 ? `\n- Diamante: ${ud}` : ''}${up > 0 ? `\n- Pocion: ${up}` : ''}${uc > 0 ? `\n- Caja comun: ${uc}` : ''}${uu > 0 ? `\n- Caja normal: ${uu}` : ''}
`.trim()
                    if (global.DATABASE._data.users[m.sender].uncommon >= 1) {
                        global.DATABASE._data.users[m.sender].uncommon -= 1
                        global.DATABASE._data.users[m.sender].money += um * 1
                        global.DATABASE._data.users[m.sender].diamond += ud * 1
                        global.DATABASE._data.users[m.sender].exp += ue * 1
                        global.DATABASE._data.users[m.sender].potion += up * 1
                        global.DATABASE._data.users[m.sender].common += uc * 1
                        global.DATABASE._data.users[m.sender].uncommon += uu * 1
                        conn.reply(m.chat, Hun, m)
                        if (umc > 0) {
                            m.reply(`*Felicidades, obtienes un artículo raro*\n${umc} Caja mitica`)
                            global.DATABASE._data.users[m.sender].mythic += umc * 1
                        }
                    } else conn.reply(m.chat, 'No tienes suficientes cajas normales', m)
                    break
                case '10':
                    let _ud1 = `${Math.floor(Math.random() * 5)}`.trim()
                    let _ue1 = `${Math.floor(Math.random() * 750)}`.trim()
                    let _um1 = `${Math.floor(Math.random() * 400)}`.trim()
                    let _up1 = `${Math.floor(Math.random() * 7)}`.trim()
                    let _umc1 = `${Math.floor(Math.random() * 2)}`.trim()
                    let _uu1 = `${Math.floor(Math.random() * 4)}`.trim()
                    let _uc1 = `${Math.floor(Math.random() * 7)}`.trim()
                    let ud1 = (_ud1 * 1)
                    let ue1 = (_ue1 * 1)
                    let um1 = (_um1 * 1)
                    let up1 = (_up1 * 1)
                    let umc1 = (_umc1 * 1)
                    let uu1 = (_uu1 * 1)
                    let uc1 = (_uc1 * 1)
                    let Hun1 = `
Abriste *10 cajas normales* y obtienes:
${um1 > 0 ? `\n- Dinero: ${um1}` : ''}${ue1 > 0 ? `\n- Exp: ${ue1}` : ''}${ud1 > 0 ? `\n- Diamante: ${ud1}` : ''}${up1 > 0 ? `\n- Pocion: ${up1}` : ''}${uc1 > 0 ? `\n- Caja comun: ${uc1}` : ''}${uu1 > 0 ? `\n- Caja normal: ${uu1}` : ''}
`.trim()
                    if (global.DATABASE._data.users[m.sender].uncommon >= 10) {
                        global.DATABASE._data.users[m.sender].uncommon -= 10
                        global.DATABASE._data.users[m.sender].money += um1 * 1
                        global.DATABASE._data.users[m.sender].diamond += ud1 * 1
                        global.DATABASE._data.users[m.sender].exp += ue1 * 1
                        global.DATABASE._data.users[m.sender].potion += up1 * 1
                        global.DATABASE._data.users[m.sender].common += uc1 * 1
                        global.DATABASE._data.users[m.sender].uncommon += uu1 * 1
                        conn.reply(m.chat, Hun1, m)
                        if (umc1 > 0) {
                            m.reply(`*Felicidades, obtienes un artículo raro*\n${umc1} Caja mitica`)
                            global.DATABASE._data.users[m.sender].mythic += umc1 * 1
                        }
                    } else conn.reply(m.chat, 'No tienes suficientes cajas normales', m)
                    break
                case '100':
                    let _ud2 = `${Math.floor(Math.random() * 20)}`.trim()
                    let _ue2 = `${Math.floor(Math.random() * 8000)}`.trim()
                    let _um2 = `${Math.floor(Math.random() * 5000)}`.trim()
                    let _up2 = `${Math.floor(Math.random() * 20)}`.trim()
                    let _umc2 = `${Math.floor(Math.random() * 10)}`.trim()
                    let _uu2 = `${Math.floor(Math.random() * 25)}`.trim()
                    let _uc2 = `${Math.floor(Math.random() * 50)}`.trim()
                    let ud2 = (_ud2 * 1)
                    let ue2 = (_ue2 * 1)
                    let um2 = (_um2 * 1)
                    let up2 = (_up2 * 1)
                    let umc2 = (_umc2 * 1)
                    let uu2 = (_uu2 * 1)
                    let uc2 = (_uc2 * 1)
                    let Hun2 = `
Abriste *100 cajas normales* y obtienes:
${um2 > 0 ? `\n- Dinero: ${um2}` : ''}${ue2 > 0 ? `\n- Exp: ${ue2}` : ''}${ud2 > 0 ? `\n- Diamante: ${ud2}` : ''}${up2 > 0 ? `\n- Pocion: ${up2}` : ''}${uc2 > 0 ? `\n- Caja comun: ${uc2}` : ''}${uu2 > 0 ? `\n- Caja normal: ${uu2}` : ''}
`.trim()
                    if (global.DATABASE._data.users[m.sender].uncommon >= 100) {
                        global.DATABASE._data.users[m.sender].uncommon -= 100
                        global.DATABASE._data.users[m.sender].money += um2 * 1
                        global.DATABASE._data.users[m.sender].diamond += ud2 * 1
                        global.DATABASE._data.users[m.sender].exp += ue2 * 1
                        global.DATABASE._data.users[m.sender].potion += up2 * 1
                        global.DATABASE._data.users[m.sender].common += uc2 * 1
                        global.DATABASE._data.users[m.sender].uncommon += uu2 * 1
                        conn.reply(m.chat, Hun2, m)
                        if (umc2 > 0) {
                            m.reply(`*Felicidades, obtienes un artículo raro*\n${umc2} Caja mitica`)
                            global.DATABASE._data.users[m.sender].mythic += umc2 * 1
                        }
                    } else conn.reply(m.chat, 'No tienes suficientes cajas normales', m)
                    break
                case '1000':
                    let _ud3 = `${Math.floor(Math.random() * 50)}`.trim()
                    let _ue3 = `${Math.floor(Math.random() * 100000)}`.trim()
                    let _um3 = `${Math.floor(Math.random() * 50000)}`.trim()
                    let _up3 = `${Math.floor(Math.random() * 100)}`.trim()
                    let _umc3 = `${Math.floor(Math.random() * 100)}`.trim()
                    let _uu3 = `${Math.floor(Math.random() * 100)}`.trim()
                    let _uc3 = `${Math.floor(Math.random() * 200)}`.trim()
                    let ud3 = (_ud3 * 1)
                    let ue3 = (_ue3 * 1)
                    let um3 = (_um3 * 1)
                    let up3 = (_up3 * 1)
                    let umc3 = (_umc3 * 1)
                    let uu3 = (_uu3 * 1)
                    let uc3 = (_uc3 * 1)
                    let Hun3 = `
Abriste *1000 cajas normales* y obtienes:
${um3 > 0 ? `\n- Dinero: ${um3}` : ''}${ue3 > 0 ? `\n- Exp: ${ue3}` : ''}${ud3 > 0 ? `\n- Diamante: ${ud3}` : ''}${up3 > 0 ? `\n- Pocion: ${up3}` : ''}${uc3 > 0 ? `\n- Caja comun: ${uc3}` : ''}${uu3 > 0 ? `\n- Caja normal: ${uu3}` : ''}
`.trim()
                    if (global.DATABASE._data.users[m.sender].uncommon >= 1000) {
                        global.DATABASE._data.users[m.sender].uncommon -= 1000
                        global.DATABASE._data.users[m.sender].money += um3 * 1
                        global.DATABASE._data.users[m.sender].diamond += ud3 * 1
                        global.DATABASE._data.users[m.sender].exp += ue3 * 1
                        global.DATABASE._data.users[m.sender].potion += up3 * 1
                        global.DATABASE._data.users[m.sender].common += uc3 * 1
                        global.DATABASE._data.users[m.sender].uncommon += uu3 * 1
                        conn.reply(m.chat, Hun3, m)
                        if (umc3 > 0) {
                            m.reply(`*Felicidades, obtienes un artículo raro*\n${umc3} Caja mitica`)
                            global.DATABASE._data.users[m.sender].mythic += umc3 * 1
                        }
                    } else conn.reply(m.chat, 'No tienes suficientes cajas normales', m)
                    break
                default:
                    return conn.reply(m.chat, Lmao ,m)
            }
            break
        case 'mitico':
            switch (jumlah) {
                case '1':
                case 'crate':
                    let _mm = `${Math.floor(Math.random() * 200)}`.trim()
                    let _mmm = `${pickRandom(['0', '0', '1', '0'])}`.trim()
                    let _me = `${Math.floor(Math.random() * 250)}`.trim()
                    let _mp = `${Math.floor(Math.random() * 3)}`.trim()
                    let _mu = `${Math.floor(Math.random() * 3)}`.trim()
                    let _mc = `${Math.floor(Math.random() * 5)}`.trim()
                    let _ml = `${pickRandom(['0', '0', '1', '0',  '0'])}`.trim()
                    let _md = `${Math.floor(Math.random() * 3)}`.trim()
                    let mm = (_mm * 1)
                    let mmm = (_mmm * 1)
                    let me = (_me * 1)
                    let mp = (_mp * 1)
                    let mu = (_mu * 1)
                    let mc = (_mc * 1)
                    let ml = (_ml * 1)
                    let md = (_md * 1)
                    let Mychat = `
Abriste *una caja mitica* y obtienes:
${mm > 0 ? `\n- Dinero: ${mm}` : ''}${me > 0 ? `\n- Exp: ${me}` : ''}${md > 0 ? `\n- Diamante: ${md}` : ''}${mp > 0 ? `\n- Pocion: ${mp}` : ''}${mc > 0 ? `\n- Caja comun: ${mc}` : ''}${mu > 0 ? `\n- Caja normal: ${mu}` : ''}
`.trim()
                    if (global.DATABASE._data.users[m.sender].mythic >= 1) {
                        global.DATABASE._data.users[m.sender].mythic -= 1
                        global.DATABASE._data.users[m.sender].money += mm * 1
                        global.DATABASE._data.users[m.sender].diamond += md * 1
                        global.DATABASE._data.users[m.sender].exp += me * 1
                        global.DATABASE._data.users[m.sender].potion += mp * 1
                        global.DATABASE._data.users[m.sender].common += mc * 1
                        global.DATABASE._data.users[m.sender].uncommon += mu * 1
                        conn.reply(m.chat, Mychat, m)
                        if (mmm > 0) {
                            m.reply(`*Felicidades, obtienes un artículo raro*\n${mmm} Caja mitica`)
                            global.DATABASE._data.users[m.sender].mythic += mmm * 1
                        }
                        if (ml > 0) {
                            m.reply(`*Felicidades, obtienes un artículo epico*\n${ml} Cajas legendarias`)
                            global.DATABASE._data.users[m.sender].legendary += ml * 1
                        }
                    } else conn.reply(m.chat, 'No tienes suficientes cajas miticas', m)
                    break
                case '10':
                    let _mm1 = `${Math.floor(Math.random() * 2000)}`.trim()
                    let _mmm1 = `${Math.floor(Math.random() * 4)}`.trim()
                    let _me1 = `${Math.floor(Math.random() * 3000)}`.trim()
                    let _mp1 = `${Math.floor(Math.random() * 6)}`.trim()
                    let _mu1 = `${Math.floor(Math.random() * 6)}`.trim()
                    let _mc1 = `${Math.floor(Math.random() * 11)}`.trim()
                    let _ml1 = `${Math.floor(Math.random() * 1)}`.trim()
                    let _md1 = `${Math.floor(Math.random() * 5)}`.trim()
                    let mm1 = (_mm1 * 1)
                    let mmm1 = (_mmm1 * 1)
                    let me1 = (_me1 * 1)
                    let mp1 = (_mp1 * 1)
                    let mu1 = (_mu1 * 1)
                    let mc1 = (_mc1 * 1)
                    let ml1 = (_ml1 * 1)
                    let md1 = (_md1 * 1)
                    let Mychat1 = `
Abriste *10 cajas miticas* y obtienes:
${mm1 > 0 ? `\n- Dinero: ${mm1}` : ''}${me1 > 0 ? `\n- Exp: ${me1}` : ''}${md1 > 0 ? `\n- Diamante: ${md1}` : ''}${mp1 > 0 ? `\n- Pocion: ${mp1}` : ''}${mc1 > 0 ? `\n- Caja comun: ${mc1}` : ''}${mu1 > 0 ? `\n- Caja normal: ${mu1}` : ''}
`.trim()
                    if (global.DATABASE._data.users[m.sender].mythic >= 10) {
                        global.DATABASE._data.users[m.sender].mythic -= 10
                        global.DATABASE._data.users[m.sender].money += mm1 * 1
                        global.DATABASE._data.users[m.sender].diamond += md1 * 1
                        global.DATABASE._data.users[m.sender].exp += me1 * 1
                        global.DATABASE._data.users[m.sender].potion += mp1 * 1
                        global.DATABASE._data.users[m.sender].common += mc1 * 1
                        global.DATABASE._data.users[m.sender].uncommon += mu1 * 1
                        conn.reply(m.chat, Mychat1, m)
                        if (mmm1 > 0) {
                            m.reply(`*Felicidades, obtienes un artículo raro*\n${mmm1} Caja mitica`)
                            global.DATABASE._data.users[m.sender].mythic += mmm1 * 1
                        }
                        if (ml1 > 0) {
                            m.reply(`*Felicidades, obtienes un artículo epico*\n${ml1} Cajas legendarias`)
                            global.DATABASE._data.users[m.sender].legendary += ml1 * 1
                        }
                    } else conn.reply(m.chat, 'No tienes suficientes cajas miticas', m)
                    break
                case '100':
                    let _mm2 = `${Math.floor(Math.random() * 25000)}`.trim()
                    let _mmm2 = `${Math.floor(Math.random() * 10)}`.trim()
                    let _me2 = `${Math.floor(Math.random() * 30000)}`.trim()
                    let _mp2 = `${Math.floor(Math.random() * 50)}`.trim()
                    let _mu2 = `${Math.floor(Math.random() * 80)}`.trim()
                    let _mc2 = `${Math.floor(Math.random() * 150)}`.trim()
                    let _ml2 = `${Math.floor(Math.random() * 6)}`.trim()
                    let _md2 = `${Math.floor(Math.random() * 20)}`.trim()
                    let mm2 = (_mm2 * 1)
                    let mmm2 = (_mmm2 * 1)
                    let me2 = (_me2 * 1)
                    let mp2 = (_mp2 * 1)
                    let mu2 = (_mu2 * 1)
                    let mc2 = (_mc2 * 1)
                    let ml2 = (_ml2 * 1)
                    let md2 = (_md2 * 1)
                    let Mychat2 = `
Abriste *100 cajas miticas* y obtienes:
${mm2 > 0 ? `\n- Dinero: ${mm2}` : ''}${me2 > 0 ? `\n- Exp: ${me2}` : ''}${md2 > 0 ? `\n- Diamante: ${md2}` : ''}${mp2 > 0 ? `\n- Pocion: ${mp2}` : ''}${mc2 > 0 ? `\n- Caja comun: ${mc2}` : ''}${mu2 > 0 ? `\n- Caja normal: ${mu2}` : ''}
`.trim()
                    if (global.DATABASE._data.users[m.sender].mythic >= 100) {
                        global.DATABASE._data.users[m.sender].mythic -= 100
                        global.DATABASE._data.users[m.sender].money += mm2 * 1
                        global.DATABASE._data.users[m.sender].diamond += md2 * 1
                        global.DATABASE._data.users[m.sender].exp += me2 * 1
                        global.DATABASE._data.users[m.sender].potion += mp2 * 1
                        global.DATABASE._data.users[m.sender].common += mc2 * 1
                        global.DATABASE._data.users[m.sender].uncommon += mu2 * 1
                        conn.reply(m.chat, Mychat2, m)
                    } else conn.reply(m.chat, 'No tienes suficientes cajas miticas', m)
                    break
                case '1000':
                    let _mm3 = `${Math.floor(Math.random() * 500000)}`.trim()
                    let _mmm3 = `${Math.floor(Math.random() * 50)}`.trim()
                    let _me3 = `${Math.floor(Math.random() * 750000)}`.trim()
                    let _mp3 = `${Math.floor(Math.random() * 70)}`.trim()
                    let _mu3 = `${Math.floor(Math.random() * 250)}`.trim()
                    let _mc3 = `${Math.floor(Math.random() * 750)}`.trim()
                    let _ml3 = `${Math.floor(Math.random() * 10)}`.trim()
                    let _md3 = `${Math.floor(Math.random() * 50)}`.trim()
                    let mm3 = (_mm3 * 1)
                    let mmm3 = (_mmm3 * 1)
                    let me3 = (_me3 * 1)
                    let mp3 = (_mp3 * 1)
                    let mu3 = (_mu3 * 1)
                    let mc3 = (_mc3 * 1)
                    let ml3 = (_ml3 * 1)
                    let md3 = (_md3 * 1)
                    let Mychat3 = `
Abriste *1000 cajas miticas* y obtienes:
${mm3 > 0 ? `\n- Dinero: ${mm3}` : ''}${me3 > 0 ? `\n- Exp: ${me3}` : ''}${md3 > 0 ? `\n- Diamante: ${md3}` : ''}${mp3 > 0 ? `\n- Pocion: ${mp3}` : ''}${mc3 > 0 ? `\n- Caja comun: ${mc3}` : ''}${mu3 > 0 ? `\n- Caja normal: ${mu3}` : ''}
`.trim()
                    if (global.DATABASE._data.users[m.sender].mythic >= 1000) {
                        global.DATABASE._data.users[m.sender].mythic -= 1000
                        global.DATABASE._data.users[m.sender].money += mm3 * 1
                        global.DATABASE._data.users[m.sender].diamond += md3 * 1
                        global.DATABASE._data.users[m.sender].exp += me3 * 1
                        global.DATABASE._data.users[m.sender].potion += mp3 * 1
                        global.DATABASE._data.users[m.sender].common += mc3 * 1
                        global.DATABASE._data.users[m.sender].uncommon += mu3 * 1
                        conn.reply(m.chat, Mychat3, m)
                        if (mmm3 > 0) {
                            m.reply(`*Felicidades, obtienes un artículo raro*\n${mmm3} Caja mitica`)
                            global.DATABASE._data.users[m.sender].mythic += mmm3 * 1
                        }
                        if (ml3 > 0) {
                            m.reply(`*Felicidades, obtienes un artículo epico*\n${ml3} Cajas legendarias`)
                            global.DATABASE._data.users[m.sender].legendary += ml3 * 1
                        }
                    } else conn.reply(m.chat, 'No tienes suficientes cajas miticas', m)
                    break
                default:
                    return conn.reply(m.chat, Lmao, m)
            }
            break
        case 'legendario':
            switch (jumlah) {
                case '1':
                case 'crate':
                    let _lm = `${Math.floor(Math.random() * 450)}`.trim()
                    let _le = `${Math.floor(Math.random() * 550)}`.trim()
                    let _lp = `${Math.floor(Math.random() * 5)}`.trim()
                    let _lu = `${Math.floor(Math.random() * 7)}`.trim()
                    let _lc = `${Math.floor(Math.random() * 10)}`.trim()
                    let _ll = `${pickRandom(['0', '0', '1', '0'])}`.trim()
                    let _lpp = `${pickRandom(['0', '1', '0'])}`.trim()
                    let _ld = `${Math.floor(Math.random() * 5)}`.trim()
                    let _lmm = `${pickRandom(['0', '1', '0', '1', '0', '0'])}`.trim()
                    let lm = (_lm * 1)
                    let le = (_le * 1)
                    let lp = (_lp * 1) 
                    let lu = (_lu * 1) 
                    let lc = (_lc * 1) 
                    let ll = (_ll * 1) 
                    let lpp = (_lpp * 1)       
                    let ld = (_ld * 1) 
                    let lmm = (_lmm * 1)
                    let Lechat = `
Abriste *una caja legendaria* y obtienes:
${lm > 0 ? `\n- Dinero: ${lm}` : ''}${le > 0 ? `\n- Exp: ${le}` : ''}${ld > 0 ? `\n- Diamante: ${ld}` : ''}${lp > 0 ? `\n- Pocion: ${lp}` : ''}${lc > 0 ? `\n- Caja comun: ${lc}` : ''}${lu > 0 ? `\n- Caja normal: ${lu}` : ''}
`.trim()  
                    if (global.DATABASE._data.users[m.sender].legendary >= 1) {
                        global.DATABASE._data.users[m.sender].legendary -= 1
                        global.DATABASE._data.users[m.sender].money += lm * 1
                        global.DATABASE._data.users[m.sender].diamond += ld * 1
                        global.DATABASE._data.users[m.sender].exp += le * 1
                        global.DATABASE._data.users[m.sender].potion += lp * 1
                        global.DATABASE._data.users[m.sender].common += lc * 1
                        global.DATABASE._data.users[m.sender].uncommon += lu * 1
                        conn.reply(m.chat, Lechat, m)
                        if (lmm > 0) {
                            m.reply(`*Felicidades, obtienes un artículo raro*\n${lmm} Caja mitica`)
                            global.DATABASE._data.users[m.sender].mythic += lmm * 1
                        }
                        if (ll > 0 || lpp > 0) {
                             m.reply(`*Felicidades, obtienes un artículo epico*${ll > 0 ? `\n${ll} Cajas legendarias` : ''}${lpp > 0 ? `\n${lpp} Caja de mascotas` : ''}`)
                            global.DATABASE._data.users[m.sender].legendary += ll * 1
                            global.DATABASE._data.users[m.sender].pet += lpp * 1
                        }
                    } else conn.reply(m.chat, 'No tienes suficientes cajas legendarias', m)
                    break
                case '10':
                    let _lm1 = `${Math.floor(Math.random() * 10000)}`.trim()
                    let _le1 = `${Math.floor(Math.random() * 15000)}`.trim()
                    let _lp1 = `${Math.floor(Math.random() * 30)}`.trim()
                    let _lu1 = `${Math.floor(Math.random() * 50)}`.trim()
                    let _lc1 = `${Math.floor(Math.random() * 75)}`.trim()
                    let _ll1 = `${Math.floor(Math.random() * 2)}`.trim()
                    let _lpp1 = `${Math.floor(Math.random() * 6)}`.trim()
                    let _ld1 = `${Math.floor(Math.random() * 16)}`.trim()
                    let _lmm1 = `${Math.floor(Math.random() * 4)}`.trim()
                    let lm1 = (_lm1 * 1)
                    let le1 = (_le1 * 1)
                    let lp1 = (_lp1 * 1) 
                    let lu1 = (_lu1 * 1) 
                    let lc1 = (_lc1 * 1) 
                    let ll1 = (_ll1 * 1) 
                    let lpp1 = (_lpp1 * 1)       
                    let ld1 = (_ld1 * 1) 
                    let lmm1 = (_lmm1 * 1)
                    let Lechat1 = `
Abriste *10 cajas legendarias* y obtienes:
${lm1 > 0 ? `\n- Dinero: ${lm1}` : ''}${le1 > 0 ? `\n- Exp: ${le1}` : ''}${ld1 > 0 ? `\n- Diamante: ${ld1}` : ''}${lp1 > 0 ? `\n- Pocion: ${lp1}` : ''}${lc1 > 0 ? `\n- Caja comun: ${lc1}` : ''}${lu1 > 0 ? `\n- Caja normal: ${lu1}` : ''}
`.trim()  
                    if (global.DATABASE._data.users[m.sender].legendary >= 10) {
                        global.DATABASE._data.users[m.sender].legendary -= 10
                        global.DATABASE._data.users[m.sender].money += lm1 * 1
                        global.DATABASE._data.users[m.sender].diamond += ld1 * 1
                        global.DATABASE._data.users[m.sender].exp += le1 * 1
                        global.DATABASE._data.users[m.sender].potion += lp1 * 1
                        global.DATABASE._data.users[m.sender].common += lc1 * 1
                        global.DATABASE._data.users[m.sender].uncommon += lu1 * 1
                        conn.reply(m.chat, Lechat1, m)
                        if (lmm1 > 0) {
                            m.reply(`*Felicidades, obtienes un artículo raro*\n${lmm1} Caja mitica`)
                            global.DATABASE._data.users[m.sender].mythic += lmm1 * 1
                        }
                        if (ll1 > 0 || lpp1 > 0) {
                             m.reply(`*Felicidades, obtienes un artículo epico*${ll1 > 0 ? `\n${ll1} Cajas legendarias` : ''}${lpp1 > 0 ? `\n${lpp1} Caja de mascotas` : ''}`)
                            global.DATABASE._data.users[m.sender].legendary += ll1 * 1
                            global.DATABASE._data.users[m.sender].pet += lpp1 * 1
                        }
                    } else conn.reply(m.chat, 'No tienes suficientes cajas legendarias', m)
                    break
                case '100':
                    let _lm2 = `${Math.floor(Math.random() * 100000)}`.trim()
                    let _le2 = `${Math.floor(Math.random() * 200000)}`.trim()
                    let _lp2 = `${Math.floor(Math.random() * 100)}`.trim()
                    let _lu2 = `${Math.floor(Math.random() * 250)}`.trim()
                    let _lc2 = `${Math.floor(Math.random() * 750)}`.trim()
                    let _ll2 = `${Math.floor(Math.random() * 11)}`.trim()
                    let _lpp2 = `${Math.floor(Math.random() * 51)}`.trim()
                    let _ld2 = `${Math.floor(Math.random() * 50)}`.trim()
                    let _lmm2 = `${Math.floor(Math.random() * 11)}`.trim()
                    let lm2 = (_lm2 * 1)
                    let le2 = (_le2 * 1)
                    let lp2 = (_lp2 * 1) 
                    let lu2 = (_lu2 * 1) 
                    let lc2 = (_lc2 * 1) 
                    let ll2 = (_ll2 * 1) 
                    let lpp2 = (_lpp2 * 1)       
                    let ld2 = (_ld2 * 1) 
                    let lmm2 = (_lmm2 * 1)
                    let Lechat2 = `
Abriste *100 cajas legendarias* y obtienes:
${lm2 > 0 ? `\n- Dinero: ${lm2}` : ''}${le2 > 0 ? `\n- Exp: ${le2}` : ''}${ld2 > 0 ? `\n- Diamante: ${ld2}` : ''}${lp2 > 0 ? `\n- Pocion: ${lp2}` : ''}${lc2 > 0 ? `\n- Caja comun: ${lc2}` : ''}${lu2 > 0 ? `\n- Caja normal: ${lu2}` : ''}
`.trim()  
                    if (global.DATABASE._data.users[m.sender].legendary >= 100) {
                        global.DATABASE._data.users[m.sender].legendary -= 100
                        global.DATABASE._data.users[m.sender].money += lm2 * 1
                        global.DATABASE._data.users[m.sender].diamond += ld2 * 1
                        global.DATABASE._data.users[m.sender].exp += le2 * 1
                        global.DATABASE._data.users[m.sender].potion += lp2 * 1
                        global.DATABASE._data.users[m.sender].common += lc2 * 1
                        global.DATABASE._data.users[m.sender].uncommon += lu2 * 1
                        conn.reply(m.chat, Lechat2, m)
                        if (lmm2 > 0) {
                            m.reply(`*Felicidades, obtienes un artículo raro*\n${lmm2} Caja mitica`)
                            global.DATABASE._data.users[m.sender].mythic += lmm2 * 1
                        }
                        if (ll2 > 0 || lpp2 > 0) {
                             m.reply(`*Felicidades, obtienes un artículo epico*${ll2 > 0 ? `\n${ll2} Cajas legendarias` : ''}${lpp2 > 0 ? `\n${lpp2} Caja de mascotas` : ''}`)
                            global.DATABASE._data.users[m.sender].legendary += ll2 * 1
                            global.DATABASE._data.users[m.sender].pet += lpp2 * 1
                        }
                    } else conn.reply(m.chat, 'No tienes suficientes cajas legendarias', m)
                    break
                case '1000':
                    let _lm3 = `${Math.floor(Math.random() * 2000000)}`.trim()
                    let _le3 = `${Math.floor(Math.random() * 5000000)}`.trim()
                    let _lp3 = `${Math.floor(Math.random() * 500)}`.trim()
                    let _lu3 = `${Math.floor(Math.random() * 1000)}`.trim()
                    let _lc3 = `${Math.floor(Math.random() * 2500)}`.trim()
                    let _ll3 = `${Math.floor(Math.random() * 51)}`.trim()
                    let _lpp3 = `${Math.floor(Math.random() * 222)}`.trim()
                    let _ld3 = `${Math.floor(Math.random() * 250)}`.trim()
                    let _lmm3 = `${Math.floor(Math.random() * 111)}`.trim()
                    let lm3 = (_lm3 * 1)
                    let le3 = (_le3 * 1)
                    let lp3 = (_lp3 * 1) 
                    let lu3 = (_lu3 * 1) 
                    let lc3 = (_lc3 * 1) 
                    let ll3 = (_ll3 * 1) 
                    let lpp3 = (_lpp3 * 1)       
                    let ld3 = (_ld3 * 1) 
                    let lmm3 = (_lmm3 * 1)
                    let Lechat3 = `
Abriste *1000 cajas legendarias* y obtienes:
${lm3 > 0 ? `\n- Dinero: ${lm3}` : ''}${le3 > 0 ? `\n- Exp: ${le3}` : ''}${ld3 > 0 ? `\n- Diamante: ${ld3}` : ''}${lp3 > 0 ? `\n- Pocion: ${lp3}` : ''}${lc3 > 0 ? `\n- Caja comun: ${lc3}` : ''}${lu3 > 0 ? `\n- Caja normal: ${lu3}` : ''}
`.trim()  
                    if (global.DATABASE._data.users[m.sender].legendary >= 1000) {
                        global.DATABASE._data.users[m.sender].legendary -= 1000
                        global.DATABASE._data.users[m.sender].money += lm3 * 1
                        global.DATABASE._data.users[m.sender].diamond += ld3 * 1
                        global.DATABASE._data.users[m.sender].exp += le3 * 1
                        global.DATABASE._data.users[m.sender].potion += lp3 * 1
                        global.DATABASE._data.users[m.sender].common += lc3 * 1
                        global.DATABASE._data.users[m.sender].uncommon += lu3 * 1
                        conn.reply(m.chat, Lechat3, m)
                        if (lmm3 > 0) {
                            m.reply(`*Felicidades, obtienes un artículo raro*\n${lmm3} Caja mitica`)
                            global.DATABASE._data.users[m.sender].mythic += lmm3 * 1
                        }
                        if (ll3 > 0 || lpp3 > 0) {
                             m.reply(`*Felicidades, obtienes un artículo epico*${ll3 > 0 ? `\n${ll3} Cajas legendarias` : ''}${lpp3 > 0 ? `\n${lpp3} Caja de mascotas` : ''}`)
                            global.DATABASE._data.users[m.sender].legendary += ll3 * 1
                            global.DATABASE._data.users[m.sender].pet += lpp3 * 1
                        }
                    } else conn.reply(m.chat, 'No tienes suficientes cajas legendarias', m)
                    break
                default:
                    return conn.reply(m.chat, Lmao, m)
            }
            break
        case 'pet':
        case 'mascota':
            let _mknp = pickRandom([1, 2, 1, 5, 3, 2, 1, 2, 4, 1, 3, 5, 2, 4, 3])
            let mknp = (_mknp * 1)
            let kucing = global.DATABASE._data.users[m.sender].kucing
            let rubah = global.DATABASE._data.users[m.sender].rubah
            let kuda = global.DATABASE._data.users[m.sender].kuda
            let _pet = `${pickRandom(['gato', 'zorro', 'lobo'])}`.trim()
            if (global.DATABASE._data.users[m.sender].pet > 0) { 
                global.DATABASE._data.users[m.sender].pet -= 1
                if (_pet == 'gato' && kucing > 0) {
                    global.DATABASE._data.users[m.sender].potion += 2
                    global.DATABASE._data.users[m.sender].makananpet += mknp * 1
                    conn.reply(m.chat, `Ya tienes un *${_pet}*, tu recompensa se reemplaza con *2* pociones${mknp > 0 ? ` y ${mknp} comida para mascotas` : ''}`, m)
                } else if (_pet == 'gato' && kucing == 0) {
                    global.DATABASE._data.users[m.sender].kucing += 1
                    global.DATABASE._data.users[m.sender].makananpet += mknp * 1
                    conn.reply(m.chat, `*Felicidades obtienes un ${_pet}${mknp > 0 ? ` y ${mknp} comida para mascotas*` : '*'}`, m)
                } else if (_pet == 'zorro' && rubah > 0) {
                    global.DATABASE._data.users[m.sender].potion += 2
                    global.DATABASE._data.users[m.sender].makananpet += mknp * 1
                    conn.reply(m.chat, `Ya tienes un *${_pet}*, tu recompensa se reemplaza con *2* pociones${mknp > 0 ? ` y ${mknp} comida para mascotas` : ''}`, m)
                } else if (_pet == 'zorro' && rubah == 0) {
                    global.DATABASE._data.users[m.sender].rubah += 1
                    global.DATABASE._data.users[m.sender].makananpet += mknp * 1
                    conn.reply(m.chat, `*Felicidades obtienes un ${_pet}${mknp > 0 ? ` y ${mknp} comida para mascotas*` : '*'}`, m)
                } else if (_pet == 'lobo' && kuda  > 0) {
                    global.DATABASE._data.users[m.sender].potion += 2
                    global.DATABASE._data.users[m.sender].makananpet += mknp * 1
                    conn.reply(m.chat, `Ya tienes un *${_pet}*, tu recompensa se reemplaza con *2* pociones${mknp > 0 ? ` y ${mknp} comida para mascotas` : ''}`, m)
                } else if (_pet == 'lobo' && kuda == 0) {
                    global.DATABASE._data.users[m.sender].kuda += 1
                    global.DATABASE._data.users[m.sender].makananpet += mknp * 1
                    conn.reply(m.chat, `*Felicidades obtienes un ${_pet}${mknp > 0 ? ` y ${mknp} comida para mascotas*` : '*'}`, m)
                } else {
                    global.DATABASE._data.users[m.sender].makananpet += mknp * 1
                    m.reply(pickRandom(['Esta caja de mascotas está vacía']) + '. Sólo obtienes *' + mknp + '* comida para mascotas')
                }
            } else m.reply('No tienes suficiente caja de mascotas')
            break
        default:
            return conn.reply(m.chat, bruh, m)
    }
  } catch (e) {
      console.log(e)
      conn.reply(m.chat, bruh, m)
      if (DevMode) {
        for (let jid of global.owner.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(v => v != conn.user.jid)) {
            conn.sendMessage(jid, 'Open.js error\nNo: *' + m.sender.split`@`[0] + '*\nCommand: *' + m.text + '*\n\n*' + e + '*', MessageType.text)
        }
    }
  }
}
handler.help = ['open']
handler.tags = ['rpg']
handler.command = /^(open|buka|abrir)$/i

handler.fail = null

module.exports = handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

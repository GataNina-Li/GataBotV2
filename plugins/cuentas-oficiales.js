let handler = async m => m.reply(`
✅ 𝘾𝙐𝙀𝙉𝙏𝘼𝙎 𝙊𝙁𝙄𝘾𝙄𝘼𝙇𝙀𝙎 𝙂𝘼𝙏𝘼𝘽𝙊𝙏 ✅

*Hola, los números Oficiales de GataBot son:*

🐈 *GataBot ~ Wa.me/994407312387*

🐈 *GataBot ~ Wa.me/593993684821*

🐈 *Sub GataBot ~ Wa.me/12363005316*

👆 _Para saber si GataBot está Activada escriba #estado_

👆 _Para ver el menú escriba #menu_

👆 _Puedes ser Bot diciendo #serbot o #jadibot_

👆 _Puedes hacer una solicitud para que los Bots Oficiales se unan diciendo #unete enlace del grupo_

👆 _Puedes Instalar a GataBot diciendo #instalarbot y #procesobot_
_________________________________________________

*Número de la Creadora (NO BOT)*

😸 *Gata Dios ~ Wa.me/14509777159*

👆 _Solo escríbeme para temas relacionados a GataBot_
_________________________________________________

⚠️ *Los Bots Oficiales son temporales en grupos, es preferible que sea Bot o instalar a GataBot* ⚠️
                            🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈
`.trim()) 
handler.help = ['instalarbot']
handler.tags = ['info']
handler.command = /^cuentasoficiales|cuentaoficial|cuentasofc|cuentasgatabot|Cuentasoficiales|cuentagatabot|cuentasgb|cuentagb|Cuentagb|Cuentasgb$/i

module.exports = handler

let handler = async m => m.reply(`
⚡▁ ▂ ▄ ▅ ▆ ▇ █ 🚆 █ ▇ ▆ ▅ ▄ ▂ ▁⚡

💥 𝙔𝘼 𝙋𝙐𝙀𝘿𝙀 𝙄𝙉𝙎𝙏𝘼𝙇𝘼𝙍 𝘼 𝙂𝘼𝙏𝘼𝘽𝙊𝙏 ❕

*VÍDEO DE INSTALACIÓN*
*https://youtu.be/85xI8WFMIUY*

✨ 𝙍𝙀𝙌𝙐𝙄𝙎𝙄𝙏𝙊𝙎 𝙋𝘼𝙍𝘼 𝙄𝙉𝙎𝙏𝘼𝙇𝘼𝙍 𝙂𝘼𝙏𝘼𝘽𝙊𝙏

✅ _1 GB de almacenamiento_
✅ _Aplicación Termux (actualizada)_
✅ _Un WhatsApp inmune (secundario)_
✅ _Un número virtual_
✅ _2 dispositivos o una PC para escanear_


🌸 𝙂𝙄𝙏𝙃𝙐𝘽 > 𝙍𝙀𝙋𝙊𝙎𝙄𝙏𝙊𝙍𝙄𝙊
*_Visita mí repositorio 😸 para más información, si te agrada el Bot apoya me con una ⭐️ ¡Gracias!_*

*_https://github.com/GataNina-Li/GataBotV2_*


❇️ 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎 𝘿𝙀 𝙄𝙉𝙎𝙏𝘼𝙇𝘼𝘾𝙄𝙊́𝙉 𝙑𝙄́𝘼 𝙂𝙄𝙏𝙃𝙐𝘽 

> termux-setup-storage
> apt update && apt upgrade -y -y
> pkg install git 
> apt install git -y
> apt install nodejs -y
> apt install ffmpeg -y
> apt install imagemagick -y
> git clone https://github.com/GataNina-Li/GataBotV2
> cd GataBotV2
> ls
> npm install
> npm install -g npm@8.5.5
> npm update
> npm start

*_PARA TENER UNA GUIA DE COMO INSTALAR A GATABOT_*
*_USA EL COMANDO;_*
#procesobot

💡 *_NOTA:_*
*_Lea la información del archivo README.md de GataBot:_*

*_https://github.com/GataNina-Li/GataBotV2/blob/master/README.md_*

⚠️ *_Si usas un número importante para que sea Bot, o un WhatsApp normal es posible que el número pueda irse al soporte_*

💛 *_Si tienes dudas o necesitas ayuda en el proceso de la instalación puede escribir me a este número (No es Bot el número)_*

📲 *_Wa.me/14509544207_*

❗ *_Solo para temas de instalación_* 

⚡▁ ▂ ▄ ▅ ▆ ▇ █ 🚆 █ ▇ ▆ ▅ ▄ ▂ ▁⚡
                            🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈
`.trim()) 
handler.help = ['instalarbot']
handler.tags = ['info']
handler.command = /^instalarbot$/i

module.exports = handler

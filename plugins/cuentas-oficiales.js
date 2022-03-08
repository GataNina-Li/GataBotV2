let handler = async m => m.reply(`
𝘾𝙐𝙀𝙉𝙏𝘼𝙎 𝙊𝙁𝙄𝘾𝙄𝘼𝙇𝙀𝙎 𝙂𝘼𝙏𝘼𝘽𝙊𝙏

                            🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈
`.trim()) 
handler.help = ['instalarbot']
handler.tags = ['info']
handler.command = /^instalarbot$/i

module.exports = handler

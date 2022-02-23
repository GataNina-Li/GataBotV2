// NO QUITES NI CAMBIES NADA DE AQUI POR FAVOR
// AGREGA TUS DATOS SI QIERES, PERO NO QUITES LOS MIOS
let handler = async m => m.reply(`
*┏ ┅ ━━━━━━━━━━━━━━━━ ┅ ━*
*┇                         「 DONAR 」*  
*┣ ┅ ━━━━━━━━━━━━━━━━ ┅ ━*
*┇❖ Colaborador en el desarrollo*
*┇ de GataBot Por Gata Dios* 😸
*┣ ┅ ━━━━━━━━━━━━━━━━ ┅ ━*
*┃❖ Hola persona hermosa 💙*
*┃👉 Aquí tienes algunos datos*
*┃ para que puedas apoyar <3*
*┃*
*┃ -   CLABE: 646180192175788481* 
*┃ -   BANCO: STP* 
*┃ -   BENEFICIARIO: JOSE SOBRINO* 
*┃ -   CONCEPTO: APOYO*  
*┃➤ PayPal: https://www.paypal.me/TheShadowBrokers133*
*┃❖ Contáctame si necesitas otros*
*┃datos y para darte las gracias <3*
*┃❖ wa.me/5219996125657*
*┣ ┅ ━━━━━━━━━━━━━━━━ ┅ ━*
`.trim()) 
//PUEDES AGREGAR TUS DATOS, PERO NO QUITES LOS QUE YA ESTÁN PUESTOS
handler.help = ['donar']
handler.tags = ['info']
handler.command = /^(dona|donar|apoyar|dardinero|apoyo)$/i

module.exports = handler

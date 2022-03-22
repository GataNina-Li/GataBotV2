let handler = async m => m.reply(`
⚡▁ ▂ ▄ ▅ ▆ ▇ █ 🚆 █ ▇ ▆ ▅ ▄ ▂ ▁⚡

🐈 𝙋𝙍𝙊𝘾𝙀𝙎𝙊 𝘿𝙀 𝙄𝙉𝙎𝙏𝘼𝙇𝘼𝘾𝙄𝙊́𝙉 🐈

*VÍDEO DE INSTALACIÓN*
*https://youtu.be/85xI8WFMIUY*

*_https://github.com/GataNina-Li/GataBotV2_*

*_Asumiremos que ya debiste de estar informado sobre el contenido del comando #instalarbot_*

*_Asegúrese de crear una cuenta en GitHub, te recomiendo que veas este vídeo para poder crear la cuenta_*

❇️ *Crear cuenta en Celular:*
*_https://youtu.be/hVtq40FBLxs_*

❇️ *Crear cuenta en PC:*
*_https://youtu.be/Ts7op-h95uE_*

😊 *_¡¡Comencemos!!_*
_Tenemos que instalar la aplicación F-Droid, aquí te dejo la página para que puedas descargar la_
*_https://f-droid.org/_*

▫️ *_¿Porque debo de instalar F-Droid?_*
_Desde esa aplicación vamos a obtener Termux Actualizada, ya que el Termux de la Play Store está desactualizado._

▫️ _En caso que el *celular/tablet* pida activar opción como fuentes desconocidas le das en permitir_

▫️ _Una vez descargado el archivo procedemos a instalar F-Droid_

▫️ _Cuando ya tengamos instalada la aplicación F-Droid recuerda darle permisos de almacenamiento ve al *ajuste>aplicaciones>F-Droid>Permisos* y le activa/otorga el de Almacenamiento_

▫️ _Ahora ingresamos a la aplicación F-Droid y refrescamos la aplicación, (como cuando refresca una página desde el celular/tablet)_

▫️ _En la parte inferior derecha hay un símbolo de Lupa 🔎 presionamos y escribimos *Termux* y escogemos la que dice Termux "emulador de terminal con paquetes", presionamos esa opción y instalamos la aplicación Termux_

▫️ _Es posible que salga una opción que diga *"necesitamos permisos para instalar de manera externa la aplicación"* vamos a las opciones que brinda el dispositivo en concreto el apartado de instalar aplicaciones desconocidas y activamos, ahora si instalamos la aplicación Termux_

💫 _*Si has llegado hasta aquí sin inconvenientes ¡vas muy bien!*_

▫️ _Ingresamos a la aplicación Termux, debería salirte un símbolo como este *"$"*_
_*¿Recuerda los comandos para la instalación?* ¡Ahora vamos hacer uso de ello!_

▫️ _*Escribimos en el Termux* tal como esta la escritura no aumente mayúscula o símbolos:_

termux-setup-storage

▫️ _Presione la tecla siguiente o enter de su dispositivo. Ese comando permitirá *Otorgar permisos de almacenamiento* de Termux, si sale opción le da en permitir el permiso_

▫️ *_Ahora escriba:_*

apt update && apt upgrade -y -y

▫️ _Cabe recalcar que cada vez que salga el símbolo $ intuimos que es para poder continuar escribiendo comandos. Si sale algo así *"(Y/I/N/O/D/Z) [default=N] ?"* desde el teclado presionamos la letra *"y"*, y le damos en enter_

▫️ _Dejemos esto en claro, cada vez que salga *(Y/I/N/O/D/Z) [default=N] ?*, o salga *Y/N* siempre vamos a usar la tecla/letra *"y"*, y le damos a siguiente o enter_

▫️ *_Si te sale este símbolo $ ahora escriba:_*

pkg install git 

▫️ *_Ahora escriba_*

apt install git -y

▫️ *_Ahora escriba_*

apt install nodejs -y

▫️ *_Ahora escriba:_*

apt install ffmpeg -y

▫️ *Esperamos...* 😆 recuerde si sale *Y/N* escriba la letra y, luego enter

▫️ *_Ahora escriba_*

apt install imagemagick -y

▫️ *_Ahora escriba:_*

git clone https://github.com/GataNina-Li/GataBotV2

▫️ _*Esperamos...* 🤹‍♀️ esto puede tardar dependiendo de la velocidad de su Internet_

▫️ *_Ahora escriba:_*

cd GataBotV2

▫️ _Si sale algo así *"~/GataBotV2 $"*_
_*¡Entonces vas bien!*_ 🌟

▫️ *_Ahora escriba:_*

ls 

▫️ *_El "ls" es la L y S. No es "is". Si te salen nombres como estos:_*
_Bot.jpg, database.json, index.js, config.js etc..._ *_Entonces el clonado de repositorio está ✅ correcto_* 

▫️ *_Ahora escriba:_*

npm install

▫️ _Esperamos... 🐋 Cuando te vuelva a salir el *$ , escriba:*_

npm install -g npm@8.5.5

▫️ *_Ahora escriba:_*

npm update

▫️ *_Por último escriba:_*

npm start 

*✅ Listo!!*
*Ahora escanea el código QR con otro celular tomando le foto al código y escanear lo con el segundo dispositivo. También puedes tener la PC para enviar la foto y desde la pantalla de su PC escanear el código QR*

❗ *RECUERDA HACER ESTE PROCEDIMIENTO PASO A PASO PARA QUE NO TENGAS INCONVENIENTES*

❇️ *Si tienes aún dudas visita el repositorio de GataBot*

*_https://github.com/GataNina-Li/GataBotV2_*

⚡▁ ▂ ▄ ▅ ▆ ▇ █ 🚆 █ ▇ ▆ ▅ ▄ ▂ ▁⚡
                            🐈 𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨 🐈
`.trim()) 
handler.help = ['instalarbot']
handler.tags = ['info']
handler.command = /^Procesobot|procesobot|PROCESOBOT|Botproceso|botproceso|BOTPROCESO|procesodelbot$/i

module.exports = handler

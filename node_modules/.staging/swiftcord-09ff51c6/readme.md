# Swiftcord
![Swiftcord](https://i.imgur.com/1Tq6KDb.png)

Simple & easy to use image manipulation module.

# Installing

```bash
npm i --save swiftcord
```

# Features
- Super fast image manipulation
- Welcomer abd leaver images
- Rank card
- and more...

# Functions
- batslap(image1, image2)
- beautiful(image)
- facepalm(image)
- gay(image)
- kiss(image1, image2)
- rip(image)
- spank(image1, image2)
- trash(image)
- blur(image, level = 5)
- greyscale(image)
- sepia(image)
- invert(image)
- delete(image)
- color(color_hex_or_html5_color_name)
- trigger(image)
- hitler(image)
- bed(image1, image2)
- wanted(image)
- circle(image)
- jail(image)
- dither(image)
- rank({ username, discrim, level, rank, neededXP, currentXP, avatarURL })

# Example

```js

const Swiftcord = require("swiftcord");
const canva = new Swiftcord.Canvas();
const fs = require("fs");

function create() {
    fs.readFile("./image.png", async (err, data) => {
        let img = await canva.trigger(data);
        return fs.writeFile("./triggered.gif", img, (err) => {
            if (err) console.error(err);
        });
    });
}

create();

```

# Discord.js Example

```js
const Discord = require("discord.js");
const client = new Discord.Client();
const { Swiftcord } = require("swiftcord");
const cord = new Swiftcord();

client.on("ready", () => {
    console.log("I'm online!");
});

client.on("message", async (message) => {
    if (message.author.bot) return;
    if (message.content === "!trigger") {
        let avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await cord.trigger(avatar);
        let attachment = new Discord.MessageAttachment(image, "triggered.gif");
        return message.channel.send(attachment);
    }
    if (message.content === "!delete") {
        let spotify = message.member.presence.activities.filter(x => x.name == 'Spotify' && x.type == 'LISTENING')[0];

        let trackIMG = `https://i.scdn.co/image/${spotify.assets.largeImage.slice(8)}`;
        let trackName = spotify.details;
        let trackAuthor = spotify.state;
        let trackAlbum = spotify.assets.largeText;

        const data = await cord.Spotify({
            title: trackName,
            artist: trackAuthor,
            album: trackAlbum,
            image: trackIMG,
            start: spotify.timestamps.start,
            end: spotify.timestamps.end
        });
        const img = cord.write(data, "spotify.png");

        return message.channel.send(img);
    }
});

client.login("Your_Bot_Token_here");

```
# Example Welcome

```js
const Discord = require("discord.js");
const client = new Discord.Client();
const { Swiftcord } = require("swiftcord");
const cord = new Swiftcord();

let image = await cord.Welcome()
    .setUsername(message.author.username)
    .setDiscriminator(message.author.discriminator)
    .setMemberCount("18")
    .setGuildName(message.guild.name)
    .setGuildIcon(message.guild.iconURL({ format: "png" }))
    .setAvatar(message.member.user.displayAvatarURL({ format: "png", size: 2048 }))
    .setBackground("https://img.kirameki.one/LTqHsfYS.jpg")
    .toAttachment();
const img = cord.write(image, "welcome.png");

return message.channel.send(attachment);
```
![image](https://i.imgur.com/fieddDc.png)

# Preview
![image](https://i.imgur.com/P68XUqq.png)

# Join Our Discord Server
[![https://discord.gg/q99CQEP](https://invite.atzu.xyz/svg/q99CQEP "https://discord.gg/q99CQEP")](https://discord.gg/q99CQEP)

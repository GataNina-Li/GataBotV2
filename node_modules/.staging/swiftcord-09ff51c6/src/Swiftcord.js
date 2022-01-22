const Canvas = require("canvas");
const jimp = require("jimp");
const GIFEncoder = require("gifencoder");
const circle = require('@jimp/plugin-circle');
const configure = require('@jimp/custom');
const Util = require("./Utils.js");

const getColors = require('get-image-colors')
var onecolor = require('onecolor')
const fetch = require('node-fetch');

// load custom plugins
configure({ plugins: [circle] }, jimp);

class Swiftcord {

    /**
     * batslap
     * @param {Image1} image1 first image
     * @param {Image2} image2 second image
     * @returns <Buffer>
     */
    async batslap(image1, image2) {
        if (!image1) throw new Error("first image was not provided!");
        if (!image2) throw new Error("second image was not provided!");
        let base = await jimp.read(__dirname+"/assets/batslap.png");
        image1 = await jimp.read(image1);
        image2 = await jimp.read(image2);
        base.resize(1000, 500);
        image1.resize(220, 220);
        image2.resize(200, 200);
        base.composite(image2, 580, 260);
        base.composite(image1, 350, 70);
        let raw = await base.getBufferAsync("image/png");
        return raw;
    }

    /**
     * beautiful
     * @param {Image} image image
     * @returns <Buffer>
     */
    async beautiful(image) {
        if (!image) throw new Error("image was not provided!");
        let base = await jimp.read(__dirname +"/assets/beautiful.png");
        base.resize(376, 400);
        let img = await jimp.read(image);
        img.resize(84, 95);
        base.composite(img, 258, 28);
        base.composite(img, 258, 229);
        let raw = await base.getBufferAsync("image/png");
        return raw;
    }

    /**
     * facepalm
     * @param {Image} image image
     * @returns <Buffer>
     */
    async facepalm(image) {
        if (!image) throw new Error("image was not provided!");
        let canvas = Canvas.createCanvas(632, 357);
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 632, 357);
        let avatar = await Canvas.loadImage(image);
        ctx.drawImage(avatar, 199, 112, 235, 235);
        let layer = await Canvas.loadImage(__dirname +"/assets/facepalm.png");
        ctx.drawImage(layer, 0, 0, 632, 357);
        return canvas.toBuffer();
    }

    /**
     * gay
     * @param {Image} image Image
     * @returns <Buffer>
     */
    async gay(image) {
        if (!image) throw new Error("image was not provided!");
        let bg = await Canvas.loadImage(__dirname +"/assets/gay.png");
        let img = await Canvas.loadImage(image);
        const canvas = Canvas.createCanvas(400, 400);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 400, 400);
        ctx.drawImage(bg, 0, 0, 400, 400);
        return canvas.toBuffer();
    }

    /**
     * kiss
     * @param {image1} image1 first image
     * @param {image2} image2 second image
     * @returns <Buffer>
     */
    async kiss(image1, image2) {
        if (!image1) throw new Error("first image was not provided!");
        if (!image2) throw new Error("second image was not provided!");
        const canvas = Canvas.createCanvas(768, 574);
        const ctx = canvas.getContext("2d");
        const background = await Canvas.loadImage(__dirname +"/assets/kiss.png");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        const avatar = await Canvas.loadImage(image1);
        const avatar1 = await Canvas.loadImage(image2);
        ctx.drawImage(avatar1, 370, 25, 200, 200);
        ctx.drawImage(avatar, 150, 25, 200, 200);

        return canvas.toBuffer();
    }

    /**
     * rip
     * @param {Image} image Image
     * @returns <Buffer>
     */
    async rip(image) {
        if (!image) throw new Error("image was not provided!");
        const canvas = Canvas.createCanvas(244, 253);
        const ctx = canvas.getContext("2d");
        const background = await Canvas.loadImage(__dirname +"/assets/rip.png");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        const avatar = await Canvas.loadImage(image);
        ctx.drawImage(avatar, 63, 110, 90, 90);
        return canvas.toBuffer();
    }

    /**
     * spank
     * @param {image1} image1 first image
     * @param {image2} image2 second image
     * @returns <Buffer>
     */
    async spank(image1, image2) {
        if (!image1) throw new Error("first image was not provided!");
        if (!image2) throw new Error("second image was not provided!");
        let bg = await jimp.read(__dirname +"/assets/spank.png");
        image1 = await jimp.read(image1);
        image2 = await jimp.read(image2);
        bg.resize(500, 500);
        image1.resize(140, 140);
        image2.resize(120, 120);
        bg.composite(image2, 350, 220);
        bg.composite(image1, 225, 5);
        let raw = await bg.getBufferAsync("image/png");
        return raw;
    }

    /**
     * trash
     * @param {Image} image Image
     * @returns <Buffer>
     */
    async trash(image) {
        if (!image) throw new Error("image was not provided!");
        let bg = await jimp.read(__dirname +"/assets/trash.png");
        image = await jimp.read(image);
        image.resize(309, 309);
        image.blur(5);
        bg.composite(image, 309, 0);
        let raw = await bg.getBufferAsync("image/png");
        return raw;
    }

    /**
     * blur
     * @param {Image} image Image
     * @param {Number} level blur level
     * @returns <Buffer>
     */
    async blur(image, level = 5) {
        if (!image) throw new Error("image was not provided!");
        image = await jimp.read(image);
        image.blur(isNaN(level) ? 5 : parseInt(level));
        let raw = await image.getBufferAsync("image/png");
        return raw;
    }

    /**
     * greyscale
     * @param {Image} image Image
     * @returns <Buffer>
     */
    async greyscale(image) {
        if (!image) throw new Error("image was not provided!");
        image = await jimp.read(image);
        image.greyscale();
        let raw = await image.getBufferAsync("image/png");
        return raw;
    }

    /**
     * sepia
     * @param {Image} image Image
     * @returns <Buffer>
     */
    async sepia(image) {
        if (!image) throw new Error("image was not provided!");
        image = await jimp.read(image);
        image.sepia();
        let raw = await image.getBufferAsync("image/png");
        return raw;
    }

    /**
     * invert
     * @param {Image} image Image
     * @returns <Buffer>
     */
    async invert(image) {
        if (!image) throw new Error("image was not provided!");
        image = await jimp.read(image);
        image.invert();
        let raw = await image.getBufferAsync("image/png");
        return raw;
    }

    /**
     * delete
     * @param {Image} image Image
     * @returns <Buffer>
     */
    async delete(image) {
        if (!image) throw new Error("image was not provided!");
        let bg = await jimp.read(__dirname + "/assets/delete.png");
        image = await jimp.read(image);
        image.resize(195, 195);
        bg.composite(image, 120, 135);
        let raw = await bg.getBufferAsync("image/png");
        return raw;
    }

    /**
     * color
     * @param {Color} color name/hex
     * @returns <Buffer>
     */
    async color(color = "#FFFFFF") {
        const canvas = Canvas.createCanvas(2048, 2048);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return canvas.toBuffer();
    }

    /**
     * trigger
     * @param {Image} image image
     * @returns <Buffer>
     */
    async trigger(image) {
        if (!image) throw new Error("image was not provided!");
        const base = await Canvas.loadImage(__dirname +"/assets/triggered.png");
        const img = await Canvas.loadImage(image);
        const GIF = new GIFEncoder(256, 310)
        GIF.start();
        GIF.setRepeat(0);
        GIF.setDelay(15);
        const canvas = Canvas.createCanvas(256, 310);
        const ctx = canvas.getContext('2d');
        const BR = 20;
        const LR = 10;
        let i = 0;
        while (i < 9) {
            ctx.clearRect(0, 0, 256, 310);
            ctx.drawImage(img, Math.floor(Math.random() * BR) - BR, Math.floor(Math.random() * BR) - BR, 256 + BR, 310 - 54 + BR);
            ctx.fillStyle = '#FF000033';
            ctx.fillRect(0, 0, 256, 310);
            ctx.drawImage(base, Math.floor(Math.random() * LR) - LR, 310 - 54 + Math.floor(Math.random() * LR) - LR, 256 + LR, 54 + LR);
            GIF.addFrame(ctx);
            i++
        };
        GIF.finish();
        return GIF.out.getData();
    }
    
    /**
     * hitler
     * @param {Image} image Image
     * @returns <Buffer>
     */
    async hitler(image) {
        if (!image) throw new Error("Image was not provided!");
        let bg = await jimp.read(__dirname + "/assets/hitler.png");
        let img = await jimp.read(image);
        img.resize(140, 140);
        bg.composite(img, 46, 43);
        let raw = await bg.getBufferAsync("image/png");
        return raw;
    }
    
    /**
     * bed
     * @param {image1} image1 first image
     * @param {image2} image2 second image
     * @returns <Buffer>
     */
    async bed(image1, image2) {
        if (!image1) throw new Error("first image was not provided!");
        if (!image2) throw new Error("second image was not provided!");
        let bg = await jimp.read(__dirname +"/assets/bed.png");
        image1 = await jimp.read(image1);
        image2 = await jimp.read(image2);
        image1.resize(100, 100);
        image2.resize(70, 70);
        let image3 = image1.clone().resize(70, 70);
        bg.composite(image1, 25, 100);
        bg.composite(image1, 25, 300);
        bg.composite(image3, 53, 450);
        bg.composite(image2, 53, 575);
        let raw = await bg.getBufferAsync("image/png");
        return raw;
    }
    
    /**
     * wanted
     * @param {image} Image
     * @returns <Buffer>
     */
    async wanted(image) {
        if (!image) throw new Error("no image provided!");
        let base = await jimp.read(__dirname + "/assets/wanted.png");
        let img = await jimp.read(image);
        img.resize(447, 447);
        base.composite(img, 145, 282);
        let raw = await base.getBufferAsync("image/png");
        return raw;
    }

    /**
     * circle
     * @param {Image} image Image
     * @returns <Buffer>
     */
    async circle(image) {
        if (!image) throw new Error("image was not provided!");
        image = await jimp.read(image);
        image.circle();
        let raw = await image.getBufferAsync("image/png");
        return raw;
    }
    
    /**
     * jail
     * @param {image} Image
     * @returns <Buffer>
     */
    async jail(image) {
        if (!image) throw new Error("no image provided!");
        let canvas = Canvas.createCanvas(350, 350);
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 350, 350);
        let avatar = await Canvas.loadImage(image);
        ctx.drawImage(avatar, 0, 0, 350, 350);
        let layer = await Canvas.loadImage(__dirname +"/assets/jail.png");
        ctx.drawImage(layer, 0, 0, 350, 350);
        return canvas.toBuffer();
    }

    /**
     * affect
     * @param {image} Image
     * @returns <Buffer>
     */
    async affect(image) {
        if (!image) throw new Error("no image provided!");
        let base = await jimp.read(__dirname + "/assets/affect.png");
        let img = await jimp.read(image);
        img.resize(200, 157);
        base.composite(img, 180, 383);
        let raw = await base.getBufferAsync("image/png");
        return raw;
    }

    /**
     * dither
     * @param {Image} image Image
     * @returns <Buffer>
     */
    async dither(image) {
        if (!image) throw new Error("image was not provided!");
        image = await jimp.read(image);
        image.dither565();
        let raw = await image.getBufferAsync("image/png");
        return raw;
    }

    /**
     * rank
     * @param {Image} image Image
     * @returns <Buffer>
     */
    async rank({ user, level, rank, neededXP, currentXP, avatarURL, bg, color = "FFFFFF", opacity }) {
        if (!user) throw new Error("No user was provided!");
        if (!level) throw new Error("No level was provided!");
        if (!rank) throw new Error("No rank was provided!");
        if (!neededXP) throw new Error("No totalXP was provided!");
        if (!currentXP) throw new Error("No currentXP was provided!");
        if (!avatarURL) throw new Error("No avatarURL was provided!");
        if (!opacity) opacity = 0.7

        Canvas.registerFont(__dirname + '/assets/Fonts/regular-font.ttf', { family: 'Manrope', weight: "regular", style: "normal" });
        Canvas.registerFont(__dirname + '/assets/Fonts/bold-font.ttf', { family: 'Manrope', weight: "bold", style: "normal" });

        var avatar = await Canvas.loadImage(avatarURL)
        if (bg) var b = await Canvas.loadImage(bg)
        let canvas = Canvas.createCanvas(934, 282)
        let ctx = canvas.getContext('2d')
        let status;

        if(user.presence.status == 'dnd') status = "#F04848"
        if(user.presence.status == 'online') status = "#43B581"
        if(user.presence.status == 'idle') status = "#FAA61A"
        if(user.presence.status == 'offline') status = "#747F8D"
        
        if (!bg) {
            ctx.fillStyle = "#23272A"
            this.roundRect(ctx, 0, 0, 934, 282, 5, true);
        } else {
            ctx.fillStyle = "#23272A"
            ctx.save()
            ctx.beginPath();
            this.roundRect(ctx, 0, 0, 934, 282, 5, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(b, 0, 0, 934, 282);
            ctx.restore()
        }

        ctx.save()
        ctx.fillStyle = "#090A0B";
        if (bg) ctx.globalAlpha = opacity;
        else ctx.globalAlpha = 0.1 * 100 / 10;
        this.roundRect(ctx, 24, 36, 886, 210, 10, true);
        ctx.restore()

        ctx.save()
        ctx.beginPath();
        ctx.arc(122, 142, 84, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = "#000000";
       
        ctx.fillRect(38, 58, 168, 168);
        ctx.restore()

        ctx.save()
        ctx.beginPath();
        ctx.arc(121, 142, 80, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 41, 62, 160, 160);
        ctx.restore()

        ctx.save()
        ctx.beginPath();
        ctx.arc(184, 194, 24, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = "#000000";
        ctx.fillRect(160, 170, 48, 48);
        ctx.restore()

        ctx.save()
        ctx.beginPath();
        ctx.arc(184, 194, 20, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.fillStyle = status;
        ctx.fillRect(164, 174, 40, 40);
        ctx.restore()

        ctx.save()
        ctx.fillStyle = "#000000";
        this.roundRect(ctx, 256, 182, 636, 40, 25, true);
        ctx.restore()
        ctx.save()
        ctx.fillStyle = "#484B4E";
        this.roundRect(ctx, 258, 184, 632, 36, 24, true);
        ctx.restore()
        
        let widthXP = (currentXP * 615) / neededXP;
        if (widthXP > 615 - 18.5) widthXP = 615 - 18.5;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(257 + 18.5, 147.5 + 18.5 + 36.25, 18.5, 1.5 * Math.PI, 0.5 * Math.PI, true);
        ctx.fill();
        ctx.fillRect(257 + 18.5, 147.5 + 36.25, widthXP, 37.5);
        ctx.arc(257 + 18.5 + widthXP, 147.5 + 18.5 + 36.25, 18.75, 1.5 * Math.PI, 0.5 * Math.PI, false);
        ctx.fill();
        let us = user.displayName.length > 20 ? user.displayName.substring(0, 17) + "..." : user.displayName;

        var name = us  
        ctx.font = '45px Impact'
        ctx.fillStyle = 'white';
        ctx.textAlign = "left";
        ctx.fillText(name, 277, 162)

        let left = ctx.measureText(name).width + 277

        ctx.save()
        ctx.font = '25px Impact'
        ctx.fillStyle = '#7F8384';
        ctx.textAlign = "left";
        ctx.fillText(`#${user.user.discriminator}`, left, 162)
        ctx.restore()

        ctx.save()
        ctx.font = '25px Impact'
        ctx.fillStyle = 'white';
        ctx.textAlign = "left";
        ctx.fillText(`RANK`, 555, 99)
        ctx.restore()
        let temp;
        ctx.save()
        ctx.font = '45px Impact'
        ctx.fillStyle = 'white';
        ctx.textAlign = "left";
        ctx.fillText(`#${(rank)}`, 628, 99)
        temp = 710 + ctx.measureText(`#${(rank)}`).width - 73
        ctx.restore()

        ctx.save()
        ctx.font = '25px Impact'
        ctx.fillStyle = color;
        ctx.textAlign = "left";
        ctx.fillText(`LEVEL`, temp, 99)
        ctx.restore()

        ctx.save()
        ctx.font = '45px Impact'
        ctx.fillStyle = 'white';
        ctx.textAlign = "left";
        ctx.fillText(level, temp+87, 99)
        ctx.restore()

        let xp = currentXP

        let need = `/ ${neededXP} XP`

        ctx.font = '25px Impact'
        ctx.fillStyle = 'white';
        ctx.textAlign = "left";
        ctx.fillText(xp, 707, 165)

        left = ctx.measureText(xp).width + 710

        ctx.font = '25px Impact'
        ctx.fillStyle = '#7F8384';
        ctx.textAlign = "left";
        ctx.fillText(need, left, 165)

        return canvas.toBuffer();
    }

    /**
     * welcome
     * @param {Image} image Image
     * @returns <Buffer>
     */
    Welcome () {
        Canvas.registerFont(__dirname + '/assets/Fonts/regular-font.ttf', { family: 'Manrope', weight: "regular", style: "normal" });
        Canvas.registerFont(__dirname + '/assets/Fonts/Uni-Italic.ttf', { family: 'Bold', style: "Heavy" });

        return new (require('./greetings/Welcome'));
    } 

    /**
     * leaver
     * @param {Image} image Image
     * @returns <Buffer>
     */
    Goodbye() {
        Canvas.registerFont(__dirname + '/assets/Fonts/regular-font.ttf', { family: 'Manrope', weight: "regular", style: "normal" });
        Canvas.registerFont(__dirname + '/assets/Fonts/UniSans.otf', { family: 'Bold', weight: "bold", style: "normal" });

        return new (require('./greetings/Goodbye'));
    }

    /**
     * Fortnite Shop
     * @param {Token} token fornite key
     * @returns <Buffer> using .toAttachment();
     */
    Fortnite() {
        // Register SketchMatch font
        Canvas.registerFont(`${__dirname}/assets/Fonts/LuckiestGuy-Regular.ttf`, { family: "luckiest guy" });
        // Register KeepCalm font
        Canvas.registerFont(`${__dirname}/assets/Fonts/KeepCalm-Medium.ttf`, { family: "KeepCalm" });  

        return new (require('./fortnite/Shop'));
    }

    /**
     * Fortnite User
     * @param {Key} key fornite key
     * @returns <Buffer> using .toAttachment();
     */
    FortniteUser() {
        // Register SketchMatch font
        Canvas.registerFont(`${__dirname}/assets/Fonts/LuckiestGuy-Regular.ttf`, { family: "luckiest guy" });
        // Register KeepCalm font
        Canvas.registerFont(`${__dirname}/assets/Fonts/bold-font.ttf`, { family: "KeepCalm" });  

        return new (require('./fortnite/fortnitestats'));
    }
    async Spotify(options = {  title: null, image: null, artist: null, album: null, start: null, end: null, theme: null}) {
        Canvas.registerFont(__dirname + '/assets/Fonts/regular-font.ttf', { family: 'Manrope', weight: "regular", style: "normal" });
        Canvas.registerFont(__dirname + '/assets/Fonts/bold-font.ttf', { family: 'Manrope', weight: "bold", style: "normal" });
        const spotifyLogo = await Canvas.loadImage(__dirname +"/assets/spotify-logo.png");

        const canvas = Canvas.createCanvas(1889, 360);
        const ctx = canvas.getContext("2d");

        const img = await Canvas.loadImage(options.image);
        var hex = await GetColor(options.image)

        // background
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = hex;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save()
        ctx.globalAlpha = 0.7
        this.roundRect(ctx, 50, 50, 1800, 260, 20, true, false, '#fff1e5')
        ctx.restore()

        // draw image      
        ctx.drawImage(img, 80, 75, 215, 210);

        // draw spotify image logo   
        ctx.drawImage(spotifyLogo, 1730, 200, 65, 65);

        // draw songname
        ctx.fillStyle = "#000000";
        ctx.font = "bold 85px Manrope";
        ctx.fillText(Util.shorten(options.title, 30), 320, 220);

        // draw artist name
        ctx.fillStyle = "#000000";
        ctx.font = "bold 50px Manrope";
        ctx.fillText(Util.shorten(options.artist.split(";").join(","), 40), 320, 130);

        // add album
        if (options.album && typeof options.album === "string") {
            ctx.fillStyle = "#000000";
            ctx.font = "bold 50px Manrope";
            ctx.fillText(`on ${Util.shorten(options.album, 40)}`, 320, 280);
        }
        return canvas.toBuffer()
    }

    roundRect(ctx, x, y, width, height, radius, fill, stroke, color) {
        if (typeof stroke == 'undefined') {
            stroke = true;
        }
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        if (typeof radius === 'number') {
            radius = {
                tl: radius,
                tr: radius,
                br: radius,
                bl: radius
            };
        } else {
            var defaultRadius = {
                tl: 0,
                tr: 0,
                br: 0,
                bl: 0
            };
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.fillStyle = color
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }

    }
    Profile() {
        Canvas.registerFont(__dirname + '/assets/Fonts/UniSans.otf', { family: "UniSans" });
        Canvas.registerFont(__dirname + '/assets/Fonts/DancingScript.ttf', { family: "Dancing" });
        return new (require('./Profile/Base.js'))
    }
    /**
     * Attachment object for discord.js
     * @param {string|Buffer} data Data
     * @param {string} name name
     * @example const data = await swiftcord.color("blue");
     * const img = swiftcord.write(data, "color.png");
     * return message.channel.send(img);
     */
    write(data, name, raw = false) {
        if (!raw)
            return {
                files: [{ attachment: data, name: name || null }]
            };

        return { attachment: data, name: name || null };
    }
}

async function GetColor(img) {
   try {
     const rgb = await getColors(img)
     var hex = rgb[0].alpha(0.5).css()
     
    return hex    
  } catch (err) {
    console.error(err);
    return 'Server Error' 
  }
}

module.exports = Swiftcord;
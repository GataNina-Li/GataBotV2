const Canvas = require("canvas");
const { CanvasRenderingContext2D } = require('canvas');
const { formatVariable, applyText } = require(`../utils/functions`);
const Util = require("../Utils.js");

let estado = {
    online: '#44b37f',
    idle: '#faa51b',
    offline: '#747f8d',
    dnd: '#f04848'
}

module.exports = class Profile {

    constructor() {
        this.field1 = "Rank:";
        this.field2 = "Level:";
        this.field3 = "Rep:";
        this.field4 = "Money:";
        this.bio = "Biography not established"
        this.backgroundImage = `${__dirname}/../../src/assets/Profile/default.png`;
        this.avatar = `${__dirname}/../../src/assets/default-avatar.png`;
        this.marryAvatar = `${__dirname}/../../src/assets/default-avatar.png`;
        this.color = "#6ab5ff";
        this.userData = {}
        this.marry = {}
        this.marrya = false
    }

    setAvatar(value) {
        this.avatar = value;
        return this;
    }

    setMarry({ name=null, time=null, avatar=this.marryAvatar}){
        this.marry = { name, time, avatar};
        this.marrya = true
        return this;
    }

    setUser({ member, level = 0, xp = 0, money = 0, NextLevelXp = 0, reps = 0, rank = 0 }) {
        this.userData = { member, level, xp, money, NextLevelXp, reps, rank }
        return this;
    }
    setBackground(value) {
        this.backgroundImage = value;
        return this;
    }

    setBio(value) {
        this.bio = value;
        return this;
    }
    setColor(value) {
        this.color = value;
        return this;
    }

    setText(variable, value) {
        //const formattedVariable = formatVariable("text", variable);
        if (this[variable]) this[variable] = value;
        return this;
    }

    async render() {
        // Create canvas
        const canvas = Canvas.createCanvas(1500, 1500);
        const ctx = canvas.getContext('2d');
        var { member, level, xp, money,  NextLevelXp, reps, rank } = this.userData;

        //console.log(this.userData)
        // Profile card data
        const bgImg = await Canvas.loadImage(this.backgroundImage);
        const avatar = await Canvas.loadImage(this.avatar);
        const dbLevel = level
        const xpNeededForLevelUp = NextLevelXp
        const currentXPToBeginWith = xp
        const scorebarWidth = Math.round(xp * 855 / NextLevelXp);

        const leaderboardRank = rank;
        const REPS = reps
        const MONEY = money
        const BIO = this.bio
        const heart = await Canvas.loadImage(`${__dirname}/../../src/assets/Profile/heart.png`);
        const crow = await Canvas.loadImage(`${__dirname}/../../src/assets/Profile/crown.png`);
        //const petImg = await Canvas.loadImage("https://i.atzu.xyz/atzu-bcbd.png")
        let status;
        var color = this.color;

        // Background Fill
        ctx.fillStyle = '#2d2d37';
        ctx.fillRect(0, 0, 1500, 1500);

        // Background Image
        ctx.drawImage(bgImg, 0, -127, 1500, 600);

        // Background Image Overlay
        ctx.fillStyle = 'rgba(9, 9, 9, .5)';
        ctx.fillRect(0, 0, 1500, 475);

        // Username
        let username = member.user.username.length > 13 ? member.user.username.substring(0, 10) + "..." : member.user.username;
        ctx.font = '80px UniSans';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(username, 650, 400);
        const usernameLength = ctx.measureText(username).width;

        // Usertag
        ctx.font = '70px UniSans';
        ctx.fillStyle = color;
        ctx.fillText('#' + member.user.discriminator, 650 + usernameLength, 400);

        // Levelbar Background
        ctx.fillStyle = "rgba(132, 132, 132, .4)";
        ctx.fillRect(648, 455, 850, 20);

        // Levelbar
        ctx.fillStyle = color
        ctx.fillRect(648, 455, scorebarWidth, 20);

        // Levelbar Text Now
        ctx.font = '37px UniSans';
        ctx.textAlign = 'right';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(currentXPToBeginWith, 1500 - ctx.measureText(' / ' + xpNeededForLevelUp + ' XP').width, 442);

        // Levelbar Text Needed
        ctx.font = '37px UniSans';
        ctx.textAlign = 'right';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(' / ' + xpNeededForLevelUp + ' XP', 1500, 442);

        // Background Stats Overlay         
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(50, 500, 600, 950);

        ctx.font = '70px UniSans';
        ctx.textAlign = 'center';
        ctx.fillStyle = color
        ctx.fillText(this.field1, 180, 950);
        const fieldLength = ctx.measureText(this.field1).width;

        // Rank Text
        ctx.font = '70px UniSans';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(rank.shortNum(), 125 + fieldLength, 955);

        // Level Label
        ctx.font = "70px UniSans";
        ctx.textAlign = 'center';
        ctx.fillStyle = color
        ctx.fillText(this.field2, 182, 1050);
        const field2Length = ctx.measureText(this.field2).width;

        // Level Text
        ctx.font = "70px UniSans";
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(level.shortNum(), 150+field2Length, 1055);

        // Reps Label
        ctx.font = "70px UniSans";
        ctx.textAlign = 'center';
        ctx.fillStyle = color
        ctx.fillText(this.field3, 166, 1150);
        const field3Length = ctx.measureText(this.field3).width;

        // Reps Text
        ctx.font = "70px UniSans";
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(reps.shortNum(), 160+field3Length, 1155);

        // Money Label
        ctx.font = "70px UniSans";
        ctx.textAlign = 'center';
        ctx.fillStyle = color
        ctx.fillText(this.field4, 210, 1250);
        const field4Length = ctx.measureText(this.field4).width;

        // Reps Text
        ctx.font = "70px UniSans";
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(MONEY.shortNum(), 170+field4Length, 1255);

        if (this.marrya) {
            const { name, time, avatar } = this.marry
            const Mavatar = await Canvas.loadImage(avatar)

            this.roundRect(ctx, 780, 50, 420, 60, 40, true, false, '#2d2d37')

            this.roundRect(ctx, 1100, 240, 300, 60, 40, true, false, '#2d2d37')

            this.roundRect(ctx, 650, 100, 800, 150, 80, true, false, '#2d2d37')

            ctx.save();
            ctx.beginPath();
            ctx.arc(750, 175, 60, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(Mavatar, 650, 70, 200, 200);
            ctx.restore();

            // Label
            ctx.font = "55px Dancing";
            ctx.textAlign = 'center';
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText("Married to:", 990, 95);

            // User Name
            ctx.font = "70px UniSans";
            ctx.textAlign = 'center';
            ctx.fillStyle = color;
            ctx.fillText(Util.shorten(name, 20), 1060, 195);

            // Time 
            ctx.font = "60px Dancing";
            ctx.textAlign = "center";
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(Util.MarryTime(new Date(time)), 1250, 285);
        }

        // Badges Bg Label        
        this.roundRect(ctx, 680, 520, 800, 110, 80, true, false, '#2a2a2a')
        // Label
        ctx.font = "70px UniSans";
        ctx.textAlign = 'center';
        ctx.fillStyle = color;
        ctx.fillText("Badges", 1080, 600);

        // BIO bg label
        this.roundRect(ctx, 680, 1020, 800, 110, 80, true, false, '#2a2a2a')
        // Label
        ctx.font = "70px UniSans";
        ctx.textAlign = 'center';
        ctx.fillStyle = color;
        ctx.fillText("Bio", 1080, 1100);

        ctx.font = "50px UniSans";
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.wrapText(Util.shorten(BIO, 110), 1080, 1200, 800, 0, 8);

        // badges 
        if (this.marrya) {
            ctx.drawImage(heart, 700, 635, 150, 150);
        }
        if (leaderboardRank == "1") {
            ctx.drawImage(crow, 750 + heart.width, 635, 150, 150);
        }
        // Background Avatar Circle
        ctx.beginPath();
        ctx.arc(350, 500, 300, 0, Math.PI * 2, true);
        ctx.fillStyle = "#2d2d37";
        ctx.fill();
        ctx.closePath();

        // Avatar Image
        ctx.save();
        ctx.beginPath();
        ctx.arc(350, 500, 280, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, 50, 220, 600, 600);
        ctx.restore();

        if (member.id === "325414558623858698" || rank === 1) {
            const ownerBadge = await Canvas.loadImage('https://img.kirameki.one/8A5fZRMN.png');
            ctx.rotate(-22 * Math.PI / 180);
            ctx.fillStyle = color
            ctx.drawImage(ownerBadge, 60, 126, 150, 150);
        }
        //console.log(member.id)
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
};

CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, width, lineHeight, maxLines) {
    if (!lineHeight)
        lineHeight = +this.font.match(/(\d+)px/)[1]
    let ls = text.split('\n')
    let ln = 0
    for (let l of ls) {
        let ws = l.split(' ')
        let lwr = 0
        for (let i = 0; i < ws.length; i++) {
            if (ln >= maxLines) return
            let lw = this.measureText(ws.slice(lwr, i + 1)).width
            if (lw > width && i + 1 - lwr > 1) {
                this.fillText(ws.slice(lwr, i).join(' '), x, y + ln * lineHeight)
                lwr = i
                ln++
            }
            if (ws.length - 1 === i) {
                this.fillText(ws.slice(lwr, i + 1).join(' '), x, y + ln * lineHeight)
                ln++
            }
        }
        ln++
    }
    return this
}
// Prototype function to profile method 
Number.prototype.shortNum = function(a) {
    var value = this.valueOf();
    var bN = 0;
    var sf = ["", "k", "m", "b", "t", "c", "q", "s"];
    while (value > 999) {
        value /= 1000;
        bN++;
    }
    return value.toFixed(0) + sf[bN];
}
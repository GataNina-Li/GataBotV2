const Greeting = require(`${__dirname}/Base`);

module.exports = class Goodbye extends Greeting {
    constructor(){
        super();
        this.textTitle = "GOODBYE";
        this.textMessage = "{server}";
        this.colorTitle = "#df0909";
        this.assent = `${__dirname}/../../src/assets/greetings/goodbye.png`;
    }
};

//Leaving from 
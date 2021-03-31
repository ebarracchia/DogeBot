const math = require("mathjs");

module.exports = {
    name: 'math',
    description: 'solve equation',
    aliases: ['m'],
    usage: '[equation]',
    execute(data, text, args) {
        let msgObj = [`Please send: !math [equation] -> where equation is any valid math operation`];
        const equation = text
        try {
            if (equation) {
                const result = math.evaluate(equation);
                msgObj = [`The result for ${equation} is: ${result}`];
            }
        } catch (error) {
            console.log(error)
        }  
    
        data.message.reply(msgObj, {whispered: true, mentionUser: true}).then()
    },
};
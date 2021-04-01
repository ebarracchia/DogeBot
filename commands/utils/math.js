const math = require("mathjs");
const getText = require('../../common/getArrayUtils.js');

module.exports = {
    name: 'math',
    description: 'solve equation',
    aliases: ['m'],
    usage: '[equation]',
    execute(data, args) {
        let msgObj = [`Please send: !math [equation] -> where equation is any valid math operation`];
        const equation = getText(args);
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
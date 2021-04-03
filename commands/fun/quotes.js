const axios = require("axios");

module.exports = {
    name: 'quote',
    description: 'get quote',
    aliases: ['quotes'],
    async execute(data) {
        let resp = await axios.get('https://zenquotes.io/api/random');
        quote = resp.data[0];
		data.message.reply(`${quote.q} | ${quote.a}`, { mentionUser: false })
    },
};
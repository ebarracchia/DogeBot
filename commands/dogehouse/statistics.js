const axios = require("axios");

module.exports = {
    name: 'statistics',
    description: 'get statistics',
    aliases: ['stats'],
    async execute(data) {
        let resp = await axios.get('https://api.dogehouse.xyz/v1/statistics')
		data.message.reply(`Total Online: ${resp.data.totalOnline} | Total Rooms: ${resp.data.totalRooms} | Total Bots Online: ${resp.data.totalBotsOnline}`, { mentionUser: false })
    },
};
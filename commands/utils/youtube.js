const youtubesearchapi=require('youtube-search-api');

module.exports = {
    name: 'youtube',
    description: 'search into youtube',
    aliases: ['m'],
    usage: '[search]',
    async execute(data, args) {
        let msgObj = null;
        if (args) {
            const result = await youtubesearchapi.GetListByKeyword(args, false);
            if (result.items.length) {
                const item = result.items[0];
                console.log(item);
                msgObj = [`${item.title} - https://www.youtube.com/watch?v=${item.id}`];
            } else {
                msgObj = [`No results.`];
            }
        } else {
            msgObj = [`No search text provided.`];
        }
        data.message.reply(msgObj, {whispered: false, mentionUser: false}).then()
    },
};
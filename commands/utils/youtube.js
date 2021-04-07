const youtubesearchapi=require('youtube-search-api');

const getYoutubeInfo = (item) => {
    switch (item.type) {
        case 'video':
            return `${item.title} | ⏰ (${item.length.simpleText}) - 🔗 https://www.youtube.com/watch?v=${item.id}`;
            break;
        case 'channel':
            return `${item.title} - 🔗 https://www.youtube.com/channel/${item.id}`;
            break;
        
        default:
            return '';
            break;
    }
}

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
                msgObj = [`${getYoutubeInfo(item)}`];
            } else {
                msgObj = [`No results.`];
            }
        } else {
            msgObj = [`No search text provided.`];
        }
        data.message.reply(msgObj, {whispered: false, mentionUser: false}).then()
    },
};
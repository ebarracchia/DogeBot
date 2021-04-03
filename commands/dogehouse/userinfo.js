const getUser = require('../../common/getDogehouseUtils.js');

module.exports = {
    name: 'userinfo',
    description: 'get user information',
    aliases: ['u'],
    usage: '[User ID or Username]',
    async execute(data, args) {
        let user = data.message.author;
        if (args[0]) {
            user = await getUser(data.app.users.get(args[0]));
            if (!user.id) {
                const msgObj = [`Wrong user provided!!`];
                data.message.author.whisper(msgObj); 
                return                  
            }
        }
        const msgObj = [`Username: ${user.username} | Followers: ${user.numFollowers} | Following: ${user.numFollowing} | Id: ${user.id} | Bio: ${user.bio} | Avatar: `, {Link: user.avatarUrl}];
        data.message.author.whisper(msgObj); 
    },
};
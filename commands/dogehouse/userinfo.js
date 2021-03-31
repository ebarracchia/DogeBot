module.exports = {
    name: 'userinfo',
    description: 'get user information',
    execute(data) {
        const msgObj = [`Username: ${data.message.author.username} | Followers: ${data.message.author.numFollowers} | Following: ${data.message.author.numFollowing} | Id: ${data.message.author.id} | Avatar: `, {Link: data.message.author.avatarUrl}];
        data.message.author.whisper(msgObj); 
    },
};
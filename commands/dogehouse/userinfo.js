module.exports = {
    name: 'userinfo',
    description: 'get user information',
    usage: '[User ID or Username]',
    async execute(data, args) {
        let user = data.message.author;
        if (args[0]) {
            user = await data.app.users.get(args[0]).then((user) => user.d);
            console.log(user.d);
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
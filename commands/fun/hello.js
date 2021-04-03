module.exports = {
    name: 'hello',
    description: 'answer hello',
    aliases: ['hi'],
    execute(data) {
        data?.app?.bot?.sendMessage('Hello my friend!!').then(() => console.log('done'))
    },
};
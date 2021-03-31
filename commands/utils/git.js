module.exports = {
    name: 'git',
    description: 'github link',
    execute(data) {
        data?.app?.bot?.sendMessage('https://github.com/ebarracchia').then(() => console.log('done'))
    },
};
const getText = require('../../common/getArrayUtils.js');

let poll = {who: []};

const getPollInfo = (startText = '') => {
    let resp = startText + `Current poll --> ${poll.name ? poll.name : '[No name yet]'} | ${poll.started ? 'Started' : 'Not started'} |`;
    Object.keys(poll).forEach(element => {
        if (element != 'name' && element != 'started')
            resp += '  ' + element + "=" + poll[element];
    });
    return resp;
}

module.exports = {
    name: 'poll',
    description: 'manage a poll',
    usage: '[vote / command (NAME / START / END)]',
    execute(data, args) {
        let msgObj = null;
        if (!args.length) {
            msgObj = [getPollInfo()];
        } else {
            const command = args.shift().toUpperCase();
            switch (command) {
                case 'NAME': {
                    poll.name = getText(args);
                    msgObj = [`Poll name --> ${poll.name}`];
                    break;
                }
                case 'START': {
                    poll.started = true;
                    msgObj = [`Poll started!!`];
                    break;
                }
                case 'END': {
                    const newPoll = {who: []};
                    poll = newPoll;
                    msgObj = [`Poll ended`];
                    break;
                }
            default:
                if (poll.started) {
                    if (poll.hasOwnProperty(command))
                        poll[command]++;
                    else
                        poll[command] = 1;
                    poll.who = [...poll.who, data.message.author.username];
                    msgObj = [getPollInfo('New vote added - ')];
                } else {
                    msgObj = [`Poll not started yet`];
                }
                break;
            }
        }
        if (msgObj)
            data.message.reply(msgObj, {whispered: false, mentionUser: true}).then()
        console.log(poll);
    },
};
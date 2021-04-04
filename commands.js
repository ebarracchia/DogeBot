const fs = require("fs");

// Get all commands available 
const commandFolders = fs.readdirSync('./commands');
const commands = new Map;
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        commands.set(command.name, command); 
    } 
}

module.exports = { commands };

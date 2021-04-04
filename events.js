const fs = require("fs");

// Get all events available 
const eventFolders = fs.readdirSync('./events');
const events = new Map;
for (const folder of eventFolders) {
    const eventFiles = fs.readdirSync(`./events/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`./events/${folder}/${file}`);
        events.set(event.name, event); 
    } 
}

module.exports = { events };

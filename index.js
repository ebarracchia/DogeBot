require("dotenv").config(); // Get your bot tokens

const fs = require("fs");
const { Client, EVENT } = require("dogehouse.js");
const { defaultRoom, botName, prefix, ROOM_EVENTS } = require('./config.json');
const getByValue = require('./common/getCommandAliases.js');

const token = process.env.DOGEHOUSE_TOKEN;
const refreshToken = process.env.DOGEHOUSE_REFRESH_TOKEN;

const app = new Client();

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

// Check interval  
let checkInterval = null;
let checkIntervalMinutes = 0;
const checkIntervalHandler = () => {
  clearTimeout(checkInterval);
  checkIntervalMinutes = 0;
  checkInterval = setInterval(() => { 
    checkIntervalMinutes++;
    app.bot.sendMessage(`No activity in a ${checkIntervalMinutes} minute/s ...`); 
  }, 60000);
}

// Connect to dogehouse
app.connect(token, refreshToken).then(async () => {
  console.log("Bot connected.");
  app.rooms.join(defaultRoom); // This will allow you to join a room.
  // Check interval
  checkIntervalHandler();
});

// Defining your message listener
app.on(EVENT.NEW_CHAT_MESSAGE, async (message) => {
  console.log(`${message.author.username}: ${message.content}`); 
  // Check interval
  if (message.author.username != botName)
    checkIntervalHandler();

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = commands.get(commandName) || commands.get(getByValue(commands, commandName));
  const data = {commands: commands, app: app, message: message};

  if (!command) return;

  try {
      command.execute(data, args)
  } catch (e) {
      console.log(e)
  }
});

app.on(EVENT.BOT_JOINED_ROOM, async ({room}) => {
  console.log("EVENT.BOT_JOINED_ROOM");
  console.log(room);
  if (room) {
    console.log({Room: room.name, VoiceServer: room.voiceServer})
    app.bot.sendMessage(`Connected to Room: ${room.name}`); 
  }
}); 

// Sending message outside of a Chat event
app.on(EVENT.USER_JOINED_ROOM, (user) => {
  console.log(`EVENT.USER_JOINED_ROOM- ${user.username}`);
  const publicWelcomeMessage = [{ mention: user.username }, " has joined the room!"];
  const privateWelcomeMessage = ["Welcome to the room ", { mention: user.username }, " I hope you enjoy your stay."];

  // Send Public Message
  if (ROOM_EVENTS.PUBLIC_WELCOME)
    app.bot.sendMessage(publicWelcomeMessage);

  // Send Private Message
  if (ROOM_EVENTS.PRIVATE_WELCOME)
    user.whisper(privateWelcomeMessage);

  // Check interval
  checkIntervalHandler();
});
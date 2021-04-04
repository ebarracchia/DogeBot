require("dotenv").config(); // Get your bot tokens

const fs = require("fs");
const { Client, EVENT } = require("dogehouse.js");
const { defaultRoom, prefix } = require('./config.json');
const getByValue = require('./common/getCommandAliases.js');

// Handlers
const { commands } = require('./commands.js');
const { events } = require('./events.js');

// Connect to dogehouse
const token = process.env.DOGEHOUSE_TOKEN;
const refreshToken = process.env.DOGEHOUSE_REFRESH_TOKEN;
const app = new Client();
app.connect(token, refreshToken).then(async () => {
  console.log("Bot connected.");
  app.rooms.join(defaultRoom); // This will allow you to join a room.
});

// Defining your message listener
app.on(EVENT.NEW_CHAT_MESSAGE, async (message) => {
  console.log(`${message.author.username}: ${message.content}`); 
 
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift();

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
  if (room) {
    console.log({Room: room.name, VoiceServer: room.voiceServer})
    app.bot.sendMessage(`Connected to Room: ${room.name}`); 
  }
}); 

// Sending message outside of a Chat event
app.on(EVENT.USER_JOINED_ROOM, (user) => {
  console.log(`EVENT.USER_JOINED_ROOM- ${user.username}`);

  const data = {events: events, app: app, user: user};

  events.forEach(event => {
    try {
      if (event.event == 'EVENT.USER_JOINED_ROOM')
        event.execute(data)
    } catch (e) {
      console.log(e)
    }
  });
});
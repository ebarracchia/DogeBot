/**
 * Interacting with chat
 *
 * In this example, you will learn how to listen for messages, send messages,
 * reply to messages, whisper users, and use special objects such as emoji's
 * or user mentions
 */

require("dotenv").config(); // Get your bot tokens

const fs = require("fs");
const { Client, EVENT } = require("dogehouse.js");
const { defaultRoom, botName, prefix, ROOM_EVENTS } = require('./config.json');
const getByValue = require('./common/getCommandAliases.js');

const token = process.env.DOGEHOUSE_TOKEN;
const refreshToken = process.env.DOGEHOUSE_REFRESH_TOKEN;

const app = new Client();

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

/**
 * Connect to dogehouse
 *
 * This will connect this client application to the dogehouse api. If you do not
 * do this, the bot will not work.
 */
app.connect(token, refreshToken).then(async () => {
  console.log("Bot connected.");
  app.rooms.join(defaultRoom); // This will allow you to join a room.
  // Check interval
  checkIntervalHandler();
});

/**
 * Defining your message listener
 *
 * This will begin listening for new messages sent in the chat of the room that the bot
 * is currently in.  Once a message has been sent, it will return a message controller, which
 * will allow you to easily manage your message.
 *
 * The message controller will allow you to do things such as deleting, replying to, and getting
 * the author to name a few.
 */
app.on(EVENT.NEW_CHAT_MESSAGE, async (message) => {
  console.log(`${message.author.username}: ${message.content}`); 
  // Check interval
  if (message.author.username != botName)
    checkIntervalHandler();

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const text = message.content.split(commandName).pop();        

  const command = commands.get(commandName) || commands.get(getByValue(commands, commandName));
  const data = {commands: commands, app: app, message: message};

  if (!command) return;

  try {
      command.execute(data, text, args)
  } catch (e) {
      console.log(e)
  }
});

app.on(EVENT.BOT_JOINED_ROOM, async ({room}) => {
  console.log("EVENT.BOT_JOINED_ROOM");
  console.log({Room: room.name, VoiceServer: room.voiceServer})
}); 

/**
 * Sending message outside of a Chat event
 *
 * This willshow you how you can send a message to a user or in the chat without having to listen
 * for another message.  You will learn how to send a message by itself, you will learn how to
 * send a messge to a specific user as well as whisper a specific user.
 */
app.on(EVENT.USER_JOINED_ROOM, (user) => {
  console.log(`EVENT.USER_JOINED_ROOM- ${user.username}`);
  const publicWelcomeMessage = [
    { mention: user.username },
    " has joined the room!",
  ];
  const privateWelcomeMessage = [
    "Welcome to the room ",
    { mention: user.username },
    " I hope you enjoy your stay.",
  ];

  /**
   * Send Public Message
   * This will send a plain message as the bot.
   */
   if (ROOM_EVENTS.PUBLIC_WELCOME)
    app.bot.sendMessage(publicWelcomeMessage);

  /**
   * Send Private Message
   * This will send a private message to the user that joined the room.
   */
  if (ROOM_EVENTS.PRIVATE_WELCOME)
    user.whisper(privateWelcomeMessage);

  // Check interval
  checkIntervalHandler();
});

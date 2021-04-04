const ROOM_EVENTS = {
    "PUBLIC_WELCOME": false, 
    "PRIVATE_WELCOME": false
}

module.exports = {
    name: 'welcome',
    event: 'EVENT.USER_JOINED_ROOM',
    description: 'give welcome',
    async execute(data) {
        const { user } = data; 
        const publicWelcomeMessage = [{ mention: user.username }, " has joined the room!"];
        const privateWelcomeMessage = ["Welcome to the room ", { mention: user.username }, " I hope you enjoy your stay, to see my commands type: !help"];
      
        // Send Public Message
        if (ROOM_EVENTS.PUBLIC_WELCOME)
          app.bot.sendMessage(publicWelcomeMessage);
      
        // Send Private Message
        if (ROOM_EVENTS.PRIVATE_WELCOME)
          user.whisper(privateWelcomeMessage);
      
    }
};
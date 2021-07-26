const { Intents } = require('discord.js');
const { Petal } = require('../dist');

new Petal({
    token: '-- bot token here --',
    module_location: require('path').join(__dirname, 'modules'),
    database_location: require('path').join(__dirname, 'petal.sqlite'),
    intents: new Intents([
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_MESSAGES',
        'GUILD_INVITES',
        'GUILD_MESSAGE_REACTIONS',
    ])
})
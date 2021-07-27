const { Intents, ReplyMessageOptions, MessageEmbed } = require('discord.js');
const { Petal } = require('../dist');

/**
 * Handles errors with ** style **
 * @param {Petal} petal Petal instance
 * @param {string} message Error message
 * @returns {ReplyMessageOptions}
 */
const custom_error_handler = (petal, message) => {

    return {

        embeds: [

            new MessageEmbed()
                .setColor('#7289da')
                .setTitle(`Uh oh!!`)
                .setDescription(message)

        ]

    }

}

new Petal({
    token: '-- bot token here --',
    module_location: require('path').join(__dirname, 'modules'),
    database_location: require('path').join(__dirname, 'petal.sqlite'),
    error_handler: custom_error_handler,
    intents: new Intents([
        'GUILDS',
        'GUILD_MEMBERS',
        'GUILD_MESSAGES',
        'GUILD_INVITES',
        'GUILD_MESSAGE_REACTIONS',
    ])
})
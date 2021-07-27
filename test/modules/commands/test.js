const { MessageEmbed, MessageActionRow, Message, GuildMember, Interaction, CommandInteraction } = require('discord.js');
const { PetalCommand, PetalButton, Petal } = require('../../../dist');
const { Store } = require('../../../dist/classes/PetalStorage');

const test = new PetalCommand({
    arguments: [
        {
            name: 'Member',
            type: 'member',
            message: 'Please provide a valid member',
            required: true
        }
    ]
})


/**
 * Example petal command
 * @param {Petal} petal Petal instance 
 * @param {Array} args Array of arguments, in this case containing a member
 * @param {Message|CommandInteraction} message Message object
 * @param {Store} user User specific storage 
 * @param {Store} server Server specific storage 
 * @returns 
 */
test.run = (petal, args, message, user, server) => new Promise((resolve, reject) => {
    
    // Member is optional
    if (args[0]) {

        // Member
        const member = args[0];

        // Should never be needed
        if ((!member instanceof GuildMember)) throw new Error("Member not required type.");

        // Log data
        console.log(`User provided: ${member.user.username}.`);

    }

    /**
     * Deletes the message on delete button pressed
     * @param {Interaction} interaction Interaction data
     */
    const delete_handler = (interaction) => {
        interaction.message.delete();
    }

    // Resolving in [Embed, ActionRow[]] mixed format.
    resolve([

        // Embed
        new MessageEmbed()
            .setColor('#7289da') // Blurple supremacy
            .setTitle('Welcome to petal!')
            .setThumbnail(petal.client.user.displayAvatarURL())
            .setDescription('Petal is a new [Discord.js](https://discord.js.org) framework!\nClick the button below to visit Petal\'s GitHub.'),

        // Array of Action Rows (Max 5)
        [
            new MessageActionRow()
                .addComponents(
                    new PetalButton()
                        .setLabel('Learn more about petal!')
                        .setEmoji('🌻')
                        .setURL('https://github.com/tascord/petal')
                        .compile()
                )
                .addComponents(
                    new PetalButton()
                        .setLabel('Delete message')
                        .setStyle('red')
                        .setIndividual(message.author)
                        .setHandler(petal, delete_handler)
                        .compile()
                )
                .addComponents(
                    new PetalButton()
                        .setStyle('green')
                        .setIndividual(message.author)
                        .setSingle(true)
                        .setLabel('Click me!')
                        .setHandler(petal, (interaction) => {
                            interaction.reply('Try click that button again! Nothing should happen!', {
                                ephemeral: true,
                            });
                        })
                        .compile()
                )
        ]
    ]);

});

module.exports = test;
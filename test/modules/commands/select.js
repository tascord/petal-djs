const { MessageEmbed, MessageActionRow, Message, GuildMember, Interaction, CommandInteraction, SelectMenuInteraction } = require('discord.js');
const { PetalCommand, PetalSelect, Petal } = require('../../../dist');
const { Store } = require('../../../dist/classes/PetalStorage');

const test = new PetalCommand({});

/**
 * Example petal command
 * @param {Petal} petal Petal instance 
 * @param {Array<never>} args Array of arguments, in this case containing a member
 * @param {Message|CommandInteraction} message Message object
 * @param {Store} user User specific storage 
 * @param {Store} server Server specific storage 
 * @returns 
 */
test.run = (petal, args, message, user, server) => new Promise((resolve, reject) => {

    /**
     * Select menu handler
     * @param {SelectMenuInteraction} interaction Interaction event 
     */
    const handler = (interaction) => {

        interaction.deferUpdate();
        console.log('Selected values: ' + interaction.values);

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
                    new PetalSelect()
                        .setHandler(petal, handler)
                        .addOption({ label: 'Gunk', description: 'Bunk gunk', default: true, value: 'op_gunk'})
                        .addOption({ label: 'Munk', description: 'Bunk Munk', default: false, value: 'op_munk'})
                        .compile()
                )
        ]
    ]);

});

module.exports = test;
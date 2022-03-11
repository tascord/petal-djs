const { MessageEmbed, Message, CommandInteraction, Role } = require('discord.js');
const { PetalCommand, Petal } = require('../../../dist');
const { Store } = require('../../../dist/classes/PetalStorage');

const role = new PetalCommand({
    arguments: [
        {
            name: 'Selection',
            description: 'Select an option',
            type: 'string',
            required: true,
            list: [
                { name: 'Gunk', value: 'gunk'},
                { name: 'Funk', value: 'funk'},
                { name: 'Spunk', value: 'spunk'},
            ]
        }
    ]
})

/**
 * Example petal command
 * @param {Petal} petal Petal instance 
 * @param {Array<string>} args Array of arguments, in this case containing a member
 * @param {Message|CommandInteraction} message Message object
 * @param {Store} user User specific storage 
 * @param {Store} server Server specific storage 
 * @returns 
 */
role.run = (petal, args) => new Promise((resolve) => {

    const choice = args.shift();

    // Resolving in [Embed, ActionRow[]] mixed format.
    resolve(

        // Embed
        new MessageEmbed()
            .setColor('#7289da') // Blurple supremacy
            .setTitle('Welcome to petal!')
            .setThumbnail(petal.client.user.displayAvatarURL())
            .setDescription(`Thank you for selecting ${choice.toString()}`)

    );

});

module.exports = role;
const { MessageEmbed, MessageActionRow, Message, GuildMember, Interaction, CommandInteraction } = require('discord.js');
const { PetalCommand, PetalButton, Petal } = require('../../../dist');
const { Store } = require('../../../dist/classes/PetalStorage');

const selection = new PetalCommand({
    arguments: [
        {
            name: 'Selection',
            type: 'string',
            message: 'Please provide a valid selection',
            required: true,
            list: [

                {
                    name: 'Gunk Bunk',
                    value: 'gunk'
                },
                {
                    name: 'Gunk Funk',
                    value: 'funk'
                },
                {
                    name: 'Gunk Munk',
                    value: 'munk'
                },
                {
                    name: 'Gunk Skunk',
                    value: 'skunk'
                },
                

            ]
        }
    ]
})


/**
 * Example petal command
 * @param {Petal} petal Petal instance 
 * @param {Array<String>} args Array of arguments, in this case containing a member
 * @param {Message|CommandInteraction} message Message object
 * @param {Store} user User specific storage 
 * @param {Store} server Server specific storage 
 * @returns 
 */
selection.run = (petal, args, message, user, server) => new Promise((resolve, reject) => {
    
    const selection = args.shift();

    resolve(

        // Embed
        new MessageEmbed()
            .setColor('#7289da') // Blurple supremacy
            .setTitle('Welcome to petal!')
            .setThumbnail(petal.client.user.displayAvatarURL())
            .setDescription(`You selected '${selection}' as an argument!`),

    );

});

module.exports = selection;
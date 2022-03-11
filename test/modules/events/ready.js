const { PetalEvent, Petal } = require('../../../dist');

const ready = new PetalEvent();

/**
 * Petal ready event
 * @param {Petal} petal 
 */
ready.run = (petal) => {

    console.log(`Petal instance logged in: ${petal.client.user.tag}.`);

    // Deploy to test server
    petal.client.guilds.fetch('920506765500645426')
        .then(guild => {

            petal.deploy_commands(guild);

        });

}

module.exports = ready;
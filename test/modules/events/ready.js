const { PetalEvent } = require('../../../dist');

const ready = new PetalEvent();
ready.run = (petal) => {

    console.log(`Petal instance logged in: ${petal.client.user.tag}.`);

}

module.exports = ready;
const { PetalEvent } = require('../../../dist');

const message = new PetalEvent();
message.run = (petal, message) => {

    petal.handle_command(message, 'p.');

}

module.exports = message;
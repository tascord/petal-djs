const { Petal } = require('../dist');

new Petal({
    token: 'your token here!',
    module_location: require('path').join(__dirname, 'modules'),
    database_location: require('path').join(__dirname, 'petal.sqlite')
})
const { Petal } = require('../dist');

new Petal({
    token: 'ODQ4NzY4NDg0Njg1OTA1OTUw.YLRbQA.6q4YlDeXDFMJQXv2ouNdl71yZYI',
    module_location: require('path').join(__dirname, 'modules'),
    database_location: require('path').join(__dirname, 'petal.sqlite')
})
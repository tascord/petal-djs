const { Petal } = require('../dist');

new Petal({
    token: 'NzMwOTY0OTY5NDk5MTMxOTk1.XwfKLQ.irE8p4QPU33HK7RFWpTDZ_Pt7ZQ',
    module_location: require('path').join(__dirname, 'modules'),
    database_location: require('path').join(__dirname, 'petal.sqlite')
})
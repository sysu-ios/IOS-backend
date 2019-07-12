var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.ios;

ds.automigrate('Subscribe', function (err) {
    if (err) throw err;

    var accounts = [
        {
            first: 'test',
            second: 'test'
        }
    ];
    var count = accounts.length;
    accounts.forEach(function (account) {
        app.models.Subscribe.create(account, function (err, model) {
            if (err) throw err;

            console.log('Created:', model);

            count--;
            if (count === 0)
                ds.disconnect();
        });
    });
});


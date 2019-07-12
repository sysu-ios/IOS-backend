var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.ios;

ds.automigrate('Account', function (err) {
    if (err) throw err;

    var accounts = [
        {
            UserName: 'test',
            Password: 'test',
            UserIcon: 'test',
            PhoneNumber: 'test',
            Email: 'test',
            Introduction: 'test',
            Sex: 'man',
            Birthday: '1997-08-07',
            Region: 'guangdong',
            PostNum: 1,
            PraiseNum: 2,
            Attention: 0,
            FanNum: 4,
            createdAt: new Date(),
            lastModifiedAt: new Date()
        }
    ];
    var count = accounts.length;
    accounts.forEach(function (account) {
        app.models.Account.create(account, function (err, model) {
            if (err) throw err;

            console.log('Created:', model);

            count--;
            if (count === 0)
                ds.disconnect();
        });
    });
});

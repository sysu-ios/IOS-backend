var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.ios;

ds.automigrate('Account', function (err) {
    if (err) throw err;

    var accounts = [
        {
            UserName: 'test1',
            Password: 'test1',
            UserIcon: '',
            PhoneNumber: '17620124723',
            Email: '1299927852@qq.com',
            Introduction: 'test1',
            Sex: 'man',
            Birthday: '1997-08-07',
            Region: 'guangdong',
            PostNum: 1,
            PraiseNum: 2,
            Attention: 0,
            FanNum: 4,
            createdAt: new Date(),
            lastModifiedAt: new Date()
        },
        {
            UserName: 'test2',
            Password: 'test2',
            UserIcon: '',
            PhoneNumber: '17620124724',
            Email: '1299927852@qq.com',
            Introduction: 'test2',
            Sex: 'woman',
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

ds.automigrate('News', function (err) {
    if (err) throw err;

    var accounts = [
        {
            PhoneNumber: '17620124723',
            Picture: [1],
            Content: '',
            PraiseNum: 2,
            ShareNum: 2,
            CommentNum: 3,
            createdAt: new Date(),
            lastModifiedAt: new Date()
        }
    ];
    var count = accounts.length;
    accounts.forEach(function (account) {
        app.models.News.create(account, function (err, model) {
            if (err) throw err;
            console.log('Created:', model);
            count--;
            if (count === 0)
                ds.disconnect();
        });
    });
});

ds.automigrate('Subscribe', function (err) {
    if (err) throw err;

    var accounts = [
        {
            first: '17620124723',
            second: '17620124724'
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

ds.automigrate('StorageFile', function (err) {
    if (err) throw err;

    var accounts = [
        {
            "type": "string",
            "name": "string",
            "url": "string"
        }
    ];
    var count = accounts.length;
    accounts.forEach(function (account) {
        app.models.StorageFile.create(account, function (err, model) {
            if (err) throw err;

            console.log('Created:', model);

            count--;
            if (count === 0)
                ds.disconnect();
        });
    });
});

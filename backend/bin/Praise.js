var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.ios;

ds.automigrate('Praise', function (err) {
    if (err) throw err;

    var accounts = [
        {
            ArticleId: 0,
            CommentId: 1,
            UserPhone: '17620124723',
            createdAt: new Date(),
            lastModifiedAt: new Date()
        }
    ];
    var count = accounts.length;
    accounts.forEach(function (account) {
        app.models.Praise.create(account, function (err, model) {
            if (err) throw err;
            console.log('Created:', model);
            count--;
            if (count === 0)
                ds.disconnect();
        });
    });
});

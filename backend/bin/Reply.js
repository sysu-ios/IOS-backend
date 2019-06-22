var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.ios;

ds.automigrate('Reply', function (err) {
    if (err) throw err;

    var accounts = [
        {
            CommentId: 1,
            UserPhone: '17620124723',
            Content: '',
            ReplyNum: 0,
            createdAt: new Date(),
            lastModifiedAt: new Date()
        }
    ];
    var count = accounts.length;
    accounts.forEach(function (account) {
        app.models.Reply.create(account, function (err, model) {
            if (err) throw err;
            console.log('Created:', model);
            count--;
            if (count === 0)
                ds.disconnect();
        });
    });
});

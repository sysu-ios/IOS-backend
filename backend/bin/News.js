var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.ios;

ds.automigrate('News', function (err) {
    if (err) throw err;

    var accounts = [
        {
            PhoneNumber: '17620124723',
            Picture: ['/api/containers/common/download/snipaste_2019-06-04_14-18-031560957756108.png'],
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


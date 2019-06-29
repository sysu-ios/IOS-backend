var path = require('path');

var app = require(path.resolve(__dirname, '../../server/server'));
var ds = app.datasources.ios;
module.exports = function (News) {
    News.observe('before save', function (ctx, next) {
        var now = new Date();
        if (ctx.isNewInstance) {
            ctx.instance.createdAt = now;
            ctx.instance.lastModifiedAt = now;
        } else {
            ctx.data.lastModifiedAt = new Date();
        }
        next();
    });
    News.post = function (data, cb) {
        console.info(data.PhoneNumber);
        News.create(data, function (err, instance) {
            var res = {
                code: 201,
                message: 'success',
                articleId: instance.id
            };
            console.info(instance);
            cb(null, res);
        });
    };
    News.delete = function (id, cb) {
        console.info(id);
        News.find({ where: { id: id } }, function (err, instance) {
            if (instance.length == 0) {
                var res = {
                    code: 200,
                    message: 'fail',
                    error: 'no subscribe'
                };
                cb(null, res);
            }
            else {
                News.destroyById(id, function (err) {
                    var res = {
                        code: 200,
                        message: 'success'
                    };
                    cb(null, res);
                });
            }
        });

    };
    News.getRecommendList = function (phone, cb) {
        console.info(phone);
        var Subscribe = app.models.Subscribe;
        var Account = app.models.Account;
        Subscribe.find({ where: { first: phone } }, function (err, instance) {
            if (instance.length == 0) {
                var res = {
                    code: 200,
                    message: 'fail',
                    error: 'no subscribe'
                };
                cb(null, res);
            }
            else {
                var resPhone = new Array();
                console.info(instance.length)
                for (var i = 0; i < instance.length; i++) {
                    console.info(instance[i].second)
                    resPhone[i] = instance[i].second;
                }
                Account.find({ where: { PhoneNumber: { "inq": resPhone } } }, function (err, instance1) {
                    if (instance1.length == 0) {
                        var res = {
                            code: 200,
                            message: 'fail',
                            error: 'no account'
                        };
                        cb(null, res);
                    }

                    else {

                        News.find({ where: { PhoneNumber: { "inq": resPhone } },order: "createdAt desc" }, function (err, instance2) {
                            if (instance2.length == 0) {
                                var res = {
                                    code: 200,
                                    message: 'fail',
                                    error: 'no news'
                                };
                                cb(null, res);
                            }
                            else {
                                var objs = [];
                                instance2.forEach(function (item) {
                                    var UserName = '';
                                    var UserIcon = '';
                                    console.info(item.PhoneNumber);
                                    for (var i = 0; i < instance1.length; i++) {
                                        if (instance1[i].PhoneNumber == item.PhoneNumber) {
                                            UserName = instance1[i].UserName;
                                            UserIcon = instance1[i].UserIcon;
                                            break;
                                        }
                                    }
                                    console.info(UserName);
                                    objs.push({
                                        id: item.id,
                                        UserName: UserName,
                                        UserIcon: UserIcon,
                                        Content: item.Content,
                                        Picture: item.Picture,
                                        createdAt: item.createdAt,
                                        CommentNum: item.CommentNum,
                                        ShareNum: item.ShareNum,
                                        PraiseNum: item.PraiseNum
                                    });
                                });
                                var res = {
                                    code: 200,
                                    message: 'success',
                                    data: objs
                                };
                                cb(null, res);
                            }
                        });
                    }
                });
                console.info(resPhone);


            }
        });

    };
    News.getMyNewsList = function (phone, cb) {
        console.info(phone);
        var Account = app.models.Account;
        Account.find({ where: { PhoneNumber: phone } }, function (err, instance1) {
            if (instance1.length == 0) {
                var res = {
                    code: 200,
                    message: 'fail',
                    error: 'no account'
                };
                cb(null, res);
            }

            else {
                News.find({ where: { PhoneNumber: phone },order: "createdAt desc" }, function (err, instance2) {
                    if (instance2.length == 0) {
                        var res = {
                            code: 200,
                            message: 'fail',
                            error: 'no news'
                        };
                        cb(null, res);
                    }
                    else {
                        var objs = [];
                        instance2.forEach(function (item) {
                            var UserName = '';
                            var UserIcon = '';
                            console.info(item.PhoneNumber);
                            for (var i = 0; i < instance1.length; i++) {
                                if (instance1[i].PhoneNumber == item.PhoneNumber) {
                                    UserName = instance1[i].UserName;
                                    UserIcon = instance1[i].UserIcon;
                                    break;
                                }
                            }
                            console.info(UserName);
                            objs.push({
                                id: item.id,
                                UserName: UserName,
                                UserIcon: UserIcon,
                                Content: item.Content,
                                Picture: item.Picture,
                                createdAt: item.createdAt,
                                CommentNum: item.CommentNum,
                                ShareNum: item.ShareNum,
                                PraiseNum: item.PraiseNum
                            });
                        });
                        var res = {
                            code: 200,
                            message: 'success',
                            data: objs
                        };
                        cb(null, res);
                    }
                });
            }
        });

    };

    News.remoteMethod('post',
        {
            http: { path: '/post', verb: 'post' },
            accepts: { arg: 'data', type: 'object', required: true, http: { source: 'body' } },
            returns: { arg: 'response', type: 'object' }
        });
    News.remoteMethod('getRecommendList',
        {
            http: { path: '/getRecommendList', verb: 'get' },
            accepts: { arg: 'phone', type: 'string', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
    News.remoteMethod('getMyNewsList',
        {
            http: { path: '/getMyNewsList', verb: 'get' },
            accepts: { arg: 'phone', type: 'string', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
    News.remoteMethod('delete',
        {
            http: { path: '/delete', verb: 'delete' },
            accepts: { arg: 'id', type: 'number', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
};

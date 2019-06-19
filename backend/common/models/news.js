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
                message: 'success'
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
                News.destroyById(id,function (err) {
                    var res = {
                        code: 200,
                        message: 'success'
                    };
                    cb(null, res);
                });
            }
        });
        
    };
    News.getRecommend = function (phone, cb) {
        console.info(phone);
        var Subscribe = app.models.Subscribe;
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
                console.info(resPhone);
                News.find({ where: { PhoneNumber: { "inq": resPhone } } }, function (err, instance) {
                    if (instance.length == 0) {
                        var res = {
                            code: 200,
                            message: 'fail',
                            error: 'no news'
                        };
                        cb(null, res);
                    }
                    else {
                        var res = {
                            code: 200,
                            message: 'success',
                            data: instance
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
    News.remoteMethod('getRecommend',
        {
            http: { path: '/getRecommend', verb: 'get' },
            accepts: { arg: 'phone', type: 'string', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
    News.remoteMethod('delete',
        {
            http: { path: '/delete', verb: 'get' },
            accepts: { arg: 'id', type: 'number', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
};

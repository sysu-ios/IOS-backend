var path = require('path');

var app = require(path.resolve(__dirname, '../../server/server'));
var ds = app.datasources.ios;
module.exports = function (Praise) {
    Praise.observe('before save', function (ctx, next) {
        var now = new Date();
        if (ctx.isNewInstance) {
            ctx.instance.createdAt = now;
            ctx.instance.lastModifiedAt = now;
        } else {
            ctx.data.lastModifiedAt = new Date();
        }
        next();
    });

    //点赞
    Praise.post = function (data, cb) {
        Praise.create(data, function (err, instance) {
            var res = {
                code: 201,
                message: 'success',
                PraiseId: instance.id
            };
            console.info(instance);
            cb(null, res);
        });
    };
    //获取某个文章或评论的全部点赞
    Praise.getPraiseList = function (data, cb) {
        console.info(data.CommentId);
        if (data.ArticleId != 0) {
            Praise.find({ where: { ArticleId: data.ArticleId } }, function (err, instance) {
                if (instance.length == 0) {
                    var res = {
                        code: 200,
                        message: 'warning',
                        error: 'no Praise'
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
        else if(data.CommentId != 0) {
            
            Praise.find({ where: { CommentId: data.CommentId } }, function (err, instance) {
                if (instance.length == 0) {
                    var res = {
                        code: 200,
                        message: 'warning',
                        error: 'no Praise'
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
        
    };
    //获取我的点赞
    Praise.getMyPraiseList = function (phone, cb) {
        Praise.find({ where: { UserPhone: phone } }, function (err, instance) {
            if (instance.length == 0) {
                var res = {
                    code: 200,
                    message: 'warning',
                    error: 'no Praise'
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
    };
    //删除某个点赞
    Praise.delete = function (id, cb) {
        Praise.destroyAll({ id: id }, function (err, info) {
            if (err) {
                return cb(null, {
                    code: 200,
                    message: 'fail',
                    error: err.message
                });
            }
            cb(null, {
                code: 200,
                message: 'success',
                count: info.count
            });
        });
    };


    Praise.remoteMethod('post',
        {
            http: { path: '/post', verb: 'post' },
            accepts: { arg: 'data', type: 'object', required: true, http: { source: 'body' } },
            returns: { arg: 'response', type: 'object' }
        });
    Praise.remoteMethod('getPraiseList',
        {
            http: { path: '/getPraiseList', verb: 'post' },
            accepts: { arg: 'data', type: 'object', required: true, http: { source: 'body' } },
            returns: { arg: 'response', type: 'object' }
        });
    Praise.remoteMethod('getMyPraiseList',
        {
            http: { path: '/getMyPraiseList', verb: 'get' },
            accepts: { arg: 'phone', type: 'string', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
    Praise.remoteMethod('delete',
        {
            http: { path: '/delete', verb: 'delete' },
            accepts: { arg: 'id', type: 'number', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
};

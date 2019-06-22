var path = require('path');

var app = require(path.resolve(__dirname, '../../server/server'));
var ds = app.datasources.ios;
module.exports = function (Reply) {
    Reply.observe('before save', function (ctx, next) {
        var now = new Date();
        if (ctx.isNewInstance) {
            ctx.instance.createdAt = now;
            ctx.instance.lastModifiedAt = now;
        } else {
            ctx.data.lastModifiedAt = new Date();
        }
        next();
    });

    //回复评论
    Reply.post = function (data, cb) {
        Reply.create(data, function (err, instance) {
            var res = {
                code: 201,
                message: 'success',
                ReplyId: instance.id
            };
            console.info(instance);
            cb(null, res);
        });
    };
    //获取某个评论的全部回复
    Reply.getReplyList = function (CommentId, cb) {
        Reply.find({ where: { CommentId: CommentId } }, function (err, instance) {
            if (instance.length == 0) {
                var res = {
                    code: 200,
                    message: 'warning',
                    error: 'no Reply'
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
    //获取用户发表的回复
    Reply.getMyReplyList = function (phone, cb) {
        Reply.find({ where: { UserPhone: phone } }, function (err, instance) {
            if (instance.length == 0) {
                var res = {
                    code: 200,
                    message: 'warning',
                    error: 'no Reply'
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
    //删除某个回复
    Reply.delete = function(id, cb) {
        Reply.destroyAll({ id: id }, function (err, info) {
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
                error: info.count
            });
          });
    };

    Reply.remoteMethod('post',
        {
            http: { path: '/post', verb: 'post' },
            accepts: { arg: 'data', type: 'object', required: true, http: { source: 'body' } },
            returns: { arg: 'response', type: 'object' }
        });
    Reply.remoteMethod('getReplyList',
        {
            http: { path: '/getReplyList', verb: 'get' },
            accepts: { arg: 'CommentId', type: 'number', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
    Reply.remoteMethod('getMyReplyList',
        {
            http: { path: '/getMyReplyList', verb: 'get' },
            accepts: { arg: 'phone', type: 'string', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
    Reply.remoteMethod('delete',
        {
            http: { path: '/delete', verb: 'get' },
            accepts: { arg: 'id', type: 'number', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
};

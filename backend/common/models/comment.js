var path = require('path');

var app = require(path.resolve(__dirname, '../../server/server'));
var ds = app.datasources.ios;
module.exports = function (Comment) {
    Comment.observe('before save', function (ctx, next) {
        var now = new Date();
        if (ctx.isNewInstance) {
            ctx.instance.createdAt = now;
            ctx.instance.lastModifiedAt = now;
        } else {
            ctx.data.lastModifiedAt = new Date();
        }
        next();
    });
    //对文章发表评论
    Comment.post = function (data, cb) {
        Comment.create(data, function (err, instance) {
            var res = {
                code: 201,
                message: 'success',
                CommentId: instance.id
            };
            console.info(instance);
            cb(null, res);
        });
    };
    //获取某个文章的全部评论（不包含回复）
    Comment.getCommentList = function (ArticleId, cb) {
        Comment.find({ where: { ArticleId: ArticleId } }, function (err, instance) {
            if (instance.length == 0) {
                var res = {
                    code: 200,
                    message: 'warning',
                    error: 'no comment'
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
    //获取用户发表的评论
    Comment.getMyCommentList = function (phone, cb) {
        Comment.find({ where: { UserPhone: phone } }, function (err, instance) {
            if (instance.length == 0) {
                var res = {
                    code: 200,
                    message: 'warning',
                    error: 'no comment'
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
    //删除某个评论
    Comment.delete = function(id, cb) {
        Comment.destroyAll({ id: id }, function (err, info) {

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

    Comment.remoteMethod('post',
        {
            http: { path: '/post', verb: 'post' },
            accepts: { arg: 'data', type: 'object', required: true, http: { source: 'body' } },
            returns: { arg: 'response', type: 'object' }
        });
    Comment.remoteMethod('getCommentList',
        {
            http: { path: '/getCommentList', verb: 'get' },
            accepts: { arg: 'ArticleId', type: 'number', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
    Comment.remoteMethod('getMyCommentList',
        {
            http: { path: '/getMyCommentList', verb: 'get' },
            accepts: { arg: 'phone', type: 'string', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
    Comment.remoteMethod('delete',
        {
            http: { path: '/delete', verb: 'get' },
            accepts: { arg: 'id', type: 'number', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
};

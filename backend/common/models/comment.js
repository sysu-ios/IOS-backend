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
        console.info(data.PhoneNumber);
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
        Comment.find
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

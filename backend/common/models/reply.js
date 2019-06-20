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


    Reply.remoteMethod('post',
        {
            http: { path: '/post', verb: 'post' },
            accepts: { arg: 'data', type: 'object', required: true, http: { source: 'body' } },
            returns: { arg: 'response', type: 'object' }
        });
    Reply.remoteMethod('getReplyList',
        {
            http: { path: '/getReplyList', verb: 'get' },
            accepts: { arg: 'ArticleId', type: 'number', required: true, http: { source: 'query' } },
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

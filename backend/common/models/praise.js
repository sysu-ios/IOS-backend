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


    Praise.remoteMethod('post',
        {
            http: { path: '/post', verb: 'post' },
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
            http: { path: '/delete', verb: 'get' },
            accepts: { arg: 'id', type: 'number', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
};

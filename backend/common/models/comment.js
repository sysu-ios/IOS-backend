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
        var News = app.models.News;
        Comment.create(data, function (err, instance) {
            News.findOne({where: {ArticleId:data.ArticleId}},function(err,instance1){
                if (instance1 == null) {
                    var res = {
                      code: 200,
                      message: 'fail',
                      error: 'no news'
                    };
                    cb(null, res);
                  }
                  
                  else {
                    News.updateAll({ArticleId:data.ArticleId}, { CommentNum: instance1.CommentNum+1 }, function (err, instance2) {});
                    console.info(instance1.CommentNum);
                    var res = {
                        code: 201,
                        message: 'success',
                        CommentId: instance.id
                    };
                    cb(null, res);
                  }
            });
            
        });
    };
    //获取某个文章的全部评论（不包含回复）
    Comment.getCommentList = function (ArticleId, cb) {
        var Account = app.models.Account;
        
        Comment.find({ where: { ArticleId: ArticleId },order: "createdAt desc" }, function (err, instance) {
            if (instance.length == 0) {
                var res = {
                    code: 200,
                    message: 'warning',
                    error: 'no comment'
                };
                cb(null, res);
            }
            else {
                Account.find({ where: {} }, function (err, instance1) {
                    
                    if (instance1.length == 0) {
                        var res = {
                            code: 200,
                            message: 'fail',
                            error: 'no account'
                        };
                        cb(null, res);
                    }
                    else {
                        console.info(instance1.length);  
                        var objs = [];
                        instance.forEach(function (item) {
                            var UserName = '';
                            var UserIcon = '';
                            console.info(item.PhoneNumber);
                            for (var i = 0; i < instance1.length; i++) {
                                if (instance1[i].PhoneNumber == item.UserPhone) {
                                    UserName = instance1[i].UserName;
                                    UserIcon = instance1[i].UserIcon;
                                    console.info(UserName);
                                    break;
                                }
                            }
                            objs.push({
                                id: item.id,
                                ArticleId: item.ArticleId,
                                UserName: UserName,
                                UserIcon: UserIcon,
                                Content: item.Content,
                                ReplyNum: item.ReplyNum,
                                PraiseNum: item.PraiseNum,
                                createdAt: item.createdAt,
                                lastModifiedAt: item.lastModifiedAt
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
    //获取用户发表的评论
    Comment.getMyCommentList = function (phone, cb) {
        Comment.find({ where: { UserPhone: phone } ,order: "createdAt desc"}, function (err, instance) {
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
    Comment.delete = function (id, cb) {
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
                count: info.count
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
            accepts: { arg: 'ArticleId', type: 'string', required: true, http: { source: 'query' } },
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
            http: { path: '/delete', verb: 'delete' },
            accepts: { arg: 'id', type: 'number', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
};

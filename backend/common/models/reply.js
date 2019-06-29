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
        var Comment = app.models.Comment;
        Reply.create(data, function (err, instance) {
            Comment.findOne({where:{id:data.CommentId}},function (err,instance1){
                if (instance1 == null) {
                    var res = {
                      code: 200,
                      message: 'fail',
                      error: 'no comment'
                    };
                    cb(null, res);
                  }
                  else {

                    Comment.updateAll({ id:data.CommentId }, { ReplyNum: instance1.ReplyNum+1 }, function (err, instance1) {});
                    console.info(instance1.ReplyNum);
                    var res = {
                        code: 201,
                        message: 'success',
                        ReplyId: instance.id
                    };
                    cb(null, res);
                  }
            });

        });
    };
    //获取某个评论的全部回复
    Reply.getReplyList = function (CommentId, cb) {
        var Account = app.models.Account;
        Reply.find({ where: { CommentId: CommentId },order: "createdAt desc" }, function (err, instance) {
            if (instance.length == 0) {
                var res = {
                    code: 200,
                    message: 'warning',
                    error: 'no Reply'
                };
                cb(null, res);
            }
            else {
                Account.find(true, function (err, instance1) {
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
                                if (instance1[i].PhoneNumber == item.PhoneNumber) {
                                    UserName = instance1[i].UserName;
                                    UserIcon = instance1[i].UserIcon;
                                    break;
                                }
                            }
                            objs.push({
                                id: item.id,
                                CommentId: item.CommentId,
                                UserName: UserName,
                                UserIcon: UserIcon,
                                Content: item.Content,
                                ReplyNum: item.ReplyNum,
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
    //获取用户发表的回复
    Reply.getMyReplyList = function (phone, cb) {
        Reply.find({ where: { UserPhone: phone },order: "createdAt desc" }, function (err, instance) {
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
        var Comment = app.models.Comment;
        Reply.destroyAll({ id: id }, function (err, info) {
            if (err) {
                return cb(null, {
                    code: 200,
                    message: 'fail',
                    error: err.message
                });
            }
            else {
                Reply.findOne({ id: id }, function (err, instance) {
                    if (instance == null) {
                        var res = {
                          code: 200,
                          message: 'fail',
                          error: 'no reply'
                        };
                        cb(null, res);
                      }
                      else {
                        Comment.findOne({where:{id:instance.CommentId}},function (err,instance1){
                            if (instance1 == null) {
                                var res = {
                                  code: 200,
                                  message: 'fail',
                                  error: 'no comment'
                                };
                                cb(null, res);
                              }
                              else {
                                Comment.updateAll({ id:instance.CommentId }, { ReplyNum: instance1.ReplyNum-1 }, function (err, instance1) {});
                                
                                cb(null, {
                                    code: 200,
                                    message: 'success',
                                    count: info.count
                                });
                              }
                        });
                      }
                });      
            }
           
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
            http: { path: '/delete', verb: 'delete' },
            accepts: { arg: 'id', type: 'number', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
};

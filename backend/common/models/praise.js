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

    //点赞或取消点赞
    Praise.post = function (data, cb) { 
               
        if (data.ArticleId == "") {//对评论点赞
            Praise.find({where: { and: [{ UserPhone: data.UserPhone}, {CommentId: data.CommentId }]}}, function(err, instance) {
                console.info(instance);
                if (instance.length == 0) {//对评论点赞
                    var Comment = app.models.Comment;
                    Comment.findOne({ where: { id: data.CommentId } }, function (err, instance2) {
                        if (instance2 != null) {
                            Comment.updateAll({ id: data.CommentId }, { PraiseNum: instance2.PraiseNum + 1 }, function (err, instance3) {
                                Praise.create(data, function (err, instance1) {
                                    var res = {
                                        code: 201,
                                        message: 'success',
                                        PraiseId: instance1.id
                                    };
                                    cb(null, res);
                                });   
                            });
                        }
                        else {
                            return cb(null, {
                                code: 200,
                                message: 'fail',
                                error: "no comment"
                            });
                        }
                    });
                    
                }
                else {//取消评论点赞
                    Praise.destroyAll({ id: instance[0].id }, function (err, info) {
                        if (err) {
                            return cb(null, {
                                code: 200,
                                message: 'fail',
                                error: err.message
                            });
                        }
                    
                        var Comment = app.models.Comment;
                        Comment.findOne({ where: { id: data.CommentId } }, function (err, instance2) {
                            if (instance2 != null) {
                                Comment.updateAll({ id: data.CommentId }, { PraiseNum: instance2.PraiseNum - 1 }, function (err, instance3) {
                                    cb(null, {
                                        code: 200,
                                        message: 'success',
                                        count: info.count
                                    });
                                });
                            }
                            else {
                                return cb(null, {
                                    code: 200,
                                    message: 'fail',
                                    error: "no comment"
                                });
                            }
                        });
                    
                    });
                }
            });
        } 
        else {
            Praise.find({where: { and: [{ UserPhone: data.UserPhone}, {ArticleId: data.ArticleId }]}}, function(err, instance) {
                console.info(instance);
                if (instance.length == 0) {//对wenzhang点赞
                    var News = app.models.News;
                    console.info(data);
                    News.findOne({ where: { ArticleId: data.ArticleId } }, function (err, instance2) {
                        if (instance2 != null) {
                            News.updateAll({ ArticleId: data.ArticleId }, { PraiseNum: instance2.PraiseNum + 1 }, function (err, instance3) {
                                Praise.create(data, function (err, instance1) {
                                    var res = {
                                        code: 201,
                                        message: 'success',
                                        PraiseId: instance1.id
                                    };
                                    cb(null, res);
                                });
                                
                            });
                        }
                        else {
                            return cb(null, {
                                code: 200,
                                message: 'fail',
                                error: "no news"
                            });
                        }
                    });
                    
                }
                else {//取消wenzhang点赞
                    Praise.destroyAll({ id: instance[0].id }, function (err, info) {
                        if (err) {
                            return cb(null, {
                                code: 200,
                                message: 'fail',
                                error: err.message
                            });
                        }
                        var News = app.models.News;
                        var ArticleId1 = parseInt(data.ArticleId);
                        News.findOne({ where: { ArticleId: data.ArticleId } }, function (err, instance2) {
                            if (instance2 != null) {
                                News.updateAll({ ArticleId: data.ArticleId}, { PraiseNum: instance2.PraiseNum - 1 }, function (err, instance3) {
                                    cb(null, {
                                        code: 200,
                                        message: 'success',
                                        count: info.count
                                    });
                                });
                            }
                            else {
                                return cb(null, {
                                    code: 200,
                                    message: 'fail',
                                    error: "no news"
                                });
                            }
                        });
                    
                    });
                }
            });    
        }
        
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
        else if (data.CommentId != 0) {

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

};

var path = require('path');

var app = require(path.resolve(__dirname, '../../server/server'));
var ds = app.datasources.ios;

module.exports = function (Subscribe) {
    Subscribe.delete = function (data, cb) {
        Subscribe.destroyAll({ first: data.first, second: data.second }, function (err, info) {
            console.info(info.id);
            var res = {
                code: 201,
                message: 'success'
            };
            cb(null, res);
        });
    };
    Subscribe.getByPhone = function (phone, cb) {
        Subscribe.find({ where: { first: phone } }, function (err, instance) {
            if (err) {
                var res = {
                    code: 200,
                    message: 'fail',
                    error: err
                };
                cb(null, res);
            }
            else if (instance.length == 0) {
                var res = {
                    code: 200,
                    message: 'fail',
                    error: 'no subscribe'
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

    Subscribe.getUnsubscribe = function (phone, cb) {
        var Account = app.models.Account;
        Subscribe.find({ where: { first: phone } }, function (err, instance) {
            if (err) {
                var res = {
                    code: 200,
                    message: 'fail',
                    error: err
                };
                cb(null, res);
            }
            else if (instance.length == 0) {
                var res = {
                    code: 200,
                    message: 'fail',
                    error: 'no subscribe'
                };
                cb(null, res);
            }
            else {
                var hasPhone= [];
                instance.forEach(function (item) {
                    hasPhone.push(item.second);
                });
                console.log(hasPhone) ;
                Account.find({ where: { PhoneNumber: { "nin": hasPhone } } }, function (err, instance1) {
                    if (instance1.length == 0) {
                        var res = {
                            code: 200,
                            message: 'fail',
                            error: 'no account'
                        };
                        cb(null, res);
                    }
                    else {
                        var res = {
                            code: 200,
                            message: 'success',
                            data: instance1
                        };
                        cb(null, res);
                    }
                   
                });  
                
            }
        });
    };

    Subscribe.remoteMethod('delete',
        {
            http: { path: '/delete', verb: 'delete' },
            accepts: { arg: 'data', type: 'object', required: true, http: { source: 'body' } },
            returns: { arg: 'response', type: 'object' }
        });
    Subscribe.remoteMethod('getByPhone',
        {
            http: { path: '/getByPhone', verb: 'get' },
            accepts: { arg: 'phone', type: 'string', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
    Subscribe.remoteMethod('getUnsubscribe',
        {
            http: { path: '/getUnsubscribe', verb: 'get' },
            accepts: { arg: 'phone', type: 'string', required: true, http: { source: 'query' } },
            returns: { arg: 'response', type: 'object' }
        });
};

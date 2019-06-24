
module.exports = function (Account) {
  Account.observe('before save', function (ctx, next) {
    var now = new Date();
    if (ctx.isNewInstance) {
      ctx.instance.createdAt = now;
      ctx.instance.lastModifiedAt = now;
    } else {
      ctx.data.lastModifiedAt = new Date();
    }
    next();
  });
  
  Account.findByName = function (name, cb) {
    Account.find({ where: { UserName: name } }, function (err, instance) {
      if (instance.length == 0) {
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
          data: instance
        };
        cb(null, res);
      }
    });
  };
  Account.findByEmail = function (email, cb) {
    Account.findOne({ where: { Email: email } }, function (err, instance) {
      if (instance == null) {
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
          data: instance
        };
        cb(null, res);
      }
    });
  };
  Account.findByPhone = function (phone, cb) {
    Account.findOne({ where: { PhoneNumber: phone } }, function (err, instance) {
      if (instance == null) {
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
          data: instance
        };
        cb(null, res);
      }
    });
  };
  Account.loginNoPd = function (phone, cb) {
    Account.findOne({ where: { PhoneNumber: phone } }, function (err, instance) {
      if (instance == null) {
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
          data: instance
        };
        cb(null, res);
      }
    });
    
  };
  Account.loginByPd = function (user, cb) {
    console.info(user);
    console.info(user.PhoneNumber);
    Account.findOne({ where: { PhoneNumber: user.PhoneNumber } }, function (err, instance) {
      if (instance == null) {
        var res = {
          code: 200,
          message: 'fail',
          error: 'no account'
        };
        cb(null, res);
      }
      else {
        if (instance.Password == user.Password) {
          var res = {
            code: 200,
            message: 'success',
            data: instance
          };
          cb(null, res);
        }
        else {
          var res = {
            code: 200,
            message: 'fail',
            error: 'password is incorrect'
          };
          cb(null, res);
        }
      }
      
    });
    
  };
  Account.changePd = function (user, cb) {
    console.info(user);
    Account.count({ PhoneNumber: user.PhoneNumber }, function (err, count) {
      console.info(count);
      if (count == 1) {
        Account.updateAll({ PhoneNumber: user.PhoneNumber }, { Password: user.Password }, function (err, instance) {
          var res = {
            code: 200,
            message: 'success'
          };
          cb(null, res);
        });
      }
      else {
        var res = {
          code: 200,
          message: 'fail',
          error: 'no account'
        };
        cb(null, res);
      }
    });
  };
  Account.register = function (user, cb) {
    console.info(user.PhoneNumber);
    Account.count({ PhoneNumber: user.PhoneNumber }, function (err, count) {
      console.info(count);
      if (count == 0) {
        Account.create(user, function (err, instance) {
          var res = {
            code: 201,
            message: 'success'
          };
          cb(null, res);
        });
      }
      else {
        var res = {
          code: 200,
          message: 'fail',
          error: 'exist account'
        };
        cb(null, res);
      }
    });
  };

  Account.deleteUser = function (phone, cb) {
    Account.destroyAll({ PhoneNumber: phone }, function (err, info) {
      console.info(info.id);
      cb(null, info);
    });
  };
  Account.updateUser = function (user, cb) {
    Account.count({ PhoneNumber: user.PhoneNumber }, function (err, count) {
      console.info(count);
      if (count == 1) {
        Account.updateAll({ PhoneNumber: user.PhoneNumber }, user, function (err, instance) {
          var res = {
            code: 201,
            message: 'success'
          };
          cb(null, res);
        });
      }
      else {
        var res = {
          code: 200,
          message: 'fail',
          error: 'no account'
        };
        cb(null, res);
      }
    });

  };
  

  //dataSource.connector.execute（sql_stmt，params，callback）;
  Account.remoteMethod('loginNoPd',
    {
      http: { path: '/loginNoPd', verb: 'get' },
      accepts: { arg: 'phone', type: 'string', required: true, http: { source: 'query' } },
      returns: { arg: 'response', type: 'object' }
    });
  Account.remoteMethod('loginByPd',
    {
      http: { path: '/loginByPd', verb: 'post' },
      accepts: { arg: 'user', type: 'object', required: true, http: { source: 'body' } },
      returns: { arg: 'response', type: 'object' }
    });
  Account.remoteMethod('changePd',
    {
      http: { path: '/changePd', verb: 'post' },
      accepts: { arg: 'user', type: 'object', required: true, http: { source: 'body' } },
      returns: { arg: 'response', type: 'object' }
    });
  Account.remoteMethod('register',
    {
      http: { path: '/register', verb: 'post' },
      accepts: { arg: 'user', type: 'object', required: true, http: { source: 'body' } },
      returns: { arg: 'response', type: 'object' }
    });
  Account.remoteMethod(
    'findByName',
    {
      http: { path: '/findByName', verb: 'get' },
      accepts: { arg: 'name', type: 'string', required: true, http: { source: 'query' } },
      returns: { arg: 'response', type: 'object' }
    });
  Account.remoteMethod('findByEmail',
    {
      http: { path: '/findByEmail', verb: 'get' },
      accepts: { arg: 'email', type: 'string', required: true, http: { source: 'query' } },
      returns: { arg: 'response', type: 'object' }
    });
  Account.remoteMethod('findByPhone',
    {
      http: { path: '/findByPhone', verb: 'get' },
      accepts: { arg: 'phone', type: 'string', required: true, http: { source: 'query' } },
      returns: { arg: 'response', type: 'object' }
    });
  Account.remoteMethod('updateUser',
    {
      http: { path: '/updateUser', verb: 'patch' },
      accepts: { arg: 'user', type: 'object', required: true, "description": "用户模型", http: { source: 'body' } },
      returns: { arg: 'response', type: 'object' }
    });
  Account.remoteMethod('deleteUser',
    {
      http: { path: '/deleteUser', verb: 'get' },
      accepts: { arg: 'phone', type: 'string', required: true, http: { source: 'query' } },
      returns: { arg: 'count', type: 'string' }
    });
}

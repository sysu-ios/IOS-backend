
module.exports = function(Subscribe) {
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
    Subscribe.remoteMethod('delete',
    {
      http: { path: '/delete', verb: 'post' },
      accepts: { arg: 'data', type: 'object', required: true, http: { source: 'body' } },
      returns: { arg: 'response', type: 'object' }
    });
};

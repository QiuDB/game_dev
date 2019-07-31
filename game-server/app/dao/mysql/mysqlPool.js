const mysql = require('mysql')
const logger = require('pomelo-logger').getLogger('pomelo', __filename);

let MysqlPool = function() {
    this.utils = null;

    this.query = null;
    this.insert = null;
    this.update = null;
    this.delete = null;
};

MysqlPool.prototype.init = function(mysqlConfig) {
    this.pool = mysql.createPool({
        connectionLimit: 10,
        host: mysqlConfig.host,
        port: mysqlConfig.port,
        user: mysqlConfig.user,
        password: mysqlConfig.password,
        database: mysqlConfig.database,
        supportBigNumbers: true
    });

    this.query = this.NNDQuery;
    this.insert = this.NNDQuery;
    this.update = this.NNDQuery;
    this.delete = this.NNDQuery;

    return this;
};

MysqlPool.prototype.NNDQuery = function(sql, args, cb) {
    let self = this;
    this.pool.getConnection(function(err, connection) {
        if (err) {
            logger.error(err);
            self.utils.invokeCallback(cb, err);
            return;
        }

        connection.query(sql, args, function(error, results, fields) {
            connection.release();
            if (error) {
                logger.error(error);
                self.utils.invokeCallback(cb, error);
                return;
            }
            self.utils.invokeCallback(cb, null, results, fields);
        });
    })
};

module.exports = {
    id: 'mysqlPool',
    func: MysqlPool,
    props: [{
        name: 'utils',
        ref: 'utils'
    }]
}
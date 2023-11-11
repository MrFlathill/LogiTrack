const mysql = require("mysql2");

class Database {
    constructor(connectionProperties) {
        this.connection = mysql.createConnection(connectionProperties);
    }

    query(sql, params) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, params, (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }

    queryClose(sql, params) {
        const ret = this.query(sql, params);
        this.close();
        return ret;
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end((error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }
}

module.exports.Database = Database;
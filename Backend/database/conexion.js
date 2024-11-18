const mysql = require('mysql');
require("dotenv").config();

const conexion = mysql.createPool({
    connectionLimit: 50,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

function getConnection(callback) {
    conexion.getConnection(function(err, connection) {
        if(err){
            return callback(err, null);
        }

        callback(null, connection);
    });    
}

module.exports = {
    getConnection
};
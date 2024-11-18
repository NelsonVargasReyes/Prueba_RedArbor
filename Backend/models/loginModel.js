const db = require('../database/conexion');

/* ============================================================================== */
exports.login = function(email, callback) {
    db.getConnection(function(err, connection) {
        if(err){
            console.error('Error al conectar a la base de datos:', err);
            return callback(err, null);
        }

        connection.query(
            "SELECT id FROM empleados WHERE email = ?",
            [email],
            function(err, result){
                connection.release();

                if(err){
                    return callback(err, null);
                }

                return callback(null, result);
            }
        );
    });
};
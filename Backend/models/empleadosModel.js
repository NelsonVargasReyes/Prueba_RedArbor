const db = require('../database/conexion');

/* ============================================================================== */
exports.empleados = function (pag, callback){
    const desde = 10;

    db.getConnection(function (err, connection) {
        if(err){
            console.error("Error al conectar a la base de datos:", err);
            return callback(err, null);
        }

        const offset = (pag - 1) * desde;

        connection.query(
            "SELECT COUNT(*) AS total FROM empleados WHERE id != 1 ",
            function(err, countResult) {
                if (err) {
                    return callback(err, null);
                }

                const total = countResult[0].total;

                connection.query(
                    `SELECT em.id, em.name, em.surname, em.DateOfBirth, em.email, em.idRol, ro.rol
                    FROM empleados em
                    INNER JOIN roles ro
                    ON em.idRol = ro.id
                    WHERE em.id != 1
                    ORDER BY name ASC 
                    LIMIT ? OFFSET ?`,
                    [parseInt(desde, 10), parseInt(offset, 10)],
                    function (err, result) {
                        connection.release();
            
                        if (err) {
                          return callback(err, null);
                        }
            
                        return callback(null, { total, data: result });
                    }
                );
            }
        );
    });
};

exports.eliminarEmpleados = function (ids, callback) {
    db.getConnection(function (err, connection) {
        if(err) {
            console.error("Error al conectar a la base de datos:", err);
            return callback(err, null);
        }

        connection.query(
            "DELETE FROM empleados WHERE id IN (?)",
            [ids],
            function (err, result) {
                connection.release();

                if(err) {
                    return callback(err, null);
                }

                return callback(null, result);
            }
        );
    });
};

exports.newEmpleado = function (data, callback) {
    db.getConnection(function (err, connection) {
        if(err) {
            console.error("Error al conectar a la base de datos:", err);
            return callback(err, null);
        }

        connection.query(
            "INSERT INTO empleados SET ?",
            {
                name: data.name,
                surname: data.surname,
                DateOfBirth: data.dateOfBirth,
                email: data.email,
                idRol: data.idRol
            },
            function(err, result) {
                connection.release();

                if(err) {
                    return callback(err, null);
                }

                return callback(null, result);
            }
        );
    });
};

exports.actualizarEmpleado = function(data, callback) {    
    db.getConnection(function(err, connection) {
        if(err){
            console.error("Error al conectar a la base de datos:", err);
            return callback(err, null);
        }

        connection.query(
            "UPDATE empleados SET name = ?, surname = ?, DateOfBirth = ?, email = ?, idRol = ? WHERE id = ?",
            [
                data.name,
                data.surname,
                data.dateOfBirth,
                data.email,
                data.idRol,
                data.id
            ],
            function (err, result) {
                connection.release();

                if (err) {
                    return callback(err, null);
                }

                return callback(null, result);
            }
        );
    });
};

exports.rolesEmpleado = function (callback){
    db.getConnection(function (err, connection) {
        if(err) {
            console.error("Error al conectar a la base de datos:", err);
            return callback(err, null);
        }

        connection.query(
            "SELECT * FROM roles",
            function (err, result) {
                connection.release();

                if(err) {
                    return callback(err, null);
                }

                return callback(null, result);

            }
        );
    })
};
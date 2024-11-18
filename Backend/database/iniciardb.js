const { getConnection } = require('./conexion'); 
require("dotenv").config();

function iniciarDB() {
    getConnection((err, connection) => {
        if (err) {
            console.error('Error al conectar a MySQL:', err);
            return;
        }

        const namedatabase = process.env.DB_DATABASE;

        connection.query(`SHOW DATABASES LIKE '${namedatabase}'`, (error, results) => {
            if (error) {
                console.error('Error al verificar la base de datos:', error);
                connection.release();
                return;
            }

            if (results.length === 0) {
                connection.query(`CREATE DATABASE ${namedatabase}`, (error) => {
                    if (error) {
                        console.error('Error al crear la base de datos:', error);
                        connection.release();
                        return;
                    }
                    console.log(`Base de datos "${namedatabase}" creada exitosamente.`);
                    updateConnectionDatabase(namedatabase);
                    crearTablas(connection);
                });
            } else {
                console.log(`La base de datos "${namedatabase}" ya existe.`);
                updateConnectionDatabase(namedatabase);
                crearTablas(connection);
            }
        });
    });
}

function updateConnectionDatabase(database) {
    process.env.DB_DATABASE = database;
    console.log('La base de datos ha sido asignada correctamente en la configuración de conexión.');
}

function crearTablas(connection) {
    connection.query(`USE ${process.env.DB_DATABASE}`, (error) => {
        if (error) {
            console.error('Error al seleccionar la base de datos:', error);
            connection.release();
            return;
        }

        connection.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT PRIMARY KEY AUTO_INCREMENT,
                rol VARCHAR(50) NOT NULL UNIQUE
            )
        `, (error) => {
            if (error) {
                console.error('Error al crear la tabla roles:', error);
                connection.release();
                return;
            }

            connection.query(`
                INSERT INTO roles (rol) VALUES
                ('Desarrollador'),
                ('Team Leader'),
                ('CTO')
                ON DUPLICATE KEY UPDATE rol=VALUES(rol)
            `, (error) => {
                if (error) {
                    console.error('Error al insertar roles:', error);
                    connection.release();
                    return;
                }

                connection.query(`
                    CREATE TABLE IF NOT EXISTS empleados (
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        name VARCHAR(100) NOT NULL,
                        surname VARCHAR(100),
                        DateOfBirth DATE NOT NULL,
                        email VARCHAR(255) NOT NULL UNIQUE,
                        idRol INT NOT NULL,
                        CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
                        CONSTRAINT fk_role FOREIGN KEY (idRol) REFERENCES roles(id)
                    )
                `, (error) => {
                    if (error) {
                        console.error('Error al crear la tabla empleados:', error);
                        connection.release();
                        return;
                    } 

                    connection.query(`
                        INSERT INTO empleados (name, surname, DateOfBirth, email, idRol) VALUES
                        ('admin', 'redarbor', '1990-05-25', 'admin@redarbor.com', '1'),
                        ('Gabriel', 'Fernández', '1984-01-18', 'gabrielfernandez@redarbor.com', '2'),
                        ('Elena', 'Pérez', '1991-04-02', 'elenaperez@redarbor.com', '2'),
                        ('Ricardo', 'Torres', '1987-09-08', 'ricardotorres@redarbor.com', '3'),
                        ('Sofía', 'Castro', '1996-11-15', 'sofiacastro@redarbor.com', '2'),
                        ('Jorge', 'Martínez', '1980-08-25', 'jorge.martinez@redarbor.com', '2'),
                        ('Patricia', 'Jiménez', '1993-12-04', 'patriciajimenez@redarbor.com', '3'),
                        ('David', 'Ruiz', '1994-05-28', 'davidruiz@redarbor.com', '2'),
                        ('Beatriz', 'González', '1989-07-21', 'beatrizgonzalez@redarbor.com', '1'),
                        ('Francisco', 'Hernández', '1986-03-30', 'franciscohernandez@redarbor.com', '3'),
                        ('Raquel', 'García', '1990-10-12', 'raquelgarcia@redarbor.com', '2'),
                        ('Eduardo', 'López', '1982-06-18', 'eduardolopez@redarbor.com', '1'),
                        ('Marta', 'Álvarez', '1997-01-10', 'martaalvarez@redarbor.com', '3'),
                        ('Tomás', 'Ruiz', '1983-05-29', 'tomasruiz@redarbor.com', '2'),
                        ('Isabel', 'Romero', '1992-09-22', 'isabelromero@redarbor.com', '1'),
                        ('Antonio', 'Ortega', '1981-11-14', 'antonioortega@redarbor.com', '3')
                    `, (error) => {
                        if (error) {
                            console.error('Error al inserta el Admin:', error);
                            connection.release();
                            return;
                        }

                        console.log('Tablas creadas y roles insertados exitosamente');
                        connection.release();
                    });
                });
            });
        });
    });
}

module.exports = {
    iniciarDB
};

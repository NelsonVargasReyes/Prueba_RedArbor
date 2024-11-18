const jwt = require('jsonwebtoken');
require('dotenv').config();

const generarToken = (id) => {
    return new Promise((resolve, reject) => {
        const payload = {id};

        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
            if(err) {
                console.error(err);
                reject('No se genero el Token');                
            }else{
                resolve(token);
            }
        });
    })
}

module.exports = { generarToken }
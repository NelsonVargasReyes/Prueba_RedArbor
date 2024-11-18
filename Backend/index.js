'use strict'

const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { iniciarDB } = require('./database/iniciardb');

const redArbor = express(); 

redArbor.use(express.urlencoded({extended:true}));
redArbor.use(express.json());
redArbor.use(cors());

iniciarDB();

//Rutas
redArbor.get('/', (res) => {
    res.status(200).send({ data: 'OK' });
});

redArbor.use('/api', require('./routers/rutasApp'));

redArbor.listen(process.env.PORT, () => {
    console.log('Servidor en el puerto ' + process.env.PORT);    
});

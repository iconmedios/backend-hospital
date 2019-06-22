var express = require('express');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED

var app = express();
var Usuario = require('../models/usuario');

app.post('/', (req, res)=> {

    var body = req.body;

    // VIDEO 109 ANGULAR AVANZADO
    // mientras que el correo sea igual al registro
    Usuario.findOne({ email: body.email }, (err, usuarioDB)=>{
        // Validaciones
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            });
        }
        // validar si no existe el usuario
        if( !usuarioDB ){
            return res.status(500).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }
        // validar si la contraseña es incorrecta 
        // comparar body.password conta usuarioDB retorna un booleano
        if( !bcrypt.compareSync (body.password, usuarioDB.password) ){

            return res.status(500).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        //evitar que se muestre la contraseña 
        usuarioDB.password = ':)';

        // Crear un token con JWT SEED llave de validación video 111
        var token = jwt.sign({usuario: usuarioDB}, SEED,
        // fecha de exiración ej: 4 horas
        { expiresIn: 14400});



              // probar potsman
        res.status(200).json({
        ok: true,
        usuario: usuarioDB,
        token: token,
        id: usuarioDB._id
    });



  

    })

});


module.exports = app;
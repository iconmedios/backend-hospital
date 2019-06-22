var express = require('express');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require ('../middlewares/autenticacion')

var app = express();
var Usuario = require('../models/usuario');



// ruta principal
app.get('/', (req, res, next) => {


    // =======================================
    // Obtener todos los usuarios 
    // =======================================
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role id')
        .skip(desde)
        .limit(3)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                Usuario.countDocuments({}, (err, conteo) => {
                    
                // si no sucede ningun error =
                res.status(200).json({
                    ok: true,
                    // mensaje: 'Get de usuarios',
                    usuarios: usuarios,
                    total:conteo
                });

                    });





            })

});
// token version 1 video 111


// ==========================================
// Actualizar usuario
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }


        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});


// =======================================
// Crear un nuevo usuario
// =======================================
app.post('/', mdAutenticacion.verificaToken ,(req, res) => {

    // extraemos el body
    var body = req.body;
    // referencia al modelo de datos usuario
    var usuario = new Usuario({
        // enivar parametros
        nombre: body.nombre,
        email: body.email,
        // encriptar la contraseña con bcrypt video 106
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,

    });

    // guardar parametros

    usuario.save((err, usuarioGuardado) => {
        //  si suceden errores
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        // si todo es correcto devolvemos status 201 recurso creado
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });

    });

})

// =======================================
// Eliminar usuario por el ID
// =======================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }
        // Mensaje personalizado opcional para manejar le error
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe ningun usuario con ese id',
                errors: { message: 'No existe ningun usuario con ese id' }
            });
        }

        // si todo es correcto 
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    })

})




module.exports = app;
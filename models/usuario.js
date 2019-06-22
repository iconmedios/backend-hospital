var mongoose = require ('mongoose');
// Manejar las validaciones
var uniqueValidator = require('mongoose-unique-validator');

// Creación del Schema
var Schema = mongoose.Schema;

// Objeto para controlar los roles
var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'

}

// 1. crear los campos de nuestro modelo 
var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'Nombre requerido'] },
    email:{ type: String, unique:true, required: [true, 'El correo es requerido']},
    password: { type: String, required: [true, 'Contraseña requeridA'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos},


});

usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} debe ser unico'})

module.exports = mongoose.model('Usuario', usuarioSchema);
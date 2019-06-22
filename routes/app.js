var express = require ('express');
var app = express();


// ruta principal
app.get('/', (req, res, next) =>{

 res.status(200).json({
     ok: true,
     mensaje: 'Peticion realizada correctamente'
 });

});

module.exports = app;
// Requires video 90 angular avanzado
var express = require ('express');
var mongoose = require ('mongoose');

// Iniciar variables 
var app = express();

// 2. Conectar a mongoose url, funcion 

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{
    
    if (err) throw err; 
    console.log('Base de datos: \x1b[36m%s\ ', 'Online!!!' )
} );

// Rutas
app.get('/', (req, res, next) =>{

       // definir codigos 
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    })

})

// Escuchar peticiones 
app.listen( 3000, ()=>{
    console.log('Server iniciado en puerto 3000: \x1b[32m%s\ ', 'Online!!!' )
} );

//conectar con mongoDB



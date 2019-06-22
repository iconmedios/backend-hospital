// Requires video 90 angular avanzado
var express = require ('express');
var mongoose = require ('mongoose');
var bodyParser = require('body-parser');

// Iniciar variables 
var app = express();

// Body Parser parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// importar Rutas
var appRoutes = require('./routes/app')
var usuarioRoutes = require('./routes/usuario')
var loginRoutes = require('./routes/login')
var hospitalRoutes = require('./routes/hospital')
var medicoRoutes = require('./routes/medico')
var busquedaRoutes = require('./routes/busqueda')
var uploadRoutes = require('./routes/upload')
var imagenesRoutes = require('./routes/imagenes')

// 2. Conectar a mongoose url, funcion 

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', {
    useCreateIndex: true,
    useNewUrlParser: true
},
(err, res)=>{
    
    if (err) throw err; 
    console.log('Base de datos: \x1b[36m%s\ ', 'Online!!!' )
} );

// Rutas midelware 
app.use('/upload', uploadRoutes )
app.use('/img', imagenesRoutes )
app.use('/busqueda', busquedaRoutes)
app.use('/medico', medicoRoutes)
app.use('/hospital', hospitalRoutes)
app.use('/usuario', usuarioRoutes)
app.use('/login', loginRoutes)
//ultima ruta
app.use('/', appRoutes)


// Escuchar peticiones 
app.listen( 3000, ()=>{
    console.log('Server iniciado en puerto 3000: \x1b[32m%s\ ', 'Online!!!' )
} );

//conectar con mongoDB



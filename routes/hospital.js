var express = require("express");

var mdAutenticacion = require("../middlewares/autenticacion");

var app = express();
var Hospital = require("../models/hospital");

// ruta principal

 // =======================================
  // Obtener todos los hospitales
  // =======================================
app.get("/", (req, res, next) => {

  // variable para 
  var desde = req.query.desde || 0;
  desde = Number(desde);
   
  Hospital.find({})
    // populate relaciona el usario y nos devuelve todos sus campos 
    // como segundo parametro definimos que campos necesitamos 
    .populate('usuario', 'nombre email')
    .skip(desde)
    .limit(5)
    .exec((err, hospitales) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando hospitales",
        errors: err
      });
    }

    Hospital.countDocuments({}, (err, conteo) =>{
      res.status(200).json({
        ok: true,
        // mensaje: 'Get de hospitales',
        hospitales: hospitales,
        total: conteo
      });

    });
    // si no sucede ningun error =
   
  });
});
// token version 1 video 111

// ==========================================
// Actualizar Hospital
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }


        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;
        

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

           
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

            

        });

    });

});


// =======================================
// Crear un nuevo hospital
// =======================================
app.post("/", mdAutenticacion.verificaToken, (req, res) => {
  
    var body = req.body;
    var hospital = new Hospital({
    
    nombre: body.nombre,
    usuario: req.usuario._id
 
  });

  // guardar parametros

  hospital.save((err, hospitalGuardado) => {
    //  si suceden errores
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear hospital",
        errors: err
      });
    }
    // si todo es correcto devolvemos status 201 recurso creado
    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado,
      
    });
  });
});

// =======================================
// Eliminar hospital por el ID
// =======================================

app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar hospital",
        errors: err
      });
    }
    // Mensaje personalizado opcional para manejar le error
    if (!hospitalBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe ningun hospital con ese id",
        errors: { message: "No existe ningun hospital con ese id" }
      });
    }

    // si todo es correcto
    res.status(200).json({
      ok: true,
      hospital: hospitalBorrado
    });
  });
});

module.exports = app;

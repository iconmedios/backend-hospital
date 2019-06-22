var express = require("express");
const bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var SEED = require("../config/config").SEED;

var app = express();
var Usuario = require("../models/usuario");


// 2.0 Google SING
var CLIENT_ID = require("../config/config").CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);

// =============================================
// 3.0 Google SING Autenticacion Google video 141
// =============================================

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID
   
  });

  

  const payload = ticket.getPayload();
  // const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];

  // extraemos los datos de la promesa async
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
    // obtener todos los datos posibles de google user
    // payload
  };
}

// 4.0 Google SING Crear la ruta con fs async
app.post("/google", async (req, res) => {
  // Obtener el token
  var token = req.body.token;
  // Espera la respuesta de la fs async verify
  var googleUser = await verify( token )
  .catch( e => {
        return res.status(403).json({
        ok: false,
        mensaje: "Token no valido"
      });
    });

    // Verificar email usuario

  Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
    // Validaciones err si no encuentra
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuarios",
        errors: err
      });
    }
    // si existe verificar si fue creado por google o se registro normal

    if (usuarioDB) {
      if (usuarioDB.google === false) {
        return res.status(400).json({
          ok: false,
          mensaje: "Debe usar su autenticación normal"
        });
      } else {
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // expira en 4 horas

        res.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token: token,
          id: usuarioDB._id
        });
      }
    } else {
      // El usuario no existe... hay que crearlo
      var usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ":)";

      usuario.save((err, usuarioDB) => {
        var token = jwt.sign({ usuario: usuarioDB }, SEED, {expiresIn: 14400}); // expira en 4 horas

        res.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token: token,
          id: usuarioDB._id
        });
      });
    }
  });

  // 1.0 Google SING probar ruta
  // return res.status(200).json({
  //     ok: true,
  //     mensaje: 'ok!!',
  //     googleUser
  // });
});

// =============================================
// Autenticacion normal JWT video 109
// =============================================

app.post("/", (req, res) => {
  var body = req.body;

  // VIDEO 109 ANGULAR AVANZADO
  // mientras que el correo sea igual al registro
  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    // Validaciones
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuarios",
        errors: err
      });
    }
    // validar si no existe el usuario
    if (!usuarioDB) {
      return res.status(500).json({
        ok: false,
        mensaje: "Credenciales incorrectas - email",
        errors: err
      });
    }
    // validar si la contraseña es incorrecta
    // comparar body.password conta usuarioDB retorna un booleano
    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(500).json({
        ok: false,
        mensaje: "Credenciales incorrectas - password",
        errors: err
      });
    }

    //evitar que se muestre la contraseña
    usuarioDB.password = ":)";

    // Crear un token con JWT SEED llave de validación video 111
    var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // expira en 4 horas

    res.status(200).json({
      ok: true,
      usuario: usuarioDB,
      token: token,
      id: usuarioDB._id
    });
  });
});

module.exports = app;

// Invocar el modo 'strict'
'use strict';

// Cargar el módulo dependencies
var User = require('mongoose').model('User'),
  passport = require('passport');

// Crear un nuevo método controller manejador de errores
var getErrorMessage = function(err) {
  // Definir la variable de error message
  var message = '';

  // Si un error interno de MongoDB ocurre obtener el mensaje de error
  if (err.code) {
    switch (err.code) {
      // Si un error de index único ocurre configurar el mensaje de error
      case 11000:
      case 11001:
        message = 'Usuario ya existe';
        break;
      // Si un error general ocurre configurar el mensaje de error
      default:
        message = 'Se ha producido un error';
    }
  } else {
    // Grabar el primer mensaje de error de una lista de posibles errores
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  // Devolver el mensaje de error
  return message;
};

exports.success = function(req, res){
  res.send({state: 'success', user: req.user ? req.user : null});
};

exports.failure = function(req, res){
  res.send({state: 'failure', user: null, message: req.flash('error')});
};


// Crear un nuevo método controller que renderiza la página signup
exports.errorRegister = function(req, res, next) {
  // Si el usuario no está conectado renderizar la página signup, en otro caso redireccionar al usuario de vuelta a la página principal de la aplicación
  if (!req.user) {
    // Usa el objeto 'response' para renderizar la página signup
    res.render('error-register', {
      // Configurar la variable title de la página
      title: 'Error en el registro',
      // Configurar la variable del mensaje flash
      messages: req.flash('error')
    });
  } else {
    return res.redirect('/');
  }
};


// Crear un nuevo método controller que crea nuevos users 'regular'
exports.register = function(req, res, next) {
  // Si user no está conectado, crear y hacer login a un nuevo usuario, en otro caso redireccionar el user de vuelta a la página de la aplicación principal
  // El req.user se obtiene al utilizar el paquete 'passport' (revisar General->Configure->Sessions en su documentación oficial)
  if (!req.user) {
    // Crear una nueva instancia del modelo 'User'
    // req.body se obtiene al utilizar el paquete 'body-parser'
    var user = new User(req.body);
    var message = null;

    // Configurar la propiedad user provider
    user.provider = 'local';

    // Intenta salvar el nuevo documento user
    user.save(function(err) {
      // Si ocurre un error, usa el mensaje flash para reportar el error
      if (err) {
        // Usa el método de manejo de errores para obtener el mensaje de error
        var message = getErrorMessage(err);

        // Configura los mensajes flash
        // req.flash se obtiene al utilizar el paquete 'flash'
        req.flash('error', message);

        // Indica que hubo un error en el proceso de creación de usuario
        return res.redirect('/users/failure');
      }

      // Si el usuario fue creado de modo correcto usa el método 'login' de Passport para hacer login
      req.login(user, function(err) {
        // Si ocurre un error de login moverse al siguiente middleware
        if (err) return next(err);

        // Indica que el proceso de creación de usuario se realizó correctamente
        return res.redirect('/users/success');
      });
    });
  } else {
    return res.redirect('/users/success');
  }
};

// Crear un nuevo método controller que crea nuevos usuarios 'OAuth'
exports.saveOAuthUserProfile = function(req, profile, done) {
//exports.saveOAuthUserProfile = function(req, res, profile, done) {
  // Prueba a encontrar un documento user que fue registrado usando el actual provider OAuth
  User.findOne({
    provider: profile.provider,
    providerId: profile.providerId
  }, function(err, user) {
    // Si ha ocurrido un error continua al siguiente middleware
    if (err) {
      return done(err);
    } else {
      // Si un usuario no ha podido ser encontrado, crea un nuevo user, en otro caso, continua al siguiente middleware
      if (!user) {
        // Configura un posible username base username
        var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');

        // Encuentra un username único disponible
        User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
          // Configura el nombre de usuario disponible 
          profile.username = availableUsername;
          
          // Crear el user
          user = new User(profile);

          // Intenta salvar el nuevo documento user
          user.save(function(err) {
            // Si ocurre un error, usa el mensaje flash para reportar el error

            if(err){
              var message = getErrorMessage(err);
            // Configura los mensajes flash
            // req.flash se obtiene al utilizar el paquete 'flash'
            req.flash('error', message);
            return done(null, false);
            }
            // Continúa al siguiente middleware
            //return done(null, null);
            return done(err, user);
          });
        });
      } else {
        // Continúa al siguiente middleware
        return done(err, user);
      }
    }
  });
};

// Crear un nuevo método controller para signing out
exports.signout = function(req, res) {
  // Usa el método 'logout' de Passport para hacer logout
  req.logout();

  // Redirecciona al usuario de vuelta a la página de la aplicación principal
  res.redirect('/');
};

// Crear un nuevo middleware controller que es usado para autorizar operaciones de autentificación 
exports.requiresLogin = function(req, res, next) {
  // Si un usuario no está autentificado envía el mensaje de error apropiado
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'Usuario no está identificado'
    });
  }

  // Llamar al siguiente middleware
  next();
};

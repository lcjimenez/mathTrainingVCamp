// Invocar el modo 'strict' de JavaScript
'use strict';

// Cargar las dependencias del módulo
var users = require('../../app/controllers/users.server.controller'),
    passport = require('passport');

//Definir el método del módulo routes
module.exports = function(app) {

    //sends successful login state back to angular
    app.route('/users/success').get(users.success);

    //sends failure login state back to angular
    app.route('/users/failure').get(users.failure);
    
  //Configurar las rutas 'register'
  app.route('/users/register')
  .post(users.register);

  //Configurar las routes 'signin'
  app.route('/users/signin').post(passport.authenticate('local', {
       successRedirect: '/users/success',
       failureRedirect: '/users/failure'
     }));

    //Configurar las rutas 'register'
  app.route('/users/error-register').get(users.errorRegister)
     
 // Configurar las rutas Google OAuth 
  app.get('/oauth/google', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    failureRedirect: '/'
  }));

  app.get('/oauth/google/callback', 
    passport.authenticate('google', {successRedirect: '/',
                                     failureRedirect: '/users/error-register',
                                     failureFlash: true}));

  //Configurar la route 'signout'
  app.get('/users/signout', users.signout);
};
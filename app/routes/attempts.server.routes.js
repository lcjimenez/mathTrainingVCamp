// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias del módulo
var users = require('../../app/controllers/users.server.controller'),
	attempts = require('../../app/controllers/attempts.server.controller');

// Definir el método routes de module
module.exports = function(app) {
	// Configurar la rutas base a 'articles'  
	app.route('/api/attempts')
	   .get(attempts.list)
	   .post(users.requiresLogin, attempts.create);
	
	// Configurar las rutas 'articles' parametrizadas
	app.route('/api/attempts/:attemptId')
	   .get(attempts.read)
	   .put(users.requiresLogin, attempts.hasAuthorization, attempts.update)
	   .delete(users.requiresLogin, attempts.hasAuthorization, attempts.delete);

	// Configurar el parámetro middleware 'articleId'   
	app.param('attemptId', attempts.attemptByID);
};
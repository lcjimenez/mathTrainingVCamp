// Invocar modo JavaScript 'strict'
'use strict';

// Cargar las dependencias del módulo
var users = require('../../app/controllers/users.server.controller'),
	assignments = require('../../app/controllers/assignments.server.controller');

// Definir el método routes de module
module.exports = function(app) {
	// Configurar la rutas base a 'articles'  
	app.route('/api/assignments')
	   .get(assignments.list)
	   .post(users.requiresLogin, assignments.create);
	
	// Configurar las rutas 'articles' parametrizadas
	app.route('/api/assignments/:assignmentId')
	   .get(assignments.read)
	   .put(users.requiresLogin, assignments.hasAuthorization, assignments.update)
	   .delete(users.requiresLogin, assignments.hasAuthorization, assignments.delete);

	// Configurar el parámetro middleware 'articleId'   
	app.param('assignmentId', assignments.assignmentByID);
};
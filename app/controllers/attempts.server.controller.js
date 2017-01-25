// Invocar modo JavaScript 'strict' 
'use strict';

// Cargar las dependencias del módulo
var mongoose = require('mongoose'),
	Attempt = mongoose.model('Attempt');

// Crear un nuevo método controller para el manejo de errores
var getErrorMessage = function(err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Error de servidor desconocido';
	}
};

// Crear un nuevo método controller para crear nuevos artículos
exports.create = function(req, res) {
	// Crear un nuevo objeto artículo
	var attempt = new Attempt(req.body);

	// Configurar la propiedad 'creador' del artículo
	// attempt.creador = req.user;

	// Intentar salvar el artículo
	attempt.save(function(err) {
		if (err) {
			// Si ocurre algún error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(attempt);
		}
	});
};

// Crear un nuevo método controller que recupera una lista de artículos
exports.list = function(req, res) {
	// Usar el método model 'find' para obtener una lista de artículos
	Attempt.find({'creador': req.query.creador}).sort('-creado').populate({path:'asignacion', match: req.query , populate:{path: 'creador', select: 'username firstName lastName fullName'}}).exec(function(err, attempts) {
		if (err) {
			// Si un error ocurre enviar un mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(attempts);
		}
	});
};

// Crear un nuevo método controller que devuelve un artículo existente
exports.read = function(req, res) {
	res.json(req.attempt);
};

// Crear un nuevo método controller que actualiza un artículo existente
exports.update = function(req, res) {
	// Obtener el artículo usando el objeto 'request'
	var attempt = req.attempt;

	// Actualizar los campos artículo
	attempt.tipo = req.body.tipo;
	attempt.ejercicio = req.body.ejercicio;
	attempt.variables = req.body.variables;

	// Intentar salvar el artículo actualizado
	attempt.save(function(err) {
		if (err) {
			// si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(attempt);
		}
	});
};

// Crear un nuevo método controller que borre un artículo existente
exports.delete = function(req, res) {
	// Obtener el artículo usando el objeto 'request'
	var attempt = req.attempt;

	// Usar el método model 'remove' para borrar el artículo
	attempt.remove(function(err) {
		if (err) {
			// Si ocurre un error enviar el mensaje de error
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Enviar una representación JSON del artículo 
			res.json(attempt);
		}
	});
};

// Crear un nuevo controller middleware que recupera un único artículo existente
exports.attemptByID = function(req, res, next, id) {
	// Usar el método model 'findById' para encontrar un único artículo 
	Attempt.findById(id).populate({path: 'asignacion', populate: {path: 'creador', select: 'username firstName lastName fullName'}}).exec(function(err, attempt) {
		if (err) return next(err);
		if (!attempt) return next(new Error('Fallo al cargar el intento ' + id));

		// Si un artículo es encontrado usar el objeto 'request' para pasarlo al siguietne middleware
		req.attempt = attempt;

		// Llamar al siguiente middleware
		next();
	});
};

// Crear un nuevo controller middleware que es usado para autorizar una operación article 
exports.hasAuthorization = function(req, res, next) {
	// si el usuario actual no es el creador del artículo, enviar el mensaje de error apropiado
	if (req.attempt.creador.id !== req.user.id) {
		return res.status(403).send({
			message: 'Usuario no está autorizado'
		});
	}

	// Llamar al siguiente middleware
	next();
};
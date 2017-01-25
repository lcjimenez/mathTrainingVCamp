// Invocar el modo 'strict' de JavaScript mode
'use strict';

// Cargar las dependencias del módulo
var config = require('./config'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	flash = require('connect-flash'),
	passport = require('passport');

// Definir el mérodo de configuración de Express
module.exports = function(){
	// Crear una nueva instancia de la aplicación Express
	var app = express();

	// Usar la variable "NODE_ENV" para activar los middleware "morgan" logger o 'compress'
	if(process.env.NODE_ENV ==='development'){
		app.use(morgan('dev'));
	} else if(process.env.NODE_ENV === 'production'){
		app.use(compress());
	}

	// Usar las funciones middleware 'body-parser' y 'method-override'
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());
	
	// Configurar el middlesware 'session'
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));

	// Configurar el motro view de la aplicación y el directorio 'views'
	app.set('views', './app/views');
	app.set('view engine','ejs');

	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());

	// Cargar los archivos de enrutamiento
	require('../app/routes/index.server.routes.js')(app);
	require('../app/routes/users.server.routes.js')(app);
	require('../app/routes/assignments.server.routes.js')(app);
	require('../app/routes/attempts.server.routes.js')(app);

	// Configurar el servidor de archivos estáticos
	app.use(express.static('./public'));

	// error handlers

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
	    app.use(function(err, req, res, next) {
	        res.status(err.status || 500);
	        res.render('error', {
	            message: err.message,
	            error: err
	        });
	    });
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
	    res.status(err.status || 500);
	    res.render('error', {
	        message: err.message,
	        error: {}
	    });
	});

	
	// Devolver la instancia de la aplicación Express
	return app;
}

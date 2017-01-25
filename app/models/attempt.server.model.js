var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var AttemptSchema = new Schema({
	creado: {
		type: Date,
		default: Date.now
	},
	respuestaEstudiante: {
		type: String,
		default: '',
		trim: true
	},
	respuestaCorrecta: {
		type: Boolean,
		default: false,
	},
	asignacion: {
		type: Schema.ObjectId,
		ref: 'Assignment'
	},
	creador: {
		type: Schema.ObjectId,
		ref: 'User'
	}

});

mongoose.model('Attempt', AttemptSchema);
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var AssignmentSchema = new Schema({
	creado: {
		type: Date,
		default: Date.now
	},
	tipo: {
		type: String,
		default: '',
		trim: true
	},
	ejercicio: {
		type: String,
		default: '',
		trim: true
	},
	variables: {
		type: Object,
		default: {}
	},
	creador: {
		type: Schema.ObjectId,
		ref: 'User'
	}

});

mongoose.model('Assignment', AssignmentSchema);
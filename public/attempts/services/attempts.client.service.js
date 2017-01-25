// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'attempts'
angular.module('attempts').factory('Attempts', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' attempt
    return $resource('api/attempts/:attemptId', {
        attemptId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
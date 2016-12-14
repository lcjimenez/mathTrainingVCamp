// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'articles'
angular.module('assignments').factory('Assignments', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' article
    return $resource('api/assignments/:assignmentId', {
        assignmentId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
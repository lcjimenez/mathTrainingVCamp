// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'assignment'
angular.module('assignments').factory('Assignments', ['$resource', function($resource) {
	// Usar el service '$resource' para devolver un objeto '$resource' assignment
    return $resource('api/assignments/:assignmentId', {
        assignmentId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
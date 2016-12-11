// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'assignments'
angular.module('assignments').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/assignments/:num', {
			 templateUrl: function(urlattr){
                 return '/assignments/views/' + urlattr.num + '.client.view.html';
             }
		});
	}
]);
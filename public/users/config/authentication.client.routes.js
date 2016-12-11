// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'users'
angular.module('users').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/login', {
			templateUrl: 'users/views/login-user.client.view.html'
		}).
		when('/signup', {
			templateUrl: 'users/views/signup-user.client.view.html'
		});
	}
]);
// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'articles'
angular.module('attempts').config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/attempts', {
			templateUrl: 'attempts/views/list-attempts.client.view.html'
		});
	}
]); 
// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo run de 'users'
angular.module('users').run(['$rootScope', '$http', 'Authentication', function($rootScope, $http, Authentication) {
	// Exponer el service Authentication
    $rootScope.authentication = Authentication;
	
	$rootScope.signout = function(){
    	$http.get('/users/signout');
    	$rootScope.authentication = null;
	};
}
]);
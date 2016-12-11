// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo run de 'example'
angular.module('example').run(['$rootScope', '$scope', function($rootScope, $scope) {
	// Exponer el service Authentication
    $rootScope.authentication = Authentication;
	
	$rootScope.signout = function(){
    	$http.get('/users/signout');
    	$rootScope.authentication = null;
	};
}
]);
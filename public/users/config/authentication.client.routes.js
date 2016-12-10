// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'users'
angular.module('users')
.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/login', {
			templateUrl: 'users/views/login-user.client.view.html'
		}).
		when('/signup', {
			templateUrl: 'users/views/signup-user.client.view.html'
		});
	}
])
.run(['$rootScope', '$http', 'Authentication', function($rootScope, $http, Authentication) {
	// Exponer el service Authentication
    $rootScope.authentication = Authentication;
	
	$rootScope.signout = function(){
    	$http.get('/users/signout');
    	$rootScope.authentication = null;
	};
}
]);
;
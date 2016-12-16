angular.module("myApp").config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/prueba', {
            templateUrl: 'prueba/views/prueba.client.view.html'
        });
    }
]); 
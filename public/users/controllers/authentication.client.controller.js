// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller UsersController que gestiona los usuarios
angular.module('users').controller('UsersController', ['$scope', '$http', '$rootScope', '$routeParams', '$location',
    function($scope, $http, $rootScope, $routeParams, $location) {


        $scope.login = function(){
            $http.post('/users/signin', $scope.user).success(function(data){
                if(data.state == 'success'){
                    $rootScope.authentication = {'user': data.user};
                    $location.path('/');
                }
                else{
                    $scope.error_message = data.message;
                }
            });
        };

        $scope.register = function(){
            // La variable $scope.user contiene la información del usuario que se desea registrar.
            // La variable $scope.user normalmente se crea en el formulario de registro, una vez se diligencian los campos.
            // Se envía una petición POST al servidor para crear un nuevo usuario.
            $http.post('/users/register', $scope.user).success(function(data){
                if(data.state == 'success'){
                    // Si se crea exitosamente se le indica a la variable raiz $rootScope.authentication que el usuario está autenticado.
                    $rootScope.authentication = {'user': data.user};
                    // Se le indica a la variable raiz que se dirija a la página principal.
                    $location.path('/');
                }
                else{
                    $scope.error_message = data.message;
                }
            });
        };
    }
]);
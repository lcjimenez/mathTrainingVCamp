// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'attempts'
angular.module('attempts').controller('AttemptsController', ['$scope', '$routeParams', '$location', 'Authentication', 'Attempts',
    function($scope, $routeParams, $location, Authentication, Attempts) {
        // Exponer el service Authentication
        $scope.authentication = Authentication;
        // Revisa si el usuario es el administrador
        $scope.esAdmin = ($scope.authentication.user == null ? false : $scope.authentication.user.username == 'amaldonadoc');

 // // Crear un nuevo método controller para crear nuevos attempts
 //        $scope.create = function() {
 //            // Usar los campos form para crear un nuevo objeto $resource attempt
 //            var attempt = new Attempts({
 //                titulo: this.titulo,
 //                contenido: this.contenido
 //            });

 //            // Usar el método '$save' de attempt para enviar una petición POST apropiada
 //            attempt.$save(function(response) {
 //                // Si un artículo fue creado de modo correcto, redireccionar al usuario a la página del artículo 
 //                $location.path('attempts/' + response._id);
 //            }, function(errorResponse) {
 //                // En otro caso, presentar al usuario el mensaje de error
 //                $scope.error = errorResponse.data.message;
 //            });
 //        };

// Crear un nuevo método controller para recuperar una lista de artículos
        $scope.find = function() {
            // Usar el método 'query' de attempt para enviar una petición GET apropiada
            $scope.attempts = Attempts.query({}, function() {
                // Se realiza un filtro para incluir sólo los intentos que pertenencen al ejercicio.
                //$scope.attempts = $scope.allAttempts.filter(function (el) {
                //   return el.asignacion != null;
                //});
            });
        };

        // // Crear un nuevo método controller para recuperar un unico artículo
        // $scope.findOne = function() {
        //     // Usar el método 'get' de attempt para enviar una petición GET apropiada
        //     $scope.attempt = Attempts.get({
        //         attemptId: $routeParams.attemptId
        //     });
        // };

 // // Crear un nuevo método controller para actualizar un único attempt
 //        $scope.update = function() {
 //            // Usar el método '$update' de attempt para enviar una petición PUT apropiada
 //            $scope.attempt.$update(function() {
 //                // Si un attempt fue actualizado de modo correcto, redirigir el user a la página del attempt 
 //                $location.path('attempts/' + $scope.attempt._id);
 //            }, function(errorResponse) {
 //                // En otro caso, presenta al user un mensaje de error
 //                $scope.error = errorResponse.data.message;
 //            });
 //        };

// // Crear un nuevo método controller para borrar un único artículo
//         $scope.delete = function(attempt) {
//             // Si un artículo fue enviado al método, borrarlo
//             if (attempt) {
//                 // Usar el método '$remove' del artículo para borrar el artículo
//                 attempt.$remove(function() {
//                     // Eliminar el artículo de la lista de artículos
//                     for (var i in $scope.attempts) {
//                         if ($scope.attempts[i] === attempt) {
//                             $scope.attempts.splice(i, 1);
//                         }
//                     }
//                 });
//             } else {
//                 // En otro caso, usar el método '$remove' de attempt para borrar el attempt
//                 $scope.attempt.$remove(function() {
//                     $location.path('attempts');
//                 });
//             }
//         };

    }
]);
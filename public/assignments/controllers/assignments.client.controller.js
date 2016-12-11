// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'articles'
angular.module('assignments').controller('AssignmentsController', ['$scope', '$routeParams', '$location', '$timeout', 'InfoAssignment',
    function($scope, $routeParams, $location, $timeout, InfoAssignment) {
        // Verifica que el path corresponde con el ejercicio
        if(InfoAssignment.exercise != $location.path().split('/').pop()){
            $location.path('/');
        };
        // Crea una variable que almacene la inforamcíon de las asignaciones
        $scope.infoAssignment = InfoAssignment;
        // Crea diferentes nombres posibles para el ejercicio
        $scope.exercise = $scope.infoAssignment.exercise;
        $scope.exerciseUnder = $scope.exercise.replace(/-/g, '_');
        $scope.exerciseDot = $scope.exercise.replace(/-/g, '.');

        // Variable que indica si están deshabilitados el botón "enviar" y el campo de "respuesta".
        $scope.deshabilitado = true;

        $scope.$eval('variables_' + $scope.exerciseUnder + '()') ;

         // Crear un nuevo método controller para crear nuevos articles
        $scope.variables_1_2_20a = function() {
            $scope.variables = {};
            $scope.variables['id'] = '';
            $scope.variables['tiempo_inicio'] = Date();
            $scope.variables['raiz1'] = Math.floor((Math.random() -0.5) * 198);
            $scope.variables['raiz2'] = Math.floor((Math.random() -0.5) * 198);
            $scope.variables['a'] = $scope.variables['raiz1'] + $scope.variables['raiz2'];
            $scope.variables['b'] = $scope.variables['raiz1'] * $scope.variables['raiz2'];
            $scope.variables['respuesta'] = [[(-$scope.variables['raiz1']).toString(),(-$scope.variables['raiz2']).toString()]];
            setTimeout(function() {MathJax.Hub.Queue(["Typeset",MathJax.Hub]);});
        };


    }
]);
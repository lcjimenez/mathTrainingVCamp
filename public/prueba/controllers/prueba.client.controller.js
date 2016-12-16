angular.module("myApp").controller('MyCtrl', ['$scope', '$element', '$templateCache', function($scope, $element, $templateCache) {    
    $scope.html = $templateCache.get('prueba-enunciado');
    $scope.variable = 4;
}]);
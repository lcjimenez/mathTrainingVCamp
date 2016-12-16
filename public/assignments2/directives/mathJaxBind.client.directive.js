// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'articles'
/*angular.module('assignments').directive('mathJaxBind', function() {
  var refresh = function(element) {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, element]);
  };
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.mathJaxBind, function(newValue,oldValue) {
        
        element.text("$ "+(math.parse(''+newValue).toTex()=='undefined'?'':math.parse(''+newValue).toTex())+"$");
        refresh(element[0]);
      });
    }
  };
})*/

angular.module('assignments').directive('mathJaxBind', function() {
    return {
        restrict: "A",
        scope:{
            text: "@mathjaxBind"
        },
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
            
            $scope.$watch('text', function(value) {
//                console.log(value);
                var $script = angular.element("<script type='math/tex'>")
                    .html(value == undefined ? "" : value);
                $element.html("");
                $element.append($script);
                MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
            });
        }]
    };
});
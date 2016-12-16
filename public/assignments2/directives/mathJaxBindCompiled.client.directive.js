// Invocar modo JavaScript 'strict'
'use strict';

// Crear el service 'articles'
/*angular.module('assignments').directive('mathJaxBindCompiled', ['$compile', '$timeout', function($compile, $timeout) {
	var refresh = function(element) {
		setTimeout(function() {MathJax.Hub.Queue(["Typeset",MathJax.Hub, element]);}, 200);
		//MathJax.Hub.Queue(["Typeset", MathJax.Hub, element]);
	};
	return {
		restrict: 'A',
		controller: ["$scope", "$element", "$attrs",
			function($scope, $element, $attrs) {
			//console.log($attrs.mathJaxBindCompiled);
			$scope.$watch($attrs.mathJaxBindCompiled, function(html) {
				$compile(html)($scope, function(cloned, $scope){
					$element.html("");
					$element.append(cloned);
					refresh($element[0]);
				});
			});
		}]
	};
}]);*/

/*angular.module('assignments').directive('mathJaxBindCompiled', ['$compile', '$timeout', function($compile, $timeout) {
	var refresh = function(element) {
		setTimeout(function() {MathJax.Hub.Queue(["Typeset",MathJax.Hub, element]);}, 200);
		//MathJax.Hub.Queue(["Typeset", MathJax.Hub, element]);
	};
	return {
		restrict: 'A',
		controller: ["$scope", "$element", "$attrs",
			function($scope, $element, $attrs) {
			console.log($attrs.mathJaxBindCompiled);
			$scope.$watch($attrs.mathJaxBindCompiled, function(html) {
				$element.html(html);
				$compile($element.contents())($scope);
				refresh($element[0]);
			});
		}]
	};
}]);*/

angular.module('assignments').directive('mathJaxBindCompiled', ['$compile', '$timeout', function($compile, $timeout) {
	var refresh = function(element) {
		setTimeout(function() {MathJax.Hub.Queue(["Typeset",MathJax.Hub, element]);}, 200);
		//MathJax.Hub.Queue(["Typeset", MathJax.Hub, element]);
	};
	return {
		restrict: 'A',
		replace: true,
		link: 
		function(scope, element, attrs) {
			console.log(attrs.mathJaxBindCompiled);
			scope.$watch(attrs.mathJaxBindCompiled, function(html) {

/*          html = html.replace(/\$\$([^$]+)\$\$/g, "<span class=\"blue\" mathjax-bind=\"$1\"></span>");
               html = html.replace(/\$([^$]+)\$/g, "<span class=\"red\" mathjax-bind=\"$1\"></span>");  */       

				element.html(html);
				$compile(element.contents())(scope);
				refresh(element[0]);
			});
		}
	};
}]);
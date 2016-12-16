// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo run de 'assignments'
angular.module('assignments').run(['$rootScope', '$timeout', 
	function($rootScope, $timeout) {
		setTimeout(function() {MathJax.Hub.Queue(["Typeset",MathJax.Hub]);});	
	}
]);
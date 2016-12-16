// Invocar modo JavaScript 'strict'
'use strict';

// Crear el controller 'articles'
angular.module('assignments').controller('AssignmentsController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$templateCache', '$templateRequest', '$compile', 'Authentication', 'InfoAssignment', 'Assignments',
    function($scope, $rootScope, $routeParams, $location, $timeout, $templateCache, $templateRequest, $compile, Authentication,InfoAssignment, Assignments) {
        $scope.authentication = Authentication;
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

        // Se indica que el enunciado se encuentra vacío
        $scope.enunciado = '';

        // Variable que indica si están deshabilitados el botón "enviar" y el campo de "respuesta".
        //$scope.deshabilitado = true;

        //MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

        // Crear un nuevo método controller para crear nuevas asignaciones
        $scope.create = function() {
            // Usar los campos form para crear un nuevo objeto $resource de Assigments con las asignaciones
            var assignment = new Assignments({
                tipo: $scope.infoAssignment.type,
                ejercicio: $scope.infoAssignment.exercise,
                variables: $scope.variables
            });

            // Usar el método '$save' para almacenar la asignación por medio de una petición POST apropiada
            assignment.$save(function(response) {
                // En caso de que no se genere error
            }, function(errorResponse) {
                // En otro caso, presentar al usuario el mensaje de error
                //$scope.error = errorResponse.data.message;
            });
        };

        // Crear un nuevo método controller para recuperar una lista de asignaciones
        $scope.find = function() {
            $scope.assignments = Assignments.query({
                tipo: $scope.infoAssignment.type,
                ejercicio: $scope.infoAssignment.exercise,
                "creador" : $scope.authentication.user._id
            });
        };

        // Compara dos arrglos, y devuelve true si son iguales y false si son diferentes.
        function arraysEqualValores(arr1, arr2) {
            // Compara los tamaños de los arreglos. Si son diferentes devuelve false.
            if(arr1.length !== arr2.length)
                return false;
            // Compara cada uno de los valores de los arreglos. Cambia los valores de "\\" por "\" y elimina los espacios.
            // 
            for(var i = arr1.length; i--;) {
                if(arr1[i].replace(/\\/g,'\ ').replace(/ /g,"") !== arr2[i].replace(/\\/g,'\ ').replace(/ /g,""))
                    return false;
            }
            return true;
        }

        //
        function limiteIntentos()
        {
            return (($scope.asignacion.numeroIntentos != null) && ((erradas == null ? 0 : erradas.length) >= $scope.asignacion.numeroIntentos || correctas != null));
        }

        // Crear un nuevo método controller para cargar las últimas variables (nuevo=false) o crear nuevas variables (nuevo=true)
        $scope.generarEjercicio = function(nuevo) {
            // Se debe incluir SIEMPRE para borra el campo anterior y que MathJax no repita la fórmula
            $scope.enunciado = ''; // ¡¡IMPORTANTE!!
            $scope.solucion = ''; // ¡¡IMPORTANTE!!
            // Se leen las asignaciones creadas en al base de datos
            $scope.find();
            // Se espera a que la base de datos devuelva las asignaciones. Estos valores se devuelven en la variable "data"
            $scope.assignments.$promise.then(function(data){
                // Ingresa al IF siempre que no existan asignaciones dentro de la base de datos (data.length < 1) o que se decidan crear nuevas asignaciones (nuevo=true)
                if(data.length < 1 || nuevo){
                    // Evalúa las variables del ejercicio correspondiente
                    //$scope.$eval('$scope.variables_1_2_20a()');
                    $scope.variables_1_2_20a();
                    // Almacena las variables creadas
                    $scope.create();
                    //setTimeout(function() {$scope.create();}, 200);
                }
                else{
                    // Se leen las variables de la última asignación alamcenada en la base de datos (data[0].variables)
                    $scope.variables = data[0].variables;
                }
                // Se carga el template del "enunciado". Éste se encuentra el el TemplateCache.
                // Se guardó utlizando <script type="text/ng-template" id="1-2-20a-enunciado"> ... </script>
                //$scope.enunciado = $templateCache.get($scope.exercise + '-enunciado');
                $scope.enunciado = "A coin of is $ \\frac{5}{4} $ thrown $$ \\frac{1}{ {{variables.a}} }$$ dfv";
                $scope.solucionProvisional = $templateCache.get($scope.exercise + '-solucion');
/*                $templateRequest($scope.exercise + '-enunciado').then(function(data){
                    $scope.enunciado = data;
                });*/
            });
        }

                // Crear un nuevo método controller para cargar las últimas variables (nuevo=false) o crear nuevas variables (nuevo=true)
        $scope.resolver = function() {
            //$scope.solucion = ''+$scope.solucionProvisional;
            $scope.deshabilitado = true;
            // Crea y guarda en la DB las variables, ya que la respuesta de las anteriores ya se ha revelado.
            //$scope.variables_1_2_20a();
            //$scope.create();
            setTimeout(function() {
                $scope.variables_1_2_20a();
                $scope.create();
            }, 1000);
        }

        // Se crean las variables de una asignación nueva.
        $scope.variables_1_2_20a = function() {
            $scope.variables = {};
            $scope.variables['raiz1'] = Math.floor((Math.random() -0.5) * 198);
            $scope.variables['raiz2'] = Math.floor((Math.random() -0.5) * 198);
            $scope.variables['a'] = $scope.variables['raiz1'] + $scope.variables['raiz2'];
            $scope.variables['b'] = $scope.variables['raiz1'] * $scope.variables['raiz2'];
            $scope.variables['respuesta'] = [[(-$scope.variables['raiz1']).toString(),(-$scope.variables['raiz2']).toString()]];
        }
    }
]);
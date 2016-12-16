angular.module('assignments').controller('AssignmentsController', ['$scope', '$element', '$templateCache', '$location', 'Authentication', 'InfoAssignment', 'Assignments',
	function($scope, $element, $templateCache, $location, Authentication, InfoAssignment, Assignments) {
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
        $scope.solucion = '';

        // Se crea la variable "variables"
        var variables = {};

        // Variable que indica si están deshabilitados el botón "enviar" y el campo de "respuesta".
        //$scope.deshabilitado = true;

        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

        // Crear un nuevo método controller para crear nuevas asignaciones
        $scope.create = function() {
            // Usar los campos form para crear un nuevo objeto $resource de Assigments con las asignaciones
            var assignment = new Assignments({
                tipo: $scope.infoAssignment.type,
                ejercicio: $scope.infoAssignment.exercise,
                variables: variables
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
            // Se leen las asignaciones creadas en al base de datos
            $scope.find();
            // Se espera a que la base de datos devuelva las asignaciones. Estos valores se devuelven en la variable "data"
            $scope.assignments.$promise.then(function(data){
                // Ingresa al IF siempre que no existan asignaciones dentro de la base de datos (data.length < 1) o que se decidan crear nuevas asignaciones (nuevo=true)
                if(data.length < 1 || nuevo){
                    // Evalúa las variables del ejercicio correspondiente y luego las asigna a $scope.variables
                    $scope.$eval('variables_' + $scope.exerciseUnder + '()');
                    $scope.variables = variables;
                    // Almacena las variables creadas
                    $scope.create();
                }
                else{
                    // Se leen las variables de la última asignación alamcenada en la base de datos (data[0].variables)
                    $scope.variables = data[0].variables;
                }
                // Se carga el template del "enunciado". Éste se encuentra el el TemplateCache.
                // Se guardó utlizando <script type="text/ng-template" id="xxx-enunciado"> ... </script>
                $scope.enunciado = $templateCache.get($scope.exercise + '-enunciado');
                 $scope.solucion = '';
            });
        }

        // Crear un nuevo método controller para cargar las últimas variables (nuevo=false) o crear nuevas variables (nuevo=true)
        $scope.resolver = function() {
            $scope.solucion = $templateCache.get($scope.exercise + '-solucion');
            $scope.deshabilitado = true;
            // Crea y guarda en la DB las variables, ya que la respuesta de las anteriores ya se ha revelado.
            $scope.$eval('variables_' + $scope.exerciseUnder + '()');
            $scope.create();
        }

        // Se crean las variables de una asignación nueva.
        $scope.variables_1_2_20a = function() {
            variables = {};
            variables['raiz1'] = Math.floor((Math.random() -0.5) * 198);
            variables['raiz2'] = Math.floor((Math.random() -0.5) * 198);
            variables['a'] = variables['raiz1'] + variables['raiz2'];
            variables['b'] = variables['raiz1'] * variables['raiz2'];
            variables['respuesta'] = [[(-variables['raiz1']).toString(),(-variables['raiz2']).toString()]];
        }

    $scope.enunciado = $templateCache.get("1-2-20a-enunciado");
    $scope.variable = 4;
}]);
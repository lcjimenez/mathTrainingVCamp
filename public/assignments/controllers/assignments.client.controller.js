angular.module('assignments').controller('AssignmentsController', ['$scope', '$timeout', '$element', '$templateCache', '$location', 'Authentication', 'InfoAssignment', 'Assignments', 'Attempts',
	function($scope, $timeout, $element, $templateCache, $location, Authentication, InfoAssignment, Assignments, Attempts) {
		$scope.authentication = Authentication;
        // Verifica que el path corresponde con el ejercicio
        if(InfoAssignment.exercise != $location.path().split('/').pop()){
            $location.path('/');
        };
        // Crea una variable que almacene la inforamcíon de las asignaciones
        $scope.infoAssignment = InfoAssignment;
        //console.log($scope.infoAssignment)
        // Crea diferentes nombres posibles para el ejercicio
        $scope.exercise = $scope.infoAssignment.exercise;
        $scope.exerciseUnder = $scope.exercise.replace(/-/g, '_');
        $scope.exerciseDot = $scope.exercise.replace(/-/g, '.');

        // Se indica que el enunciado se encuentra vacío
        $scope.enunciado = '';
        $scope.solucion = '';
        $scope.respuestaSolucion = '';
        $scope.respuestaCorrecta = false;
        $scope.intentosRealizados = 0;

        // Se crea la variable "variables"
        var variables = {};

        // Variable que indica si están deshabilitados el botón "enviar" y el campo de "respuesta".
        $scope.deshabilitado = true;

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
                // Se leen las asignaciones creadas en al base de datos
                $scope.findAssignments();
            }, function(errorResponse) {
                // En otro caso, presentar al usuario el mensaje de error
                //$scope.error = errorResponse.data.message;
            });
        };

        // Crear un nuevo método controller para recuperar una lista de asignaciones
        $scope.findAssignments = function() {
            $scope.assignments = Assignments.query({
                'tipo': $scope.infoAssignment.type,
                'ejercicio': $scope.infoAssignment.exercise,
                'creador' : $scope.authentication.user._id
            }, function() {

                if($scope.assignments.length >= 1)
                {
                    $scope.findAttempts();
                    //console.log('Asignaciones');
                    //console.log($scope.assignments);
                    //$scope.deshabilitado = false;
                }

            });
        };

                // Crear un nuevo método controller para crear nuevas asignaciones
        $scope.createAttempt = function() {
            // Usar los campos form para crear un nuevo objeto $resource de Assigments con las asignaciones
            var attempt = new Attempts({
                'respuestaEstudiante': $scope.respuesta,
                'respuestaCorrecta': $scope.respuestaCorrecta,
                'asignacion': $scope.assignments[0]._id,
                'creador' : $scope.authentication.user._id
            });

            // Usar el método '$save' para almacenar la asignación por medio de una petición POST apropiada
            attempt.$save(function(response) {
                // En caso de que no se genere error
                $scope.findAttempts();
            }, function(errorResponse) {
                // En otro caso, presentar al usuario el mensaje de error
                //$scope.error = errorResponse.data.message;
            });
        };

        // Crear un nuevo método controller para recuperar una lista de asignaciones
        $scope.findAttempts = function() {
            $scope.allAttempts = Attempts.query({
                'tipo': $scope.infoAssignment.type,
                'ejercicio': $scope.infoAssignment.exercise,
                'creador' : $scope.authentication.user._id
            }, function() {
                // Se realiza un filtro para incluir sólo los intentos que pertenencen al ejercicio.
                //$scope.attempts = $scope.allAttempts.filter(function (el) {
                //   return el.asignacion != null;
                //});
            });
        };

        // Crear un nuevo método controller para cargar las últimas variables (nuevo=false) o crear nuevas variables (nuevo=true)
        $scope.generarEjercicio = function(nuevo) {
            // Garantiza que se deshabiliten los campos, hasta que se compruebe que existen las variables.
            $scope.deshabilitado = true;
            // Se leen las asignaciones creadas en al base de datos
            $scope.findAssignments();
            // Se espera a que la base de datos devuelva las asignaciones. Estos valores se devuelven en la variable "assignments"
            $scope.assignments.$promise.then(function(assignments){
                // Ingresa al IF siempre que no existan asignaciones dentro de la base de datos (assignments.length < 1) o que se decidan crear nuevas asignaciones (nuevo=true)
                if(assignments.length < 1 || nuevo){
                    // Evalúa las variables del ejercicio correspondiente y luego las asigna a $scope.variables
                    $scope.$eval('variables_' + $scope.exerciseUnder + '()');
                    $scope.variables = variables;
                    // Almacena las variables creadas
                    $scope.create();
                    //console.log('Genera variables: '+ $scope.exerciseUnder);
                }
                else{
                    // Se leen las variables de la última asignación alamcenada en la base de datos (assignments[0].variables)
                    variables = assignments[0].variables;
                    $scope.variables = variables;
                    //console.log('No genera variables');
                }

                // Se espera a que la base de datos devuelva todos los intentos de la asignación. Estos valores se devuelven en la variable "allAttempts"
                // Si aún no se han generado intentos, genera un error, y por lo tanto llama al "catch"
                // Se carga el template del "enunciado". Éste se encuentra el el TemplateCache.
                // Se guardó utlizando <script type="text/ng-template" id="xxx-enunciado"> ... </script>
                $scope.actualizarIntentos(true);

            });
        }

        $scope.actualizarIntentos = function(actualizarPlantilla) {
            // Se espera a que la base de datos devuelva todos los intentos de la asignación. Estos valores se devuelven en la variable "allAttempts"
            // Si aún no se han generado intentos, genera un error, y por lo tanto llama al "catch"
            try {
                $scope.allAttempts.$promise.then(function(allAttempts){
                    $scope.attempts = allAttempts.filter(function (el) {
                        return el.asignacion != null;
                    });

                    $scope.wrongAttempts = $scope.attempts.filter(function (el) {
                        return !(el.respuestaCorrecta) ;
                    });

                    $scope.rightAttempts = $scope.attempts.filter(function (el) {
                        return el.respuestaCorrecta ;
                    });

                    // Se carga el template del "enunciado". Éste se encuentra el el TemplateCache.
                    // Se guardó utlizando <script type="text/ng-template" id="xxx-enunciado"> ... </script>
                    if(actualizarPlantilla || limiteIntentos()){
                        $scope.visualizarPlantilla();
                    }

                    // console.log('Todos Intentos');
                    // console.log(allAttempts);
                    // console.log('Errores:');
                    // console.log($scope.wrongAttempts);
                    // console.log('Aciertos:');
                    // console.log($scope.rightAttempts);
                });
            }
            catch(err) {
                $scope.attempts = $scope.wrongAttempts = $scope.rightAttempts = [];
                // Se carga el template del "enunciado". Éste se encuentra el el TemplateCache.
                // Se guardó utlizando <script type="text/ng-template" id="xxx-enunciado"> ... </script>
                if(actualizarPlantilla){
                    $scope.visualizarPlantilla();
                }
                //console.log($scope.attempts);
            }

        }

        $scope.visualizarPlantilla = function() {
             // Se carga el template del "enunciado". Éste se encuentra el el TemplateCache.
            // Se guardó utlizando <script type="text/ng-template" id="xxx-enunciado"> ... </script>
            $scope.enunciado = $templateCache.get($scope.exercise + '-enunciado');
            // console.log('VisualizarPlantilla: infoAssignment.')
            // console.log($scope.infoAssignment);

            $scope.solucion = (limiteIntentos() && $scope.infoAssignment.showSolution ? $templateCache.get($scope.exercise + '-solucion') : "");
            $scope.respuestaSolucion = (limiteIntentos() ? $templateCache.get($scope.exercise + '-respuestaSolucion') : "");
            $scope.respuesta = (limiteIntentos() ? ($scope.rightAttempts.length > 0 ? $scope.rightAttempts[0].respuestaEstudiante : ($scope.wrongAttempts.length > 0 ? $scope.wrongAttempts[0].respuestaEstudiante:"")) : "");
            $scope.mensajeRespuesta = ($scope.rightAttempts.length == 0 ? (!limiteIntentos() ? "" : "<font color='red'><span class='glyphicon glyphicon-remove'></span> <b>0% - SE AGOTARON LOS INTENTOS</b></font>" ) : "<font color='green'><span class='glyphicon glyphicon-ok'></span> <b>100% - EL EJERCICIO SE HA RESUELTO CORRECTAMENTE</b></font>");
            $scope.deshabilitado = limiteIntentos();
            $scope.ayudaDeshabilitada = limiteIntentos() || !($scope.infoAssignment.help);
        }
        


        // Crear un nuevo método controller para cargar las últimas variables (nuevo=false) o crear nuevas variables (nuevo=true)
        $scope.resolver = function() {
            $scope.solucion = $templateCache.get($scope.exercise + '-solucion');
            $scope.respuestaSolucion = $templateCache.get($scope.exercise + '-respuestaSolucion');
            $scope.deshabilitado = true;
            // Crea y guarda en la DB las variables, ya que la respuesta de las anteriores ya se ha revelado.
            $scope.$eval('variables_' + $scope.exerciseUnder + '()');
            $scope.createAttempt();
            $timeout(function() {}, 3000).then(
                function()
                {
                    $scope.create();
                    $scope.actualizarIntentos(false);
                }
            );
        }

/*        $scope.actualizarRespuesta = function(respuesta){
            $scope.respuesta = respuesta;
        }*/
        // ENVIAR
        $scope.enviar = function(esNuevo){
            var esCorrecto = false;
            var str = $scope.respuesta;
            //Revisa el tipo de respuesta que tiene el problema, si es "valores" el tipo de verificación
            //es uno, si es "funcion" el tipo de verificación es otro. Revisar el Switch Case
            // console.log('variables: ' + variables['tipoRespuesta']);
            switch(variables['tipoRespuesta']){
                case 'valores':
                    var respuestaEstudiante = str.split(";");
                    var uniqueRespuestaEstudiante = [];
                    $.each(respuestaEstudiante, function(i, el){
                        if($.inArray(el, uniqueRespuestaEstudiante) === -1) uniqueRespuestaEstudiante.push(el);
                    });
                    for (k = 0; k < variables.respuesta.length; k++) 
                    { 
                        var respuestaReal = variables.respuesta[k];
                        var uniqueRespuestaReal = [];
                        $.each(respuestaReal, function(i, el){
                            if($.inArray(el, uniqueRespuestaReal) === -1) uniqueRespuestaReal.push(el);
                        });
                        esCorrecto = esCorrecto || arraysEqualValores(uniqueRespuestaEstudiante.sort(), uniqueRespuestaReal.sort());
                    }
                    // console.log('prueba 1: ' + esCorrecto);
                    break;

                case 'funcion':
                    var respuestaEstudiante = str;
                    var respuestaReal = variables.respuesta;
                    var parser = math.parser();
                    parser.eval('f(x,y,z)='+respuestaEstudiante);
                    parser.eval('g(x,y,z)='+respuestaReal);
                    for(k = 0; k < 10; k++){
                        var x = Math.floor((Math.random() -0.5) * 1000);
                        var y = Math.floor((Math.random() -0.5) * 1000);
                        var z = Math.floor((Math.random() -0.5) * 1000);
                        try {
                            var f = parser.eval('f('+ x +','+ y +','+ z +')');
                            var g = parser.eval('g('+ x +','+ y +','+ z +')');
                        }
                        catch(err) {
                            esCorrecto = false;
                            break;
                        }
                        if(''+f != ''+g){
                            esCorrecto = false;
                            break;
                        }
                        esCorrecto = true;
                    }
                    break;
            }
            $scope.respuestaCorrecta = esCorrecto;
            //console.log('Correcto? ' + esCorrecto);
            // Se espera a que la base de datos devuelva todos los intentos de la asignación. Estos valores se devuelven en la variable "allAttempts"
            // Si aún no se han generado intentos, genera un error, y por lo tanto llama al "catch"
            //$scope.actualizarIntentos();

            if(!(limiteIntentos()))
            {
                $scope.createAttempt();
            }
            if(esNuevo)
            {
                $scope.mensajeRespuesta = "<span class='glyphicon glyphicon-refresh glyphicon-refresh-animate'></span>";
            }
            else if(esCorrecto)
            {
                $scope.mensajeRespuesta = "<font color='green'><span class='glyphicon glyphicon-ok'></span> <b>RESPUESTA CORRECTA</b></font>";
            }
            else
            {
                $scope.mensajeRespuesta = "<font color='red'><span class='glyphicon glyphicon-remove'></span> <b>RESPUESTA INCORRECTA</b>, vuelve a intentarlo</font>";
            }
            $timeout(function() {}, 1000).then(
                function() {
                    $scope.generarEjercicio(esNuevo);
                }
            );
        }

        // Genera un vector del tamaño indicado por la variable num, el cual se utiliza para la función ng-repeat
        $scope.getNumber = function(num) {
            var foo = new Array(num);
            for(var i=0;i<foo.length;i++){
                foo[i]=i;
            }
            return foo;
        }


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
            // console.log('limite intentos. wrongAttempts');
            // console.log($scope.wrongAttempts);
            return (($scope.infoAssignment.attempts != null) && ($scope.wrongAttempts.length >= $scope.infoAssignment.attempts || $scope.rightAttempts.length > 0));
        }

        // Se crean las variables de una asignación nueva.
        $scope.variables_1_2_20a = function() {
            // Se definen las variables del ejercicio
            variables = {};
            variables['raiz1'] = Math.floor((Math.random() -0.5) * 198);
            variables['raiz2'] = Math.floor((Math.random() -0.5) * 198);
            variables['a'] = variables['raiz1'] + variables['raiz2'];
            variables['b'] = variables['raiz1'] * variables['raiz2'];
            variables['respuesta'] = [[(-variables['raiz1']).toString(),(-variables['raiz2']).toString()]];
            // Se define el tipo de respuesta del ejercicio ("valores", "funcion", etc.)
            variables['tipoRespuesta'] = "valores";
        }

        // Se crean las variables de una asignación nueva.
        $scope.variables_1_2_20b = function() {
            // Se definen las variables del ejercicio
            variables = {};
            variables['raiz1'] = Math.floor((Math.random() -0.5) * 198);
            variables['raiz2'] = Math.floor((Math.random() -0.5) * 198);
            variables['a'] = variables['raiz1'] + variables['raiz2'];
            variables['b'] = variables['raiz1'] * variables['raiz2'];
            variables['respuesta'] = [[(0).toString(),(-variables['raiz1']).toString(),(-variables['raiz2']).toString()]];
            // Se define el tipo de respuesta del ejercicio ("valores", "funcion", etc.)
            variables['tipoRespuesta'] = "valores";
        }

        // Se crean las variables de una asignación nueva.
        $scope.variables_1_4_8 = function() {
            // Se definen las variables del ejercicio
            variables = {};
            variables['Fy'] = [];
            variables['Y'] = [];
            variables['respuesta'] = [[]];
            var d = Math.floor(Math.random() * 127) + 1;
            //var n = 32;
            var n = Math.floor(Math.random() * d);
            var a = CQ(n+'/'+d).toString();
            var x0 = 0;
            var y0 = 0;
            var N = [1, 2, 4, 8];
            var h = eval(math.eval('(pi - '+ x0 +') ./ ' + JSON.stringify( N )).toString());
            var Y = [];
            for(var i = 0; i < N.length ; i++){
                variables['Fy'].push([]);
                Y.push([y0]);
                variables['Y'].push([parseFloat(y0).toFixed(3)]);
                for(var j = 0; j < N[i]; j++){
                    var fy = 1-Math.sin(eval(a)*Y[i][j]);
                    variables['Fy'][i].push(eval(parseFloat(fy).toFixed(3)));
                    var y = Y[i][j]+h[i]*fy;
                    Y[i].push(y);
                    variables['Y'][i].push(parseFloat(y).toFixed(3));
                }
                variables['respuesta'][0].push(parseFloat(Y[i][Y[i].length-1]).toFixed(3));
            }
            variables['a'] = math.parse(a).toTex();
            // Se define el tipo de respuesta del ejercicio ("valores", "funcion", etc.)
            variables['tipoRespuesta'] = "valores";
        }

        // Se crean las variables de una asignación nueva.
        $scope.variables_1_4_15 = function() {
            // Se definen las variables del ejercicio

            //console.log('Ingresa a 1.4.15');
            variables = {};
            variables['Ft'] = [];
            variables['T'] = [];
            variables['respuesta'] = [[]];
            var K = 1;
            //var K = Math.floor(Math.random() * 1) + 1;
            var M = Math.floor(Math.random() * 200);
            do{
                var T0 = Math.floor(Math.random() * 200);
            }while(Math.abs(M-T0)<10);
            var h = [0.1, 0.1];
            var N = [10, 20];
            var T = [];
            //console.log('Antes del for. variables: ' + JSON.stringify(variables));
            for(var i = 0; i < N.length ; i++){
                variables['Ft'].push([]);
                T.push([T0]);
                variables['T'].push([parseFloat(T0).toFixed(1)]);
                for(var j = 0; j < N[i]; j++){
                    var ft = K*(M-T[i][j]);
                    variables['Ft'][i].push(eval(parseFloat(ft).toFixed(1)));
                    var t = T[i][j]+h[i]*ft;
                    T[i].push(t);
                    variables['T'][i].push(parseFloat(t).toFixed(1));
                }
                variables['respuesta'][0].push(parseFloat(T[i][T[i].length-1]).toFixed(0));
            }
            //console.log('Despues del for. variables: ' + JSON.stringify(variables));
            variables['K'] = K;
            variables['M'] = M;
            variables['T0'] = T0;
            variables['h'] = h;
            variables['N'] = N;
            //console.log('Despues del otras var. variables: ' + JSON.stringify(variables));
            // Se define el tipo de respuesta del ejercicio ("valores", "funcion", etc.)
            variables['tipoRespuesta'] = "valores";
        }

        // Se crean las variables de una asignación nueva.
        $scope.variables_2_3_17 = function() {
            // Se definen las variables del ejercicio
            variables = {};
            variables['A'] = Math.floor((Math.random() * 18) + 2 );
            variables['b'] = Math.floor((Math.random() * 18) + 2 );
            variables['C'] = Math.floor((Math.random() * 18) + 2 );
            variables['x0'] = Math.floor((Math.random() * 8) + 2 );
            variables['xf'] = variables['x0'] + Math.floor((Math.random() * 18) + 2 );

            variables['respuesta'] = variables['A'] + 'x e^('+ variables['b'] +'x) + ' + (variables['A'] * variables['C']) + 'x';
            variables['respuestaTex'] = math.parse(''+variables.respuesta).toTex()

            variables['tipoRespuesta'] = "funcion";
        }

        // Se crean las variables de una asignación nueva.
        $scope.variables_2_3_30 = function() {
            // Se definen las variables del ejercicio
            variables = {};
            variables['A'] = Math.floor((Math.random() * 17) + 3 );
            variables['b'] = Math.floor((Math.random() * 18) + 2 );
            variables['C'] = (variables['A'] * variables['b'] * variables['b'] + 1) +"/"+ (variables['A'] * variables['b'] * variables['b']);

            variables['respuesta'] = '(x/'+ variables['b'] +' - 1/'+ (variables['A'] * variables['b'] * variables['b']) +' + '+ variables['C'] +' e^-('+ (variables['A'] * variables['b']) +'x))^(1/'+ variables['A'] +')';
            variables['respuestaTex'] = math.parse(''+variables.respuesta).toTex();

            variables['tipoRespuesta'] = "funcion";
        }

        // Se crean las variables de una asignación nueva.
        $scope.variables_2_5_9 = function() {
            // Se definen las variables del ejercicio
            variables = {};
            variables['A'] = Math.floor((Math.random() * 9) + 1 ) * 2;
            variables['b'] = Math.floor((Math.random() * 18) + 2 );
            variables['N'] = Math.floor((Math.random() * 18) + 2 );
            variables['D'] = Math.floor((Math.random() * 10) + 1 ) * (variables['N'] + 2);
            variables['respuesta'] = variables['A']/2 + '* x^2 * y^2 + ' + variables['b'] + ' * x^2 * y + '+ (variables['D']/(variables['N'] + 2)) +' x^'+ (variables['N'] + 2);
            variables['respuestaTex'] = math.parse(''+variables.respuesta).toTex();

            variables['tipoRespuesta'] = "funcion";
        }


        // Se crean las variables de una asignación nueva.
        $scope.variables_3_2_2 = function() {
            // Se definen las variables del ejercicio
            variables = {};
            // concentración de sal en la solución que entra (aleatorio entre 0 y 1)
            variables['K'] = Math.floor(Math.random() * 100 + 1) / 100;
            // razón de entrada y salida de solución salina (aleatorio entero de 1 a 10)
            variables['R'] = Math.floor(Math.random() * 10) + 1 ;
            // volumen inicial dentro del tanque con solución salina (aleatorio entero entre 50 y 1000)
            variables['V'] = Math.floor(Math.random() * 951) + 50;
            // Kg de sal disueltos inicialmente (aleatorio entre 0.3 y 1)
            variables['S'] = (Math.floor(Math.random() * 8) + 3) / 10;
            // concentración final para a que se quiere hallar el tiempo (aleatorio entre 0 y 0.1)
            variables['Kf'] = (Math.floor(Math.random() * 10) + 1) / 100;
            // tiempo en que se quiere averiguar la concentración de sal (aleatorio entero entre 1 y 100)
            variables['T'] = (Math.floor(Math.random() * 100) + 1);
            //
            variables['R1'] = Math.floor(variables['K'] * variables['R'] * 10000) / 10000;
            variables['R2'] = Math.floor(variables['R'] / variables['V'] * 10000) / 10000;
            variables['R3'] = Math.floor(variables['R1'] / variables['R2'] * 10000) / 10000;
            variables['Rfinal'] = variables['R3'] + (variables['S'] - variables['R3']) * math.exp(-variables['R2']*variables['T']);
            //variables['Tfinal'] = math.log( ( variables['Kf'] + variables['R3'] ) / ( variables['S'] - variables['R3'] ) ) / (variables['R2']);
            variables['Tfinal'] = math.log( ( variables['Kf'] * variables['V'] - variables['R3'] ) / ( variables['S'] - variables['R3'] ) ) / -(variables['R2']);
            variables['respuesta'] = [[(variables['Rfinal']).toString(),(variables['Tfinal']).toString()]];
            // Se define el tipo de respuesta del ejercicio ("valores", "funcion", etc.)
            variables['tipoRespuesta'] = "valores";
        }
/*
        $scope.variables_3_3_7 = function() {
            // Se definen las variables del ejercicio
            variables = {};
            // temperatura de la oficina en la mañana (aleatorio entero entre 20 y 30)
            variables['To'] = Math.floor(Math.random() * 11) + 20;
            // Temperatura exterior (aleatorio entero entre 31 y 40)
            variables['E'] = Math.floor(Math.random() * 10) + 31;
            // constante del edificio (aleatorio entre 1 y 10)
            variables['H'] = Math.floor(Math.random() * 10) + 1;
            // hora a la que se quiere averiguar la temperatura (aleatorio entero de 2 a 6)
            variables['hora'] = Math.floor(Math.random() * 5) + 2;
            // concentración final para a que se quiere hallar el tiempo (aleatorio entre 0 y 0.1)
            //
            variables['K'] = Math.floor(1 / variables['H'] * 10000) / 10000;
            variables['Ce'] = Math.floor( (variables['To'] - variables['V']) * math.exp() * 10000) / 10000;
            variables['Tfinal'] = math.log( ( variables['Kf'] + variables['R3'] ) / ( variables['S'] - variables['R3'] ) ) / -(variables['R2']);
            variables['respuesta'] = [[(variables['Tfinal']).toString()]];
            // Se define el tipo de respuesta del ejercicio ("valores", "funcion", etc.)
            variables['tipoRespuesta'] = "valores";
        }*/
}]);
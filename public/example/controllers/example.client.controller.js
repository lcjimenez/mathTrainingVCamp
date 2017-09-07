angular.module('example').controller('ExampleController', ['$scope', '$window', '$timeout', '$location', 'Authentication', 'InfoAssignment',
  function($scope, $window, $timeout, $location, Authentication, InfoAssignment) {
    $scope.authentication = Authentication;
    $scope.infoAssignment = InfoAssignment;
    // Revisa si el usuario es el administrador
    $scope.esAdmin = ($scope.authentication.user == null ? false : $scope.authentication.user.username == 'lcjimenez');
    //setTimeout(function() {MathJax.Hub.Queue(["Typeset",MathJax.Hub]);});

    // Se definen las asignaciones, con sus respectivos "tipos"
$scope.asignaciones = [{'tipo':'Talleres','numeroIntentos':10,'ayudas':true, 'muestraSolucion':true,
                          'ejercicios':[{'guia':1, 'enabled': false,'nombre':'1-2-20a','tipoRespuesta':'valores'},
                                        {'guia':1, 'enabled': false,'nombre':'1-2-20b','tipoRespuesta':'valores'},
                                        {'guia':1, 'enabled': false,'nombre':'1-4-8','tipoRespuesta':'valores'},
                                        {'guia':1, 'enabled': false,'nombre':'1-4-15','tipoRespuesta':'valores'},
                                        {'guia':1, 'enabled': false,'nombre':'2-3-17','tipoRespuesta':'funcion'},
                                        {'guia':1, 'enabled': false,'nombre':'2-3-30','tipoRespuesta':'funcion'},
                                        {'guia':1, 'enabled': false,'nombre':'2-5-9','tipoRespuesta':'funcion'},
                                        {'guia':2, 'enabled': false,'nombre':'3-2-2','tipoRespuesta':'valores'},
                                        {'guia':2, 'enabled': false,'nombre':'3-3-7','tipoRespuesta':'valores'},
                                        {'guia':2, 'enabled': false,'nombre':'3-3-10','tipoRespuesta':'valores'},
                                        {'guia':2, 'enabled': false,'nombre':'3-5-3','tipoRespuesta':'valores'},
                                        {'guia':2, 'enabled': false,'nombre':'4-2-17a','tipoRespuesta':'funcion'},
                                        {'guia':2, 'enabled': false,'nombre':'4-2-17b','tipoRespuesta':'funcion'},
                                        {'guia':2, 'enabled': false,'nombre':'4-2-17c','tipoRespuesta':'funcion'},
                                        {'guia':3, 'enabled': false,'nombre':'5-2-17','tipoRespuesta':'valores'},
                                        {'guia':3, 'enabled': false,'nombre':'5-2-19','tipoRespuesta':'valores'},
                                        {'guia':3, 'enabled': false,'nombre':'6-3-3a','tipoRespuesta':'funcion'},
                                        {'guia':3, 'enabled': false,'nombre':'6-3-3b','tipoRespuesta':'funcion'},
                                        {'guia':3, 'enabled': false,'nombre':'6-3-3c','tipoRespuesta':'funcion'},
                                        {'guia':4, 'enabled': true,'nombre':'7-4-21','tipoRespuesta':'funcion'},
                                        {'guia':4, 'enabled': true,'nombre':'7-4-23','tipoRespuesta':'funcion'}]},
                         {'tipo':'Quices','numeroIntentos':1,'ayudas':false, 'muestraSolucion':false,
                          'ejercicios':[{'guia':1, 'enabled': false,'nombre':'1-2-20a','tipoRespuesta':'valores'},
                                        {'guia':1, 'enabled': false,'nombre':'1-2-20b','tipoRespuesta':'valores'},
                                        {'guia':1, 'enabled': false,'nombre':'1-4-8','tipoRespuesta':'valores'},
                                        {'guia':1, 'enabled': false,'nombre':'1-4-15','tipoRespuesta':'valores'},
                                        {'guia':1, 'enabled': false,'nombre':'2-3-17a','tipoRespuesta':'funcion'},
                                        {'guia':1, 'enabled': false,'nombre':'2-3-30','tipoRespuesta':'funcion'},
                                        {'guia':1, 'enabled': false,'nombre':'2-5-9','tipoRespuesta':'funcion'},
                                        {'guia':2, 'enabled': false,'nombre':'3-2-2','tipoRespuesta':'valores'},
                                        {'guia':2, 'enabled': false,'nombre':'3-3-7','tipoRespuesta':'valores'},
                                        {'guia':2, 'enabled': false,'nombre':'3-3-10','tipoRespuesta':'valores'},
                                        {'guia':2, 'enabled': false,'nombre':'3-5-3','tipoRespuesta':'valores'},
                                        {'guia':2, 'enabled': false,'nombre':'4-2-17a','tipoRespuesta':'funcion'},
                                        {'guia':2, 'enabled': false,'nombre':'4-2-17b','tipoRespuesta':'funcion'},
                                        {'guia':2, 'enabled': false,'nombre':'4-2-17c','tipoRespuesta':'funcion'},
                                        {'guia':3, 'enabled': false,'nombre':'5-2-17','tipoRespuesta':'valores'},
                                        {'guia':3, 'enabled': false,'nombre':'5-2-19','tipoRespuesta':'valores'},
                                        {'guia':3, 'enabled': false,'nombre':'6-3-3a','tipoRespuesta':'funcion'},
                                        {'guia':3, 'enabled': false,'nombre':'6-3-3b','tipoRespuesta':'funcion'},
                                        {'guia':3, 'enabled': false,'nombre':'6-3-3c','tipoRespuesta':'funcion'},
                                        {'guia':4, 'enabled': true,'nombre':'7-4-21','tipoRespuesta':'funcion'},
                                        {'guia':4, 'enabled': true,'nombre':'7-4-23','tipoRespuesta':'funcion'}]}];
  
  // Variable asociada a la asignación que contiene el grupo de ejercicios que se están realizando (talleres, quices, etc.). La variables cambia con el menú.
  $scope.asignacion = $scope.asignaciones[0];
  // Se ajustan los parametros de la asignacion dentro del servicio InfoAssignment para que se puede pasar entre diferentes scope.
  $scope.infoAssignment.type = $scope.asignacion.tipo;
  $scope.infoAssignment.attempts = $scope.asignacion.numeroIntentos;
  $scope.infoAssignment.help = $scope.asignacion.ayudas;
  $scope.infoAssignment.showSolution = $scope.asignacion.muestraSolucion;



  // Variable asociada al ejercicio particular que se está realizando. La variables cambia al cambiar la item de la paginación. 
  //$scope.ejercicio = {};
  // Varible que indica la ubicanción (dentro de la paginación) del ejercicio que se está realizando.
  $scope.indice;
  // Variable que contiene las variables del ejercicio que se está realizando en el momento.
  var tiposVariables = ['en curso', 'correctas' , 'erradas'];
  var variables = {};
  var enCurso = {};
  var correctas = [];
  var erradas = [];
  
  $scope.intentos = '';
  $scope.mostrarAyuda = true;
  
  
  // PAGINACIÓN
  // Hace parte de la paginación. Al pulsar disminuye el índice de la paginación. Si es el primer item no hace nada.
  $scope.previo = function(){
    if($scope.indice === 0){
      return;
    }else{
    $scope.indice = $scope.indice - 1; 
    $scope.ejercicio = $scope.asignacion.ejercicios[$scope.indice]; 
    $scope.iniciar(false);
    }
  }
  
  // Hace parte de la paginación. Al pulsar aumenta el índice de la paginación. Si es el último item no hace nada.
  $scope.siguiente = function(){
    if($scope.indice === $scope.asignacion.ejercicios.length-1){
      return;
    }else{
    $scope.indice = $scope.indice + 1; 
    $scope.ejercicio = $scope.asignacion.ejercicios[$scope.indice]; 
    $scope.iniciar(false);
    }
  }
  
  // ELECCIÓN ASIGNACIÓN
  // Con el menú se elige una asignación, y ésta se guarda dentro de la variable asignación. Adicionalmente se 
  // borra la información del ejercicio previo, y su ídice, y se borra el enunciado.
  $scope.asignacionSeleccionada = function(asignacion){
    $scope.asignacion = asignacion;
    $scope.infoAssignment.type = $scope.asignacion.tipo;
    $scope.infoAssignment.attempts = $scope.asignacion.numeroIntentos;
    $scope.infoAssignment.help = $scope.asignacion.ayudas;
    $scope.infoAssignment.showSolution = $scope.asignacion.muestraSolucion;

    $scope.ejercicio = {};
    $scope.indice = null;
    
    
    $scope.intentos = "";
    $scope.ayudaDeshabilitada = !($scope.asignacion.ayudas);
  }
  
  // Se observa cuál es la asignación que está elegida, para resaltarla dentro del menú.
  $scope.estaAsignacionActiva = function(verAsignacion){ 
    return verAsignacion === $scope.asignacion;
  };
  
  // ELECCIÓN EJERCICIO
  // Con la paginación se elige un ejercicio, y éste se guarda dentro de la variables ajercicio. Adicionalmente se 
  // corre el ejercicio escogido pero no se generan variables nuevas
  $scope.ejercicioSeleccionado = function(ejercicio,indice){
    //$scope.ejercicio = ejercicio;
    $scope.infoAssignment.exercise = ejercicio.nombre;
    $scope.infoAssignment.answerType = ejercicio.tipoRespuesta;
    $scope.indice = indice;
    $location.path("/assignments/"+ ejercicio.nombre);
    //$scope.iniciar(false);

    //$scope.estado = $scope.ejercicio.tipoRespuesta;
  }
  // Se observa cuál es el ejercicio que está elegido, para resaltarlo dentro de la paginación.
  $scope.estaEjercicioActivo = function(verEjercicio){ 
    return verEjercicio === $scope.ejercicio;
  };

  // INICIAR
  // Función que indica que se debe iniciar un ejercio. Se debe ingresar una variables que indique si las variables 
  // del ejercicio son nuevas o si se toman las almacenadas previamente para el mismo ejercicio.
  $scope.iniciar = function(esNuevo)
  {
    $scope.generarVariables(esNuevo);
    $timeout(function() {}, 1000).then(
      function() {
      
        variables = (correctas != null ? correctas[0] : enCurso);
        var texto = $scope.$eval($scope.ejercicio.textFunc);
        $scope.enunciado = texto.enunciado;
        $scope.solucion = (limiteIntentos() && $scope.asignacion.muestraSolucion ? texto.solucion : "");
        $scope.respuestaSolucion = (limiteIntentos() ? texto.respuestaSolucion : "");
//        $scope.respuestaSolucion= (limiteIntentos() ? (correctas != null ? correctas[correctas.length-1].respuesta_enviada :(erradas != null ? erradas[correctas.length-1].respuesta_enviada :"")) : "");
        $scope.respuesta = (limiteIntentos() ? (correctas != null ? correctas[correctas.length-1].respuesta_enviada :(erradas != null ? erradas[erradas.length-1].respuesta_enviada:"")) : "");
//        $scope.respuesta = "";
        $scope.mensajeRespuesta = (correctas == null ? (!limiteIntentos() ? "" : "<font color='red'><span class='glyphicon glyphicon-remove'></span> <b>0% - SE AGOTARON LOS INTENTOS</b></font>" ) : "<font color='green'><span class='glyphicon glyphicon-ok'></span> <b>100% - EL EJERCICIO SE HA RESUELTO CORRECTAMENTE</b></font>");
        $scope.intentos = 'Intentos: '+ ((erradas == null ? 0 : erradas.length) + (correctas == null ? 0 : correctas.length)) +'/'+($scope.asignacion.numeroIntentos == null ? '∞': $scope.asignacion.numeroIntentos);
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        $scope.deshabilitado = limiteIntentos();
        $scope.ayudaDeshabilitada = limiteIntentos() || !($scope.asignacion.ayudas);
      }
    );
  
  }

  // ENVIAR
  $scope.enviar = function(esNuevo){
    var str = $scope.respuesta;
    
    //Revisa el tipo de respuesta que tiene el problema, si es "valores" el tipo de verificación
    //es uno, si es "funcion" el tipo de verificación es otro. Revisar el Switch Case
    switch($scope.ejercicio.tipoRespuesta){
      case 'valores':
        var respuestaEstudiante = str.split(";");
        var uniqueRespuestaEstudiante = [];
        $.each(respuestaEstudiante, function(i, el){
          if($.inArray(el, uniqueRespuestaEstudiante) === -1) uniqueRespuestaEstudiante.push(el);
        });
        
        var esCorrecto = false;
        
        for (k = 0; k < variables.respuesta.length; k++) 
        { 
          var respuestaReal = variables.respuesta[k];
          var uniqueRespuestaReal = [];
          $.each(respuestaReal, function(i, el){
            if($.inArray(el, uniqueRespuestaReal) === -1) uniqueRespuestaReal.push(el);
          });
          
          esCorrecto = esCorrecto || arraysEqualValores(uniqueRespuestaEstudiante.sort(), uniqueRespuestaReal.sort());
        }
        break;
      case 'funcion':
        var respuestaEstudiante = str;
        var esCorrecto = false;
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


    

    
    if(!(limiteIntentos()))
    {
      $scope.guardarRespuesta(esCorrecto);
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
        $scope.iniciar(esNuevo);
      }
    );
  }
                  
  function arraysEqualValores(arr1, arr2) {
      if(arr1.length !== arr2.length)
          return false;
      for(var i = arr1.length; i--;) {
          if(arr1[i].replace(/\\/g,'\ ').replace(/ /g,"") !== arr2[i].replace(/\\/g,'\ ').replace(/ /g,""))
              return false;
      }
  
      return true;
  }
  
  function limiteIntentos()
  {
    return (($scope.infoAssignment.attempts != null) && ((erradas == null ? 0 : erradas.length) >= $scope.infoAssignment.attempts || correctas != null));
  }
  
  
  // VARIABLES
  // Genera las variables del ejercicio
  $scope.generarVariables = function(varNuevas){
    // google.script.run.withSuccessHandler(
    //   function(memoria)
    //   {
    //     var nuevasVariables = $scope.$eval($scope.ejercicio.varFunc); // Llama a la función que genera las variables del ejercicio escogido.
    //     var accion = tiposVariables[0];
        
    //     if (memoria == null)
    //     {
    //       memoria = {};
    //       memoria[$scope.asignacion.tipo] = {};
    //       memoria[$scope.asignacion.tipo][$scope.ejercicio.nombre] = {};
    //       memoria[$scope.asignacion.tipo][$scope.ejercicio.nombre][tiposVariables[0]] = nuevasVariables;
    //       //google.script.run.guardarParametros(memoria);
    //     }
    //     else if (memoria[$scope.asignacion.tipo] == null)
    //     {
    //       memoria[$scope.asignacion.tipo] = {};
    //       memoria[$scope.asignacion.tipo][$scope.ejercicio.nombre] = {};
    //       memoria[$scope.asignacion.tipo][$scope.ejercicio.nombre][tiposVariables[0]] = nuevasVariables;
    //       //google.script.run.guardarParametros(memoria);
    //     }
    //     else if (memoria[$scope.asignacion.tipo][$scope.ejercicio.nombre] == null)
    //     {
    //       memoria[$scope.asignacion.tipo][$scope.ejercicio.nombre] = {};
    //       memoria[$scope.asignacion.tipo][$scope.ejercicio.nombre][tiposVariables[0]] = nuevasVariables;
    //       //google.script.run.guardarParametros(memoria);
    //     }
    //     else if(varNuevas)
    //     {
    //       memoria[$scope.asignacion.tipo][$scope.ejercicio.nombre][tiposVariables[0]] = nuevasVariables;
    //       //google.script.run.guardarParametros(memoria);
    //     }
    //     enCurso = memoria[$scope.asignacion.tipo][$scope.ejercicio.nombre][tiposVariables[0]];
    //     correctas = memoria[$scope.asignacion.tipo][$scope.ejercicio.nombre][tiposVariables[1]];
    //     erradas = memoria[$scope.asignacion.tipo][$scope.ejercicio.nombre][tiposVariables[2]];
        
    //   }
    // ).obtenerParametros();
  }
   
  // GUARDAR
  // Guardar respuesta
  $scope.guardarRespuesta = function(esCorrecto){
    // google.script.run.withSuccessHandler(
    //   function(memoria)
    //   {
        
    //     var accion = (esCorrecto ?  tiposVariables[1] : tiposVariables[2]);
        
    //     var variablesProvi = enCurso;
        
    //     if (memoria[$scope.asignacion.tipo][$scope.ejercicio.nombre][accion] == null)
    //     {
    //       memoria[$scope.asignacion.tipo][$scope.ejercicio.nombre][accion] = [];
    //     }
        
    //     variablesProvi['tiempo_fin'] = Date();
    //     variablesProvi['respuesta_enviada'] = $scope.respuesta.split(";");
        
    //     memoria[$scope.asignacion.tipo][$scope.ejercicio.nombre][accion].push(variablesProvi);
    //     //google.script.run.guardarParametros(memoria);
    //   }
    // ).obtenerParametros();
  }
  
  // AYUDA
  // Ayudar a resolver
  $scope.ayudameAResolverlo = function(){
    var texto = $scope.$eval($scope.ejercicio.textFunc);
    $scope.enunciado = texto.enunciado;
    $scope.solucion = texto.solucion;
    $scope.respuestaSolucion = texto.respuestaSolucion;
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    $scope.deshabilitado = true;
    //$scope.ayudaDeshabilitada = true;
    $scope.guardarRespuesta(false);
    $timeout(function() {}, 3000).then(
      function()
      {
        $scope.generarVariables(true);
      }
    );
  }

    
  function guidGenerator(){
    var S4 = function() {
      return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }
    
    $scope.varEj_1_2_20a = function(){
      var variables = {};
      variables['id'] = guidGenerator();
      variables['tiempo_inicio'] = Date();
      variables['raiz1'] = Math.floor((Math.random() -0.5) * 198);
      variables['raiz2'] = Math.floor((Math.random() -0.5) * 198);
      variables['a'] = variables['raiz1']+variables['raiz2'];
      variables['b'] = variables['raiz1']*variables['raiz2'];
      variables['respuesta'] = [[(-variables['raiz1']).toString(),(-variables['raiz2']).toString()]];
      return variables;
    };
    
    $scope.ej_1_2_20a = function(){
      var enunciado =  "<p>Determine los valores de $m$ para los que la función $\\phi \\left( x \\right) = { e }^{ mx }$ es una solución de la ecuación:</p>"+
      "<div id='formulaEnunciado'> "+
      " $$\\frac { { d }^{ 2 }y }{ d{ x }^{ 2 } } " + ( variables.a < 0 ? ' ' : '+') + variables.a + " \\frac { dy }{ dx } " + ( variables.b < 0 ? ' ' : '+') + variables.b + " y = 0 $$" +
      "</div>"+
      "<p>Nota: Debe ingresar las respuestas como valores <b>enteros</b> y separado por punto y coma ($;$), por ejemplo, respuestas de la forma $4;5$ o de la forma $3;4;7$.</p>"+
      "<br>";
      
      var solucion = "<p>Podemos observar que si reemplazamos la función $\\phi \\left( x \\right) = { e }^{ mx }$ dentro de la ecuación obtenemos</p>"+
      "<div id='formula1'>$$ {\\left( { e }^{ mx }\\right)}^{''}"+(variables.a < 0 ? "" : "+")+variables.a+" {\\left( { e }^{ mx }\\right)}^{'}"+(variables.b < 0 ? "" : "+")+variables.b+" \\left( { e }^{ mx }\\right)=0$$</div>"+
      "<div id='formula1'>$$ \\left( { m }^{ 2 }{ e }^{ mx }\\right)"+(variables.a < 0 ? "" : "+")+variables.a+"\\left( m { e }^{ mx } \\right)"+(variables.b < 0 ? "" : "+")+variables.b+"\\left(  { e }^{ mx } \\right)=0$$</div>"+
      "<div id='formula1'>$$ { e }^{ mx } \\left( { m }^{ 2 }"+(variables.a < 0 ? "" : "+")+variables.a+"m"+(variables.b < 0 ? "" : "+")+variables.b+" \\right)=0$$</div>"+
      "<p>Debido a que ${ e }^{ mx } \\ne 0$ para todo valor de $x$ deducimos que</p>"+
      "<div id='formula2'>$$ { m }^{ 2 }"+(variables.a < 0 ? "" : "+")+variables.a+" m "+(variables.b < 0 ? "" : "+")+variables.b+"=0$$</div>"+
      "<p>Factorizando obtenemos</p>"+
      "<div id='formula3'>$$ \\left( m "+(variables.raiz1 < 0 ? "" : "+")+variables.raiz1+" \\right) \\left( m "+(variables.raiz2 < 0 ? "" : "+")+variables.raiz2+" \\right)=0$$</div>";
      
      var respuestaSolucion = "<p>La función es solución para <span id=respuesta1>$ m ="+ variables.respuesta[0][0]+" $</span> y para <span id=respuesta2>$ m ="+ variables.respuesta[0][1]+" $</span>.</p>";
      
      return {'enunciado':enunciado,'solucion':solucion, 'respuestaSolucion':respuestaSolucion};
    }
    
    $scope.varEj_1_2_20b = function (){
      var variables = {};
      variables['id'] = guidGenerator();
      variables['tiempo_inicio'] = Date();
      variables['raiz1'] = Math.floor((Math.random() -0.5) * 198);
      variables['raiz2'] = Math.floor((Math.random() -0.5) * 198);
      variables['a'] = variables['raiz1']+variables['raiz2'];
      variables['b'] = variables['raiz1']*variables['raiz2'];
      variables['respuesta'] = [[(0).toString(),(-variables['raiz1']).toString(),(-variables['raiz2']).toString()]];
      return variables;
    }
    
    $scope.ej_1_2_20b = function(){
      var enunciado =  "<p>Determine los valores de $m$ para los que la función $\\phi \\left( x \\right) = { e }^{ mx }$ es una solución de la ecuación:</p>"+
      "<div id='formulaEnunciado'> "+
      " $$\\frac { { d }^{ 3 }y }{ d{ x }^{ 3 } } " + ( variables.a < 0 ? ' ' : '+') + variables.a + " \\frac { { d }^{ 2 }y }{ d{ x }^{ 2 } } " + ( variables.b < 0 ? ' ' : '+') + variables.b + " \\frac { dy }{ dx } = 0 $$" +
      "</div>"+
      "<p>Nota: Debe ingresar las respuestas como valores <b>enteros</b> y separado por punto y coma ($;$), por ejemplo, respuestas de la forma $4;5$ o de la forma $3;4;7$.</p>"+
      "<br>";
      
      var solucion = "<p>Podemos observar que si reemplazamos la función $\\phi \\left( x \\right) = { e }^{ mx }$ dentro de la ecuación obtenemos</p>"+
      "<div id='formula1'>$$ {\\left( { e }^{ mx }\\right)}^{'''}"+(variables.a < 0 ? "" : "+")+variables.a+" {\\left( { e }^{ mx }\\right)}^{''}"+(variables.b < 0 ? "" : "+")+variables.b+" {\\left( { e }^{ mx }\\right)}^{'}=0$$</div>"+
      "<div id='formula1'>$$ \\left( { m }^{ 3 }{ e }^{ mx }\\right)"+(variables.a < 0 ? "" : "+")+variables.a+"\\left( { m }^{ 2 } { e }^{ mx } \\right)"+(variables.b < 0 ? "" : "+")+variables.b+"\\left( m  { e }^{ mx } \\right)=0$$</div>"+
      "<div id='formula1'>$$ { e }^{ mx } \\left( { m }^{ 3 }"+(variables.a < 0 ? "" : "+")+variables.a+"{ m }^{ 2 }"+(variables.b < 0 ? "" : "+")+variables.b+" m \\right)=0$$</div>"+
      "<p>Debido a que ${ e }^{ mx } \\ne 0$ para todo valor de $x$ deducimos que</p>"+
      "<div id='formula2'>$$ { m }^{ 3 }"+(variables.a < 0 ? "" : "+")+variables.a+" { m }^{ 2 } "+(variables.b < 0 ? "" : "+")+variables.b+" m=0$$</div>"+
      "<p>Factorizando obtenemos</p>"+
      "<div id='formula2'>$$ m \\left( { m }^{ 2 }"+(variables.a < 0 ? "" : "+")+variables.a+" m "+(variables.b < 0 ? "" : "+")+variables.b+" \\right) =0$$</div>"+
      "<div id='formula3'>$$ m \\left( m "+(variables.raiz1 < 0 ? "" : "+")+variables.raiz1+" \\right) \\left( m "+(variables.raiz2 < 0 ? "" : "+")+variables.raiz2+" \\right)=0$$</div>";
      
      var respuestaSolucion = "<p>La función es solución para <span id=respuesta1>$ m ="+ variables.respuesta[0][0]+" $</span>, para <span id=respuesta2>$ m ="+ variables.respuesta[0][1]+" $</span> y para <span id=respuesta2>$ m ="+ variables.respuesta[0][2]+" $</span>.</p>";

      return {'enunciado':enunciado,'solucion':solucion, 'respuestaSolucion':respuestaSolucion};
    }
    
    $scope.varEj_1_4_8 = function (){
      var variables = {};
      variables['id'] = guidGenerator();
      variables['tiempo_inicio'] = Date();
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
      variables['a'] = a;
      return variables;
    }
    
    $scope.ej_1_4_8 = function(){
      var enunciado =  "<p>Utilice el método de Euler para aproximar la solución del problema</p>"+
      "<div> "+
      " $$\\frac { dy }{ dx } = 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot y \\right) $$" +
      "</div>"+
      "<p>con condición inicial</p>"+
      "<div> "+
      " $$ y \\left( 0 \\right) = 0 $$" +
      "</div>"+
      "<p>en $ x = \\pi $ usando $1$, $2$, $4$ y $8$ pasos.</p>"+
      "<p>Nota: Debe ingresar las respuestas como valores con <b>tres decimales</b> y separado por punto y coma ($;$), por ejemplo, respuestas de la forma $1.234;2.546$ o de la forma $1.208;6.405;2.388$.</p>"+
      "<br>";
      
      var solucion = "<p>Los valores iniciales son $x_0 = y_0 = 0$ y $ f\\left( x, y \\right) = 1 - \\sin \\left( " + math.parse(variables.a).toTex() + "\\cdot y \\right) $. Si el número de pasos es $N$, entonces cada paso sería </p>"+
      "<div>$$ h = \\frac{ \\left( \\pi - x_0 \\right)}{ N } = \\frac{ \\pi }{ N } $$</div>"+
      "<p>Recordemos que la formula recursiva del método de Euler es, para $n = 0, 1,..., N$,</p>"+
      "<div>$$ x_{n+1} = x_n + h $$</div>"+
      "<div>$$ y_{n+1} = y_n + h \\cdot f \\left( x_n , y_n \\right) = y_n + h \\cdot \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + "\\cdot y_n \\right) \\right) $$</div>"+
      "<p>Para $N = 1$, $h = \\pi$,</p>"+
      "<div>$$ x_1 = x_0 + h = 0 + \\pi = \\pi $$</div>"+
      "<div>$$ y_1 = y_0 + h \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  y_0 \\right) \\right) = 0 + \\pi \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  0 \\right) \\right) = \\pi \\cdot "+ variables.Fy[0][0] +" \\approx "+ variables.Y[0][1] +" $$</div>"+
      "<p>Para $N = 2$, $h = \\frac{\\pi}{2}$,</p>"+
      "<div>$$ x_1 = x_0 + h = 0 + \\frac{\\pi}{2} = \\frac{\\pi}{2} $$</div>"+
      "<div>$$ y_1 = y_0 + h \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  y_0 \\right) \\right) = 0 + \\frac{\\pi}{2} \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  0 \\right) \\right) = \\frac{\\pi}{2}  \\cdot "+ variables.Fy[1][0] +" \\approx "+ variables.Y[1][1] +" $$</div>"+
      "<div>$$ x_2 = x_1 + h = \\frac{\\pi}{2} + \\frac{\\pi}{2} = \\pi $$</div>"+
      "<div>$$ y_2 = y_1 + h \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  y_1 \\right) \\right) = "+ variables.Y[1][1] +" + \\frac{\\pi}{2} \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  "+ variables.Y[1][1] +" \\right) \\right) = "+ variables.Y[1][1] +" + \\frac{\\pi}{2}  \\cdot "+ variables.Fy[1][1] +"  \\approx "+ variables.Y[1][2] +" $$</div>"+
      "<p>Para $N = 4$, $h = \\frac{\\pi}{4}$,</p>"+
      "<div>$$ x_1 = x_0 + h = 0 + \\frac{\\pi}{4} = \\frac{\\pi}{4} $$</div>"+
      "<div>$$ y_1 = y_0 + h \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  y_0 \\right) \\right) = 0 + \\frac{\\pi}{4} \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  0 \\right) \\right) = \\frac{\\pi}{4}  \\cdot "+ variables.Fy[2][0] +" \\approx "+ variables.Y[2][1] +" $$</div>"+
      "<div>$$ x_2 = x_1 + h = \\frac{\\pi}{4} + \\frac{\\pi}{4} = \\frac{\\pi}{2} $$</div>"+
      "<div>$$ y_2 = y_1 + h \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  y_1 \\right) \\right) = "+ variables.Y[2][1] +" + \\frac{\\pi}{4} \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  "+ variables.Y[2][1] +" \\right) \\right) = "+ variables.Y[2][1] +" + \\frac{\\pi}{4}  \\cdot "+ variables.Fy[2][1] +" \\approx "+ variables.Y[2][2] +" $$</div>"+
      "<div>$$ x_3 = x_2 + h = \\frac{\\pi}{2} + \\frac{\\pi}{4} = \\frac{3 \\cdot \\pi}{4} $$</div>"+
      "<div>$$ y_3 = y_2 + h \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  y_2 \\right) \\right) = "+ variables.Y[2][2] +" + \\frac{\\pi}{4} \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  "+ variables.Y[2][2] +" \\right) \\right) = "+ variables.Y[2][2] +" + \\frac{\\pi}{4}  \\cdot "+ variables.Fy[2][2] +" \\approx "+ variables.Y[2][3] +" $$</div>"+
      "<div>$$ x_4 = x_3 + h = \\frac{ 3 \\cdot \\pi }{4} + \\frac{\\pi}{4} = \\pi $$</div>"+
      "<div>$$ y_4 = y_3 + h \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  y_3 \\right) \\right) = "+ variables.Y[2][3] +" + \\frac{\\pi}{4} \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  "+ variables.Y[2][3] +" \\right) \\right) = "+ variables.Y[2][3] +" + \\frac{\\pi}{4}  \\cdot "+ variables.Fy[2][3] +" \\approx "+ variables.Y[2][4] +" $$</div>"+
      "<p>Para $N = 8$, $h = \\frac{\\pi}{8}$,</p>"+
      "<div>$$ x_1 = x_0 + h = 0 + \\frac{\\pi}{8} = \\frac{\\pi}{8} $$</div>"+
      "<div>$$ y_1 = y_0 + h \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  y_0 \\right) \\right) = 0 + \\frac{\\pi}{8} \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  0 \\right) \\right) = \\frac{\\pi}{8}  \\cdot "+ variables.Fy[3][0] +" \\approx "+ variables.Y[3][1] +" $$</div>"+
      "<div>$$ x_2 = x_1 + h = \\frac{\\pi}{8} + \\frac{\\pi}{8} = \\frac{\\pi}{4} $$</div>"+
      "<div>$$ y_2 = y_1 + h \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  y_1 \\right) \\right) = "+ variables.Y[3][1] +" + \\frac{\\pi}{8} \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  "+ variables.Y[3][1] +" \\right) \\right) = "+ variables.Y[3][1] +" + \\frac{\\pi}{8}  \\cdot "+ variables.Fy[3][1] +" \\approx "+ variables.Y[3][2] +" $$</div>"+
      "<div>$$ x_3 = x_2 + h = \\frac{\\pi}{4} + \\frac{\\pi}{8} = \\frac{3 \\cdot \\pi}{8} $$</div>"+
      "<div>$$ y_3 = y_2 + h \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  y_2 \\right) \\right) = "+ variables.Y[3][2] +" + \\frac{\\pi}{8} \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  "+ variables.Y[3][2] +" \\right) \\right) = "+ variables.Y[3][2] +" + \\frac{\\pi}{8}  \\cdot "+ variables.Fy[3][2] +" \\approx "+ variables.Y[3][3] +" $$</div>"+
      "<div>$$ x_4 = x_3 + h = \\frac{ 3 \\cdot \\pi }{8} + \\frac{\\pi}{8} = \\frac{\\pi}{2} $$</div>"+
      "<div>$$ y_4 = y_3 + h \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  y_3 \\right) \\right) = "+ variables.Y[3][3] +" + \\frac{\\pi}{8} \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  "+ variables.Y[3][3] +" \\right) \\right) = "+ variables.Y[3][3] +" + \\frac{\\pi}{8}  \\cdot "+ variables.Fy[3][3] +" \\approx "+ variables.Y[3][4] +" $$</div>"+
      "<div>$$ x_5 = x_4 + h = \\frac{ \\pi }{2} + \\frac{\\pi}{8} = \\frac{ 5 \\cdot \\pi }{8} $$</div>"+
      "<div>$$ y_5 = y_4 + h \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  y_4 \\right) \\right) = "+ variables.Y[3][4] +" + \\frac{\\pi}{8} \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  "+ variables.Y[3][4] +" \\right) \\right) = "+ variables.Y[3][4] +" + \\frac{\\pi}{8}  \\cdot "+ variables.Fy[3][4] +" \\approx "+ variables.Y[3][5] +" $$</div>"+
      "<div>$$ x_6 = x_5 + h = \\frac{ 5 \\cdot \\pi }{8} + \\frac{\\pi}{8} = \\frac{ 3 \\cdot \\pi}{4} $$</div>"+
      "<div>$$ y_6 = y_5 + h \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  y_5 \\right) \\right) = "+ variables.Y[3][5] +" + \\frac{\\pi}{8} \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  "+ variables.Y[3][5] +" \\right) \\right) = "+ variables.Y[3][5] +" + \\frac{\\pi}{8}  \\cdot "+ variables.Fy[3][5] +" \\approx "+ variables.Y[3][6] +" $$</div>"+
      "<div>$$ x_7 = x_6 + h = \\frac{ 3 \\cdot \\pi}{4} + \\frac{\\pi}{8} = \\frac{7 \\cdot \\pi}{8} $$</div>"+
      "<div>$$ y_7 = y_6 + h \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  y_6 \\right) \\right) = "+ variables.Y[3][6] +" + \\frac{\\pi}{8} \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  "+ variables.Y[3][6] +" \\right) \\right) = "+ variables.Y[3][6] +" + \\frac{\\pi}{8}  \\cdot "+ variables.Fy[3][6] +" \\approx "+ variables.Y[3][7] +" $$</div>"+
      "<div>$$ x_8 = x_7 + h = \\frac{ 7 \\cdot \\pi }{8} + \\frac{\\pi}{8} = \\pi $$</div>"+
      "<div>$$ y_8 = y_7 + h \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  y_7 \\right) \\right) = "+ variables.Y[3][7] +" + \\frac{\\pi}{8} \\left( 1 - \\sin \\left( " + math.parse(variables.a).toTex() + " \\cdot  "+ variables.Y[3][7] +" \\right) \\right) = "+ variables.Y[3][7] +" + \\frac{\\pi}{8}  \\cdot "+ variables.Fy[3][7] +" \\approx "+ variables.Y[3][8] +" $$</div>";
            
      //$scope.estado = 'variables';
      var respuestaSolucion = "<p>Las aproximaciones para la solución evaluada en $ \\pi $ serían: $ y \\left( \\pi \\right) = "+ variables.respuesta[0][0]+" $, para $N = 1$, $ y \\left( \\pi \\right) = "+ variables.respuesta[0][1]+" $, para $N = 2$, $ y \\left( \\pi \\right) = "+ variables.respuesta[0][2]+" $, para $N = 4$ y $ y \\left( \\pi \\right) = "+ variables.respuesta[0][3]+" $, para $N = 8$.</p>";
      
      return {'enunciado':enunciado,'solucion':solucion, 'respuestaSolucion':respuestaSolucion};
    }

    $scope.varEj_1_4_15 = function (){
      var variables = {};
      variables['id'] = guidGenerator();
      variables['tiempo_inicio'] = Date();
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
      variables['K'] = K;
      variables['M'] = M;
      variables['T0'] = T0;
      variables['h'] = h;
      variables['N'] = N;
      return variables;
    }
    
    $scope.ej_1_4_15 = function(){
      var enunciado =  "<p>La ley de enfriamiento de Newton establece que la razón de cambio de la termperatura $T \\left( t \\right)$ de un cuerpo es proporcional a la diferencia entre la termperatura del medio $M \\left( t \\right)$ y la termperatrura del cuerpo. Es decir,</p>"+
      "<div> "+
      " $$\\frac { dT }{ dt } = K \\left[ M \\left( t \\right) - T \\left( t \\right) \\right] $$" +
      "</div>"+
      "<p>donde $K$ es una constante. Sea $K = "+ variables.K +" \\left( minutos \\right)^{-1} $ y consideremos una temperatura del medio constante $M \\left( t \\right) = "+ variables.M +"°F $. "+
      "Si el cuerpo tiene un temperatura inicial de $"+ variables.T0 +" °F$, utilice el método de Euler con $h="+ variables.h[0] +"$ para aproximar la termperatura del cuerpo después de:</p>"+
      "<ol type='a'><li>"+ (variables.h[0] * variables.N[0]) +" minutos.</li><li>"+ (variables.h[1] * variables.N[1]) +" minutos.</li></ol>"+
      "<p>Nota: Debe ingresar las respuestas como valores <b>enteros</b> y separado por punto y coma ($;$), por ejemplo, respuestas de la forma $155;152$ o de la forma $126;119$.</p>"+
      "<br>";
      
      var solucion = "<p>Para el ejercicio tenemos que la variable independiente es $t$ y la variable dependiente es la temperatura del cuerpo $T\\left( t \\right)$.</p>"+
        "<p>Adicionalmente, los valores iniciales son $t_0 = 0$ y $T_0 = "+ variables.T0 +" °F $ y $ f\\left( t, T \\right) = K \\left( M - T \\right) $.</p>"+
        "<p>De la formula recursiva del método de Euler para $n = 0, 1,..., N$, donde $N$ es el número de pasos, tenemos que</p>"+
        "<div>$$ t_{n+1} = t_n + h  = t_n + "+variables.h[0]+" $$</div>"+
        "<div>$$ T_{n+1} = T_n + h \\cdot f \\left( t_n , T_n \\right) = T_n + h \\cdot \\left( K \\cdot \\left( M - T_n \\right) \\right) = T_n + "+variables.h[0]+" \\cdot  \\left( " + variables.M + " - T_n \\right) $$</div>"+
        "<p>De esta manera calculamos los valores de $T$ para los diferentes valores de $n$:</p>";
        for(var i = 0; i < variables.N[1]; i++){
          solucion = solucion.concat("<div>$$ t_{"+ (i+1) +"} = t_{"+ (i) +"} + h = "+parseFloat(i*variables.h[1]).toFixed(1)+" + "+ variables.h[1] +" = "+ parseFloat((i+1)*variables.h[1]).toFixed(1) +" $$</div>");
          solucion = solucion.concat("<div>$$ T_{"+ (i+1) +"} = "+eval(variables.T[1][i])+" + "+eval(variables.h[1])+" \\cdot  \\left( " + variables.M + " - "+eval(variables.T[1][i])+" \\right) = "+eval(variables.T[1][i])+" + "+eval(variables.h[1])+" \\cdot \\left("+ eval(variables.Ft[1][i]) +"\\right) \\approx "+ eval(variables.T[1][i+1]) +" $$</div>");
        }
        solucion = solucion.concat("<br>");            

      var respuestaSolucion = "<p>Las aproximaciones para la temperatura serían $ T = "+ variables.respuesta[0][0]+" °F $ en $"+ (variables.h[0] * variables.N[0]) +"$ minutos y $ T = "+ variables.respuesta[0][1]+" °F $ en $"+ (variables.h[1] * variables.N[1]) +"$ minutos.</p>";
      
      return {'enunciado':enunciado,'solucion':solucion, 'respuestaSolucion':respuestaSolucion};
    }
    
    
    $scope.varEj_2_3_17 = function (){
      var variables = {};
      variables['id'] = guidGenerator();
      variables['tiempo_inicio'] = Date();
      variables['A'] = Math.floor((Math.random() * 18) + 2 );
      variables['b'] = Math.floor((Math.random() * 18) + 2 );
      variables['C'] = Math.floor((Math.random() * 18) + 2 );
      variables['x0'] = Math.floor((Math.random() * 8) + 2 );
      variables['xf'] = variables['x0'] + Math.floor((Math.random() * 18) + 2 );
//      variables['respuesta'] = [[ variables['A'] + 'x{ e }^{ '+ variables['b'] +'x }+' + (variables['A'] * variables['C']) + ' x '],
//                                [ variables['A'] + 'x e^{ '+ variables['b'] +'x }+' + (variables['A'] * variables['C']) + ' x ']];
      variables['respuesta'] = variables['A'] + 'x e^('+ variables['b'] +'x) + ' + (variables['A'] * variables['C']) + 'x';
      return variables;
    }
    
    $scope.ej_2_3_17 = function(){
      var enunciado =  "<p>Para la siguiente ecuación diferencial</p>"+
      "<div> $$\\frac { dy }{ dx } - \\frac { y }{ x } = " + (variables.A * variables.b) + " x { e }^{ "+ variables.b +" x } $$ </div>"+
      "<p>suponiendo las siguientes condiciones iniciales</p>"+
      "<div> $$ y\\left( "+ variables.x0 +" \\right) = " + ( variables.A * variables.x0) + " { e }^{ "+ (variables.b * variables.x0) +" } + " + ( variables.A * variables.C * variables.x0 ) + " $$ </div>"+
      "<p>Encuentre la función $ y \\left( x \\right) = ? $ que es solución.</p>"+
      "<br>"+
      "<p>Nota: Recuerde ingresar la respuesta en función de la variable $x$, por ejemplo, respuestas de la forma $4+5 \\cdot x$ o de la forma $x \\cdot e^{ \\left( 2 \\cdot x \\right) }$.</p>"+
      "<br>";
      
      var solucion = "<p>Recordemos que si podemos representar la ecuación diferencial en su forma canónica </p>"+
        "<div> $$ \\frac { dy }{ dx } +P \\left( x \\right) y = Q \\left( x \\right)  $$ </div>"+
        "<p>Podemos calcular el factor integrante $ \\mu \\left( x \\right)  $ mediante la fórmula </p>"+
        "<div> $$ \\mu \\left( x \\right) = { e }^{ \\int { P \\left( x \\right) dx }  } $$ </div>"+
        "<p>Multiplicando la ecuación en su forma canónica por $ \\mu \\left( x \\right)  $ tenemos </p>"+
        "<div> $$ \\mu \\left( x \\right) \\frac { dy }{ dx } +P \\left( x \\right) \\mu \\left( x \\right) y = \\mu \\left( x \\right) Q \\left( x \\right)  $$ </div>"+
        "<p>Y teniendo en cuenta que el lado izquierdo es precisamente $ \\frac { d }{ dx } \\left[ \\mu \\left( x \\right) y \\right] $ tenemos que </p>"+
        "<div> $$ \\frac { d }{ dx } \\left( \\mu \\left( x \\right) y \\right)  = \\mu \\left( x \\right) Q \\left( x \\right)  $$ </div>"+
        "<p>De lo cual podemos despejar $ y \\left( x \\right) $ como </p>"+
        "<div> $$ y \\left( x \\right)  = \\frac{ 1 }{ \\mu \\left( x \\right) } \\int { \\mu \\left( x \\right) Q \\left( x \\right) dx }  $$ </div>"+
        "<p>Reemplazando los valores del ejercicio tenemos </p>"+
        "<div> $$ P \\left( x \\right)  = - \\frac{ 1 }{ x } $$ </div>"+
        "<p>Y </p>"+
        "<div> $$ Q \\left( x \\right)  = " + (variables.A * variables.b) + " x { e }^{ "+ variables.b +" x } $$ </div>"+
        "<p>Por consiguiente </p>"+
        "<div> $$ \\mu \\left( x \\right) = { e }^{ - \\int { \\frac{ 1 }{ x } dx }  } = { e }^{ -\\ln { \\left( x \\right)  }  } = { e }^{ \\ln { \\left( { x }^{ -1 } \\right)  }  } = { x }^{ -1 } = \\frac { 1 }{ x }  $$ </div>"+
        "<p>Reemplazando tenemos </p>"+
        "<div> $$ y \\left( x \\right)  = \\frac{ 1 }{ { 1 }/{ x } } \\int { \\left( \\frac { 1 }{ x } \\right) \\left( " + (variables.A * variables.b) + " x { e }^{ "+ variables.b +" x }  \\right) dx } = x \\int { " + (variables.A * variables.b) + " { e }^{ "+ variables.b +" x } dx } = x \\left( \\frac{ " + (variables.A * variables.b) + " }{ " + variables.b + " } { e }^{ "+ variables.b +" x } + C \\right) = "+ variables.A  +" x { e }^{ "+ variables.b +" x } + C x $$ </div>"+
        "<p>Evaluando la función en las condiciones iniciales tenemos </p>"+
        "<div> $$ y \\left( "+ variables.x0 +" \\right)  = "+ variables.A  +" \\left( "+ variables.x0 +" \\right) { e }^{ "+ variables.b +" \\left( "+ variables.x0 +" \\right) } + \\left( "+ variables.x0 +" \\right) C = "+ (variables.A  * variables.x0) +" { e }^{ "+ (variables.b * variables.x0) +" } + "+ variables.x0 +"  C  $$ </div>"+
        "<p>De acuerdo al enunciado del problema tenemos </p>"+
        "<div> $$ "+ (variables.A  * variables.x0) +" { e }^{ "+ (variables.b * variables.x0) +" } + "+ variables.x0 +"  C = " + (variables.A * variables.x0) + " { e }^{ "+ (variables.b * variables.x0) +" } + " + ( variables.A * variables.C * variables.x0 ) + " $$ </div>"+
        "<p>Despejando $ C $ tenemos </p>"+
        "<div> $$ C = \\frac{"+( variables.A * variables.C * variables.x0 ) +"}{"+variables.x0 +"} = "+ (variables.A * variables.C ) +" $$ </div>"+
        "<p>Reemplazando el resultado en la ecuación obtenemos finalmente $ y \\left( x \\right) $ como</p>"+
        "<div> $$ y \\left( x \\right) = " + math.parse(''+variables.respuesta).toTex() + " $$ </div>";
        
        var respuestaSolucion = "<p> La respuesta es $ "+ math.parse(''+variables.respuesta).toTex() +" $.</p>";
      
      return {'enunciado':enunciado,'solucion':solucion, 'respuestaSolucion':respuestaSolucion};
    }
    
    
    
    $scope.varEj_2_3_30 = function (){
      var variables = {};
      variables['id'] = guidGenerator();
      variables['tiempo_inicio'] = Date();
      variables['A'] = Math.floor((Math.random() * 17) + 3 );
      variables['b'] = Math.floor((Math.random() * 18) + 2 );
      variables['C'] = (variables['A'] * variables['b'] * variables['b'] + 1) +"/"+ (variables['A'] * variables['b'] * variables['b']);
//      variables['x0'] = 0;
//      variables['xf'] = variables['x0'] + Math.floor((Math.random() * 18) + 2 );
//      variables['respuesta'] = [['\\sqrt ['+ variables['A'] +']{ \\frac { x }{ '+ variables['b'] +' } - \\frac { 1 }{ '+ (variables['A'] * variables['b'] * variables['b']) +' } + '+ variables['C'] +' e^{-'+ (variables['A'] * variables['b']) +' x} }' ]];
        variables['respuesta'] = '(x/'+ variables['b'] +' - 1/'+ (variables['A'] * variables['b'] * variables['b']) +' + '+ variables['C'] +' e^-('+ (variables['A'] * variables['b']) +'x))^(1/'+ variables['A'] +')';

      return variables;
    }
    
    $scope.ej_2_3_30 = function(){
      var enunciado =  "<p>Para la siguiente ecuación diferencial</p>"+
      "<div> $$ \\frac { dy }{ dx } + "+ variables.b +" y = x { y }^{ "+ (1-variables.A) +" } $$ </div>"+
      "<p>suponiendo las siguientes condiciones iniciales</p>"+
      "<div> $$ y\\left( 0 \\right) = 1 $$ </div>"+
      "<p>Encuentre la función $ y \\left( x \\right) = ? $ que es solución.</p>"+
      "<br>"+
      "<p>Nota: Recuerde ingresar la respuesta en función de la variable $x$, por ejemplo, respuestas de la forma $4+5 \\cdot x$ o de la forma $x \\cdot e^{ \\left( 2 \\cdot x \\right) }$. Utilice únicamente números <b>fraccionarios</b>, por ejemplo, de la forma $\\frac{1}{10}$.</p>"+
      "<br>";
      
      var solucion = "<p>Multiplicando ambos lados de la ecuación por $ y^{"+ (variables.A - 1) +"}$, se obtiene </p>"+
        "<div> $$ y^{"+(variables.A - 1)+"} \\frac { dy }{ dx } + "+ variables.b +" y^{"+ variables.A +"}  = x  $$ </div>"+
        "<p>Si $ v = y^{"+ (variables.A) +"}$, entonces $\\frac{dv}{dx} = "+ (variables.A) +" y^{"+ (variables.A - 1) +"} \\frac{dy}{dx} $. De lo cual se puede despejar $y^{"+ (variables.A - 1) +"} \\frac{dy}{dx} = \\frac{1}{"+ (variables.A) +"} \\frac{dv}{dx} $, obteniendo </p>"+
        "<div> $$ \\frac{1}{"+ (variables.A) +"} \\frac{dv}{dx} + "+ variables.b +" v  = x  $$ </div>"+
        "<p>Reescribiendo la ecuación en su forma canónica</p>"+
        "<div> $$ \\frac{dv}{dx} + "+ (variables.A * variables.b) +" v  = "+ variables.A +" x $$ </div>"+
        "<p>Recordando que representando la ecuación diferencial en su forma canónica </p>"+
        "<div> $$ \\frac { dv }{ dx } +P \\left( x \\right) v = Q \\left( x \\right)  $$ </div>"+
        "<p>Podemos calcular el factor integrante $ \\mu \\left( x \\right)  $ mediante la fórmula </p>"+
        "<div> $$ \\mu \\left( x \\right) = { e }^{ \\int { P \\left( x \\right) dx }  } $$ </div>"+
        "<p>Multiplicando la ecuación en su forma canónica por $ \\mu \\left( x \\right)  $ tenemos </p>"+
        "<div> $$ \\mu \\left( x \\right) \\frac { dv }{ dx } +P \\left( x \\right) \\mu \\left( x \\right) v = \\mu \\left( x \\right) Q \\left( x \\right)  $$ </div>"+
        "<p>Y teniendo en cuenta que el lado izquierdo es precisamente $ \\frac { d }{ dx } \\left[ \\mu \\left( x \\right) v \\right] $ tenemos que </p>"+
        "<div> $$ \\frac { d }{ dx } \\left( \\mu \\left( x \\right) y \\right)  = \\mu \\left( x \\right) Q \\left( x \\right)  $$ </div>"+
        "<p>De lo cual podemos despejar $ v \\left( x \\right) $ como </p>"+
        "<div> $$ v \\left( x \\right)  = \\frac{ 1 }{ \\mu \\left( x \\right) } \\int { \\mu \\left( x \\right) Q \\left( x \\right) dx }  $$ </div>"+
        "<p>Reemplazando los valores del ejercicio tenemos </p>"+
        "<div> $$ P \\left( x \\right)  = "+ (variables.A * variables.b) +" $$ </div>"+
        "<p>Y </p>"+
        "<div> $$ Q \\left( x \\right)  = "+ variables.A +" x $$ </div>"+
        "<p>Por consiguiente </p>"+
        "<div> $$ \\mu \\left( x \\right) = { e }^{ \\int { "+ (variables.A * variables.b) +" dx }  } = { e }^{"+ (variables.A * variables.b) +" x  }  $$ </div>"+
        "<p>Reemplazando tenemos </p>"+
        "<div> $$ v \\left( x \\right)  = { e }^{ - "+ (variables.A * variables.b) +" x  } \\int { \\left( { e }^{ "+ (variables.A * variables.b) +" x  } \\right) \\left( "+ variables.A +" x  \\right) dx } = "+ variables.A +" { e }^{ - "+ (variables.A * variables.b) +" x  } \\int { x { e }^{ "+ (variables.A * variables.b) +" x  }  dx } $$ </div>"+
         "<p>Aplicando el método de integración por partes $\\int{u \\cdot dw} = u \\cdot w - \\int{ w \\cdot du} $, donde $ u = x $, $ dw = { e }^{ "+ (variables.A * variables.b) +" x  } dx $, $ du = dx $ y $ w = \\frac{1}{ "+ (variables.A * variables.b) +" } { e }^{ "+ (variables.A * variables.b) +" x  } $  </p>"+
        "<div> $$ v \\left( x \\right) =  "+ variables.A +" { e }^{ - "+ (variables.A * variables.b) +" x  } \\left( \\left( x \\right) \\left( \\frac{1}{ "+ (variables.A * variables.b) +" } { e }^{ "+ (variables.A * variables.b) +" x  } \\right) - \\int {  \\left( \\frac{1}{ "+ (variables.A * variables.b) +" } { e }^{ "+ (variables.A * variables.b) +" x  } \\right)  dx } \\right) = \\frac{ { e }^{ - "+ (variables.A * variables.b) +" x  } }{ "+ variables.b +" } \\left(  x { e }^{ "+ (variables.A * variables.b) +" x  } - \\int {  { e }^{ "+ (variables.A * variables.b) +" x  }  dx } \\right) $$ </div>"+
        "<div> $$ v \\left( x \\right) = \\frac{ { e }^{ - "+ (variables.A * variables.b) +" x  } }{ "+ variables.b +" } \\left(  x { e }^{ "+ (variables.A * variables.b) +" x  } - \\frac{{ e }^{ "+ (variables.A * variables.b) +" x  }}{ "+ (variables.A * variables.b) +" } + C_1 \\right) = \\frac{x}{"+variables.b+"}  - \\frac{1}{ "+ (variables.A * (variables.b * variables.b)) +" } + C { e }^{ -"+ (variables.A * variables.b) +" x  } $$ </div>"+
        "<p>Despejando $ y \\left( x \\right) = \\left( v \\left( x \\right) \\right)^{\\frac{1}{"+ variables.A +"}}  $ tenemos que </p>"+
        "<div> $$ y \\left( x \\right) = \\left( \\frac{x}{"+variables.b+"}  - \\frac{1}{ "+ (variables.A * (variables.b * variables.b)) +" } + C { e }^{ -"+ (variables.A * variables.b) +" x  } \\right)^{ \\left( \\frac{1}{ "+ variables.A +" } \\right) }  $$ </div>"+
        "<p>De acuerdo al enunciado del problema tenemos </p>"+
        "<div> $$ y \\left( 0 \\right) = \\left( \\frac{ \\left( 0 \\right) }{"+variables.b+"}  - \\frac{1}{ "+ (variables.A * (variables.b * variables.b)) +" } + C { e }^{ -"+ (variables.A * variables.b) +" \\left( 0 \\right)  } \\right) ^ {\\left(\\frac{1}{ "+ variables.A +" }\\right)} = 1 $$ </div>"+
        "<div> $$ \\left( C - \\frac{1}{ "+ (variables.A * variables.b * variables.b) +" }\\right)^{\\left(\\frac{1}{ "+ variables.A +" }\\right)} = 1 $$ </div>"+
        "<p>Despejando $ C $ tenemos </p>"+
        "<div> $$ C = 1 + \\frac{1}{ "+ (variables.A * variables.b * variables.b) +" } = \\frac{"+ (variables.A * variables.b * variables.b + 1) +"}{ "+ (variables.A * variables.b * variables.b) +" } $$ </div>"+
        "<p>Reemplazando el resultado en la ecuación obtenemos finalmente $ y \\left( x \\right) $ como</p>"+
        "<div> $$ y \\left( x \\right) = " + math.parse(''+variables.respuesta).toTex() + " $$ </div>";
        
        var respuestaSolucion = "<p> La respuesta es $ "+ math.parse(''+variables.respuesta).toTex() +" $.</p>";
      
      return {'enunciado':enunciado,'solucion':solucion, 'respuestaSolucion':respuestaSolucion};
    }

    $scope.varEj_2_5_9 = function (){
      var variables = {};
      variables['id'] = guidGenerator();
      variables['tiempo_inicio'] = Date();
      variables['A'] = Math.floor((Math.random() * 9) + 1 ) * 2;
      variables['b'] = Math.floor((Math.random() * 18) + 2 );
      variables['N'] = Math.floor((Math.random() * 18) + 2 );
      variables['D'] = Math.floor((Math.random() * 10) + 1 ) * (variables['N'] + 2);
      variables['respuesta'] = variables['A']/2 + '* x^2 * y^2 + ' + variables['b'] + ' * x^2 * y + '+ (variables['D']/(variables['N'] + 2)) +' x^'+ (variables['N'] + 2);
      return variables;
    }

    $scope.ej_2_5_9 = function(){
      var enunciado =  "<p>Obtenga $F\\left( x,y \\right)$ de la solución implicita de</p>"+
      "<div> $$\\left( "+ variables.A +" \\cdot y^2 + "+ (2*variables.b) +" \\cdot y + "+ variables.D +" \\cdot x^{"+ variables.N +"} \\right) dx = \\left( "+ variables.A +" \\cdot x \\cdot y + "+variables.b+" \\cdot x \\right) dy = 0 $$ </div>"+
      "<br>"+
      "<p>Nota: Si la solución implicita es $F\\left(x,y\\right) = C $, en la respuesta sólo incluya $F \\left( x,y \\right)$. Recuerde ingresar la respuesta en función de las variables $x$ y $y$, por ejemplo, respuestas de la forma $x \\cdot y + y^2$ o de la forma $\\frac{x}{y}$.</p>"+
      "<br>";
            
      var solucion = "<p>Se debe calcular la derivada de $M\\left( x \\right)\$ y $N\\left(x\\right)\$ </p>"+
        "<div> $$ M \\left( x,y \\right) = "+variables.A+" \\cdot y^2 + "+(2*variables.b)+" \\cdot y + "+ variables.D +" \\cdot x^{ "+ variables.N +" } $$ </div>"+
        "<div> $$ N \\left( x,y \\right) = "+variables.A+" \\cdot x \\cdot y + "+(variables.b)+" \\cdot x $$ </div>"+
        "<div> $$ \\frac{\\partial M}{\\partial y} = "+ (2*variables.A)+" \\cdot y + "+(2*variables.b)+"$$ </div>"+
        "<div> $$ \\frac{\\partial N}{\\partial x} = "+ (variables.A)+" \\cdot y + "+(variables.b)+"$$ </div>"+
        "<p>Se puede observar que la ecuación no es exacta dado que $M \\left( x,y \\right) \\neq N \\left( x,y \\right)$, de esta manera se debe calcular el cociente</p>"+
        "<div> $$ \\frac{\\frac{\\partial M}{\\partial y} - \\frac{\\partial N}{\\partial x}}{N} = \\frac{\\left("+ (2*variables.A)+" \\cdot y + "+(2*variables.b)+"\\right) - \\left("+ (variables.A)+" \\cdot y + "+(variables.b)+"\\right) }{"+variables.A+" \\cdot x \\cdot y + "+(variables.b)+" \\cdot x} = \\frac{ "+variables.A+" \\cdot y + "+(variables.b)+"  }{x \\cdot \\left("+variables.A+" \\cdot y + "+(variables.b)+" \\right)} = \\frac{1}{x}$$ </div>"+
        "<p>cuyo resultado depende únicamente de $x$, de tal manera que de la ecuación se puede obtener un factor integrante </p>"+
        "<div> $$ \\mu \\left( x \\right) = e^\\left(\\int{\\frac{1}{x}dx}\\right) = e^{\\left(\\ln \\left| x \\right| \\right)} = \\left| x \\right|  $$ </div>"+
        "<p>Se puede observar que si $\\mu$ es un factor integrante $-\\mu$ también lo es.</p>"+
        "<div> $$ \\mu \\left( x \\right) = x $$ </div>"+
        "<p>De esta manera si se multiplica la ecuación diferencia por $x$ se obtendrá la ecuación exacta</p>"+
        "<div> $$\\left( "+ variables.A +" \\cdot y^2 + "+ (2*variables.b) +" \\cdot y + "+ variables.D +" \\cdot x^{"+ variables.N +"} \\right) x dx + x^2 \\left( "+ variables.A +" \\cdot y + "+variables.b+" \\right) dy = 0 $$ </div>"+
        "<p>De lo cual se puede obtener</p>"+
        "<div> $$ F\\left(x,y\\right) = \\int{ x^2 \\left( "+ variables.A +" \\cdot y + "+variables.b+" \\right) dy } = x^2 \\left( "+ (variables.A / 2) +" \\cdot y^2 + "+variables.b+" \\cdot y \\right) + h \\left( x \\right) $$ </div>"+
        "<p>Despejando</p>"+
        "<div> $$ \\frac{\\partial F}{\\partial x} = 2 \\cdot x \\left( "+ (variables.A / 2) +" \\cdot y^2 + "+variables.b+" \\cdot y \\right) + \\frac{\\partial h \\left( x \\right)}{\\partial x} = \\left( "+ variables.A +" \\cdot y^2 + "+ (2*variables.b) +" \\cdot y + "+ variables.D +" \\cdot x^{"+ variables.N +"} \\right) x $$ </div>"+
          "<div> $$ \\frac{\\partial h \\left( x \\right)}{\\partial x} = "+ variables.D +" \\cdot x^{"+ (variables.N + 1) +"} $$ </div>"+
          "<div> $$ h \\left( x \\right) = \\int{"+ variables.D +" \\cdot x^{"+ (variables.N + 1) +"} dx} = "+ ( variables.D / (variables.N + 2) ) +" \\cdot x^{"+ (variables.N + 2) +"}  $$ </div>"+
          "<div> $$ F\\left(x,y\\right) = x^2 \\left( "+ (variables.A / 2) +" \\cdot y^2 + "+variables.b+" \\cdot y \\right) + "+ ( variables.D / (variables.N + 2) ) +" \\cdot x^{"+ (variables.N + 2) +"} $$ </div>"+
          "<div> $$ F\\left(x,y\\right) = "+ (variables.A / 2) +" \\cdot x^2 \\cdot y^2 + "+variables.b+" \\cdot x^2 \\cdot y + "+ ( variables.D / (variables.N + 2) ) +" \\cdot x^{"+ (variables.N + 2) +"} $$ </div>"+
        "<br>";
              
        var respuestaSolucion = "<p> Obteniendo como respuesta es $ "+ math.parse(''+variables.respuesta).toTex() +" $.</p>";
      
      return {'enunciado':enunciado,'solucion':solucion, 'respuestaSolucion':respuestaSolucion};
    }




  }
]);
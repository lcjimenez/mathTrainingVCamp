angular.module('assignments').directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        html = html.replace(/\$\$([^$]+)\$\$/g, "<span class=\"formula\" mathjax-bind=\"$1\"></span>");
        html = html.replace(/\$([^$]+)\$/g, "<span class=\"inline-formula\" mathjax-bind=\"$1\"></span>");
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
});
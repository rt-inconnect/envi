(function () {
  'use strict';

  angular
  .module('app.slider', [])
  .directive('enviSlider', ['$state', '$rootScope', enviSliderDirective]);

  function enviSliderDirective ($state, $rootScope) {
    var directive = {
      link: link,
      restrict: 'A',
      templateUrl: 'templates/slider/slider.html'
    };

    return directive;

    function link (scope, el, attrs) {
      scope.sMode = $state.current.name || 'obj';

      scope.$watch('sMode', function () {
        if (scope.sMode == 'sector') {
          $rootScope.emptyData();
          $state.go('sector');
        }
      });

    };
  };

})();
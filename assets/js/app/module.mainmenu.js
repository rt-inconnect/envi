(function () {
  'use strict';

  angular
  .module('app.mainmenu', [])
  .directive('mainmenu', ['Xtranslate', MainmenuDirective]);

  function MainmenuDirective (Xtranslate) {
    var directive = {
      link: link,
      restrict: 'A',
      templateUrl: 'templates/mainmenu/mainmenu.html'
    };

    return directive;

    function link (scope, el, attrs) {
      
      scope.langItems = [
        {
          "text": Xtranslate.langs.ru,
          "click": "setLang('ru')"
        },
        {
          "text": Xtranslate.langs.en,
          "click": "setLang('en')"
        }
      ];
      scope.setLang = Xtranslate.setLang;

    };
  };

})();
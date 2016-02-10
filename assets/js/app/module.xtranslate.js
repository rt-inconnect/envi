(function () {
	'use strict';

	angular
	.module('app.xtranslate', ['pascalprecht.translate'])
	.factory('Xtranslate', ['$rootScope', '$window', '$translate', XtranslateFactory])
  .filter('xtranslate', ['Xtranslate', xtranslate]);


	function XtranslateFactory ($rootScope, $window, $translate) {
	  var langs = {en: 'English', ru: 'Русский'};

		var factory = {
			activate: activate,
			setLang: setLang,
			langs: langs,
			lang: {}
		};

		return factory;

		function activate (cb) {
	    $rootScope.$on('$translateChangeSuccess', function () {
	      factory.lang.key = $translate.use();
	      factory.lang.name = langs[factory.lang.key];
	      cb(factory.lang);
	    });
		};

		function setLang (langKey) {
      $translate.use(langKey).then(function () {
	      $window.location.reload();
	      factory.lang.key = langKey;
	      factory.lang.name = langs[langKey];
      });
		}
	};

  function xtranslate (Xtranslate) {
    return function (rec, field) {
    	if (!rec) return '';
      return rec[field + Xtranslate.lang.key.capitalizeFirstLetter()];
    };
  };

})();
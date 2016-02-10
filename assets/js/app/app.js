(function () {
  'use strict';

  var app = angular.module('app', [
    'ui.router',
    'ngSanitize',
    'ngAnimate',
    'mgcrea.ngStrap',

    'app.config',
    'app.constant',
    'app.xtranslate',
    'app.auth',
    'app.mainmenu',
    'app.slider',
    'app.republic',
    'app.org',
    'app.obj',
    'app.sector',
    'app.knowledge',
    'app.gis'
  ]);
})();
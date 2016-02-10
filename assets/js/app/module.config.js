(function () {
  'use strict';

  angular
  .module('app.config', ['pascalprecht.translate', 'ngCookies', 'app.chart'])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$translateProvider', config])
  .run(['$injector', '$rootScope', '$state', 'Republic', 'Org', 'Obj', run])
  .controller('App', ['$scope', 'Xtranslate', AppCtrl]);

  function config ($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider) {
    $urlRouterProvider.otherwise('/obj');
    $stateProvider
      .state('obj', {
        url: '/obj?org&obj',
        templateUrl: '/templates/obj/layout.html',
        controller: 'Obj',
        controllerAs: 'obj'
      })
      .state('sector', {
        url: '/sector',
        templateUrl: '/templates/sector/layout.html',
        controller: 'Sector',
        controllerAs: 'sector'
      });

    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    $translateProvider.useStaticFilesLoader({
      prefix: 'l10n/',
      suffix: '.json'
    });
    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('ru');
    $translateProvider.useCookieStorage();

  };

  function run ($injector, $rootScope, $state, Republic, Org, Obj) {
    
    $injector.get("$http").defaults.transformRequest = function(data, headersGetter) {
      headersGetter()['Client-Token'] = token;
      if (data) {
        return angular.toJson(data);
      }
    };

    $rootScope.$state = $state;
    $rootScope.selects = {
      rep: 0,
      org: $state.params.org || 0,
      obj: $state.params.obj || 0
    };

    $rootScope.commonData = {
      republics: Republic.query(),
      orgs: [],
      objs: [],
      obj: {},
      org: {}
    };

    $rootScope.$watch('selects.rep', function (nVal) {
      if (nVal) {
        Org.query({repId: nVal}).then(function (orgs) {
          $rootScope.commonData.orgs = orgs;
          getOrg();
        });
      };
    });

    $rootScope.$watch('selects.org', function (nVal) {
      if (nVal) {
        Obj.query({orgId: nVal, limit: 99999}).then(function (objs) {
          $rootScope.commonData.objs = objs;
          $rootScope.$broadcast('orgChanged', {org: nVal});
          $state.go('obj', {org: nVal});
          getOrg();
        });
      };
    });

    $rootScope.$watch('selects.obj', function (nVal) {
      if (nVal && typeof nVal == 'number') {
        Obj.get(nVal).then(function (obj) {
          $rootScope.selects.rep = obj.orgId.repId;
          $rootScope.selects.org = obj.orgId.id;
          $rootScope.commonData.obj = obj;
          $rootScope.$broadcast('objChanged', {obj: obj});
          $state.go('obj', {org: obj.orgId.id, obj: obj.id});
        });
      }
    });

    $rootScope.$watch('commonData.obj', function (nVal) {
      if (nVal && typeof nVal == 'object') {
        $rootScope.selects.obj = nVal.id;
      }
    });

    function getOrg () {
      var index = $rootScope.commonData.orgs.map(function (o) { return o.id }).indexOf($rootScope.selects.org);
      $rootScope.commonData.org = $rootScope.commonData.orgs[index];
    };

    $rootScope.emptyData = function () {
      $rootScope.selects = {
        rep: 0,
        org: 0,
        obj: 0
      };

      $rootScope.commonData = {
        republics: Republic.query(),
        orgs: [],
        objs: [],
        obj: {},
        org: {}
      };
    };

    $rootScope.print = function(id) {
      var printContents = document.getElementById(id).innerHTML;
      var popupWin = window.open('', '_blank');
      popupWin.document.open()
      popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="/styles/cosmo.css" /><link rel="stylesheet" type="text/css" href="/styles/style.css" /></head><body onload="window.print()">' + printContents + '</html>');
      popupWin.document.close();
    };

  }

  function AppCtrl ($scope, Xtranslate) {
    $scope.vm = this;
    Xtranslate.activate(function () {
      $scope.vm.lang = Xtranslate.lang;
    });    
  };

})();
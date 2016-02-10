(function () {
  'use strict';

  angular
  .module('app.obj', ['angularFileUpload'])
  .controller('Obj', ['$scope', '$rootScope', '$state', 'Xtranslate', 'ObjData', 'ObjParam', 'Chart', 'Auth', 'FileUploader', 'API', ObjCtrl])
  .controller('ObjPassport', ['$scope', '$rootScope', 'Obj', 'FileUploader', 'API', 'Auth', ObjPassportCtrl])
  .factory('Obj',['API', '$http', '$q', ObjFactory])
  .factory('ObjData',['API', '$http', '$q', ObjDataFactory])
  .factory('ObjParam',['API', '$http', '$q', ObjParamFactory])
  .directive('objFilterDirective', ['$rootScope', '$state', 'Republic', 'Org', 'Obj', objFilterDirective])
  .directive('objPassportDirective', [objPassportDirective]);

  function ObjCtrl ($scope, $rootScope, $state, Xtranslate, ObjData, ObjParam, Chart, Auth, FileUploader, API) {
    $scope.vm = this;
    $scope.vm.data = [];
    $scope.vm.chart = [];
    $scope.vm.chartTypes = Chart.types;
    $scope.vm.sChart = 'line';
    $scope.vm.secondAxe = false;

    $scope.vm.param = 0;
    $scope.vm.curParam = {};
    $scope.vm.params = [];

    $scope.vm.curData = {};

    if (!$state.params.org) return false;
    
    ObjParam.query($state.params.org).then(function (params) {
      $scope.vm.params = params;
      if (params.length > 0) $scope.vm.param = params[0].id;
    });

    $scope.vm.paramAction = function (isUpdate) {
      $scope.vm.xparam = isUpdate ? $scope.vm.params[paramIndex()] : {};
    };

    $scope.vm.saveParam = function (param, hide) {
      Auth.check('admin', function () {
        param.orgId = $state.params.org;
        ObjParam[param.id ? 'update' : 'create'](param).then(function (res) {
          param.id ? param = res : $scope.vm.params.push(res);
          hide();
        });
      });
    };

    $scope.vm.destroyParam = function () {
      Auth.check('admin', function () {
        if (!confirm(TRANSLATE[Xtranslate.lang.key].destroy)) return false;
        ObjParam.destroy($scope.vm.param).then(function () {
          $scope.vm.params.splice(paramIndex(), 1);
          $scope.vm.param = 0;
        });
      });
    };

    $scope.$watch('vm.param', function (nVal) {
      $scope.vm.curParam = $scope.vm.params[paramIndex()];
      loadObjData(nVal, 'data', function () {
        if ($scope.vm.curParam.secondAxe) {
          loadObjData($scope.vm.curParam.secondAxe.id, 'secondAxe', renderLastData);
        } else {
          $scope.vm.secondAxe = false;
          renderLastData();
        }
      });
    });

    $scope.vm.editData = function (rec, key) {
      Auth.check($rootScope.selects.rep, function () {
        var field = key ? 'm' + key : 'limit';
        var data = parseFloat(prompt(key + '.' + rec.year, rec[field]));
        if (!Number.isNaN(data)) {
          rec[field] = parseFloat(data.toFixed(2));
          ObjData.update(rec);
          getChartData();
        }
      });
    };

    $scope.vm.addYear = function () {
      Auth.check($rootScope.selects.rep, function () {
        var params = {
          year: parseInt(prompt(TRANSLATE[Xtranslate.lang.key].year, '')),
          param: $scope.vm.param,
          obj: $state.params.obj
        } 
        ObjData.addYear(params).then(function (year) {
          $scope.vm.data.push(year);
        });
      });
    };

    $scope.vm.chartAnotherYear = function (row) {
      getChartData(row);
    };

    $scope.vm.changeChart = function (type) {
      $scope.vm.sChart = type.code;
      getChartData();
    };

    var uploader = $scope.vm.uploader = new FileUploader({ 
      removeAfterUpload: true,
      queueLimit: 1,
      withCredentials: true
    });

    $scope.vm.importData = function () {
      Auth.check($rootScope.selects.rep, function () { uploader.uploadAll(); });
    };
    uploader.onAfterAddingFile = function (item) {
      item.url = API.obj.data + '/importData/?obj=' + $rootScope.selects.obj + '&param=' + $scope.vm.param;
    };    
    uploader.onCompleteItem = function (item, response, status, headers) {
      $scope.vm.data = response;
      item.hide();
    };

    function paramIndex () {
      return $scope.vm.params.map(function (p) { return p.id }).indexOf($scope.vm.param);
    };

    function lastDataItem () {
      if ($scope.vm.data.length > 0) {
        return $scope.vm.data[$scope.vm.data.length - 1];
      }
      return false;
    };

    function loadObjData (param, loadIn, callback) {
      if (param && $state.params.obj) {
        ObjData.query({paramId: param, objId: $state.params.obj}).then(function (data) {
          $scope.vm[loadIn] = data;
          if (callback) callback();
        });
      }
    };

    function renderLastData () {
      var lastItem = lastDataItem();
      if (lastItem) getChartData(lastItem);
    };

    function getChartData (data) {
      if (data) {
        $scope.vm.data.forEach(function (r) { r.selected = false; });
        data.selected = true;
      } else {
        $scope.vm.data.forEach(function(r) { if (r.selected) data = r; });
      }
      data.labelEn = $scope.vm.curParam.nameEn;
      data.labelRu = $scope.vm.curParam.nameRu;
      $scope.vm.curData = data;
      $scope.vm.chart = Chart.renderObj( $scope.vm.sChart, data, getSecondAxeByYear(data.year) );
    };

    function getSecondAxeByYear (year) {
      if ($scope.vm.secondAxe) {
        var index = $scope.vm.secondAxe.map(function (o) { return o.year; }).indexOf(year);
        if (index >= 0) {
          $scope.vm.secondAxe[index].label = $scope.vm.curParam.secondAxe.nameRu;
          return $scope.vm.secondAxe[index];          
        }
      }
      return false;
    };

  };

  function ObjPassportCtrl ($scope, $rootScope, Obj, FileUploader, API, Auth) {
    $scope.vm = this;
    $scope.vm.isEdit = false;
    $scope.vm.toggleEdit = function () {
      Auth.check($rootScope.selects.rep, function () {
        $rootScope.commonData.obj.isEdit = !$rootScope.commonData.obj.isEdit;
      });      
    };
    $scope.vm.save = function (data) {
      Obj.update(data).then(function (res) {
        $rootScope.commonData.obj.isEdit = false;
      });
    };
    var uploader = $scope.vm.uploader = new FileUploader({ 
      removeAfterUpload: true,
      queueLimit: 1,
      withCredentials: true
    });
    uploader.onAfterAddingFile = function (item) {
      item.url = API.obj.picture + '/' + item.obj.id;
      item.upload();
    };
    uploader.onCompleteItem = function (item, response, status, headers) {
      item.obj.picture = response;
    };
  };

  function ObjFactory (API, $http, $q) {
    var factory = {
      query: query,
      get: get,
      search: search,
      update: update
    };

    return factory;

    function query (params) {
      if (!params) params = { limit:99999 };
      var defer = $q.defer();
      $http.get(API.obj.query, {params:params}).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };

    function get (id) {
      if (!id) return false;
      var defer = $q.defer();
      $http.get(API.obj.query + '/' + id).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };

    function search (name) {
      if (!name) return false;
      var defer = $q.defer();
      $http.get(API.obj.query + '/search', {params:{ name: name }}).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };

    function update (data) {
      if (!data && !data.id) return false;
      var defer = $q.defer();
      $http.put(API.obj.query + '/' + data.id, data).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };    
  };

  function ObjDataFactory (API, $http, $q) {
    var factory = {
      query: query,
      update: update,
      addYear: addYear
    };

    return factory;

    function query (params) {
      if (!params) params = {};
      params.limit = 999999;
      var defer = $q.defer();
      $http.get(API.obj.data, {params:params}).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };

    function update (data) {
      if (!data && !data.id) return false;
      var defer = $q.defer();
      $http.put(API.obj.data + '/' + data.id, data).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };

    function addYear (params) {
      if (!params.year || !params.param || !params.obj) return false;
      var defer = $q.defer();
      $http.post(API.obj.data + '/addYear', params).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };

  };

  function ObjParamFactory (API, $http, $q) {
    var factory = {
      query: query,
      create: create,
      update: update,
      destroy: destroy
    };

    return factory;

    function query (orgId) {
      if (!orgId) return [];
      var defer = $q.defer();
      $http.get(API.obj.param, { params: { orgId: orgId } }).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };

    function create (data) {
      if (!data) return false;
      var defer = $q.defer();
      $http.post(API.obj.param, data).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };

    function update (data) {
      if (!data) return false;
      var defer = $q.defer();
      $http.put(API.obj.param + '/' + data.id, data).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };

    function destroy (id) {
      if (!id) return false;
      var defer = $q.defer();
      $http.delete(API.obj.param + '/' + id).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };
  };  

  function objFilterDirective ($rootScope, $state, Republic, Org, Obj) {
    var directive = {
      link: link,
      restrict: 'A',
      templateUrl: 'templates/obj/filter.html'
    };

    return directive;

    function link (scope, el, attrs) {

      if ($state.params.org) {
        Org.get($state.params.org).then(function (org) {
          $rootScope.selects.rep = org.repId.id;
          $rootScope.selects.org = org.id;
        });
      }

      if ($state.params.obj) {
        Obj.get($state.params.obj).then(function (obj) {
          $rootScope.selects.obj = obj.id;
          $rootScope.commonData.obj = obj;
        });
      }

    };
  };

  function objPassportDirective () {
    var directive = {
      //link: link,
      restrict: 'A',
      templateUrl: 'templates/obj/passport.html',
      controller: "ObjPassport",
      controllerAs: "objPassport"
    };

    return directive;
  };

})();
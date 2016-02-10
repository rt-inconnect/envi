(function () {
  'use strict';

  angular
  .module('app.sector', [])
  .controller('Sector', ['$scope', 'Xtranslate', 'PARAMS', 'Auth', 'SectorData', 'SectorParam', 'Republic', 'Chart', SectorCtrl])  
  .factory('SectorData',['API', '$http', '$q', SectorDataFactory])
  .factory('SectorParam',['API', '$http', '$q', SectorParamFactory])
  .directive('sectorPassportDirective', [sectorPassportDirective]);

  function SectorCtrl ($scope, Xtranslate, PARAMS, Auth, SectorData, SectorParam, Republic, Chart) {
    $scope.vm = this;
    $scope.vm.republics = [];
    $scope.vm.chartTypes = Chart.types;
    $scope.vm.sChart = 'line';
    $scope.vm.curParam = {};

    SectorParam.query().then(function (params) {
      $scope.vm.params = params;
      if (params.length > 0) $scope.vm.sParam = params[0].id;
    });
    Republic.query().then(function (republics) {
      PARAMS.intReps.forEach(function (repId) {
        var index = republics.map(function (r) { return r.id; }).indexOf(repId);
        republics.splice(index, 1);
        $scope.vm.republics = republics;
      });
    });
    $scope.$watch('vm.sParam', function () {
      if ($scope.vm.sParam) {
        var index = $scope.vm.params.map(function (p) { return p.id }).indexOf($scope.vm.sParam);
        $scope.vm.curParam = $scope.vm.params[index];
        $scope.vm.datas = [];
        SectorData.query($scope.vm.sParam).then(function (datas) { $scope.vm.datas = datas; });
      }
    });
    $scope.$watch('vm.datas', function () {
      getChartData();
    });    

    $scope.vm.editData = function (rec) {
      if ($scope.vm.curParam.calc > 0) return false;
      Auth.check('admin', function () {
        var i = $scope.vm.republics.map(function (r) { return r.id }).indexOf(rec.repId);
        var republic = $scope.vm.republics[i].nameRu;
        var data = parseFloat(prompt(rec.year + ' - ' + republic, rec.data));
        if (!Number.isNaN(data)) {
          rec.data = parseFloat(data.toFixed(2));
          SectorData.update(rec);
          getChartData();
        }
      });
    };
    $scope.vm.calcTotal = function (data) {
      var total = 0;
      data.forEach(function (d) {
        total += d.data;
      });
      var avgIds = [PARAMS.sector.consumptionHectareId, PARAMS.sector.consumptionPersonId];
      if(avgIds.indexOf($scope.vm.curParam.id) >= 0) total = total / $scope.vm.republics.length;
      return parseFloat(total.toFixed(2));
    };
    $scope.vm.changeChart = function (type) {
      $scope.vm.sChart = type.code;
      getChartData();
    };
    $scope.vm.chartOneRepublic = function (republic) {
      if (republic.selected) {
        republic.selected = false;
      } else {
        $scope.vm.republics.forEach(function (r) { r.selected = false; });
        republic.selected = true;        
      }
      getChartData();
    };

    $scope.vm.paramAction = function (isUpdate) {
      $scope.vm.xparam = isUpdate ? $scope.vm.params[paramIndex()] : {};
    };

    $scope.vm.saveParam = function (param, hide) {
      Auth.check('admin', function () {
        SectorParam[param.id ? 'update' : 'create'](param).then(function (res) {
          param.id ? param = res : $scope.vm.params.push(res);
          hide();
        });
      });
    };

    $scope.vm.destroyParam = function () {
      Auth.check('admin', function () {
        if (!confirm(TRANSLATE[Xtranslate.lang.key].destroy)) return false;
        SectorParam.destroy($scope.vm.sParam).then(function () {
          $scope.vm.params.splice(paramIndex(), 1);
          $scope.vm.sParam = 0;
        });
      });
    };

    $scope.vm.addYear = function () {
      Auth.check('admin', function () {
        var params = {
          year: parseInt(prompt(TRANSLATE[Xtranslate.lang.key].year, '')),
          param: $scope.vm.sParam
        } 
        SectorData.addYear(params).then(function (year) {
          $scope.vm.datas[params.year] = year;
        });
      });
    };

    function getChartData () {
      var republic = false;
      $scope.vm.republics.forEach(function(r) {
        if (r.selected) republic = r;
      });
      $scope.vm.chart = Chart.renderSector(
        $scope.vm.sChart, $scope.vm.datas, republic ? [republic] : $scope.vm.republics
      );
    };

    function paramIndex () {
      return $scope.vm.params.map(function (p) { return p.id }).indexOf($scope.vm.sParam);
    };    

  };

  function SectorDataFactory (API, $http, $q) {
    var factory = {
      query: query,
      update: update,
      addYear: addYear
    };

    return factory;

    function query (paramId) {
      if (!paramId) return [];
      var defer = $q.defer();
      $http.get(API.sector.data + paramId).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };

    function update (rec) {
      if (!rec && !rec.id) return false;
      var defer = $q.defer();
      $http.post(API.sector.dataUpdate, {id:rec.id, data:rec.data}).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };

    function addYear (params) {
      if (!params.year || !params.param) return false;
      var defer = $q.defer();
      $http.post(API.sector.addYear, params).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };    
  };

  function SectorParamFactory (API, $http, $q) {
    var factory = {
      query: query,
      create: create,
      update: update,
      destroy: destroy      
    };

    return factory;

    function query () {
      var defer = $q.defer();
      $http.get(API.sector.paramCtrl).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };

    function create (data) {
      if (!data) return false;
      var defer = $q.defer();
      $http.post(API.sector.paramCtrl, data).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };

    function update (data) {
      if (!data) return false;
      var defer = $q.defer();
      $http.put(API.sector.paramCtrl + '/' + data.id, data).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };

    function destroy (id) {
      if (!id) return false;
      var defer = $q.defer();
      $http.delete(API.sector.paramCtrl + '/' + id).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };    
  };

  function sectorPassportDirective () {
    var directive = {
      //link: link,
      restrict: 'A',
      templateUrl: 'templates/sector/passport.html'
    };

    return directive;
  };
})();
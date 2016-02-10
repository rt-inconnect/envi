(function () {
  'use strict';

  angular
  .module('app.gis', ['uiGmapgoogle-maps'])
  .config(['uiGmapGoogleMapApiProvider', config])
  .controller('Gis', ['$scope', '$rootScope', '$state', 'Org', 'Obj', GisCtrl])
  .directive('gisDirective', [gisDirective]);

  function config (uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      //    key: 'your api key',
      v: '3.17'
    });
  };
  
  function GisCtrl ($scope, $rootScope, $state, Org, Obj) {
    $scope.vm = this;

    var defaultMap = {
      center: { latitude: 40, longitude: 71 },
      zoom: 5
    };

    $scope.vm.map = {
      center: defaultMap.center,
      zoom: defaultMap.zoom,
      markers: [],
      markersEvents: {
        click: function (marker, e, model, args) {
          //console.log(marker, e, model);
          $scope.vm.map.window.model = angular.copy(model);
          //$scope.vm.map.window.marker = angular.copy(marker);
          $scope.vm.map.window.show = true;
          $rootScope.selects.obj = model.id;
        }
      },
      window: {
        marker: {},
        show: false,
        closeClick: function () {
          this.show = false;
        },
        options: {
          pixelOffset: {height: -30, width: 0}
        }
      },
      search: function (val) {
        return Obj.search(val);
      }
    };

    $scope.vm.export = function() {
      var size = { w:870, h:460 };
      var url = 'https://maps.googleapis.com/maps/api/staticmap?';
          url += 'center=' + $scope.vm.map.center.latitude + ',' + $scope.vm.map.center.longitude;
          url += '&size=' + size.w + 'x' + size.h;
          url += '&zoom=' + $scope.vm.map.zoom;
      if ($rootScope.commonData.objs.length > 0) {
        $rootScope.commonData.objs.forEach(function (o) {
          url += '&markers=' + o.latitude + ',' + o.longitude;
        });
      }

      var win = window.open(url, '_blank');
    }

    $scope.$on('orgChanged', function (e, args) {
      if (!$state.params.obj) {
        $scope.vm.map.center = defaultMap.center;
        $scope.vm.map.zoom = defaultMap.zoom;        
      }
    });
    $scope.$on('objChanged', function (e, args) {
      if (args.obj.latitude && args.obj.longitude) {
        $scope.vm.map.center = {
          latitude: args.obj.latitude,
          longitude: args.obj.longitude
        };
        $scope.vm.map.zoom = 8;
        $scope.vm.map.window.model = angular.copy(args.obj);
        $scope.vm.map.window.show = true;
      }
    });

  };

  function gisDirective () {
    var directive = {
      //link: link,
      restrict: 'A',
      templateUrl: 'templates/gis/map.html',
      controller: "Gis",
      controllerAs: "gis"
    };

    return directive;
  };

})();
(function () {
  'use strict';

  angular
  .module('app.knowledge', [])
  .factory('Category',['API', '$http', '$q', CategoryFactory])
  .factory('Knowledge',['API', '$http', '$q', KnowledgeFactory])
  .controller('Knowledge', ['$scope', 'Auth', 'Category', 'Knowledge', KnowledgeCtrl])
  .directive('knowledgeDirective', [knowledgeDirective]);

  function KnowledgeCtrl ($scope, Auth, Category, Knowledge) {
    $scope.vm = this;
    $scope.vm.categories = [];
    $scope.vm.knowledges = [];
    $scope.vm.category = {};
    $scope.vm.knowledge = {};
    $scope.vm.sCategory = 0;
    $scope.vm.sKnowledge = 0;

    Category.query().then(function (categories) {
      $scope.vm.categories = categories;
    });

    $scope.$watch('vm.sCategory', function (nVal) {
      if (nVal) {
        Knowledge.query({categoryId: nVal}).then(function (knowledges) {
          $scope.vm.knowledges = knowledges;
        });
      };
    });

    $scope.$watch('vm.sKnowledge', function (nVal) {
      if (nVal) {
        var index = $scope.vm.knowledges.map(function (o) { return o.id; }).indexOf(nVal),
              url = $scope.vm.knowledges[index].url;
        window.open(url, "knowledge");        
      }
    });

    $scope.vm.saveCategory = function (category) {
      Auth.check('admin', function () {
        Category.create(category).then(function (result) {
          $scope.vm.categories.push(result);
          $scope.vm.category = {};
        });
      });
    };
    $scope.vm.saveKnowledge = function (knowledge) {
      knowledge.categoryId = $scope.vm.sCategory;
      Knowledge.create(knowledge).then(function (result) {
        $scope.vm.knowledges.push(result);
        $scope.vm.knowledge = {};
      });
    };
  };

  function CategoryFactory (API, $http, $q) {
    var factory = {
      query: query,
      create: create
    };

    return factory;

    function query (params) {
      if (!params) params = {};
      var defer = $q.defer();
      $http.get(API.category.query, {params:params}).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };
    function create (params) {
      if (!params) return false;
      var defer = $q.defer();
      $http.post(API.category.query, params).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };
  };

  function KnowledgeFactory (API, $http, $q) {
    var factory = {
      query: query,
      create: create
    };

    return factory;

    function query (params) {
      if (!params) params = {};
      var defer = $q.defer();
      $http.get(API.knowledge.query, {params:params}).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };
    function create (params) {
      if (!params) return false;
      var defer = $q.defer();
      $http.post(API.knowledge.query, params).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };    
  };

  function knowledgeDirective () {
    var directive = {
      //link: link,
      restrict: 'A',
      templateUrl: 'templates/knowledge/directive.html',
      controller: "Knowledge",
      controllerAs: "knowledge"
    };

    return directive;
  };

})();
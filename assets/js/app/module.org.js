(function () {
	'use strict';

	angular
	.module('app.org', [])
	.factory('Org', ['API', '$http', '$q', OrgFactory]);

	function OrgFactory (API, $http, $q) {
    var factory = {
      query: query,
      get: get
    };

    return factory;

    function query (params) {
      if (!params) params = {};
      var defer = $q.defer();
      $http.get(API.org.query, {params:params}).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };

    function get (id) {
      if (!id) return false;
      var defer = $q.defer();
      $http.get(API.org.query + '/' + id).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };
	};

})();
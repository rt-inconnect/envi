(function () {
	'use strict';

	angular
	.module('app.republic', [])
	.factory('Republic', ['API', '$http', '$q', RepublicFactory]);

	function RepublicFactory (API, $http, $q) {
    var factory = {
      query: query
    };

    return factory;

    function query () {
      var defer = $q.defer();
      $http.get(API.republic.query).then(function(res) {
        defer.resolve(res.data);
      });
      return defer.promise;
    };
	};

})();
(function () {
  'use strict';

  angular
  .module('app.auth', [])
  .factory('Auth', ['$http', 'API', AuthFactory]);

  function AuthFactory ($http, API) {
    var self = this;
    self.roles = angular.copy(roles);

    var factory = {
      check: check,
      login: login
    };

    return factory;

    function check (role, callback) {
      if (self.roles.indexOf('admin') >= 0 || self.roles.indexOf(role) >= 0) return callback();
      return this.login(role, callback);
    };

    function login (role, callback) {
      var password = prompt('Введите пароль:', '');
      if (password) 
        $http.post(API.auth.login, { password: md5(password) })
          .success(function (data) {
            self.roles.push(data);
            if (role == data || data == 'admin') return callback();
            errorAlert();
            return false;
          })
          .error(errorAlert);
      else return false;
    };

    function errorAlert () {
      alert('У Вас недостаточно прав!');
    };
  };

})();
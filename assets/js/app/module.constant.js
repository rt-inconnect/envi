(function () {
  'use strict';

  angular
  .module('app.constant', [])
  .constant('API', API())
  .constant('PARAMS', PARAMS());

  function API () {
    return {
      auth: {
        login: '/api/auth/login'
      },
      republic: {
        query: '/api/republic'
      },
      org: {
        query: '/api/org'
      },
      obj: {
        query: '/api/obj',
        picture: '/api/obj/picture',
        param: '/api/objParam',
        data: '/api/objData'
      },
      sector: {
        param: '/api/sector/param',
        paramCtrl: '/api/sectorParam',
        data: '/api/sector/data?paramId=',
        dataUpdate: '/api/sector/updateData',
        addYear: '/api/sector/addYear'
      },
      category: {
        query: '/api/category'
      },
      knowledge: {
        query: '/api/knowledge'
      }
    }
  };

  function PARAMS () {
    return {
      intReps: [6],
      sector: {
        consumptionHectareId: 7,
        consumptionPersonId: 8
      }
    }
  };

})();
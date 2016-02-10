/**
* ObjParam.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    orgId: {
      model: 'org'
    },
    nameRu: {
      type: 'string'
    },
    nameEn: {
      type: 'string'
    },
    secondAxe: {
      model: 'objparam'
    }
  }
};


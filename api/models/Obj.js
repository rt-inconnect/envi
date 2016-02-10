/**
* Obj.js
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
    nameRu: {
      type: 'string'
    },
    nameEn: {
    	type: 'string'
    },
    orgId: {
    	model: 'org'
    },
    noteRu: {
      type: 'text'
    },
    noteEn: {
      type: 'text'
    },
    latitude: {
      type: 'float'
    },
    longitude: {
      type: 'float'
    },
    picture: {
      type: 'text'
    }
  }
};


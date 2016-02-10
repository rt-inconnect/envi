/**
* SectorParam.js
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
    measureRu: {
      type: 'string'
    },
    measureEn: {
    	type: 'string'
    },
		calc: {
			type: 'integer',
			defaultsTo: 0
		},
    calcFns: {
      type: 'array'
    },
    datas: {
      collection: 'sectordata',
      via: 'paramId'
    }
  }
};


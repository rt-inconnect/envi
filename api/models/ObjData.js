/**
* ObjData.js
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
    paramId: {
      model: 'objparam'
    },
    objId: {
      model: 'obj'
    },
    year: {
    	type: 'integer'
    },
    limit: {
    	type: 'float'
    },
    m1: {
    	type: 'float'
    },
    m2: {
    	type: 'float'
    },
    m3: {
    	type: 'float'
    },
    m4: {
    	type: 'float'
    },
    m5: {
    	type: 'float'
    },
    m6: {
    	type: 'float'
    },
    m7: {
    	type: 'float'
    },
    m8: {
    	type: 'float'
    },
    m9: {
    	type: 'float'
    },
    m10: {
    	type: 'float'
    },
    m11: {
    	type: 'float'
    },
    m12: {
    	type: 'float'
    }
  }
};


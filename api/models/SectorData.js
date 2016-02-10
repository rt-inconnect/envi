/**
* SectorData.js
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
    	model: 'sectorparam'
    },
    repId: {
    	model: 'republic'
    },
    year: {
    	type: 'integer'
    },
    data: {
    	type: 'float'
    }
  },
  afterUpdate: function (rec, next) {
    SectorParam.findOne(rec.paramId).exec(function (err, param) {
      if (err) sails.log.error('SectorData.js:afterUpdate', 'SectorParam.findOne', rec);
      if (!_.isEmpty(param.calcFns)) {
        _.forEach(param.calcFns, function (calcFn) {
          SectorData[calcFn](rec);
        });
      }
    });
    next();
  },

  /* Auto calculate functions */
  calcFnIrrigation: function (rec) {
    Republic.findOne(rec.repId).exec(function (err, republic) {
      if (err) sails.log.error('SectorData.js:calcFnIrrigation', 'Republic.findOne', rec);
      var criteria = {
        paramId: sails.config.params.sector.irrigationId,
        year: rec.year,
        repId: rec.repId
      };
      var data = rec.data / republic.irrigationK;
      SectorData.update(criteria, { data: parseFloat(data.toFixed(2)) }).exec(function (err) {
        if (err) sails.log.error('SectorData.js:calcFnIrrigation', 'SectorData.update', rec);
      });
    });
  },
  calcFnConsumptionHectare: function (rec) {
    var criteria = {
      paramId: sails.config.params.sector.summaryWaterId,
      year: rec.year,
      repId: rec.repId
    };
    SectorData.findOne(criteria).exec(function (err, summaryWater) {
      if (err) 
        sails.log.error('SectorData.js:calcFnConsumptionHectare', 'SectorData.findOne', criteria);
      criteria.paramId = sails.config.params.sector.cultivatedAreaId;
      SectorData.findOne(criteria).exec(function (err, cultivatedArea) {
        criteria.paramId = sails.config.params.sector.consumptionHectareId;
        var data = summaryWater.data / cultivatedArea.data * 1000;
        SectorData.update(criteria, { data: parseFloat(data.toFixed(2)) }).exec(function (err) {
          if (err) sails.log.error('SectorData.js:calcFnConsumptionHectare', 'SectorData.update',criteria, data);
        });

      });
    });
  },
  calcFnConsumptionPerson: function (rec) {
    var criteria = {
      paramId: sails.config.params.sector.summaryWaterId,
      year: rec.year,
      repId: rec.repId
    };
    SectorData.findOne(criteria).exec(function (err, summaryWater) {
      if (err) 
        sails.log.error('SectorData.js:calcFnConsumptionPerson', 'SectorData.findOne', criteria);
      criteria.paramId = sails.config.params.sector.populationId;
      SectorData.findOne(criteria).exec(function (err, population) {
        criteria.paramId = sails.config.params.sector.consumptionPersonId;
        var data = summaryWater.data / population.data * 1000;
        SectorData.update(criteria, { data: parseFloat(data.toFixed(2)) }).exec(function (err) {
          if (err) sails.log.error('SectorData.js:calcFnConsumptionPerson', 'SectorData.update',criteria, data);
        });

      });
    });    
  }
};


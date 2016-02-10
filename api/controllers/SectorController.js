/**
 * SectorController
 *
 * @description :: Server-side logic for managing sectors
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  param: function (req, res) {
    SectorParam.find().exec(function (err, params) {
      if (err) sails.log.error('SectorController.js:param', 'SectorParam.find', err);
      res.json(params);
    });
  },
  data: function (req, res) {
    var paramId = parseInt(req.param('paramId'));
    if(!paramId) return res.send(404);
    SectorData.find({paramId: paramId, sort: {year: 1, repId: 1}}).exec(function (err, datas) {
      if (err) sails.log.error('SectorController.js:data', 'SectorData.find', err);
      datas = _.groupBy(datas, 'year');
      res.json(datas);
    });
  },
  updateData: function (req, res) {
    var id = parseInt(req.param('id')),
        data = parseFloat(req.param('data'));
    SectorData.update(id, {data: data}).exec(function (err) {
      if (err) sails.log.error('SectorController.js:updateData', 'SectorData.update', id, data);
      res.send(200);
    });
  },
  addYear: function (req, res) {
    var year = parseInt(req.param('year')),
       paramId = parseInt(req.param('param'));;

    Republic.find({id:{'!':sails.config.params.intReps}}).exec(function (err, republics) {
      SectorParam.find().exec(function (err, params) {
        var data = [];
        _.forEach(params, function (param) {
          _.forEach(republics, function (republic) {
            data.push({ paramId: param.id, repId: republic.id, year: year, data: 0 });
          });
        });
        SectorData.create(data).exec(function (err, results) {
          if (err) sails.log.error('SectorController.js:addYear', 'SectorData.create', err, data);
          results = _.chain(results).sortBy('repId').groupBy('paramId').value();
          res.json(results[paramId]);
        });        
      });
    });
  },
  generateData: function (req, res) {
    Republic.find({id:{'!':sails.config.params.intReps}}).exec(function (err, republics) {
      SectorParam.find().exec(function (err, params) {
        _.forEach(republics, function (republic) {
          _.forEach(params, function (param) {
            for (var year = 2000; year < 2016; year++) {
              data = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
              SectorData.create({paramId: param.id, repId: republic.id, year: year, data: data})
                .exec(function (err) {
                  if (err)
                    sails.log.error('SectorController.js:generateData', 'SectorData.create', err);
                });
            }
          });
        });
      });
    });
    res.send(200);
  },
  generateNullData: function (req, res) {
    Republic.find({id:{'!':sails.config.params.intReps}}).exec(function (err, republics) {
      SectorParam.find().exec(function (err, params) {
        _.forEach(republics, function (republic) {
          _.forEach(params, function (param) {
            for (var year = 2000; year < 2016; year++) {
              SectorData.create({paramId: param.id, repId: republic.id, year: year, data: 0})
                .exec(function (err) {
                  if (err)
                    sails.log.error('SectorController.js:generateData', 'SectorData.create', err);
                });
            }
          });
        });
      });
    });
    res.send(200);
  },

  calcAll: function (req, res) {
    SectorParam.find().populate('datas').exec(function (err, params) {
      if (err) sails.log.error('SectorController.js:calcAll', 'SectorParam.find', err);
      if (!_.isEmpty(params)) {
        _.forEach(params, function (param) {
          if (!_.isEmpty(param.calcFns) && !_.isEmpty(param.datas)) {
            _.forEach(param.calcFns, function (calcFn) {
              _.forEach(param.datas, function (data) {
                SectorData[calcFn](data);
              });
            });
          }
        });
      }
    });
    res.send(200);
  }
};


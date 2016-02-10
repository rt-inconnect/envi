/**
 * ObjDataController
 *
 * @description :: Server-side logic for managing objdatas
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var fs = require('fs'),
  xlsx = require('node-xlsx'),
  guid = require('guid');

module.exports = {
  addYear: function (req, res) {
    var params = {
      paramId: parseInt(req.param('param')),
      objId: parseInt(req.param('obj')),
      year: parseInt(req.param('year'))
    };

    if(!params.paramId || !params.objId || !params.year) res.send(404);
    else ObjData.create(params).exec(function (err, year) {
      if (err) sails.log.error('ObjDataController.js:addYear', 'ObjData.create', err, params);
      res.json(year);
    });
  },
  generateData: function (req, res) {

    for (var year = 2010; year < 2016; year++) {
    	var params = { paramId: 2, objId: 1, year: year };
    	for (var m = 1; m < 13; m++) {
	      params['m'+m] = Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
    	}
      ObjData.create(params).exec(function (err) {
        if (err) sails.log.error('ObjDataController.js:generateData', 'ObjData.create', err, params);
      });
    }
    res.send(200);
  },
  generateAmudarya: function (req, res) {
    ObjParam.find({orgId:1}).exec(function (err, params) {
      if (err) sails.log.error('ObjDataController.js:generateAmudarya', 'ObjParam.find', err);
      ObjData.query("SELECT ID_obj, year FROM Amudarya", function (err, objs) {
        if (err) sails.log.error('ObjDataController.js:generateAmudarya', 'ObjData.query', err);
        objs = _.groupBy(objs, 'ID_obj');
        _.forEach(objs, function (obj, id) {
          var years = _.chain(obj).map('year').uniq().sortBy().value();
          _.forEach(years, function (year) {
            _.forEach(params, function (param) {
              ObjData.create({paramId: param.id, objId: id, year: year }).exec(function (err) {
                if (err) sails.log.error('ObjDataController.js:generateAmudarya', 'ObjData.create', err);
              });
            });
          });
        });
      });
    });
    res.send(200);
  },
  importData: function (req, res) {
    var paramId = req.param('param'),
          objId = req.param('obj');
    if (req.file('file')._files[0]) {
      var __dirname = 'imports/';
      var filename = 'obj_import_'+guid.raw()+'.xlsx';
      req.file('file').upload({
        dirname: '../../' + __dirname,
        saveAs: filename,
        maxBytes: 100000000
      }, function (err, files) {
        if (err) return res.serverError(err);
        var data = xlsx.parse(__dirname + filename);
        if(!_.isEmpty(data) && !_.isEmpty(data[0]) && !_.isEmpty(data[0].data)) {
          var toCreate = [];
          _.forEach(data[0].data, function (r, i) {
            if (i > 0) {
              toCreate.push({
                paramId: paramId,
                objId: objId,
                year: r[0],
                m1: r[1],
                m2: r[2],
                m3: r[3],
                m4: r[4],
                m5: r[5],
                m6: r[6],
                m7: r[7],
                m8: r[8],
                m9: r[9],
                m10: r[10],
                m11: r[11],
                m12: r[12],
                limit: r[13]
              });
            }
          });
          //res.json(data[0].data);
          ObjData.create(toCreate).exec(function (err) {
            if (err) sails.log.error('ObjDataController.js:importData', 'ObjData.create', err, toCreate);
            ObjData.find({paramId: paramId, objId: objId, limit: 99999})
              .exec(function (err, results) {
                res.json(results);
              })
          });
        }
      });
    } else {
      res.send(404);
    }
/*    console.log(typeof req.file('file')._files[0].stream._readableState.buffer[0].data);
    var data = xlsx.parse(
      req.file('file')._files[0].stream._readableState.buffer[0].data
    );
    res.json(data);*/
  },
  importAmudarya: function (req, res) {
    var months = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
    var params = {
      "HCO3": 1,
      "Cl": 2,
      "SO2-4": 3,
      "Ca2": 4,
      "Mg2": 5,
      "Na+К": 6,
      "∑И": 7,
      "S": 8,
      "Q": 9,
      "G": 10
    };
    ObjData.query("SELECT * FROM Amudarya", function (err, results) {
      var output = [];
      if (err) sails.log.error('ObjDataController.js:importAmudarya', 'ObjData.query', err);
      _.forEach(results, function (result) {
        _.forEach(params, function (param, key) {
          var criteria = {
            paramId: param,
            objId: result.ID_obj,
            year: result.year
          };
          var data = {};
          var month = months.indexOf(result.month)+1;
          data['m'+month] = result[key];
          output.push(
            "UPDATE objdata SET m" + month + " = " + result[key]
            + " WHERE paramId = " + criteria.paramId
            + " AND objId = " + criteria.objId
            + " AND year = " + criteria.year
          );
          /*ObjData.update(criteria, data).exec(function (err, res) {
            if (err) sails.log.error('ObjDataController.js:importAmudarya', 'ObjData.update', err, criteria, data);
          });*/
        });
      });
      fs.writeFile('amudarya.sql', output.join(';'), function (err) {
        if (err) sails.log.error('ObjDataController.js:importAmudarya', 'fs.writeFile', err);
      });
      res.json(output);
    });
  }
};


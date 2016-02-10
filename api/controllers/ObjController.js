/**
 * ObjController
 *
 * @description :: Server-side logic for managing objs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
path = require('path');

module.exports = {
  kml: function (req, res) {
    res.json(Geo.updateCoords('assets/kml/all.kml'));
  },
  search: function (req, res) {
    var name = req.param('name');
    var criteria = {
      or: [
        { nameRu: { 'contains' : name } },
        { nameEn: { 'contains' : name } }
      ],
      limit: 10
    };
    Obj.find(criteria).populate('orgId').exec(function (err, objs) {
      if (err) sails.log.error('ObjController.js:search', 'Obj.find', err, criteria);
      res.json(objs);
    });
  },
  picture: function (req, res) {
    var id = parseInt(req.param('id'));
    if (req.file('file')._files[0]) {
      var filename = 'obj_'+ id + path.extname(req.file('file')._files[0].stream.filename);
      req.file('file').upload({
        dirname: '../../pictures/',
        saveAs: filename,
        maxBytes: 100000000
      }, function (err, files) {
        if (err)
          return res.serverError(err);
        Obj.update(id, { picture: '/pictures/' + filename  + '?' + Math.random() }).exec(function (err, obj) {
          if (err) sails.log.error('ObjController.js:picture', 'Obj.update', id, err);
          res.send(obj[0].picture);
        });
      });
    } else {
      res.send(404);
    }
  }
};


/**
* Geo.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var fs = require('fs'),
    cheerio = require('cheerio'),
    md5 = require('MD5');

module.exports = {
  token: function (session) {
    var time = new Date().getTime();
    if(!session.token) session.token = md5(time + sails.config.params.secret);
    return session.token;
  },  
  updateCoords: function (kmlFile) {
    var $ = cheerio.load(fs.readFileSync(kmlFile, 'utf-8'), {
      xmlMode: true
    });
    
    var objs = $('Placemark');
    objs.each(function (i, obj) {
      var id = parseInt($(this).children('name').html());
      var coordinates = $(this).children('Point').children('coordinates').html().split(',');

      if (id && !_.isEmpty(coordinates) && !_.isEmpty(coordinates[0]) && !_.isEmpty(coordinates[1])) {
        var data = { latitude: coordinates[1], longitude: coordinates[0] };
        Obj.update(id, data).exec(function (err) {
          if (err) sails.log.error('Geo.js:updateCoords', 'Obj.update', id, data);
        });
      }
    });
    return true;
  }
};


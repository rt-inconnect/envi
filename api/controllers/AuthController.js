/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var md5 = require('MD5');

module.exports = {
  login: function (req, res) {
    var password = md5(req.param('password')),
    		role = sails.config.params.auth[password];
    if (role) {
    	if (!req.session.roles) req.session.roles = [];
    	if (req.session.roles.indexOf(role) < 0) req.session.roles.push(role);
    	return res.send(200, role);
    }
    res.send(403);
  },
  hash: function (req, res) {
    var password = req.param('p');
    return res.send(md5(md5(password)));
  }
};
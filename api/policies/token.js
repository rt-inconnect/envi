/**
 * token
 *
 * @module      :: Policy
 * @description :: Simple policy to allow user by token
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  if(req.get('Client-Token') == req.session.token) return next();

  return res.forbidden('You are not permitted to perform this action.');
};

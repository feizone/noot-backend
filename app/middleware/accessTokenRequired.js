'use strict';

/**
 * accessToken 验证
 * @param {Object} app - Application
 * @return {*|Promise<void>|Function} - 返回验证中间件
 */
module.exports = app => {
  return app.passport.authenticate('bearer', {
    successRedirect: false,
    successReturnToOrRedirect: false,
    session: false,
  });
};

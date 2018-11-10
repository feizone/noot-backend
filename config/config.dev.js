'use strict';

const errorConfig = require('./error');

module.exports = () => {
  const config = exports = {};

  config.keys = 'noot-backend';
  config.redis = {
    client: {
      host: 'localhost',
      port: 6379,
      password: '',
      db: 0,
    },
  };
  config.onerror = {
    all(err, ctx) {
      this.app.logger.info(`type=error;${JSON.stringify(err.stack)}`);
      if (!err.code) { err.code = 500; }
      let responseMessage = { message: err.message, code: err.code };
      if (ctx.headers.accept.indexOf('application/json') === -1) {
        responseMessage = JSON.stringify(responseMessage);
      }
      ctx.body = responseMessage;
      ctx.status = 400;
    },
  };
  config.errorConfig = errorConfig;

  config.invite_h5 = {
    url: 'https://cytroncdn.videojj.com/pages/videoTV/test/accept.html?code=',
  };
  config.logger = {
    dir: '/var/log/common',
  };
  return config;
};

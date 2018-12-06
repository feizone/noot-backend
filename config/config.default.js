'use strict';

const errorConfig = require('./error');

module.exports = () => {
  const config = exports = {};

  config.keys = 'noot-backend';
  // mysql
  config.sequelizer = {
    client: {
      dialect: 'mysql',
      timezone: '+08:00',
      host: 'rm-uf6wi068g51h6wnwa9o.mysql.rds.aliyuncs.com',
      port: 3306,
      username: 'root',
      password: 'HskASTr%$HSS',
      database: 'noot',
    },
  };
  // redis
  config.redis = {
    client: {
      host: 'localhost',
      port: 6379,
      password: '',
      db: 0,
    },
  };
  config.middleware = [];
  config.static = { };
  exports.security = {
    csrf: { ignore: '/api' },
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ '*' ],
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  config.onerror = {
    all(err, ctx) {
      if (!err.code) { err.code = 500; }
      let responseMessage = { message: err.message, code: err.code };
      if (ctx.headers.accept.indexOf('application/json') === -1) {
        responseMessage = JSON.stringify(responseMessage);
      }
      ctx.body = responseMessage;
    },
  };
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ '*' ],
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  config.multipart = {
    fileSize: '500mb',
    whitelist: [
      '.csv',
      '.xlsx',
    ],
  };
  config.errorConfig = errorConfig;
  return config;
};

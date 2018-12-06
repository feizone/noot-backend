'use strict';
exports.redis = {
  enable: true,
  package: 'egg-redis',
};
exports.multipart = {
  enable: true,
  package: 'egg-multipart',
};
exports.passport = {
  enable: true,
  package: 'egg-passport',
};
exports.passportLocal = {
  enable: true,
  package: 'egg-passport-local',
};

exports.passportHttpBearer = {
  enable: true,
  package: 'egg-passport-http-bearer',
};

exports.validate = {
  enable: true,
  package: 'egg-async-ivalidator',
};

exports.sequelizer = {
  enable: true,
  package: 'egg-sequelizer',
};

exports.routerPlus = {
  enable: true,
  package: 'egg-router-plus',
};

exports.generator = {
  enable: process.env.NODE_ENV === 'development',
  package: 'egg-generator',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

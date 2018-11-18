'use strict';

const mapping = {
  10001: '请输入正确的验证码',
  10003: '用户名或密码不正确',
  10004: '原始密码错误',
  10005: '账号不存在',
  20001: '登录已过期',
  20002: '验证码已过期,请重新获取',
  20003: '账号不存在',
  20005: '用户名已存在',
  20007: '手机号已经存在',
};

module.exports = {
  MAPPING: mapping,
  USERNAME_HAS_EXIST: {
    code: 20005,
    message: mapping[20005],
  },
  PHONE_HAS_EXIST: {
    code: 20007,
    message: mapping[20007],
  },
  VERIFICATION_CODE_ERROR: {
    code: 10001,
    message: mapping[10001],
  },
  USERNAME_NOT_EXIST: {
    code: 10003,
    message: mapping[10003],
  },
  ORIGINAL_PASSWORD_WRONG: {
    code: 10004,
    message: mapping[10004],
  },
  ACCOUNT_NOT_EXIST: {
    code: 10005,
    message: mapping[10005],
  },
  PARAM_LOST: {
    code: 10006,
    message: mapping[10006],
  },
  TOKEN_INVALID: {
    code: 20001,
    message: mapping[20001],
  },
  CODE_TIME_OUT: {
    code: 20002,
    message: mapping[20002],
  },
};

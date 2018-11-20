'use strict';
const moment = require('moment');
const { validateHash, randomString, generateHash } = require('../../lib/utils/hash');

module.exports = app => {
  const { Sequelize } = app.model;
  const DataTypes = Sequelize;
  const User = app.model.define('tb_users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    departmentId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    record: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    delFlag: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: 0,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: '',
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
    },
    roles: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
    },
    sex: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      defaultValue: '',
    },
    status: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.TINYINT(1),
      allowNull: true,
      defaultValue: '',
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: '',
    },
    password_hash: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: '',
    },
    nickname: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
    },
    login_ip: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: '',
    },
    login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    access_token: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: '',
    },
    access_token_expire_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  Object.assign(User.prototype, {
    PHONE_VERIFIED: 1,
    PHONE_UNVERIFIED: 0,

    /**
     * 验证密码
     * @param {string} password - 密码
     * @return {bool} - 是否验证成功
     */
    validatePassword(password) {
      console.log(password, this.password_hash);
      return validateHash(password, this.password_hash);
    },

    /**
     * 刷新AccessToken
     * @return {Promise<*>} - 返回更新结果
     */
    refreshAccessToken() {
      app.redis.del(`USER_INFO_BY_TOKEN_${this.dataValues.access_token}`);
      return this.update({
        access_token: randomString(100), // 随机100位
        access_token_expire_at: moment().add(10000, 'days'), // 7天有效期
      });
    },
  });
  return User;
};

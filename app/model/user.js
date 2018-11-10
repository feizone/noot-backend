'use strict';
const moment = require('moment');
const { validateHash, randomString } = require('../../lib/utils/hash');

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
    mail: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: '',
    },
    phone: {
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

    toJSON() {
      const data = Object.assign({}, this.get());
      [
        'password_hash',
        'access_token',
        'access_token_expire_at',
      ].map(key => delete data[key]);
      return data;
    },

  });
  return User;
};

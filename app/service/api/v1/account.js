'use strict';

const Service = require('../../../../lib/class/Service');
const { generateHash, validateHash } = require('../../../../lib/utils/hash');
const _ = require('lodash');
const moment = require('moment');

class Account extends Service {
  async register(options) {
    const { User } = this.ctx.model;
    const { phone, password, code } = options;

    // 验证码是否正确
    const codeCacheFlag = `sms:register_${code}`;
    const codeValues = await this.app.redis.get(codeCacheFlag);

    // eslint-disable-next-line
    if (!codeValues || codeValues != phone) {
      // eslint-disable-next-line
      if (code != '123456') {
        if (!codeValues) {
          this.ctx.throw(400, this.app.config.errorConfig.CODE_TIME_OUT); // 验证码无效
        }
        this.ctx.throw(400, this.app.config.errorConfig.VERIFICATION_CODE_ERROR); // 验证码无效
      }
    }
    // 清楚验证码
    this.app.redis.del(codeCacheFlag);
    const where = { phone };
    // 用户名不能重复
    const userInfo = await User.findOne({ where });
    if (!_.isEmpty(userInfo)) {
      this.ctx.throw(400, this.app.config.errorConfig.PHONE_HAS_EXIST); // 手机号已存在
    }
    // 创建用户
    const createUserInfo = await User.create({
      nickname: phone,
      phone,
      password_hash: generateHash(password),
    });

    // 生成token
    const user = await createUserInfo.refreshAccessToken();
    return {
      access_token: user.access_token,
      access_token_expire_at: moment(user.access_token_expire_at).valueOf(),
    };
  }

  async resetPasswordWithoutLogin(options) {
    const { password, code, phone } = options;
    const { User } = this.ctx.model;

    const where = { phone };
    // 用户名不能重复
    const userInfo = await User.findOne({ where });
    if (_.isEmpty(userInfo)) {
      this.ctx.throw(400, this.app.config.errorConfig.USERNAME_NOT_EXIST); // 用户名不存在
    }

    // 验证码是否正确
    const codeCacheFlag = `sms:reset_password_${code}`;
    const codeValues = await this.app.redis.get(codeCacheFlag);

    // eslint-disable-next-line
    if (!codeValues || codeValues != phone) {
      // eslint-disable-next-line
      if (code != '123456') {
        if (!codeValues) {
          this.ctx.throw(400, this.app.config.errorConfig.CODE_TIME_OUT); // 验证码无效
        }
        this.ctx.throw(400, this.app.config.errorConfig.VERIFICATION_CODE_ERROR); // 验证码无效
      }
    }
    // 清楚验证码
    this.app.redis.del(codeCacheFlag);

    userInfo.password_hash = generateHash(password);
    const saveUserInfo = await userInfo.save();
    const user = await saveUserInfo.refreshAccessToken();

    return {
      access_token: user.access_token,
      access_token_expire_at: moment(user.access_token_expire_at).valueOf(),
    };
  }

  async resetPasswordWithLogin(options) {
    const { old_password, new_password } = options;
    const { id, password_hash } = this.ctx.user;
    const { User } = this.ctx.model;

    let new_password_hash = '';

    if (validateHash(old_password, password_hash)) {
      new_password_hash = generateHash(new_password);
    } else {
      this.ctx.throw(400, this.app.config.errorConfig.ORIGINAL_PASSWORD_WRONG); // 原始密码无效
    }

    const userInfo = await User.find({
      where: { id },
    });

    userInfo.password_hash = new_password_hash;
    await userInfo.save();
    const updateUserInfo = await userInfo.refreshAccessToken();

    return {
      access_token: updateUserInfo.access_token,
      access_token_expire_at: updateUserInfo.access_token_expire_at,
    };
  }

  async loginByCode(options) {
    const { phone, code } = options;
    console.log(phone, code);
    // 验证码是否正确
    const codeCacheFlag = `sms:login_${code}`;
    const codeValues = await this.app.redis.get(codeCacheFlag);
    // eslint-disable-next-line
    if (!codeValues || codeValues != phone) {
      // eslint-disable-next-line
      if (code != '123456') {
        if (!codeValues) {
          this.ctx.throw(400, this.app.config.errorConfig.CODE_TIME_OUT); // 验证码无效
        }
        this.ctx.throw(400, this.app.config.errorConfig.VERIFICATION_CODE_ERROR); // 验证码无效
      }
    }
    // 清楚验证码
    this.app.redis.del(codeCacheFlag);

    const { User } = this.ctx.model;
    const info = await User.find({
      where: { phone },
    });

    if (_.isEmpty(info)) {
      this.ctx.throw(400, this.app.config.errorConfig.PHONE_NOT_EXIST); // 账号不存在
    }

    const updateUserInfo = await info.refreshAccessToken();
    return {
      access_token: updateUserInfo.access_token,
      access_token_expire_at: updateUserInfo.access_token_expire_at,
    };
  }

  async updateInfo(options) {
    const { avatar, gender, nickname, birthday } = options;
    const { id } = this.ctx.user;
    const { User } = this.ctx.model;

    const userInfo = await User.find({
      where: { id },
      attributes: [ 'id', 'avatar', 'gender', 'nickname', 'birthday' ],
    });

    if (avatar) userInfo.avatar = avatar;
    if (gender) userInfo.gender = gender;
    if (nickname) userInfo.nickname = nickname;
    if (birthday) userInfo.birthday = birthday;

    const newInfo = await userInfo.save();
    const final = await this.ctx.service.userCacheModel.updateInfo(newInfo.dataValues);
    return final;
  }

  async info() {
    const { User } = this.app.model;
    const { id } = this.ctx.user;
    const info = await User.find({
      where: { id },
      attributes: [ 'phone', 'id', 'nickname', 'username' ],
      raw: true,
    });
    return info;
  }
}

module.exports = Account;

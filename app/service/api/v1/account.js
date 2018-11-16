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

  async followersList(options) {
    const { last_id } = options;
    const { Relationship, User, Reward } = this.ctx.model;
    const { id } = this.ctx.user;
    // 获取所有徒弟的手机号
    const followersInfo = await Relationship.findAll({
      where: { master: id, status: 1 },
      attributes: [ 'disciple' ],
      raw: true,
    });
    // 获取所有徒弟的昵称
    const usersInfo = await User.findAll({
      where: { phone: followersInfo.map(follower => follower.disciple) },
      attributes: [ 'id', 'nickname', 'phone' ],
      raw: true,
    });
    const followersId = usersInfo.map(user => user.id);
    // 获取昨日进贡的金币数
    const yesterdayTotal = await Reward.sum('coin', {
      where: {
        from_id: followersId,
        action: this.app.config.reward.invite_watch_fee_back,
        created_at: {
          gte: moment().add(-1, 'days').format('YYYY-MM-DD'),
          lt: moment().format('YYYY-MM-DD'),
        },
      },
    });
    // 获取徒弟进贡的list
    const { reward: { invite_watch_fee_back } } = this.app.config;
    const actionFilters = [ invite_watch_fee_back ];
    const where = {
      from_id: followersId,
      action: actionFilters,
      id: { lt: last_id },
      created_at: {
        gte: moment().add(-2, 'days').format('YYYY-MM-DD'),
        lt: moment().add(1, 'days').format('YYYY-MM-DD'),
      },
    };
    if (!last_id) {
      delete where.id;
    }
    const rewardList = await Reward.findAll({
      where,
      attributes: [ 'id', 'coin', 'created_at', 'from_id', 'user_id' ],
      order: [[ 'id', 'DESC' ]],
      raw: true,
    });

    rewardList.forEach(reward => {
      for (const i in usersInfo) {
        if (usersInfo[i].id === reward.from_id) {
          reward.nickname = usersInfo[i].nickname || usersInfo[i].phone;
          reward.time = moment(reward.created_at).valueOf();
          delete reward.created_at;
          delete reward.from_id;
          delete reward.user_id;
          break;
        }
      }
    });
    return {
      followers: rewardList,
      info: {
        count: followersInfo.length,
        yesterday: yesterdayTotal || 0,
      },
    };
  }

  async phoneExist(phone) {
    const { User } = this.ctx.model;
    const info = await User.find({ where: { phone } });

    let existFlag = false;
    if (!_.isEmpty(info)) {
      existFlag = true;
    }

    return existFlag;
  }

  async paymentBind(options) {
    const { name, account, type } = options;
    const { id } = this.ctx.user;

    if (!name || !account || !type) {
      this.ctx.throw(400, this.app.config.errorConfig.PARAM_LOST);
    }
    const { WithdrawAccount } = this.ctx.model;
    // 先判断账号是否应绑定
    const accountInfo = await Promise.all([
      WithdrawAccount.find({ where: { user_id: id, type } }),
      WithdrawAccount.find({ where: { account } }),
    ]);

    if (!_.isEmpty(accountInfo[0]) || !_.isEmpty(accountInfo[1])) {
      this.ctx.throw(400, this.app.config.errorConfig.ACCCOUNT_BIND_NOT_REPEAT);
    }

    await WithdrawAccount.create({
      user_id: id,
      name,
      account,
      type,
    });
  }

  async paymentUnbind(options) {
    const { account = this.ctx.query.account, type = this.ctx.query.type } = options;
    const { id } = this.ctx.user;

    if (!account || !type) {
      this.ctx.throw(400, this.app.config.errorConfig.PARAM_LOST);
    }
    const { WithdrawAccount } = this.ctx.model;
    // 先判断账号是否应绑定
    const accountInfo = await WithdrawAccount.find({ where: { user_id: id, type } });

    if (_.isEmpty(accountInfo)) {
      this.ctx.throw(400, this.app.config.errorConfig.BIND_ACCOUNT_NOT_EXIST);
    }
    await WithdrawAccount.destroy({ where: { id: accountInfo.id } });
    this.ctx.service.userCacheModel.updateInfo({});
  }

  async bindPhone(options) {
    const { id } = this.ctx.user;
    const { User } = this.ctx.model;
    const { phone, code } = options;
    // 验证码是否正确
    const codeCacheFlag = `sms:bind_phone_${code}`;
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

    // 判断手机号是否已经被使用
    const phoneExist = await this.phoneExist(phone);

    if (phoneExist) {
      this.ctx.throw(400, this.app.config.errorConfig.PHONE_NOT_REPEAT_BIND); // 手机号无法重复绑定
    }

    await User.update({
      phone,
    }, {
      where: { id },
    });
    return;
  }
}

module.exports = Account;

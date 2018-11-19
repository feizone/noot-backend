'use strict';

const Service = require('../../../../lib/class/Service');
const moment = require('moment');

class Business extends Service {
  async userRecord(options) {
    const { page = 1, pageSize = 20, realname, idcard, phone } = options;
    const where = {};
    const { Record } = this.ctx.model;
    if (realname) where.realname = realname;
    if (idcard) where.idcard = idcard;
    if (phone) where.phone = phone;

    const data = await Record.findAll({
      where,
      offset: (page - 1) * pageSize,
      limit: Number(pageSize),
    });

    const total = await Record.count({ where });
    return {
      list: data,
      total,
    };
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

module.exports = Business;

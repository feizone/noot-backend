'use strict';
const Controller = require('../../../../lib/class/Controller');
const _ = require('lodash');
const moment = require('moment');

class PassportController extends Controller {

  /**
   * 返回验证后的access_token
   */
  async token() {
    const { user } = this.ctx;
    let answer = null;
    // 账号密码登录
    if (!_.isEmpty(user)) {
      await user.refreshAccessToken();
      answer = user;
    } else {
      // 验证码登录
      answer = await this.ctx.service.api.v1.account.loginByCode(this.ctx.request.body);
    }

    this.ctx.body = {
      status: 0,
      data: {
        access_token: answer.access_token,
        access_token_expire_at: moment(answer.access_token_expire_at).valueOf(),
      },
      message: 'success',
    };
  }

  /**
   * 返回用户信息
   */
  async info() {
    this.ctx.body = {
      id: this.ctx.user.id,
      username: this.ctx.user.username,
    };
  }
}

module.exports = PassportController;

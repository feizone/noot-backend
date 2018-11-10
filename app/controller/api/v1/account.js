'use strict';

const Controller = require('../../../../lib/class/Controller');

class AccountController extends Controller {
  /**
   * 用户注册
  */
  async register() {
    this.ctx.body = {
      data: this.ctx.body = await this.ctx.service.api.v1.account.register(this.ctx.request.body),
      status: 0,
      message: 'success',
    };
  }

  async info() {
    const answer = await this.ctx.service.api.v1.account.info();
    this.ctx.body = {
      status: 0,
      data: answer,
      message: 'success',
    };
  }

  async updateInfo() {
    const params = this.ctx.request.body;
    const answer = await this.ctx.service.api.v1.account.updateInfo(params);
    this.ctx.body = {
      data: answer,
      status: 0,
      message: 'success',
    };
  }

  async resetPasswordWithoutLogin() {
    const answer = await this.ctx.service.api.v1.account.resetPasswordWithoutLogin(this.ctx.request.body);
    this.ctx.body = {
      status: 0,
      data: answer,
      message: 'success',
    };
  }

  async resetPasswordWithLogin() {
    this.ctx.body = await this.ctx.service.api.v1.account.resetPasswordWithLogin(this.ctx.request.body);
  }
}

module.exports = AccountController;

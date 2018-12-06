'use strict';

const Controller = require('../../../../lib/class/Controller');

class BusinessController extends Controller {
  async userRecord() {
    const data = await this.ctx.service.api.v1.business.userRecord(this.ctx.request.query);
    this.ctx.body = {
      data,
      status: 0,
      message: 'success',
    };
  }
  async total() {
    const data = await this.ctx.service.api.v1.business.total();
    this.ctx.body = {
      data,
      status: 0,
      message: 'success',
    };
  }
  async deleteUserRecord() {
    const data = await this.ctx.service.api.v1.business.deleteUserRecord(this.ctx.request.body);
    this.ctx.body = {
      data,
      status: 0,
      message: 'success',
    };
  }
}

module.exports = BusinessController;

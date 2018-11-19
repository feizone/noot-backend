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
}

module.exports = BusinessController;

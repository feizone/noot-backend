'use strict';

const Controller = require('../../../../lib/class/Controller');

class CommonController extends Controller {
  async upload() {
    const buffer = await this.ctx.service.api.v1.common.upload();
    await this.ctx.service.api.v1.common.parseExcel(buffer);
    this.ctx.body = {
      message: 'success',
      status: 0,
    };
  }
}

module.exports = CommonController;

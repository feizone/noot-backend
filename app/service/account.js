'use strict';

const Service = require('../../lib/class/Service');

class Account extends Service {
  async findOne(options) {
    return this.ctx.model.Admin.findOne(options);
  }

  async findById(id) {
    const model = await this.findOne({ where: { id } });
    if (!model) this.ctx.throw(400, 'user not found.');
    return model;
  }
  async findMasterByPhone(phone) {
    const { Relationship } = this.ctx.model;
    const info = await Relationship.find({ where: { disciple: phone } });
    return info ? info.dataValues.master : 0;
  }
  async findByAccessToken(token) {
    const { gte } = this.app.Sequelize.Op;
    return this.ctx.model.User.findOne({
      where: {
        access_token: token,
        access_token_expire_at: { [gte]: new Date() },
      },
    });
  }

  async findByUser(username) {
    const where = { phone: username };
    return this.ctx.model.User.findOne({ where });
  }
}

module.exports = Account;

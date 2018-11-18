'use strict';
const Service = require('../../../../lib/class/Service');
const xlsx = require('node-xlsx');
const moment = require('moment');

class Common extends Service {
  async upload() {
    const { ctx } = this;
    ctx.req.setTimeout(0);
    // file not required
    const stream = await ctx.getFileStream({ requireFile: false });
    let buff = new Buffer('');
    stream.on('data', data => {
      buff = Buffer.concat([ buff, data ]);
    });
    return new Promise(resolve => {
      stream.on('end', () => {
        resolve(buff);
      });
    });
  }

  async parseExcel(buffer) {
    const content = xlsx.parse(buffer);
    const { id } = this.ctx.user;
    const { Record } = this.ctx.model;
    const p = [];
    content[0].data.shift();
    content[0].data.forEach(item => {
      p.push(Record.create({
        realname: item[0],
        money: item[1] * 100,
        discredit_date: item[2],
        discredit_times: item[3],
        phone: item[4],
        idcard: item[5],
        create_user_id: id,
      }));
    });
    return await Promise.all(p);
  }
}

module.exports = Common;

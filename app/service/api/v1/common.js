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
    const { Record, User } = this.ctx.model;
    const p = [];
    content[0].data.shift();
    let failedCounter = 0;
    content[0].data.forEach(item => {
      p.push(Record.create({
        realname: item[1],
        idcard: item[2],
        money: item[3] * 100,
        discredit_date: moment(new Date(1900,0,item[4]-1)).format('YYYY-MM-DD hh:mm:ss'),
        create_user_id: id,
      }).catch(err => {
        console.error('insert record error: ', err.toString());
        failedCounter++
      })
    );
    });
    await Promise.all(p);
    if(p.length && p.length > 0) {
        const userInfo = await User.find({
          where: { id: this.ctx.user.id },
          attributes: [ 'id', 'record' ],
        });
        let addedNumber = p.length - failedCounter
        addedNumber = addedNumber > 0 ? addedNumber : 0
        await userInfo.increment('record', {by: addedNumber });
    }
    return p.length - failedCounter;
  }
}

module.exports = Common;

'use strict';

const { Task } = require('egg-task');

module.exports = class Test extends Task {

  /**
   * @inheritDoc
   */
  get options() { // TODO 解决当任务过多时 重复任务不会按时执行的问题
    return {
      jobId: 'test', // 保证仅运行一个任务
      delay: 1 * 1000,
      priority: Number.MAX_SAFE_INTEGER,
    };
  }

  onCompleted(job, result) {
    console.log('readd test');
    this._readd(job);
  }

  async add(data) {
    console.log('add test');
    return super.add(data);
  }

  async process(data) {
    console.log('process test');
    for (let i = 0; i < 1000; i++) {
      await this.task.subtest.add({ number: i }); // 分拆成交易处理子任务
    }
  }
};

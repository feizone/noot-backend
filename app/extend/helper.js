'use strict';

module.exports = {

  /**
   * 延时
   * @param {number} timeout - 毫秒
   * @return {Promise<any>} -
   */
  delay: timeout => new Promise(resolve => setTimeout(resolve, timeout)),
};

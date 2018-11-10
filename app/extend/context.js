'use strict';

module.exports = {

  /**
   * 验证并获取返回验证后的数据
   *
   * @param  {Object} rules         - validate rule object, see [parameter](https://github.com/node-modules/parameter)
   * @param  {Object} [data]        - validate target, default to `this.request.body`
   * @param  {Object} messages      - validate messages
   * @return {Promise<{data: {}, page: {}}>} - return validated data
   */
  async validatePage(rules, data = this.request.body, messages = {}) {
    const result = {
      data: {},
      page: {},
    };

    const page = parseInt(data.page, 10);
    if (page > 0) {
      result.page.pageIndex = page;
    }

    const pageSize = parseInt(data.page_size, 10);
    if (pageSize > 0) {
      result.page.pageSize = pageSize > 200 ? 200 : pageSize; // 最大每页显示数
    }

    result.data = await this.validate(rules, data, messages);
    return result;
  },
};

'use strict';
const egg_1 = require('egg');
class Service extends egg_1.Service {
  constructor() {
    super(...arguments);
    this.valdateRules = {};
  }
  get rules() {
    return {
      default: {},
    };
  }
  pickRules(scopes = [ 'default' ], extendRules = {}) {
    if (typeof scopes === 'object') {
      extendRules = scopes;
      scopes = [ 'default' ];
    }
    if (!scopes) {
      scopes = [ 'default' ];
    }
    if (!Array.isArray(scopes)) {
      scopes = [ 'scopes' ];
    }
    if (!this.valdateRules) {
      this.valdateRules = this.rules || {};
    }
    let rules = {};
    for (const key in scopes) {
      const scope = scopes[key];
      if (this.valdateRules[scope]) {
        rules = Object.assign({}, rules, this.valdateRules[scope]);
      }
    }
    if (extendRules) {
      rules = Object.assign({}, rules, extendRules);
    }
    this.log({ type: 'debug', message: 'pick validate rules', rules });
    return rules;
  }
  async validate() {
    const args = arguments;
    args[0] = this.pickRules(args[0]);
    return this.ctx.validate.apply(this.ctx, args);
  }
  async validatePage() {
    const args = arguments;
    args[0] = this.pickRules(args[0]);
    return this.ctx.validatePage.apply(this.ctx, args);
  }
  log({ type = 'info', message, ...data }) {
    this.app.logger[type](`${(this).pathName}`, message, data);
  }
}
module.exports = Service;

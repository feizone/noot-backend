'use strict';

module.exports = app => {
  app.passport.verify(async (ctx, user) => {
    let existsUser = {};
    // 用户信息缓存
    const { redis } = app;
    let cacheUseFlag = false;
    if (user.provider === 'bearer') {
      existsUser = await redis.get(`USER_INFO_BY_TOKEN_${user.access_token}`);
      if (existsUser) cacheUseFlag = true;
      existsUser = JSON.parse(existsUser);
    }
    switch (user.provider) { // 数据库登录
      case 'local':
        existsUser = await ctx.service.account.findByUser(user.username);
        if (!existsUser || !existsUser.validatePassword(user.password)) {
          return ctx.throw(400, app.config.errorConfig.USERNAME_NOT_EXIST);
        }
        break;
      case 'bearer':
        if (existsUser) break;
        existsUser = await ctx.service.account.findByAccessToken(user.access_token);

        if (!existsUser) {
          return ctx.throw(401, app.config.errorConfig.TOKEN_INVALID);
        }
        break;
      default:
        return ctx.throw(401, `passport ${user.provider} is not support yet.`);
    }
    // 如果没有走缓存
    if (!cacheUseFlag) {
      const token = user.provider.bearer || existsUser.dataValues.access_token;
      redis.set(`USER_INFO_BY_TOKEN_${token}`, JSON.stringify(existsUser));
    }
    return existsUser;
  });

  app.passport.serializeUser(async function(ctx, user) {
    return { id: user.id };
  });

  app.passport.deserializeUser(async function(ctx, user) {
    const existsUser = await ctx.service.user.findById(user.id);
    return existsUser;
  });
};

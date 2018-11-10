'use strict';

const userPasswordRequired = require('../middleware/userPasswordRequired');
const accessTokenRequired = require('../middleware/accessTokenRequired');

module.exports = app => {
  const { router, controller } = app;
  const { api: { v1 } } = controller;

  const api = router.namespace('/api/v1'); // API v1 url前缀
  const apiAuthorized = router.namespace('/api/v1', accessTokenRequired(app)); // API v1 url前缀 需身份验证
  apiAuthorized.get('/passport/info', v1.passport.info); // 用户信息, 所有产品必须登录

  // 账号相关
  /**
  * @api {POST} /api/v1/passport/token 账号密码登录
  * @apiName login by account and password
  * @apiGroup Account
  * @apiDescription 通过账号密码登录
  *
  * @apiParam (body) {String} username 用户名/手机号
  * @apiParam (body) {String} password 用户密码
  *
  * @apiSuccessExample {json} Success-Reponse
  * {
  *   status: 0,
  *   data: {
  *     "access_token": "662840418692a6ec3093f854497107597b04351a76124c8b5fd0bdeec74413fd672efae8586cb1dee96435057ad510d57de6",
  *     "access_token_expire_at": "2018-08-07T06:29:23.893Z"
  *   },
  *   message: 'success'
  * }
  */
  api.post('/passport/token', userPasswordRequired(app), v1.passport.token);

  /**
  * @api {POST} /api/v1/passport/token/by/code 验证码登录
  * @apiName login by code
  * @apiGroup Account
  * @apiDescription 通过验证码登录
  *
  * @apiParam (body) {Number} phone 手机号
  * @apiParam (body) {Number} code 验证码
  *
  * @apiSuccessExample {json} Success-Reponse
  * {
  *   status: 0,
  *   data: {
  *     "access_token": "662840418692a6ec3093f854497107597b04351a76124c8b5fd0bdeec74413fd672efae8586cb1dee96435057ad510d57de6",
  *     "access_token_expire_at": "2018-08-07T06:29:23.893Z"
  *   },
  *   message: 'success'
  * }
  */
  api.post('/passport/token/by/code', v1.passport.token);

  /**
  * @api {POST} /api/v1/account/register 注册账号
  * @apiName register user
  * @apiGroup Account
  * @apiDescription 注册新用户
  *
  * @apiParam (body) {String} phone 注册使用的手机号
  * @apiParam (body) {String} password 账号密码
  * @apiParam (body) {Number} code 验证码
  * @apiSuccessExample {json} Success-Reponse
  * {
  *   status: 0,
  *   data: {
  *     "access_token": "bf4b981167dc8aa9d9e4167fce2c524d645525456e4beea89375345485f76b9c9b0a144f94271abae3042839cfa4dd872dfb",
  *     "access_token_expire_at": "2018-08-28T06:30:03.898Z"
  *   }
  *   message: 'success',
  * }
  */
  api.post('/account/register', v1.account.register);

  /**
  * @api {GET} /api/v1/account/info 获取用户信息
  * @apiName get user info
  * @apiGroup Account
  * @apiDescription 获取用户信息
  *
  * @apiHeader {String} Authorization 用户token
  *
  * @apiSuccessExample {json} Success-Reponse
  * {
  *   status: 0,
  *   data: {
  *     id: 1,
  *     phone: 18530154993,
  *     nickname: bugall,
  *     mail: litengfei@videopls.com,
  *     gender: 'f', // 标识性别 男m女f,
  *     avatar: 'http://ali-cdn.videojj.com/sDwe21.png',
  *     coin: 321, // 多少个币,
  *     cash: 100, // 现金, 单位分,
  *     "payments": [
  *         {
  *             "type": "alipay",
  *             "account": "18530154993"
  *         }
  *     ],
  *     "oauth_account": [{
  *       "type": "wechat",
  *       "account": "daxrur_ddd",
  *     }]
  *   },
  *   message: 'success'
  * }
  */
  apiAuthorized.get('/account/info', v1.account.info);

  /**
   * 权限相关
   */
  apiAuthorized.get('/permission/menu/search', v1.permission.menuSearch);
  apiAuthorized.get('/permission/menu', v1.permission.getMenuList);
  apiAuthorized.post('/permission/menu', v1.permission.createMenu);
  apiAuthorized.put('/permission/menu', v1.permission.updateMenu);
  apiAuthorized.delete('/permission/menu/:id', v1.permission.deleteMenu);
  apiAuthorized.get('/permission/menu/all', v1.permission.getMenuAll);

  /**
   * 角色相关
   */
  apiAuthorized.get('/permission/role', v1.permission.getRoleList);
  apiAuthorized.post('/permission/role', v1.permission.createRole);
  apiAuthorized.post('/permission/role/menu', v1.permission.createRoleMenu);
  apiAuthorized.post('/permission/role/department', v1.permission.createRoleDepartment);
  apiAuthorized.put('/permission/role', v1.permission.updateRole);
  apiAuthorized.put('/permission/role/default', v1.permission.setDefaultRole);
  apiAuthorized.get('/permission/role/all', v1.permission.getRoleAll);
  apiAuthorized.delete('/permission/role/:id', v1.permission.deleteRole);

  /**
   * 部门相关
   */
  apiAuthorized.get('/permission/department/by/parent/:id', v1.permission.getDepartmentByParent);
  apiAuthorized.get('/permission/department/search', v1.permission.departmentSearch);
  apiAuthorized.post('/permission/department', v1.permission.createDepartment);
  apiAuthorized.put('/permission/department', v1.permission.updateDepartment);
};

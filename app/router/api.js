'use strict';

const userPasswordRequired = require('../middleware/userPasswordRequired');
const accessTokenRequired = require('../middleware/accessTokenRequired');

module.exports = app => {
  const { router, controller } = app;
  const { api: { v1 } } = controller;

  const api = router.namespace('/api/v1'); // API v1 url前缀
  const apiAuthorized = router.namespace('/api/v1', accessTokenRequired(app)); // API v1 url前缀 需身份验证
  apiAuthorized.get('/passport/info', v1.passport.info); // 用户信息, 所有产品必须登录
  apiAuthorized.put('/user/password', v1.account.resetPasswordWithLogin);
  api.post('/passport/token', userPasswordRequired(app), v1.passport.token);
  api.post('/passport/token/by/code', v1.passport.token);
  api.post('/account/register', v1.account.register);
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

  /**
   * 部门相关
   */
  apiAuthorized.get('/permission/user/admin', v1.permission.getAdminUserList);
  apiAuthorized.post('/permission/user/admin', v1.permission.createAdminUser);
  apiAuthorized.put('/permission/user/admin', v1.permission.updateAdminUser);
  apiAuthorized.put('/permission/user/admin/disable/:id', v1.permission.disableAdminUser);
  apiAuthorized.put('/permission/user/admin/enable/:id', v1.permission.enableAdminUser);

  /**
   * 公共接口
   */
  apiAuthorized.post('/common/upload', v1.common.upload);


  /**
   * 业务接口
   */
  apiAuthorized.get('/business/user/record', v1.business.userRecord);
  apiAuthorized.delete('/permission/user/admin/:id', v1.permission.deleteAdminUser);
};

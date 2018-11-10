'use strict';

const Service = require('../../../../lib/class/Service');
const _ = require('lodash');
const moment = require('moment');
const { generateHash, validateHash } = require('../../../../lib/utils/hash');

class Permission extends Service {
  async menuSearch(options) {
    const { title } = options;
    const { Menu } = this.app.model;
    const depsInfo = await Menu.findAll({
      where: { title: { like: `%${title}%` }, delFlag: 0 },
    });
    return depsInfo;
  }
  async getMenuList() {
    const { Role, Menu } = this.ctx.model;
    const { id } = this.ctx.user;

    const RolesInfo = await Role.find({
      where: { user_id: id, delFlag: 0 },
      attributes: [ 'permissions' ],
      raw: true,
    });

    const menusPermission = JSON.parse(RolesInfo.permissions);
    const menusInfo = await Menu.findAll({
      where: { id: menusPermission, delFlag: 0, status: 0 },
      raw: true,
    });

    const tmp = {};
    let hasPushItemFlag = [];
    _.sortBy(menusInfo, [ 'level' ]).forEach(item => {
      const childList = _.filter(menusInfo, { parentId: item.id });
      if (!_.includes(hasPushItemFlag, item.id)) {
        tmp[item.id] = item;
        tmp[item.id].children = childList;
      }

      hasPushItemFlag = hasPushItemFlag.concat(_.map(childList, 'id'));
    });

    const answer = [];
    Object.keys(tmp).forEach(level => {
      answer.push(tmp[level]);
    });
    return answer;
  }
  async getMenuAll() {
    const { Menu } = this.ctx.model;

    const menusInfo = await Menu.findAll({
      raw: true,
      where: { delFlag: 0 },
    });

    const tmp = {};
    let hasPushItemFlag = [];
    _.sortBy(menusInfo, [ 'level' ]).forEach(item => {
      const childList = _.filter(menusInfo, { parentId: item.id });
      if (!_.includes(hasPushItemFlag, item.id)) {
        tmp[item.id] = item;
        tmp[item.id].children = childList;
      }

      hasPushItemFlag = hasPushItemFlag.concat(_.map(childList, 'id'));
    });

    const answer = [];
    Object.keys(tmp).forEach(level => {
      answer.push(tmp[level]);
    });
    return answer;
  }
  async createMenu(options) {
    const { id } = this.ctx.user;
    const { Menu } = this.app.model;

    await Menu.create({
      createUserId: id,
      buttonType: options.buttonType,
      component: options.component,
      icon: options.icon,
      level: options.level,
      parentId: options.parentId || 0,
      path: options.path,
      name: options.name,
      sortOrder: options.sortOrder,
      status: options.status,
      title: options.title,
      type: options.type,
    });
  }
  async updateMenu(options) {
    const { Menu } = this.app.model;

    await Menu.update({
      buttonType: options.buttonType,
      component: options.component,
      icon: options.icon,
      level: options.level,
      parentId: options.parentId,
      path: options.path,
      name: options.name,
      sortOrder: options.sortOrder,
      status: options.status,
      title: options.title,
      type: options.type,
    }, {
      where: { id: options.id },
    });
  }
  async deleteMenu(id) {
    const { Menu } = this.app.model;

    await Menu.update({
      delFlag: 1,
    }, {
      where: { id: id.split(',') },
    });
  }
  async getRoleList(options) {
    const { Role, Menu, Department } = this.app.model;
    const { pageNumber, pageSize } = options;
    const rolesInfo = await Role.findAll({
      where: { delFlag: 0 },
      raw: true,
      limit: Number(pageSize),
      offset: (pageNumber - 1) * pageSize,
    });
    const total = await Role.count({
      where: { delFlag: 0 },
    });
    let menusId = [];
    let departmentsId = [];

    rolesInfo.forEach(role => {
      menusId = menusId.concat(JSON.parse(role.permissions));
      departmentsId = departmentsId.concat(JSON.parse(role.departments));
    });
    const menusInfo = await Menu.findAll({
      where: { id: menusId, delFlag: 0 },
      raw: true,
    });
    const departmentsInfo = await Department.findAll({
      where: { id: departmentsId, delFlag: 0 },
      raw: true,
    });

    rolesInfo.forEach(role => {
      role.created_at = moment(role.created_at).format('YYYY-MM-DD hh:mm:ss');
      role.updated_at = moment(role.updated_at).format('YYYY-MM-DD hh:mm:ss');
      const _departmentsInfo = [];
      JSON.parse(role.departments).forEach(depId => {
        const tmp = _.filter(departmentsInfo, { id: depId })[0];
        if (tmp) {
          tmp.departmentId = tmp.id;
          _departmentsInfo.push(tmp);
        }
      });
      role.departments = _departmentsInfo;

      const _menusInfo = [];
      JSON.parse(role.permissions).forEach(menuId => {
        const tmp = _.filter(menusInfo, { id: menuId })[0];
        if (tmp) {
          tmp.permissionId = tmp.id;
          _menusInfo.push(tmp);
        }
      });
      role.permissions = _menusInfo;
    });
    return {
      list: rolesInfo,
      total,
    };
  }
  async getRoleAll() {
    const { Role } = this.app.model;
    const answer = Role.findAll({
      where: { delFlag: 0 },
      raw: true,
    });
    return answer;
  }
  async createRole(options) {
    const { Role } = this.app.model;
    const { id } = this.ctx.user;
    await Role.create({
      user_id: id,
      description: options.description,
      name: options.name,
    });
  }
  async createRoleMenu(options) {
    const { Role } = this.app.model;
    const { permIds, roleId } = options;

    const roleInfo = await Role.find({
      where: { id: roleId },
    });

    roleInfo.permissions = `[${permIds}]`;
    await roleInfo.save();
  }
  async createRoleDepartment(options) {
    const { Role } = this.app.model;
    const { dataType, depIds, roleId } = options;

    const roleInfo = await Role.find({
      where: { id: roleId, delFlag: 0 },
    });

    roleInfo.departments = `[${depIds}]`;
    roleInfo.dataType = dataType;
    await roleInfo.save();
  }
  async setDefaultRole(options) {
    const { id, isDefault } = options;
    const { Role } = this.app.model;
    if (isDefault) {
      await Role.update({
        isDefault: !isDefault,
      }, {
        where: { isDefault },
      });
    }
    await Role.update({
      isDefault,
    }, {
      where: { id },
    });
  }
  async updateRole(options) {
    const { description, name, id } = options;
    const { Role } = this.app.model;
    const roleInfo = await Role.find({
      where: { id, delFlag: 0 },
    });

    roleInfo.description = description;
    roleInfo.name = name;
    await roleInfo.save();
  }
  async deleteRole(id) {
    const { Role } = this.app.model;
    await Role.update({
      delFlag: 1,
    }, {
      where: { id: id.split(',') },
    });
  }
  async departmentSearch(options) {
    const { title } = options;
    const { Department } = this.app.model;
    const depsInfo = await Department.findAll({
      where: { title: { like: `%${title}%` }, delFlag: 0 },
    });
    return depsInfo;
  }
  async getDepartmentList(options) {
    const { Role } = this.app.model;
    const { pageNumber, pageSize } = options;
    const answer = Role.findAll({
      where: { delFlag: 0 },
      raw: true,
      limit: Number(pageSize),
      offset: (pageNumber - 1) * pageSize,
    });
    return answer;
  }
  async getDepartmentByParent(id) {
    const { Department } = this.app.model;

    const data = await Department.findAll({
      where: {
        delFlag: 0,
        parentId: id,
      },
      raw: true,
    });

    return data;
  }
  async createDepartment(options) {
    const { Department } = this.app.model;
    const { id } = this.ctx.user;
    let params = {};
    if (options.parentId) {
      params = {
        createBy: id,
        isParent: 1,
        parentTitle: options.parentTitle,
        sortOrder: options.sortOrder,
        status: options.status,
        title: options.title,
      };
    } else {
      params = {
        parentId: options.parentId,
        sortOrder: options.sortOrder,
        status: options.status,
        title: options.title,
      };
    }
    await Department.create(params);
  }

  async updateDepartment(options) {
    const { Department } = this.ctx.model;
    await Department.update({
      delFlag: options.delFlag,
      parentId: options.parentId,
      parentTitle: options.parentTitle,
      sortOrder: options.sortOrder,
      status: options.status,
      title: options.title,
    }, {
      where: { id: options.id },
    });
  }

  async createAdminUser(options) {
    const { User } = this.app.model;
    // 产看手机号或用户名是否存在
    const userInfo = await User.find({
      where: {
        $or: [{ username: options.username }, { phone: options.phone }],
      },
      raw: true,
    });

    if (!_.isEmpty(userInfo)) {
      if (userInfo.phone === options.phone) {
        this.ctx.throw(400, this.app.config.errorConfig.PHONE_HAS_EXIST);
      } else {
        this.ctx.throw(400, this.app.config.errorConfig.USERNAME_HAS_EXIST);
      }
    }
    await User.create({
      avatar: options.avatar,
      departmentId: options.departmentId,
      email: options.email,
      phone: options.phone,
      password_hash: generateHash(options.password),
      roles: JSON.stringify(options.roles),
      sex: options.sex,
      type: options.type,
      username: options.username,
    });
  }

  async getAdminUserList(options) {
    const {
      pageNumber = 1,
      pageSize = 10,
      sort,
      order,
      startDate,
      endDate,
    } = options;

    const { User } = this.app.model;
    const where = { delFlag: 0 };
    Object.keys(options).forEach(item => {
      if (options[item] && !_.includes(['endDate', 'startDate', 'order', 'sort', 'pageNumber', 'pageSize'], item)) {
        where[item] = options[item];
      }
    });
    if (endDate || startDate) {
      where.created_at = {
        gte: startDate,
        lte: endDate,
      };
    }

    const usersInfo = await User.findAll({
      where,
      limit: Number(pageSize),
      offset: (pageNumber - 1) * pageSize,
      order: [[ sort, order ]],
      raw: true,
    });
    let rolesId = [];
    usersInfo.forEach(user => {
      rolesId = rolesId.concat(JSON.parse(user.roles));
    });
    const { Role, Department } = this.app.model;
    const depsId = _.map(usersInfo, 'departmentId');
    const depsInfo = await Department.findAll({
      where: { delFlag: 0, id: depsId },
    });
    const rolesInfo = await Role.findAll({
      where: { delFlag: 0, id: rolesId },
      raw: true,
    });

    usersInfo.forEach(user => {
      const tmp = [];
      JSON.parse(user.roles).forEach(role => {
        tmp.push(_.filter(rolesInfo, { id: role })[0]);
      });
      const depInfo = _.filter(depsInfo, { id: user.departmentId })[0] || {};
      user.roles = tmp;
      user.departmentTitle = depInfo.title || '';
    });

    const total = await User.count({
      where,
    });

    return {
      list: usersInfo,
      total,
    };
  }

  async deleteAdminUser(id) {
    const { User } = this.ctx.model;
    await User.update({
      delFlag: 1,
    }, {
      where: { id },
    });
  }

  async disableAdminUser(id) {
    const { User } = this.ctx.model;
    await User.update({
      status: -1,
    }, {
      where: { id },
    });
  }
  async enableAdminUser(id) {
    const { User } = this.ctx.model;
    await User.update({
      status: 0,
    }, {
      where: { id },
    });
  }
}

module.exports = Permission;

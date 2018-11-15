'use strict';
const Controller = require('../../../../lib/class/Controller');

class PermissionController extends Controller {
  async menuSearch() {
    const data = await this.ctx.service.api.v1.permission.menuSearch(this.ctx.request.query);
    this.ctx.body = {
      status: 0,
      data,
      message: 'success',
    };
  }

  async getMenuList() {
    const answer = await this.ctx.service.api.v1.permission.getMenuList();
    this.ctx.body = {
      status: 0,
      message: 'success',
      data: answer,
    };
  }

  async getMenuAll() {
    const answer = await this.ctx.service.api.v1.permission.getMenuAll();
    this.ctx.body = {
      status: 0,
      message: 'success',
      data: answer,
    };
  }

  async createMenu() {
    await this.ctx.service.api.v1.permission.createMenu(this.ctx.request.body);
    this.ctx.body = {
      status: 0,
      message: 'success',
    };
  }

  async deleteRole() {
    await this.ctx.service.api.v1.permission.deleteRole(this.ctx.params.id);
    this.ctx.body = {
      status: 0,
      message: 'success',
    };
  }

  async createRoleMenu() {
    await this.ctx.service.api.v1.permission.createRoleMenu(this.ctx.request.body);
    this.ctx.body = {
      status: 0,
      message: 'success',
    };
  }

  async createRoleDepartment() {
    await this.ctx.service.api.v1.permission.createRoleDepartment(this.ctx.request.body);
    this.ctx.body = {
      status: 0,
      message: 'success',
    };
  }

  async updateMenu() {
    await this.ctx.service.api.v1.permission.updateMenu(this.ctx.request.body);
    this.ctx.body = {
      status: 0,
      message: 'success',
    };
  }
  async deleteMenu() {
    await this.ctx.service.api.v1.permission.deleteMenu(this.ctx.params.id);
    this.ctx.body = {
      status: 0,
      message: 'success',
    };
  }
  async getRoleList() {
    const answer = await this.ctx.service.api.v1.permission.getRoleList(this.ctx.request.query);
    this.ctx.body = {
      status: 0,
      message: 'success',
      data: answer,
    };
  }

  async getRoleAll() {
    const answer = await this.ctx.service.api.v1.permission.getRoleAll();
    this.ctx.body = {
      status: 0,
      message: 'success',
      data: answer,
    };
  }

  async createRole() {
    await this.ctx.service.api.v1.permission.createRole(this.ctx.request.body);
    this.ctx.body = {
      status: 0,
      message: 'success',
    };
  }

  async updateRole() {
    await this.ctx.service.api.v1.permission.updateRole(this.ctx.request.body);
    this.ctx.body = {
      status: 0,
      message: 'success',
    };
  }

  async setDefaultRole() {
    await this.ctx.service.api.v1.permission.setDefaultRole(this.ctx.request.body);
    this.ctx.body = {
      status: 0,
      message: 'success',
    };
  }

  async departmentSearch() {
    const data = await this.ctx.service.api.v1.permission.departmentSearch(this.ctx.request.params);
    this.ctx.body = {
      status: 0,
      data,
      message: 'success',
    };
  }

  async createDepartment() {
    await this.ctx.service.api.v1.permission.createDepartment(this.ctx.request.body);
    this.ctx.body = {
      status: 0,
      message: 'success',
    };
  }

  async getDepartmentByParent() {
    const answer = await this.ctx.service.api.v1.permission.getDepartmentByParent(this.ctx.params.id);
    this.ctx.body = {
      status: 0,
      message: 'success',
      data: answer,
    };
  }

  async updateDepartment() {
    await this.ctx.service.api.v1.permission.updateDepartment(this.ctx.request.body);
    this.ctx.body = {
      status: 0,
      message: 'success',
    };
  }

  async createAdminUser() {
    await this.ctx.service.api.v1.permission.createAdminUser(this.ctx.request.body);
    this.ctx.body = {
      status: 0,
      message: 'success',
    };
  }

  async updateAdminUser() {
    await this.ctx.service.api.v1.permission.updateAdminUser(this.ctx.request.body);
    this.ctx.body = {
      status: 0,
      message: 'success',
    };
  }

  async getAdminUserList() {
    const data = await this.ctx.service.api.v1.permission.getAdminUserList(this.ctx.request.query);
    this.ctx.body = {
      data,
      status: 0,
      message: 'success',
    };
  }

  async deleteAdminUser() {
    await this.ctx.service.api.v1.permission.deleteAdminUser(this.ctx.params.id);
    this.ctx.body = {
      status: 0,
      message: 'success',
    };
  }
  async disableAdminUser() {
    await this.ctx.service.api.v1.permission.disableAdminUser(this.ctx.params.id);
    this.ctx.body = {
      status: 0,
      message: 'success',
    };
  }
  async enableAdminUser() {
    await this.ctx.service.api.v1.permission.enableAdminUser(this.ctx.params.id);
    this.ctx.body = {
      status: 0,
      message: 'success',
    };
  }
}

module.exports = PermissionController;

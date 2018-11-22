'use strict';
module.exports = app => {
  const { Sequelize } = app.model;
  const DataTypes = Sequelize;
  const Menu = app.model.define('tb_menus', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    buttonType: {
      type: DataTypes.CHAR(),
      allowNull: false,
      defaultValue: '',
    },
    checked: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: '',
    },
    component: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      defaultValue: '',
    },
    createUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '',
    },
    delFlag: {
      type: DataTypes.TINYINT(11),
      allowNull: false,
      defaultValue: '',
    },
    description: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      defaultValue: '',
    },
    expand: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: '',
    },
    icon: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: '',
    },
    level: {
      type: DataTypes.TINYINT(2),
      allowNull: false,
      defaultValue: '',
    },
    name: {
      type: DataTypes.CHAR(100),
      allowNull: false,
      defaultValue: '',
    },
    path: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      defaultValue: '',
    },
    permTypes: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      defaultValue: '',
    },
    selected: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: '',
    },
    sortOrder: {
      type: DataTypes.DOUBLE(),
      allowNull: false,
      defaultValue: '',
    },
    status: {
      type: DataTypes.TINYINT(2),
      allowNull: false,
      defaultValue: '',
    },
    title: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      defaultValue: '',
    },
    type: {
      type: DataTypes.TINYINT(2),
      allowNull: false,
      defaultValue: '',
    },
    url: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      defaultValue: '',
    },
    parentId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    method: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      defaultValue: 'GET',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return Menu;
};

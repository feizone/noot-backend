'use strict';
module.exports = app => {
  const { Sequelize } = app.model;
  const DataTypes = Sequelize;
  const Role = app.model.define('tb_roles', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.TINYINT(1),
      defaultValue: 0,
    },
    description: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      defaultValue: '',
    },
    name: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      defaultValue: '',
    },
    delFlag: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: '',
    },
    permissions: {
      type: DataTypes.TEXT(),
      allowNull: false,
      defaultValue: '[]',
    },
    departments: {
      type: DataTypes.TEXT(),
      allowNull: false,
      defaultValue: '[]',
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

  return Role;
};

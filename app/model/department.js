'use strict';
module.exports = app => {
  const { Sequelize } = app.model;
  const DataTypes = Sequelize;
  const Department = app.model.define('tb_departments', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    createBy: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    delFlag: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: '',
    },
    isParent: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: '',
    },
    parentId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '',
    },
    parentTitle: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      defaultValue: '',
    },
    sortOrder: {
      type: DataTypes.DOUBLE(),
      allowNull: false,
      defaultValue: '',
    },
    status: {
      type: DataTypes.TINYINT(1),
      allowNull: false,
      defaultValue: '',
    },
    title: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      defaultValue: '',
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

  return Department;
};

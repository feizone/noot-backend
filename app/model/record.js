'use strict';

module.exports = app => {
  const { Sequelize } = app.model;
  const DataTypes = Sequelize;
  const Record = app.model.define('tb_records', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    idcard: {
      type: DataTypes.CHAR(20),
      allowNull: true,
      defaultValue: '',
      unique: 'record_unique_index'
    },
    realname: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '',
      unique: 'record_unique_index'
    },
    money: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0,
      unique: 'record_unique_index'
    },
    create_user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: 0,
      unique: 'record_unique_index'
    },
    phone: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: '',
    },
    discredit_date: {
      type: DataTypes.DATE,
      allowNull: true,
      unique: 'record_unique_index'
    },
    discredit_times: {
      type: DataTypes.DATE,
      allowNull: true,
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

  return Record;
};

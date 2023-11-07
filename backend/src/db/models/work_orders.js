const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const work_orders = sequelize.define(
    'work_orders',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      order_date: {
        type: DataTypes.DATE,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  work_orders.associate = (db) => {
    db.work_orders.belongsToMany(db.raw_materials, {
      as: 'materials_needed',
      foreignKey: {
        name: 'work_orders_materials_neededId',
      },
      constraints: false,
      through: 'work_ordersMaterials_neededRaw_materials',
    });

    db.work_orders.belongsToMany(db.employees, {
      as: 'labor_assigned',
      foreignKey: {
        name: 'work_orders_labor_assignedId',
      },
      constraints: false,
      through: 'work_ordersLabor_assignedEmployees',
    });

    db.work_orders.belongsToMany(db.machinery, {
      as: 'machinery_used',
      foreignKey: {
        name: 'work_orders_machinery_usedId',
      },
      constraints: false,
      through: 'work_ordersMachinery_usedMachinery',
    });

    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.work_orders.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.work_orders.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return work_orders;
};

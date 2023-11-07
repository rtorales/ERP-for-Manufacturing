const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const employees = sequelize.define(
    'employees',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      employee_name: {
        type: DataTypes.TEXT,
      },

      role: {
        type: DataTypes.TEXT,
      },

      shift: {
        type: DataTypes.TEXT,
      },

      pay_rate: {
        type: DataTypes.DECIMAL,
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

  employees.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.employees.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.employees.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return employees;
};

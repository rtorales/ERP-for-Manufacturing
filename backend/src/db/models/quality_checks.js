const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const quality_checks = sequelize.define(
    'quality_checks',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      check_date: {
        type: DataTypes.DATE,
      },

      check_stage: {
        type: DataTypes.TEXT,
      },

      passed: {
        type: DataTypes.BOOLEAN,

        allowNull: false,
        defaultValue: false,
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

  quality_checks.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.quality_checks.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.quality_checks.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return quality_checks;
};

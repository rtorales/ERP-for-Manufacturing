const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const raw_materials = sequelize.define(
    'raw_materials',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      material_name: {
        type: DataTypes.TEXT,
      },

      stock_quantity: {
        type: DataTypes.INTEGER,
      },

      reorder_level: {
        type: DataTypes.INTEGER,
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

  raw_materials.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.raw_materials.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.raw_materials.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return raw_materials;
};

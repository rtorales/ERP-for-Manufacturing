const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const inventories = sequelize.define(
    'inventories',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      product_name: {
        type: DataTypes.TEXT,
      },

      available_quantity: {
        type: DataTypes.INTEGER,
      },

      reserved_quantity: {
        type: DataTypes.INTEGER,
      },

      returned_quantity: {
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

  inventories.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.inventories.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.inventories.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return inventories;
};

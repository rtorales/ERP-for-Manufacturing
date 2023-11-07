const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class InventoriesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const inventories = await db.inventories.create(
      {
        id: data.id || undefined,

        product_name: data.product_name || null,
        available_quantity: data.available_quantity || null,
        reserved_quantity: data.reserved_quantity || null,
        returned_quantity: data.returned_quantity || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return inventories;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const inventoriesData = data.map((item) => ({
      id: item.id || undefined,

      product_name: item.product_name || null,
      available_quantity: item.available_quantity || null,
      reserved_quantity: item.reserved_quantity || null,
      returned_quantity: item.returned_quantity || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
    }));

    // Bulk create items
    const inventories = await db.inventories.bulkCreate(inventoriesData, {
      transaction,
    });

    // For each item created, replace relation files

    return inventories;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const inventories = await db.inventories.findByPk(id, {
      transaction,
    });

    await inventories.update(
      {
        product_name: data.product_name || null,
        available_quantity: data.available_quantity || null,
        reserved_quantity: data.reserved_quantity || null,
        returned_quantity: data.returned_quantity || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return inventories;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const inventories = await db.inventories.findByPk(id, options);

    await inventories.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await inventories.destroy({
      transaction,
    });

    return inventories;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const inventories = await db.inventories.findOne(
      { where },
      { transaction },
    );

    if (!inventories) {
      return inventories;
    }

    const output = inventories.get({ plain: true });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.product_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'inventories',
            'product_name',
            filter.product_name,
          ),
        };
      }

      if (filter.available_quantityRange) {
        const [start, end] = filter.available_quantityRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            available_quantity: {
              ...where.available_quantity,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            available_quantity: {
              ...where.available_quantity,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.reserved_quantityRange) {
        const [start, end] = filter.reserved_quantityRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            reserved_quantity: {
              ...where.reserved_quantity,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            reserved_quantity: {
              ...where.reserved_quantity,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.returned_quantityRange) {
        const [start, end] = filter.returned_quantityRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            returned_quantity: {
              ...where.returned_quantity,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            returned_quantity: {
              ...where.returned_quantity,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.inventories.count({
            where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.inventories.findAndCountAll({
          where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('inventories', 'product_name', query),
        ],
      };
    }

    const records = await db.inventories.findAll({
      attributes: ['id', 'product_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['product_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.product_name,
    }));
  }
};

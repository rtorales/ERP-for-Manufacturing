const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Raw_materialsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const raw_materials = await db.raw_materials.create(
      {
        id: data.id || undefined,

        material_name: data.material_name || null,
        stock_quantity: data.stock_quantity || null,
        reorder_level: data.reorder_level || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return raw_materials;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const raw_materialsData = data.map((item) => ({
      id: item.id || undefined,

      material_name: item.material_name || null,
      stock_quantity: item.stock_quantity || null,
      reorder_level: item.reorder_level || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
    }));

    // Bulk create items
    const raw_materials = await db.raw_materials.bulkCreate(raw_materialsData, {
      transaction,
    });

    // For each item created, replace relation files

    return raw_materials;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const raw_materials = await db.raw_materials.findByPk(id, {
      transaction,
    });

    await raw_materials.update(
      {
        material_name: data.material_name || null,
        stock_quantity: data.stock_quantity || null,
        reorder_level: data.reorder_level || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return raw_materials;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const raw_materials = await db.raw_materials.findByPk(id, options);

    await raw_materials.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await raw_materials.destroy({
      transaction,
    });

    return raw_materials;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const raw_materials = await db.raw_materials.findOne(
      { where },
      { transaction },
    );

    if (!raw_materials) {
      return raw_materials;
    }

    const output = raw_materials.get({ plain: true });

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

      if (filter.material_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'raw_materials',
            'material_name',
            filter.material_name,
          ),
        };
      }

      if (filter.stock_quantityRange) {
        const [start, end] = filter.stock_quantityRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            stock_quantity: {
              ...where.stock_quantity,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            stock_quantity: {
              ...where.stock_quantity,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.reorder_levelRange) {
        const [start, end] = filter.reorder_levelRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            reorder_level: {
              ...where.reorder_level,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            reorder_level: {
              ...where.reorder_level,
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
          count: await db.raw_materials.count({
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
      : await db.raw_materials.findAndCountAll({
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
          Utils.ilike('raw_materials', 'material_name', query),
        ],
      };
    }

    const records = await db.raw_materials.findAll({
      attributes: ['id', 'material_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['material_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.material_name,
    }));
  }
};

const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Work_ordersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const work_orders = await db.work_orders.create(
      {
        id: data.id || undefined,

        order_date: data.order_date || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await work_orders.setMaterials_needed(data.materials_needed || [], {
      transaction,
    });

    await work_orders.setLabor_assigned(data.labor_assigned || [], {
      transaction,
    });

    await work_orders.setMachinery_used(data.machinery_used || [], {
      transaction,
    });

    return work_orders;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const work_ordersData = data.map((item) => ({
      id: item.id || undefined,

      order_date: item.order_date || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
    }));

    // Bulk create items
    const work_orders = await db.work_orders.bulkCreate(work_ordersData, {
      transaction,
    });

    // For each item created, replace relation files

    return work_orders;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const work_orders = await db.work_orders.findByPk(id, {
      transaction,
    });

    await work_orders.update(
      {
        order_date: data.order_date || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await work_orders.setMaterials_needed(data.materials_needed || [], {
      transaction,
    });

    await work_orders.setLabor_assigned(data.labor_assigned || [], {
      transaction,
    });

    await work_orders.setMachinery_used(data.machinery_used || [], {
      transaction,
    });

    return work_orders;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const work_orders = await db.work_orders.findByPk(id, options);

    await work_orders.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await work_orders.destroy({
      transaction,
    });

    return work_orders;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const work_orders = await db.work_orders.findOne(
      { where },
      { transaction },
    );

    if (!work_orders) {
      return work_orders;
    }

    const output = work_orders.get({ plain: true });

    output.materials_needed = await work_orders.getMaterials_needed({
      transaction,
    });

    output.labor_assigned = await work_orders.getLabor_assigned({
      transaction,
    });

    output.machinery_used = await work_orders.getMachinery_used({
      transaction,
    });

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
    let include = [
      {
        model: db.raw_materials,
        as: 'materials_needed',
        through: filter.materials_needed
          ? {
              where: {
                [Op.or]: filter.materials_needed.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.materials_needed ? true : null,
      },

      {
        model: db.employees,
        as: 'labor_assigned',
        through: filter.labor_assigned
          ? {
              where: {
                [Op.or]: filter.labor_assigned.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.labor_assigned ? true : null,
      },

      {
        model: db.machinery,
        as: 'machinery_used',
        through: filter.machinery_used
          ? {
              where: {
                [Op.or]: filter.machinery_used.split('|').map((item) => {
                  return { ['Id']: Utils.uuid(item) };
                }),
              },
            }
          : null,
        required: filter.machinery_used ? true : null,
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.order_dateRange) {
        const [start, end] = filter.order_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            order_date: {
              ...where.order_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            order_date: {
              ...where.order_date,
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
          count: await db.work_orders.count({
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
      : await db.work_orders.findAndCountAll({
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
          Utils.ilike('work_orders', 'order_date', query),
        ],
      };
    }

    const records = await db.work_orders.findAll({
      attributes: ['id', 'order_date'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['order_date', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.order_date,
    }));
  }
};

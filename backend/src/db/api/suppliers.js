const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class SuppliersDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const suppliers = await db.suppliers.create(
      {
        id: data.id || undefined,

        supplier_name: data.supplier_name || null,
        contract_terms: data.contract_terms || null,
        delivery_schedule: data.delivery_schedule || null,
        payment_records: data.payment_records || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return suppliers;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const suppliersData = data.map((item) => ({
      id: item.id || undefined,

      supplier_name: item.supplier_name || null,
      contract_terms: item.contract_terms || null,
      delivery_schedule: item.delivery_schedule || null,
      payment_records: item.payment_records || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
    }));

    // Bulk create items
    const suppliers = await db.suppliers.bulkCreate(suppliersData, {
      transaction,
    });

    // For each item created, replace relation files

    return suppliers;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const suppliers = await db.suppliers.findByPk(id, {
      transaction,
    });

    await suppliers.update(
      {
        supplier_name: data.supplier_name || null,
        contract_terms: data.contract_terms || null,
        delivery_schedule: data.delivery_schedule || null,
        payment_records: data.payment_records || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return suppliers;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const suppliers = await db.suppliers.findByPk(id, options);

    await suppliers.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await suppliers.destroy({
      transaction,
    });

    return suppliers;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const suppliers = await db.suppliers.findOne({ where }, { transaction });

    if (!suppliers) {
      return suppliers;
    }

    const output = suppliers.get({ plain: true });

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

      if (filter.supplier_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'suppliers',
            'supplier_name',
            filter.supplier_name,
          ),
        };
      }

      if (filter.contract_terms) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'suppliers',
            'contract_terms',
            filter.contract_terms,
          ),
        };
      }

      if (filter.payment_records) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'suppliers',
            'payment_records',
            filter.payment_records,
          ),
        };
      }

      if (filter.delivery_scheduleRange) {
        const [start, end] = filter.delivery_scheduleRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            delivery_schedule: {
              ...where.delivery_schedule,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            delivery_schedule: {
              ...where.delivery_schedule,
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
          count: await db.suppliers.count({
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
      : await db.suppliers.findAndCountAll({
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
          Utils.ilike('suppliers', 'supplier_name', query),
        ],
      };
    }

    const records = await db.suppliers.findAll({
      attributes: ['id', 'supplier_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['supplier_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.supplier_name,
    }));
  }
};

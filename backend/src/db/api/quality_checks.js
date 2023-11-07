const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Quality_checksDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const quality_checks = await db.quality_checks.create(
      {
        id: data.id || undefined,

        check_date: data.check_date || null,
        check_stage: data.check_stage || null,
        passed: data.passed || false,

        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return quality_checks;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const quality_checksData = data.map((item) => ({
      id: item.id || undefined,

      check_date: item.check_date || null,
      check_stage: item.check_stage || null,
      passed: item.passed || false,

      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
    }));

    // Bulk create items
    const quality_checks = await db.quality_checks.bulkCreate(
      quality_checksData,
      { transaction },
    );

    // For each item created, replace relation files

    return quality_checks;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const quality_checks = await db.quality_checks.findByPk(id, {
      transaction,
    });

    await quality_checks.update(
      {
        check_date: data.check_date || null,
        check_stage: data.check_stage || null,
        passed: data.passed || false,

        updatedById: currentUser.id,
      },
      { transaction },
    );

    return quality_checks;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const quality_checks = await db.quality_checks.findByPk(id, options);

    await quality_checks.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await quality_checks.destroy({
      transaction,
    });

    return quality_checks;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const quality_checks = await db.quality_checks.findOne(
      { where },
      { transaction },
    );

    if (!quality_checks) {
      return quality_checks;
    }

    const output = quality_checks.get({ plain: true });

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

      if (filter.check_stage) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'quality_checks',
            'check_stage',
            filter.check_stage,
          ),
        };
      }

      if (filter.check_dateRange) {
        const [start, end] = filter.check_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            check_date: {
              ...where.check_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            check_date: {
              ...where.check_date,
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

      if (filter.passed) {
        where = {
          ...where,
          passed: filter.passed,
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
          count: await db.quality_checks.count({
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
      : await db.quality_checks.findAndCountAll({
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
          Utils.ilike('quality_checks', 'check_date', query),
        ],
      };
    }

    const records = await db.quality_checks.findAll({
      attributes: ['id', 'check_date'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['check_date', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.check_date,
    }));
  }
};

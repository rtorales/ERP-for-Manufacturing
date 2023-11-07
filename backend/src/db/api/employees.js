const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class EmployeesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.create(
      {
        id: data.id || undefined,

        employee_name: data.employee_name || null,
        role: data.role || null,
        shift: data.shift || null,
        pay_rate: data.pay_rate || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return employees;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const employeesData = data.map((item) => ({
      id: item.id || undefined,

      employee_name: item.employee_name || null,
      role: item.role || null,
      shift: item.shift || null,
      pay_rate: item.pay_rate || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
    }));

    // Bulk create items
    const employees = await db.employees.bulkCreate(employeesData, {
      transaction,
    });

    // For each item created, replace relation files

    return employees;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.findByPk(id, {
      transaction,
    });

    await employees.update(
      {
        employee_name: data.employee_name || null,
        role: data.role || null,
        shift: data.shift || null,
        pay_rate: data.pay_rate || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    return employees;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.findByPk(id, options);

    await employees.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await employees.destroy({
      transaction,
    });

    return employees;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const employees = await db.employees.findOne({ where }, { transaction });

    if (!employees) {
      return employees;
    }

    const output = employees.get({ plain: true });

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

      if (filter.employee_name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike(
            'employees',
            'employee_name',
            filter.employee_name,
          ),
        };
      }

      if (filter.role) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('employees', 'role', filter.role),
        };
      }

      if (filter.shift) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('employees', 'shift', filter.shift),
        };
      }

      if (filter.pay_rateRange) {
        const [start, end] = filter.pay_rateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            pay_rate: {
              ...where.pay_rate,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            pay_rate: {
              ...where.pay_rate,
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
          count: await db.employees.count({
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
      : await db.employees.findAndCountAll({
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
          Utils.ilike('employees', 'employee_name', query),
        ],
      };
    }

    const records = await db.employees.findAll({
      attributes: ['id', 'employee_name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['employee_name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.employee_name,
    }));
  }
};

// This wrapper adds Sequelize-like methods to Mongoose models
export const withSqlCompat = (mongooseModel) => {
  // We can't easily mutate the class static methods directly in a way that inherits cleanly
  // without side effects, so we wrap them in a Proxy or just attach methods.
  // Attaching methods is safer.

  mongooseModel.findByPk = async function (id, options) {
    // Sequelize: findByPk(id, { include: ... })
    // Mongoose: findById(id)
    const query = this.findById(id);
    // Handle attributes/select if needed, but basic lookup:
    let doc = await query.exec();
    if (doc) doc = transformDoc(doc);
    return doc;
  };

  mongooseModel.findAndCountAll = async function (options = {}) {
    const { where, limit, offset, order } = options;
    const mongoQuery = convertWhere(where);

    // Convert order: [['createdAt', 'DESC']] -> { createdAt: -1 }
    const sort = {};
    if (order) {
      order.forEach(([key, dir]) => {
        sort[key] = dir === "DESC" ? -1 : 1;
      });
    }

    const count = await this.countDocuments(mongoQuery);
    const rows = await this.find(mongoQuery)
      .sort(sort)
      .skip(offset || 0)
      .limit(limit || 0);

    return {
      count,
      rows: rows.map(transformDoc),
    };
  };

  mongooseModel.findAll = async function (options = {}) {
    const { where, order } = options;
    const mongoQuery = convertWhere(where);

    const sort = {};
    if (order) {
      order.forEach(([key, dir]) => {
        sort[key] = dir === "DESC" ? -1 : 1;
      });
    }

    const rows = await this.find(mongoQuery).sort(sort);
    return rows.map(transformDoc);
  };

  // Wrap findOne to support 'where'
  const originalFindOne = mongooseModel.findOne.bind(mongooseModel);
  mongooseModel.findOne = async function (optionsOrQuery) {
    // If strict Sequelize syntax: findOne({ where: { email: ... } })
    // If generic/mixed: might pass direct query object.

    let query = optionsOrQuery;
    if (optionsOrQuery && optionsOrQuery.where) {
      query = convertWhere(optionsOrQuery.where);
    }

    let doc = await originalFindOne(query);
    if (doc) doc = transformDoc(doc);
    return doc;
  };

  // Wrap create to return id instead of _id in the object immediately if possible
  const originalCreate = mongooseModel.create.bind(mongooseModel);
  mongooseModel.create = async function (data) {
    const doc = await originalCreate(data);
    return transformDoc(doc);
  };

  return mongooseModel;
};

// Helper to convert Sequelize 'where' to Mongoose query
const convertWhere = (where) => {
  if (!where) return {};
  const query = { ...where };
  // Handle simple equality. numeric comparisons needed?
  // Sequelize: { price: { [Op.gt]: 100 } } -> Mongoose: { price: { $gt: 100 } }
  // This requires a deep parse if we use complex operators.
  // For this project, mostly simple equality is used.
  return query;
};

// Helper to add 'id' getter and other Sequelize-like props to result
const transformDoc = (doc) => {
  if (!doc) return doc;
  // Mongoose documents already have .id virtual getter usually.
  // But let's ensure we return a plain object-like interface if needed,
  // or just monkey-patch the doc.
  // Sequelize instances have .save(), .destroy(), .update()

  // Add destroy method compatible with Sequelize instance.destroy()
  if (!doc.destroy) {
    doc.destroy = async function () {
      return await this.deleteOne();
    };
  }

  // Sequelize uses instance.update(attributes), Mongoose uses doc.set() + save() or similar.
  // Or we just rely on doc.save() which exists in both (but Sequelize save() is mostly for persistence).

  return doc;
};

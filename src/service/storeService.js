import db from "../models";

const getAllStores = async () => {
  try {
    let stores = await db.Store.findAll({
      attributes: ["id", "name"],
      include: { model: db.User, attributes: ["username"], as: "user" },
    });
    if (stores) {
      return {
        EM: "Get all store success!",
        EC: 0,
        DT: stores,
      };
    } else {
      return {
        EM: "Get all store error!",
        EC: 0,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Somnething wrongs with services",
      EC: -1,
      DT: [],
    };
  }
};

const getStoreWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Store.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: ["id", "name", "image"],
      include: { model: db.User, attributes: ["id", "username"], as: "user" },
      order: [["id", "DESC"]],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      stores: rows,
    };
    return {
      EM: "Ok",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Somnething wrongs with services",
      EC: -1,
      DT: [],
    };
  }
};

const checkNameStore = async (nameStore) => {
  try {
    let store = await db.Store.findOne({
      where: { name: nameStore },
    });
    if (store) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const checkNameUser = async (nameUser) => {
  try {
    let user = await db.Store.findOne({
      where: { userId: nameUser },
    });
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const createStore = async (data) => {
  try {
    let check = await checkNameStore(data.name);
    if (check === true) {
      return {
        EM: "The store name is already exists",
        EC: 1,
        DT: "name",
      };
    }
    let checkName = await checkNameUser(data.userId);
    if (checkName === true) {
      return {
        EM: "The name user is already exists",
        EC: 1,
        DT: "userId",
      };
    }
    await db.Store.create({ ...data });
    return {
      EM: "Create store successful",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs with services",
      EC: -1,
      DT: [],
    };
  }
};

module.exports = {
  getAllStores,
  getStoreWithPagination,
  createStore,
};

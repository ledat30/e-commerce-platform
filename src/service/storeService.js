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

const updateStore = async (data) => {
  try {
    let check = await checkNameStore(data.name);
    if (check === true) {
      return {
        EM: "The store name is already exists",
        EC: 1,
        DT: "name",
      };
    }
    let store = await db.Store.findOne({
      where: { id: data.id },
    });
    if (store) {
      await store.update({
        name: data.name,
        userId: data.userId,
        ...(data.image && { image: data.image }),
      });
      return {
        EM: "Update store success",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Store not found",
        EC: 2,
        DT: "",
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

const deleteStore = async (id) => {
  try {
    let store = await db.Store.findOne({
      where: { id: id },
    });
    if (store) {
      await store.destroy();
      return {
        EM: "Delete store successfully",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Store not exist",
        EC: 2,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Error from server",
      EC: 1,
      DT: [],
    };
  }
};

const searchStore = async (keyword) => {
  try {
    const results = await db.Store.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          {
            name: {
              [db.Sequelize.Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
      attributes: ["name", "userId", "id"],
      include: [
        {
          model: db.User,
          attributes: ["username"],
          as: "user",
        },
      ],
    });
    const transformedResults = results.map((result) => ({
      name: result.name,
      userId: result?.user?.username || "",
      id: result.id,
    }));
    return {
      EM: "Ok",
      EC: 0,
      DT: transformedResults,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: `Error from server: ${error.message}`,
      EC: 1,
      DT: [],
    };
  }
};

module.exports = {
  getAllStores,
  getStoreWithPagination,
  createStore,
  updateStore,
  deleteStore,
  searchStore,
};

import db from "../models";
const { Op, Sequelize } = require("sequelize");

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

const getAllProductByStoreId = async (page, limit, storeId) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Product.findAndCountAll({
      offset: offset,
      limit: limit,
      where: { storeId: storeId },
      attributes: [
        "id",
        "product_name",
        "price",
        "old_price",
        "promotion",
        'storeId',
        "image",
      ],
      include: [
        { model: db.Store, attributes: ["name", "id"] },
      ],
      order: [["id", "DESC"]],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      product: rows,
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
}

const getCategoriesByStore = async (storeId) => {
  try {
    const category = await db.Category.findAll({
      attributes: ['id', 'category_name'],
      include: [
        {
          model: db.Product,
          where: { storeId: storeId },
          attributes: ['id', 'product_name', 'price', 'old_price', 'image', 'promotion'],
        }
      ],
      order: [["id", "DESC"]],
    })
    return {
      EM: "Get all category success!",
      EC: 0,
      DT: category,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Somnething wrongs with services",
      EC: -1,
      DT: [],
    };
  }
}

const storeDashboard = async (storeId) => {
  try {
    const totalViews = await db.Product.sum('view_count', {
      where: {
        storeId: storeId
      },
    });
    const totalViewProduct = await db.Product.findAll({
      where: {
        storeId: storeId
      },
      attributes: ['id', 'product_name', 'view_count'],
      order: [["id", "DESC"]],
    })
    const totalOrders = await db.Order.count({
      where: {
        storeId: storeId,
        status: 'confirmed'
      }
    });
    const totalRevenue = await db.Order.sum('total_amount', {
      include: [{
        model: db.Shipping_Unit_Order,
        required: true,
        include: [{
          model: db.Shipping_Unit_Order_user,
          required: true,
          where: {
            status: 'Delivered'
          }
        }]
      }],
      where: {
        storeId: storeId,
        status: 'confirmed'
      }
    });
    const totalComments = await db.Comment.count({
      include: [
        {
          model: db.Product,
          where: { storeId: storeId },
        },
      ],
    });
    const totalUniqueCustomers = await db.Order.count({
      distinct: true,
      col: 'userId',
      where: {
        storeId: storeId,
        status: 'confirmed'
      }
    });
    const totalUsers = await db.User.findAll({
      attributes: ['id', 'username', 'email'],
      include: [
        {
          model: db.Order,
          attributes: [],
          where: {
            storeId: storeId
          }
        }
      ],
      group: ['User.id', 'User.username', 'User.email']
    });

    return {
      EM: "Get all category success!",
      EC: 0,
      DT: {
        totalViews: totalViews,
        totalOrders: totalOrders,
        totalComments: totalComments,
        totalUniqueCustomers: totalUniqueCustomers,
        totalUsers: totalUsers,
        totalViewProduct: totalViewProduct,
        totalRevenue: totalRevenue,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Somnething wrongs with services",
      EC: -1,
      DT: [],
    };
  }
}

const storeDashboardOrder = async (page, limit, storeId) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Order.findAndCountAll({
      offset: offset,
      limit: limit,
      where: {
        storeId: storeId,
        status: 'confirmed'
      },
      attributes: ['id', 'total_amount', 'order_date'],
      order: [['id', 'DESC']],
      include: [
        {
          model: db.Shipping_Unit_Order,
          attributes: ['id'],
          include: [{
            model: db.Shipping_Unit_Order_user,
            attributes: ['status']
          }]
        },
        {
          model: db.User,
          attributes: ['username', 'id'],
        },
        {
          model: db.OrderItem,
          attributes: ['id', 'quantily'],
          include: [
            {
              model: db.Product_size_color,
              attributes: ['id'],
              include: [
                {
                  model: db.Product,
                  attributes: ['product_name', 'id']
                },
                {
                  model: db.Size,
                  attributes: ['size_value']
                },
                {
                  model: db.Color,
                  attributes: ['name'],
                },
              ],
              where: {
                [Op.and]: [
                  { sizeId: { [Op.not]: null } },
                  { colorId: { [Op.not]: null } },
                ],
              },
            }
          ]
        }
      ]
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      orders: rows,
    }
    return {
      EM: 'OK',
      EC: 0,
      DT: data,
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Somnething wrongs with services",
      EC: -1,
      DT: [],
    };
  }
}

const storeDashboardRevenue = async (page, limit, storeId) => {
  try {
    let offset = (page - 1) * limit;
    const dailyRevenue = await db.Order.findAll({
      include: [{
        model: db.Shipping_Unit_Order,
        required: true,
        include: [{
          model: db.Shipping_Unit_Order_user,
          required: true,
          where: {
            status: 'Delivered'
          }
        }]
      }],
      where: {
        storeId: storeId,
        status: 'confirmed'
      },
      attributes: [
        [db.Sequelize.fn('DATE', db.Sequelize.col('order_date')), 'order_date'],
        [db.Sequelize.fn('SUM', db.Sequelize.col('total_amount')), 'total_revenue'],
        [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'order_count']
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('order_date'))],
      order: [[Sequelize.fn('DATE', Sequelize.col('order_date')), 'DESC']],
      limit: limit,
      offset: offset,
    });
    const countResult = await db.Order.findAll({
      where: {
        storeId: storeId,
        status: 'confirmed'
      },
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.fn('DATE', Sequelize.col('order_date'))), 'distinct_dates']
      ],
    });
    const totalDistinctDates = countResult.length;
    const totalPages = Math.ceil(totalDistinctDates / limit);
    let data = {
      totalPages: totalPages,
      totalRow: totalDistinctDates,
      dailyRevenue: dailyRevenue,
    };
    return {
      EM: 'OK',
      EC: 0,
      DT: data,
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Somnething wrongs with services",
      EC: -1,
      DT: [],
    };
  }
}

const storeDashboardRevenueByDate = async (page, limit, storeId, date) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Order.findAndCountAll({
      offset: offset,
      limit: limit,
      where: {
        storeId: storeId,
        status: 'confirmed',
        order_date: {
          [db.Sequelize.Op.between]: [
            `${date} 00:00:00`,
            `${date} 23:59:59`
          ]
        },
      },
      attributes: ['total_amount', 'id'],
      order: [['id', 'DESC']],
      include: [
        {
          model: db.Shipping_Unit_Order,
          required: true,
          include: [{
            model: db.Shipping_Unit_Order_user,
            required: true,
            where: {
              status: 'Delivered'
            }
          }]
        },
        {
          model: db.User,
          attributes: ['username', 'id']
        },
        {
          model: db.OrderItem,
          attributes: ['quantily', 'id'],
          include: [
            {
              model: db.Product_size_color,
              attributes: ['id'],
              include: [
                {
                  model: db.Product,
                  attributes: ['product_name', 'id']
                },
                {
                  model: db.Size,
                  attributes: ['size_value']
                },
                {
                  model: db.Color,
                  attributes: ['name'],
                },
              ],
              where: {
                [db.Sequelize.Op.and]: [
                  { sizeId: { [db.Sequelize.Op.not]: null } },
                  { colorId: { [db.Sequelize.Op.not]: null } },
                ],
              },
            }
          ]
        }
      ]
    });

    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      orders: rows,
    }

    return {
      EM: 'OK',
      EC: 0,
      DT: data,
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrong with services",
      EC: -1,
      DT: [],
    };
  }
}


module.exports = {
  storeDashboardOrder,
  getAllStores,
  storeDashboard,
  storeDashboardRevenueByDate,
  storeDashboardRevenue,
  getCategoriesByStore,
  getAllProductByStoreId,
  getStoreWithPagination,
  createStore,
  updateStore,
  deleteStore,
  searchStore,
};

import db from "../models";
const { Op, Sequelize, where, fn, col, literal } = require("sequelize");

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
      where: { isDelete: null },
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
      await store.update({ isDelete: 1 });
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

    const topUserIds = await db.Order.findAll({
      attributes: [
        'userId',
        [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'totalSpent']
      ],
      include: [
        {
          model: db.Shipping_Unit_Order,
          required: true,
          attributes: ['id'],
          include: [
            {
              model: db.Shipping_Unit_Order_user,
              required: true,
              attributes: ['id'],
              where: {
                status: 'Delivered'
              }
            }
          ]
        }
      ],
      where: {
        storeId: storeId,
        status: 'confirmed'
      },
      group: ['userId'],
      order: [[Sequelize.literal('totalSpent'), 'DESC']],
      limit: 10
    });

    const userIds = topUserIds.map(order => order.userId);

    const totalUsers = await db.Order.findAll({
      attributes: [
        'userId',
        [Sequelize.fn('SUM', Sequelize.col('total_amount')), 'totalSpent']
      ],
      where: {
        storeId: storeId,
        status: 'confirmed',
        userId: {
          [Op.in]: userIds
        }
      },
      include: [
        {
          model: db.Shipping_Unit_Order,
          required: true,
          attributes: ['id'],
          include: [
            {
              model: db.Shipping_Unit_Order_user,
              required: true,
              attributes: ['id'],
              where: {
                status: 'Delivered'
              }
            }
          ]
        },
        { model: db.User, attributes: ['username', 'email', 'phonenumber'] }
      ],
      group: ['userId'],
      order: [[Sequelize.literal('totalSpent'), 'DESC']],
      limit: 10
    });

    const monthlyRevenueByStore = await db.Order.findAll({
      attributes: [
        [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('Order.createdAt'), '%Y-%m'), 'month'],
        [db.sequelize.fn('sum', db.sequelize.col('Order.total_amount')), 'totalRevenue'],
      ],
      where: {
        storeId: storeId,
        status: 'confirmed'
      },
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
      group: [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('Order.createdAt'), '%Y-%m')],
      order: [[db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), '%Y-%m'), 'ASC']]
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
        monthlyRevenueByStore: monthlyRevenueByStore,
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
          attributes: ['username', 'id', 'phonenumber'],
        },
        {
          model: db.OrderItem,
          attributes: ['id', 'quantily'],
          include: [
            {
              model: db.ProductAttribute,
              attributes: ['id'],
              include: [
                {
                  model: db.Product,
                  attributes: ['product_name', 'id']
                },
                {
                  model: db.AttributeValue,
                  as: 'AttributeValue1',
                  attributes: ['id', 'name'],
                  include: [
                    { model: db.Attribute, attributes: ['id', 'name'] }
                  ]
                },
                {
                  model: db.AttributeValue,
                  as: 'AttributeValue2',
                  attributes: ['id', 'name'],
                  include: [
                    { model: db.Attribute, attributes: ['id', 'name'] }
                  ]
                }
              ],
            },
            { model: db.Order, attributes: ['customerName', 'phonenumber', 'address_detail'], }
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
          attributes: ['username', 'id', 'phonenumber']
        },
        {
          model: db.OrderItem,
          attributes: ['quantily', 'id'],
          include: [
            {
              model: db.ProductAttribute,
              attributes: ['id'],
              include: [
                {
                  model: db.Product,
                  attributes: ['product_name', 'id']
                },
                {
                  model: db.AttributeValue,
                  as: 'AttributeValue1',
                  attributes: ['id', 'name'],
                  include: [
                    { model: db.Attribute, attributes: ['id', 'name'] }
                  ]
                },
                {
                  model: db.AttributeValue,
                  as: 'AttributeValue2',
                  attributes: ['id', 'name'],
                  include: [
                    { model: db.Attribute, attributes: ['id', 'name'] }
                  ]
                }
              ],
            },
            { model: db.Order, attributes: ['customerName', 'phonenumber', 'address_detail'] }
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

const storeStatistical = async (storeId) => {
  try {
    const topSellerProducts = await db.Inventory.findAll({
      where: {
        storeId: storeId,
        quantity_sold: {
          [Op.ne]: null
        }
      },
      order: [
        ['quantity_sold', 'DESC']
      ],
      attributes: ['quantity_sold'],
      include: [
        {
          model: db.ProductAttribute, attributes: ['id'],
          include: [
            {
              model: db.Product,
              attributes: ['product_name']
            },
            {
              model: db.AttributeValue,
              as: 'AttributeValue1',
              attributes: ['id', 'name'],
              include: [
                { model: db.Attribute, attributes: ['id', 'name'] }
              ]
            },
            {
              model: db.AttributeValue,
              as: 'AttributeValue2',
              attributes: ['id', 'name'],
              include: [
                { model: db.Attribute, attributes: ['id', 'name'] }
              ]
            }
          ]
        }
      ],
      limit: 20
    });

    const topViewProducts = await db.Product.findAll({
      where: {
        storeId: storeId,
        view_count: {
          [Op.ne]: 0
        }
      },
      attributes: ['product_name', 'view_count', 'id'],
      include: [{ model: db.Category, attributes: ['category_name'] }],
      order: [['view_count', 'DESC']],
      limit: 20
    });

    const topDistricts = await db.Order.findAll({
      attributes: [
        'districtId',
        [db.sequelize.fn('COUNT', db.sequelize.col('districtId')), 'totalOrders']
      ],
      where: {
        storeId: storeId,
        status: 'confirmed'
      },
      group: ['districtId'],
      order: [[db.sequelize.literal('totalOrders'), 'DESC']],
      limit: 10,
      raw: true
    });

    const districtIds = topDistricts.map(district => district.districtId);

    const topOrdersByArea = await db.Order.findAll({
      where: {
        districtId: districtIds,
        storeId: storeId,
        status: 'confirmed',
      },
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
        { model: db.Province, attributes: ['province_full_name'], distinct: true },
        { model: db.Ward, attributes: ['ward_full_name'], distinct: true },
        { model: db.District, attributes: ['district_full_name'], distinct: true },
        {
          model: db.OrderItem,
          attributes: ['quantily', 'id', 'price_per_item'],
          include: [
            {
              model: db.ProductAttribute,
              attributes: ['id'],
              include: [
                {
                  model: db.Product,
                  attributes: ['product_name', 'id']
                },
                {
                  model: db.AttributeValue,
                  as: 'AttributeValue1',
                  attributes: ['id', 'name'],
                  include: [
                    { model: db.Attribute, attributes: ['id', 'name'] }
                  ]
                },
                {
                  model: db.AttributeValue,
                  as: 'AttributeValue2',
                  attributes: ['id', 'name'],
                  include: [
                    { model: db.Attribute, attributes: ['id', 'name'] }
                  ]
                }
              ]
            },
            {
              model: db.Order, attributes: ['customerName', 'phonenumber', 'address_detail'],
              include: [
                { model: db.User, attributes: ['username', 'phonenumber'] }
              ]
            },
          ]
        }
      ],
      order: [[db.sequelize.col('districtId'), 'ASC']],
      distinct: true
    });

    const totalOutOfStock = await db.Inventory.findAll({
      where: {
        currentNumber: {
          [Sequelize.Op.lt]: 10
        }
      }
      , attributes: ['currentNumber'],
      include: [
        {
          model: db.ProductAttribute,
          attributes: ['id'],
          include: [
            {
              model: db.Product,
              attributes: ['product_name', 'id']
            },
            {
              model: db.AttributeValue,
              as: 'AttributeValue1',
              attributes: ['id', 'name'],
              include: [
                { model: db.Attribute, attributes: ['id', 'name'] }
              ]
            },
            {
              model: db.AttributeValue,
              as: 'AttributeValue2',
              attributes: ['id', 'name'],
              include: [
                { model: db.Attribute, attributes: ['id', 'name'] }
              ]
            }
          ],
        }
      ],
      order: [['currentNumber', 'ASC']]
    });

    return {
      EM: "Get all success!",
      EC: 0,
      DT: {
        topSellerProducts: topSellerProducts,
        topViewProducts: topViewProducts,
        topOrderByArea: topOrdersByArea,
        totalOutOfStock: totalOutOfStock,
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

module.exports = {
  storeDashboardOrder,
  storeStatistical,
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

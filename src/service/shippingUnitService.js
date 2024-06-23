import db from "../models/index";
const { Op, where } = require("sequelize");

const checkNameShippingUnit = async (nameShippingUnit) => {
  try {
    let shippingUnit = await db.ShippingUnit.findOne({
      where: { shipping_unit_name: nameShippingUnit },
    });
    if (shippingUnit) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};
const checkUser = async (userId) => {
  try {
    let name = await db.ShippingUnit.findOne({
      where: { userId: userId },
    });
    if (name) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

const createShippingUnit = async (data) => {
  try {
    let check = await checkNameShippingUnit(data.shipping_unit_name);
    if (check === true) {
      return {
        EM: "The shipping unit name is already exists",
        EC: 1,
        DT: "shipping_unit_name",
      };
    }
    let checkName = await checkUser(data.userId);
    if (checkName === true) {
      return {
        EM: "The user name is already exists",
        EC: 1,
        DT: "userId",
      };
    }
    await db.ShippingUnit.create({ ...data });
    return {
      EM: "Create shipping unit successful",
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

const getAllShippingUnit = async () => {
  try {
    let shippingUnit = await db.ShippingUnit.findAll();
    if (shippingUnit) {
      return {
        EM: "Get all shipping unit success!",
        EC: 0,
        DT: shippingUnit,
      };
    } else {
      return {
        EM: "Get all shipping unit error!",
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

const getShippingUnitWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.ShippingUnit.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: ["id", "shipping_unit_name"],
      where: { isDelete: null },
      include: [
        { model: db.User, attributes: [`username`] },
      ],
      order: [["id", "DESC"]],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      shippingUnit: rows,
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

const deleteShippingUnit = async (id) => {
  try {
    let shippingUnit = await db.ShippingUnit.findOne({
      where: { id: id },
    });
    if (shippingUnit) {
      await shippingUnit.update({ isDelete: 1 });
      return {
        EM: "Delete shipping Unit successfully",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Shipping unit not exist",
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

const searchShippingUnit = async (keyword) => {
  try {
    const results = await db.ShippingUnit.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          {
            shipping_unit_name: {
              [db.Sequelize.Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
      attributes: ["shipping_unit_name", "id"],
      include: [
        {
          model: db.User,
          attributes: ["username"],
        },
      ],
    });
    return {
      EM: "Ok",
      EC: 0,
      DT: results,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Error from server",
      EC: 1,
      DT: [],
    };
  }
};

const updateShippingUnit = async (data) => {
  try {
    let check = await checkNameShippingUnit(data.shipping_unit_name);
    if (check === true) {
      return {
        EM: "The shipping unit name is already exists",
        EC: 1,
        DT: "shipping_unit_name",
      };
    }
    let shippingUnit = await db.ShippingUnit.findOne({
      where: { id: data.id },
    });
    if (shippingUnit) {
      await shippingUnit.update({
        shipping_unit_name: data.shipping_unit_name,
        userId: data.userId,
      });
      return {
        EM: "Update shipping unit success",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Shipping unit not found",
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

const readAllOrderByShippingUnit = async (page, limit, shipingUnitId) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Shipping_Unit_Order.findAndCountAll({
      where: { status: 'Received from store', shippingUnitId: shipingUnitId },
      offset: offset,
      limit: limit,
      include: [
        {
          model: db.Order,
          include: [
            {
              model: db.OrderItem,
              attributes: [`quantily`],
              include: [
                {
                  model: db.ProductAttribute,
                  attributes: ['id'],
                  include: [
                    { model: db.Product, attributes: [`product_name`] },
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
              ]
            },
            { model: db.Province, attributes: ['province_name'] },
            { model: db.District, attributes: ['district_name'] },
            { model: db.Ward, attributes: ['ward_name'] },
            {
              model: db.User,
              attributes: ['username'],
            },
            { model: db.PaymentMethod, attributes: [`method_name`] },
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
      EM: 'Ok',
      EC: 0,
      DT: data,
    }
  } catch (error) {
    console.log(error);
    return {
      EM: `Something wrongs with services`,
      EC: -1,
      DT: [],
    }
  }
}

const confirmOrder = async (body) => {
  try {
    for (const citySuffix in body) {
      const shipperGroups = body[citySuffix];
      for (const group of shipperGroups) {
        const { shipperId, orders } = group;
        for (const order of orders) {
          await createShippingUnitUser(shipperId, order.shipping_unit_orderId, order.orderId);
        }
      }
    }
    return { EC: 0, EM: "Successfully confirmed orders", DT: {} };
  } catch (error) {
    console.error("Error processing confirmation:", error);
    return { EC: -1, EM: "Failed to confirm orders", DT: {} };
  }
};

const createShippingUnitUser = async (shipperId, shipping_unit_orderId, orderId) => {
  const t = await db.sequelize.transaction();

  try {
    await db.Shipping_Unit_Order_user.create({
      shipping_unit_orderId: shipping_unit_orderId,
      userId: shipperId,
      status: 'Shipper received',
    }, { transaction: t });

    await db.Shipping_Unit_Order.update({
      status: 'Sent to shipper'
    }, {
      where: {
        orderId: orderId
      },
      transaction: t
    });

    await t.commit();
    return { EC: 0, EM: "Order updated and user added successfully", DT: {} };
  } catch (error) {
    await t.rollback();
    console.error("Error updating order or adding user:", error);
    return { EC: -1, EM: "Failed to update order or add user", DT: {} };
  }
};

const shippingUnitDashboard = async (shipingUnitId) => {
  try {
    const totalOrders = await db.Shipping_Unit_Order.count({
      where: {
        shippingUnitId: shipingUnitId,
      }
    });
    const totalOrderFails = await db.Shipping_Unit_Order_user.count({
      where: {
        status: 'Order delivery failed',
      }
    });
    const totalOrderSuccess = await db.Shipping_Unit_Order_user.count({
      where: {
        status: 'Delivered',
      }
    });
    const totalShippers = await db.Shipping_Unit_Order_user.count({
      include: [{
        model: db.Shipping_Unit_Order,
        where: { shippingUnitId: shipingUnitId }
      }],
      distinct: true,
      col: 'userId'
    });
    const users = await db.User.findAll({
      attributes: ['id', 'username', 'email', 'phonenumber'],
      include: [
        {
          model: db.Shipping_Unit_Order_user,
          attributes: [],
          required: true,
          include: [
            {
              model: db.Shipping_Unit_Order,
              attributes: [],
              where: { shippingUnitId: shipingUnitId }
            }
          ]
        }
      ],
      group: ['User.id', 'User.username', 'User.email']
    });

    const monthlyOrders = await db.Shipping_Unit_Order.findAll({
      attributes: [
        [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [db.sequelize.fn('count', db.sequelize.col('orderId')), 'totalOrders'],
      ],
      where: {
        shippingUnitId: shipingUnitId,
      },
      group: ['month'],
      order: [[db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), '%Y-%m'), 'ASC']]
    });


    return {
      EM: "Ok!",
      EC: 0,
      DT: {
        totalOrders: totalOrders,
        totalOrderFails: totalOrderFails,
        totalOrderSuccess: totalOrderSuccess,
        totalShippers: totalShippers,
        users: users,
        monthlyOrders: monthlyOrders,
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

const shippingUnitDashboardOrder = async (page, limit, shipingUnitId) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Shipping_Unit_Order.findAndCountAll({
      offset: offset,
      limit: limit,
      where: {
        shippingUnitId: shipingUnitId,
      },
      attributes: [],
      order: [['id', 'DESC']],
      include: [
        {
          model: db.Order,
          attributes: ['id', 'total_amount', 'order_date', 'payment_methodID'],
          include: [
            {
              model: db.PaymentMethod,
              attributes: ['method_name']
            },
            {
              model: db.User,
              attributes: ['username']
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
                }
              ]
            }
          ]
        },
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

module.exports = {
  createShippingUnit,
  shippingUnitDashboard,
  shippingUnitDashboardOrder,
  getAllShippingUnit,
  getShippingUnitWithPagination,
  deleteShippingUnit,
  searchShippingUnit,
  updateShippingUnit,
  readAllOrderByShippingUnit,
  confirmOrder,
};

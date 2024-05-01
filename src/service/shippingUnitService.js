import { where } from "sequelize";
import db from "../models/index";

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
      await shippingUnit.destroy();
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
                  model: db.Product_size_color,
                  attributes: ['id'],
                  include: [
                    { model: db.Product, attributes: [`product_name`] },
                    { model: db.Color, attributes: [`name`] },
                    { model: db.Size, attributes: [`size_value`] }
                  ]
                }
              ]
            },
            {
              model: db.User,
              attributes: ['username', 'address']
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

module.exports = {
  createShippingUnit,
  getAllShippingUnit,
  getShippingUnitWithPagination,
  deleteShippingUnit,
  searchShippingUnit,
  updateShippingUnit,
  readAllOrderByShippingUnit,
};
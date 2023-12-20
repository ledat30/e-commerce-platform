import db from "../models/index";

const checkNamePayment = async (namePayment) => {
  try {
    let payment = await db.PaymentMethod.findOne({
      where: { method_name: namePayment },
    });
    if (payment) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const createPayment = async (data) => {
  try {
    let check = await checkNamePayment(data.method_name);
    if (check === true) {
      return {
        EM: "The method name is already exists",
        EC: 1,
        DT: "method_name",
      };
    }
    await db.PaymentMethod.create({ ...data });
    return {
      EM: "Create method successful",
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

const getAllMethod = async () => {
  try {
    let payment = await db.PaymentMethod.findAll();
    if (payment) {
      return {
        EM: "Get all payment success!",
        EC: 0,
        DT: payment,
      };
    } else {
      return {
        EM: "Get all payment error!",
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

const getMethodWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.PaymentMethod.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: ["id", "method_name"],
      order: [["id", "DESC"]],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      payment: rows,
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

const updateMethod = async (data) => {
  try {
    let check = await checkNamePayment(data.method_name);
    if (check === true) {
      return {
        EM: "The method name is already exists",
        EC: 1,
        DT: "method_name",
      };
    }
    let payment = await db.PaymentMethod.findOne({
      where: { id: data.id },
    });
    if (payment) {
      await payment.update({
        method_name: data.method_name,
      });
      return {
        EM: "Update method success",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Method not found",
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

const deleteMethod = async (id) => {
  try {
    let payment = await db.PaymentMethod.findOne({
      where: { id: id },
    });
    if (payment) {
      await payment.destroy();
      return {
        EM: "Delete method successfully",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Method not exist",
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

const searchMethod = async (keyword) => {
  try {
    const results = await db.PaymentMethod.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          {
            method_name: {
              [db.Sequelize.Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
      attributes: ["method_name", "id"],
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

module.exports = {
  createPayment,
  getAllMethod,
  getMethodWithPagination,
  updateMethod,
  deleteMethod,
  searchMethod,
};

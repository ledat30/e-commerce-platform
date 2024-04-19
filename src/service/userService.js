import db from "../models";
import {
  checkEmailExist,
  checkPhoneExist,
  hashUserPassword,
} from "./authService";

const createNewUser = async (data) => {
  try {
    //check email/phone
    let isEmailExist = await checkEmailExist(data.email);
    if (isEmailExist === true) {
      return {
        EM: "The email is already exists",
        EC: 1,
        DT: "email",
      };
    }
    let isPhoneExist = await checkPhoneExist(data.phonenumber);
    if (isPhoneExist === true) {
      return {
        EM: "The phonenumber is already exists",
        EC: 1,
        DT: "phonenumber",
      };
    }

    let hashPassword = hashUserPassword(data.password);

    await db.User.create({ ...data, password: hashPassword });
    return {
      EM: "Create new user successful",
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

const getAllUsers = async () => {
  try {
    let users = await db.User.findAll({
      attributes: ["id", "username", "email", "phonenumber"],
      include: { model: db.Group, attributes: ["name"] },
    });
    if (users) {
      return {
        EM: "Get all user success!",
        EC: 0,
        DT: users,
      };
    } else {
      return {
        EM: "Get all user error!",
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

const getUserWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.User.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: [
        "id",
        "username",
        "email",
        "phonenumber",
        "address",
        "image",
      ],
      include: { model: db.Group, attributes: ["id", "name"] },
      order: [["id", "DESC"]],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      users: rows,
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

const updateUser = async (data) => {
  try {
    if (!data.groupId) {
      return {
        EM: "Error with empty groupId ",
        EC: 1,
        DT: "groupId",
      };
    }
    let user = await db.User.findOne({
      where: { id: data.id },
    });
    if (user) {
      //update
      await user.update({
        username: data.username,
        address: data.address,
        groupId: data.groupId,
        ...(data.image && { image: data.image }),
      });
      return {
        EM: "Update user success",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "User not found",
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

const deleteUser = async (id) => {
  try {
    let user = await db.User.findOne({
      where: { id: id },
    });
    if (user) {
      await user.destroy();
      return {
        EM: "Delete user successfully",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "User not exist",
        EC: 2,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "error from server",
      EC: 1,
      DT: [],
    };
  }
};

const searchUser = async (keyword) => {
  try {
    const results = await db.User.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          {
            username: {
              [db.Sequelize.Op.like]: `%${keyword}%`,
            },
          },
          {
            email: {
              [db.Sequelize.Op.like]: `%${keyword}%`,
            },
          },
          {
            phonenumber: {
              [db.Sequelize.Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
      attributes: ["username", "email", "groupId", "id"],
      include: [
        {
          model: db.Group,
          attributes: ["name"],
        },
      ],
    });
    const transformedResults = results.map((result) => ({
      username: result.username,
      email: result.email,
      groupId: result?.Group?.name || "",
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
      EM: "Error from server",
      EC: 1,
      DT: [],
    };
  }
};

const getGroupStore = async () => {
  try {
    let users = await db.User.findAll({
      where: { groupId: 2 },
      attributes: ["id", "username"],
      order: [["id", "DESC"]],
    });
    if (users && users.length > 0) {
      return {
        EM: "Get group store success!",
        EC: 0,
        DT: users,
      };
    } else {
      return {
        EM: "Get group store error!",
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

const groupShippingUnitFunc = async () => {
  try {
    let users = await db.User.findAll({
      where: { groupId: 3 },
      attributes: ["id", "username"],
      order: [["id", "DESC"]],
    });
    if (users && users.length > 0) {
      return {
        EM: "Get group shipping unit success!",
        EC: 0,
        DT: users,
      };
    } else {
      return {
        EM: "Get group shipping unit error!",
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
}

module.exports = {
  createNewUser,
  getAllUsers,
  getUserWithPagination,
  updateUser,
  deleteUser,
  searchUser,
  getGroupStore,
  groupShippingUnitFunc,
};

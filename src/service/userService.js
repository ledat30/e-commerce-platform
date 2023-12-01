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
      include: { model: db.Role, attributes: ["roleName"] },
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
      include: { model: db.Role, attributes: ["id", "roleName"] },
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
    if (!data.roleId) {
      return {
        EM: "Error with empty roleId ",
        EC: 1,
        DT: "roleId",
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
        roleId: data.roleId,
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

module.exports = {
  createNewUser,
  getAllUsers,
  getUserWithPagination,
  updateUser,
  deleteUser,
};

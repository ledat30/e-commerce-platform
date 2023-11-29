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

module.exports = {
  createNewUser,
};

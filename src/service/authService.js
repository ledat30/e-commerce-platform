import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { getGroupWithRole } from "./jwtService";
import { createJWT } from "../middleware/JWTAction";

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (usersPassword) => {
  let hashPassword = bcrypt.hashSync(usersPassword, salt);
  return hashPassword;
};

const checkEmailExist = async (userEmail) => {
  let user = await db.User.findOne({ where: { email: userEmail } });
  if (user) {
    return true;
  }
  return false;
};
const checkPhoneExist = async (userPhone) => {
  let user = await db.User.findOne({ where: { phonenumber: userPhone } });
  if (user) {
    return true;
  }
  return false;
};

const checkPassword = (inputPasswprd, hashPassword) => {
  return bcrypt.compareSync(inputPasswprd, hashPassword);
};

const handleUserLogin = async (rawData) => {
  try {
    let user = await db.User.findOne({
      where: {
        [Op.or]: [
          { email: rawData.valueLogin },
          { phonenumber: rawData.valueLogin },
        ],
      },
    });
    if (user) {
      let isCorrectPassword = checkPassword(rawData.password, user.password);
      if (isCorrectPassword === true) {
        let groupWithRoles = await getGroupWithRole(user);
        let userStore = await db.Store.findOne({
          where: { userId: user.id },
          attributes: ["id"],
        });
        let storeId = userStore ? userStore.id : null;
        let payload = {
          email: user.email,
          groupWithRoles,
          id: user.id,
          username: user.username,
          storeId: storeId,
        };
        let token = createJWT(payload);
        return {
          EM: "Ok",
          EC: 0,
          DT: {
            access_token: token,
            groupWithRoles,
            email: user.email,
            id: user.id,
            username: user.username,
            storeId: storeId,
          },
        };
      }
    }
    return {
      EM: "Your email/phone number or password is incorrect!",
      EC: 1,
      DT: "",
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs in server...",
      EC: -2,
    };
  }
};

module.exports = {
  hashUserPassword,
  checkEmailExist,
  checkPhoneExist,
  handleUserLogin,
};

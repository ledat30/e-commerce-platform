import db from "../models/index";
import bcrypt from "bcryptjs";

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

module.exports = {
  hashUserPassword,
  checkEmailExist,
  checkPhoneExist,
};

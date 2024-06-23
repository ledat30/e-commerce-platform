import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op, where } from "sequelize";
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
      include: [
        {
          model: db.Province,
          attributes: ['id', 'province_name'],
        },
        {
          model: db.District,
          attributes: ['id', 'district_name'],
        },
        {
          model: db.Ward,
          attributes: ['id', 'ward_name'],
        },
      ],
    });
    if (user) {
      let isCorrectPassword = checkPassword(rawData.password, user.password);
      if (isCorrectPassword === true) {
        let groupWithRoles = await getGroupWithRole(user);
        let userStore = await db.Store.findOne({
          where: { userId: user.id },
          attributes: ["id", "name"],
        });
        let storeId = userStore ? userStore.id : null;
        let nameStore = userStore ? userStore.name : null;
        let shippingUnit = await db.ShippingUnit.findOne({
          where: { userId: user.id },
          attributes: [`id`, `shipping_unit_name`],
        });
        let shipingUnitId = shippingUnit ? shippingUnit.id : null;
        let shipingUnitName = shippingUnit ? shippingUnit.shipping_unit_name : null;
        let payload = {
          email: user.email,
          phonenumber: user.phonenumber,
          provinceId: user?.Province?.id,
          districtId: user?.District?.id,
          wardId: user?.Ward?.id,
          provinceName: user?.Province?.province_name,
          districtName: user?.District?.district_name,
          wardName: user?.Ward?.ward_name,
          groupWithRoles,
          id: user.id,
          username: user.username,
          storeId: storeId,
          nameStore: nameStore,
          shipingUnitId: shipingUnitId,
          shipingUnitName: shipingUnitName,
        };
        let token = createJWT(payload);
        return {
          EM: "Ok",
          EC: 0,
          DT: {
            access_token: token,
            groupWithRoles,
            email: user.email,
            phonenumber: user.phonenumber,
            provinceId: user?.Province?.id,
            districtId: user?.District?.id,
            wardId: user?.Ward?.id,
            provinceName: user?.Province?.province_name,
            districtName: user?.District?.district_name,
            wardName: user?.Ward?.ward_name,
            id: user.id,
            username: user.username,
            storeId: storeId,
            nameStore: nameStore,
            shipingUnitId: shipingUnitId,
            shipingUnitName: shipingUnitName,
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

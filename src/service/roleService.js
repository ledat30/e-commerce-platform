import db from "../models";

const getRoles = async () => {
  try {
    let data = await db.Role.findAll({
      order: [["roleName", "DESC"]],
    });
    return {
      EM: "Get role success",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Error from sevices",
      EC: "1",
      DT: [],
    };
  }
};
module.exports = {
  getRoles,
};

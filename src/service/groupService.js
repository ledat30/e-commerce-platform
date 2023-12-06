import db from "../models";

const getGroups = async () => {
  try {
    let data = await db.Group.findAll({
      order: [["name", "DESC"]],
    });
    return {
      EM: "Get group success",
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
  getGroups,
};

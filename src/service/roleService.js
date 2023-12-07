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

const createNewRole = async (roles) => {
  try {
    let currentRoles = await db.Role.findAll({
      attributes: ["roleName", "description"],
      raw: true,
    });
    const persists = roles.filter(
      ({ roleName: roleName1 }) =>
        !currentRoles.some(({ roleName: roleName2 }) => roleName1 === roleName2)
    );
    if (persists.length === 0) {
      return {
        EM: "Nothing to create...",
        EC: 0,
        DT: [],
      };
    }
    await db.Role.bulkCreate(persists);
    return {
      EM: `Create roles successfully : ${persists.length} roles`,
      EC: 0,
      DT: [],
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

module.exports = {
  getRoles,
  createNewRole,
};

import db from "../models";

const getAllRoles = async () => {
  try {
    let data = await db.Role.findAll({
      order: [["id", "DESC"]],
    });
    return {
      EM: `Get all role successfully`,
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

const getRoleWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Role.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: ["id", "roleName", "description"],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      roles: rows,
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

const deleteRole = async (idRole) => {
  try {
    let role = await db.Role.findOne({
      where: { id: idRole },
    });
    if (role) {
      await role.destroy();
    }

    return {
      EM: `Delete roles successfully`,
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
  createNewRole,
  getAllRoles,
  deleteRole,
  getRoleWithPagination,
};

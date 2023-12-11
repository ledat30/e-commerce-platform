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
      order: [["id", "DESC"]],
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

const searchRole = async (keyword) => {
  try {
    const results = await db.Role.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          {
            roleName: {
              [db.Sequelize.Op.like]: `%${keyword}%`,
            },
          },
          {
            description: {
              [db.Sequelize.Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
      attributes: ["roleName", "description", "id"],
    });
    return {
      EM: "OK",
      EC: 0,
      DT: results,
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

const getRoleByGroup = async (id) => {
  try {
    if (!id) {
      return {
        EM: `Not found any roles`,
        EC: 0,
        DT: [],
      };
    }
    let roles = await db.Group.findOne({
      where: { id: id },
      attributes: ["id", "name", "description"],
      include: {
        model: db.Role,
        attributes: ["id", "roleName", "description"],
        through: { attributes: [] },
      },
    });

    return {
      EM: `Get roles by group successfully`,
      EC: 0,
      DT: roles,
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

const assignRoleToGroup = async (data) => {
  try {
    await db.GroupRole.destroy({
      where: { groupId: +data.groupId },
    });
    await db.GroupRole.bulkCreate(data.groupRoles);
    return {
      EM: `Assign role to group successfully`,
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
  searchRole,
  getRoleByGroup,
  assignRoleToGroup,
};

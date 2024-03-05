import db from "../models/index";

const checkNameColor = async (nameColor) => {
  try {
    let color = await db.Color.findOne({
      where: { name: nameColor },
    });
    if (color) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const createColor = async (data, storeId) => {
  try {
    let check = await checkNameColor(data.name);
    if (check === true) {
      return {
        EM: "The color name is already exists",
        EC: 1,
        DT: "name",
      };
    }
    await db.Color.create({ ...data, storeId });
    return {
      EM: "Create color successful",
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

const getAllColors = async () => {
  try {
    let colors = await db.Color.findAll();
    if (colors) {
      return {
        EM: "Get all colors success!",
        EC: 0,
        DT: colors,
      };
    } else {
      return {
        EM: "Get all colors error!",
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

const getColorWithPagination = async (page, limit, storeId) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Color.findAndCountAll({
      offset: offset,
      limit: limit,
      where: { storeId: storeId },
      include: [{ model: db.Store, attributes: ["name", "id"] }],
      attributes: ["id", "name"],
      order: [["id", "DESC"]],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      colors: rows,
    };
    return {
      EM: "Get all colors success!",
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

const readColorByStore = async (storeId) => {
  try {
    let colors = await db.Color.findAll({ where: { storeId: storeId } });
    if (colors) {
      return {
        EM: "Get all colors success!",
        EC: 0,
        DT: colors,
      };
    } else {
      return {
        EM: "Get all colors error!",
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

const deleteColor = async (id) => {
  try {
    let color = await db.Color.findOne({
      where: { id: id },
    });
    if (color) {
      await color.destroy();
      return {
        EM: "Delete color successfully",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Color not exist",
        EC: 2,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Error from server",
      EC: 1,
      DT: [],
    };
  }
};

const updateColor = async (data, storeId) => {
  try {
    let check = await checkNameColor(data.name);
    if (check === true || !data.name) {
      return {
        EM: "Please enter correct information",
        EC: 1,
        DT: "name",
      };
    }
    let color = await db.Color.findOne({
      where: { id: data.id },
    });
    if (color) {
      await color.update({
        name: data.name,
        storeId: data.storeId,
      });
      return {
        EM: "Update color success",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Color not found",
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

module.exports = {
  createColor,
  getAllColors,
  readColorByStore,
  getColorWithPagination,
  deleteColor,
  updateColor,
};

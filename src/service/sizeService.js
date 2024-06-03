import db from "../models/index";

const checkNameSize = async (nameSize, storeId) => {
  try {
    let size = await db.Size.findOne({
      where: { size_value: nameSize, storeId: storeId },
    });
    if (size) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const createSizeProduct = async (data, storeId) => {
  try {
    let check = await checkNameSize(data.size_value, storeId);
    if (check === true) {
      return {
        EM: "The size name is already exists",
        EC: 1,
        DT: "size_value",
      };
    }
    await db.Size.create({ ...data, storeId });
    return {
      EM: "Create size successful",
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

const getAllSizes = async () => {
  try {
    let sizes = await db.Size.findAll();
    if (sizes) {
      return {
        EM: "Get all sizes success!",
        EC: 0,
        DT: sizes,
      };
    } else {
      return {
        EM: "Get all sizes error!",
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

const getSizeWithPagination = async (page, limit, storeId) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Size.findAndCountAll({
      offset: offset,
      limit: limit,
      where: { storeId: storeId },
      include: [{ model: db.Store, attributes: ["name", "id"] }],
      attributes: ["id", "size_value"],
      order: [["id", "DESC"]],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      sizes: rows,
    };
    return {
      EM: "Get all sizes success!",
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

const readSizeByStore = async (storeId) => {
  try {
    let sizes = await db.Size.findAll({ where: { storeId: storeId } });
    if (sizes) {
      return {
        EM: "Get all sizes success!",
        EC: 0,
        DT: sizes,
      };
    } else {
      return {
        EM: "Get all sizes error!",
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

const deleteSize = async (id) => {
  try {
    let size = await db.Size.findOne({
      where: { id: id },
    });
    if (size) {
      await size.destroy();
      return {
        EM: "Delete size successfully",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Size not exist",
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

const updateSize = async (data, storeId) => {
  try {
    let check = await checkNameSize(data.size_value);
    if (check === true || !data.size_value) {
      return {
        EM: "Please enter correct information",
        EC: 1,
        DT: "size_value",
      };
    }
    let size = await db.Size.findOne({
      where: { id: data.id },
    });
    if (size) {
      await size.update({
        size_value: data.size_value,
        storeId: data.storeId,
      });
      return {
        EM: "Update size success",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Size not found",
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
  createSizeProduct,
  getAllSizes,
  getSizeWithPagination,
  readSizeByStore,
  deleteSize,
  updateSize,
};

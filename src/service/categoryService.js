import db from "../models/index";

const checkNameCategory = async (nameCategory) => {
  try {
    let category = await db.Category.findOne({
      where: { category_name: nameCategory },
    });
    if (category) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const createCategory = async (data) => {
  try {
    let check = await checkNameCategory(data.category_name);
    if (check === true) {
      return {
        EM: "The category name is already exists",
        EC: 1,
        DT: "category_name",
      };
    }
    await db.Category.create({ ...data });
    return {
      EM: "Create category successful",
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

const getAllCategories = async () => {
  try {
    let categories = await db.Category.findAll();
    if (categories) {
      return {
        EM: "Get all categories success!",
        EC: 0,
        DT: categories,
      };
    } else {
      return {
        EM: "Get all categories error!",
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

const getCategoryWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Category.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: ["id", "category_name"],
      order: [["id", "DESC"]],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      categories: rows,
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

const updateCategory = async (data) => {
  try {
    let check = await checkNameCategory(data.category_name);
    if (check === true || !data.category_name) {
      return {
        EM: "Please enter correct information",
        EC: 1,
        DT: "category_name",
      };
    }
    let category = await db.Category.findOne({
      where: { id: data.id },
    });
    if (category) {
      await category.update({
        category_name: data.category_name,
      });
      return {
        EM: "Update category success",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Category not found",
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

const deleteCategory = async (id) => {
  try {
    let category = await db.Category.findOne({
      where: { id: id },
    });
    if (category) {
      await category.destroy();
      return {
        EM: "Delete category successfully",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Category not exist",
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

const searchCategory = async (keyword) => {
  try {
    const results = await db.Category.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          {
            category_name: {
              [db.Sequelize.Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
      attributes: ["category_name", "id"],
    });
    return {
      EM: "Ok",
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

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryWithPagination,
  updateCategory,
  deleteCategory,
  searchCategory,
};
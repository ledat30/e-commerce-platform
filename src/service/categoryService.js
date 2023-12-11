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

module.exports = {
  createCategory,
};

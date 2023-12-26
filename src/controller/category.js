import categoryService from "../service/categoryService";

async function createFunc(req, res) {
  try {
    let data = await categoryService.createCategory(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Create category error",
      EC: "-1",
      DT: "",
    });
  }
}

const readFunc = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;

      let data = await categoryService.getCategoryWithPagination(+page, +limit);

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await categoryService.getAllCategories();

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error",
      EC: "-1",
      DT: "",
    });
  }
};

const updateFunc = async (req, res) => {
  try {
    let data = await categoryService.updateCategory(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error",
      EC: "-1",
      DT: "",
    });
  }
};

const deleteFunc = async (req, res) => {
  try {
    let data = await categoryService.deleteCategory(req.body.id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error",
      EC: "-1",
      DT: "",
    });
  }
};

const searchCategory = async (req, res) => {
  try {
    const keyword = req.query.q;
    const data = await categoryService.searchCategory(keyword);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from the server",
      EC: -1,
      DT: "",
    });
  }
};

const getDetailCategoryById = async (req, res) => {
  try {
    let data = await categoryService.getDetailCategoryById(req.query.id);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error from the server",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = {
  createFunc,
  readFunc,
  updateFunc,
  deleteFunc,
  searchCategory,
  getDetailCategoryById,
};

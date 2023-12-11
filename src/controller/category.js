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

module.exports = {
  createFunc,
};

import productService from "../service/productService";

const readFunc = async (req, res) => {
  try {
    const storeId = req.query.storeId;
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;

      let data = await productService.getProductWithPagination(
        +page,
        +limit,
        storeId
      );

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await productService.getAllProductForStoreOwner();

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

const createFunc = async (req, res) => {
  try {
    let data = await productService.createProduct(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Create product error",
      EC: "-1",
      DT: "",
    });
  }
};

const updateFunc = async (req, res) => {
  try {
    let data = await productService.updateProduct(req.body);
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
    let data = await productService.deleteProduct(req.body.id);
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

const searchProduct = async (req, res) => {
  try {
    const keyword = req.query.q;
    const data = await productService.searchProduct(keyword);
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

const readAllFunc = async (req, res) => {
  let page = req.query.page;
  let limit = req.query.limit;

  let data = await productService.getAllProductWithPagination(
    +page,
    +limit
  );

  return res.status(200).json({
    EM: data.EM,
    EC: data.EC,
    DT: data.DT,
  });
};

module.exports = {
  readFunc,
  createFunc,
  updateFunc,
  deleteFunc,
  searchProduct,
  readAllFunc,
};
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
    let data = await productService.createProduct(req.body, req.query.storeId);
    if (data.EC === 0) {
      await productService.updateInventory(data.DT.productId, data.DT.quantyly);

      if (req.body.colorsAndSizes && req.body.colorsAndSizes.length > 0) {
        const saveColorAndSizePromises = req.body.colorsAndSizes.map(
          async ({ colorId, selectedSizes }) => {
            const sizePromises = selectedSizes.map(async (sizeId) => {
              await productService.saveProductColorAndSize(
                data.DT.productId,
                colorId,
                sizeId
              );
            });
            await Promise.all(sizePromises);
          }
        );
        await Promise.all(saveColorAndSizePromises);
      }
    }
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
    const colorsAndSizes = req.body.colorsAndSizes;
    let data = await productService.updateProduct(
      req.body,
      req.query.storeId,
      colorsAndSizes
    );
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

  let data = await productService.getAllProductWithPagination(+page, +limit);

  return res.status(200).json({
    EM: data.EM,
    EC: data.EC,
    DT: data.DT,
  });
};

const readInventory = async (req, res) => {
  try {
    const storeId = req.query.storeId;
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;

      let data = await productService.getProductInStockWithPagination(
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
      let data = await productService.getAllProductInStockForStoreOwner();

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

const deleteProductInStock = async (req, res) => {
  try {
    let data = await productService.deleteProductInStock(req.body.id);
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

const updateProductInStock = async (req, res) => {
  try {
    let data = await productService.updateProductInStock(req.body);
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

const getDetailProductById = async (req, res) => {
  try {
    let data = await productService.getDetailProductById(req.query.id);
    await productService.increaseCount(req.query.id);
    return res.status(200).json(data)
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
}

const getRandomProducts = async (req, res) => {
  try {
    const randomProducts = await productService.getRandomProducts();
    res.json(randomProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const postAddToCart = async (req, res) => {
  try {
    let data = await productService.postAddToCart(req.query.productColorSizeId, req.query.userId, req.query.storeId, req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Create error",
      EC: "-1",
      DT: "",
    });
  }
}

const readProductCart = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;

      let data = await productService.getProductCartWithPagination(
        +page,
        +limit,
        userId
      );

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await productService.getAllProductAddToCart(userId);

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
}

const deleteProductCart = async (req, res) => {
  try {
    let data = await productService.deleteProductCart(req.body.id);
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
}

const createBuyProduct = async (req, res) => {
  try {
    const { orderId, productColorSizeId, storeId } = req.query;
    let data = await productService.createBuyProduct(orderId, productColorSizeId, storeId, req.body);
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
}

const orderByUser = async (req, res) => {
  try {
    const storeId = req.query.storeId;
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;

      let data = await productService.orderByUser(+page, +limit, storeId);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error",
      EC: -1,
      DT: "",
    })
  }
}

const ConfirmAllOrders = async (req, res) => {
  let storeId = req.query.storeId;
  try {
    let data = await productService.ConfirmAllOrders(storeId, req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error service",
      EC: -1,
      DT: "",
    })
  }
}

const readStatusOrderByUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;

      let data = await productService.getreadStatusOrderWithPagination(
        +page,
        +limit,
        userId
      );

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
}

module.exports = {
  readFunc,
  createFunc,
  updateFunc,
  deleteFunc,
  searchProduct,
  readAllFunc,
  readInventory,
  deleteProductInStock,
  updateProductInStock,
  getDetailProductById,
  getRandomProducts,
  postAddToCart,
  readProductCart,
  deleteProductCart,
  createBuyProduct,
  orderByUser,
  ConfirmAllOrders,
  readStatusOrderByUser,
};

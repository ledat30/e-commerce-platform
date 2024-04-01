import db from "../models";
const { Op } = require("sequelize");

const getAllProductForStoreOwner = async () => {
  try {
    let product = await db.Product.findAll({
      attributes: ["id", "product_name", "price", "old_price", "promotion"],
      include: [{ model: db.Category, attributes: ["category_name"] }],
      raw: false,
    });
    if (product && product.length > 0) {
      return {
        EM: "Get all product success!",
        EC: 0,
        DT: product,
      };
    } else {
      return {
        EM: "Get all product error!",
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

const getProductWithPagination = async (page, limit, storeId) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Product.findAndCountAll({
      offset: offset,
      limit: limit,
      where: { storeId: storeId },
      attributes: [
        "id",
        "product_name",
        "price",
        "old_price",
        "promotion",
        "description",
        "image",
        "contentMarkdown",
        "contentHtml",
      ],
      include: [
        { model: db.Category, attributes: ["category_name", "id"] },
        { model: db.Store, attributes: ["name", "id"] },
        { model: db.Inventory, attributes: ["quantyly", "id"] },
        {
          model: db.Product_size_color,
          attributes: ["id"],
          include: [
            {
              model: db.Size,
              attributes: ["size_value"],
            },
            {
              model: db.Color,
              attributes: ["name"],
            },
          ],
          where: {
            [Op.and]: [
              { sizeId: { [Op.not]: null } },
              { colorId: { [Op.not]: null } },
            ],
          },
        },
      ],
      order: [["id", "DESC"]],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      product: rows,
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

const checkNameProduct = async (nameProduct) => {
  try {
    let product = await db.Product.findOne({
      where: { product_name: nameProduct },
    });
    if (product) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

const createProduct = async (data, storeId) => {
  try {
    let check = await checkNameProduct(data.product_name);
    if (check === true) {
      return {
        EM: "The product name is already exists",
        EC: 1,
        DT: "product_name",
      };
    }
    const newProduct = await db.Product.create({ ...data, storeId });

    const productInfo = {
      productId: newProduct.id,
      quantyly: data.quantyly,
    };

    await updateInventory(newProduct.id, data.quantyly, storeId);

    if (
      data.colorsAndSizes &&
      Array.isArray(data.colorsAndSizes) &&
      data.colorsAndSizes.length > 0
    ) {
      const saveColorAndSizePromises = data.colorsAndSizes.map(
        async ({ colorId, sizeId }) => {
          await saveProductColorAndSize(newProduct.id, colorId, sizeId);
        }
      );
      await Promise.all(saveColorAndSizePromises);
    }

    return {
      EM: "Create product successful",
      EC: 0,
      DT: productInfo,
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
const updateInventory = async (productId, quantyly, storeId) => {
  try {
    let inventoryItem = await db.Inventory.findOne({
      where: {
        productId,
      },
    });

    if (inventoryItem) {
      await inventoryItem.update({
        storeId: storeId,
      });
    } else {
      await db.Inventory.create({
        productId,
        quantyly: quantyly,
        currentNumber: quantyly,
        storeId: storeId,
      });
    }

    return {
      EM: "Update inventory successful",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs with inventory update",
      EC: -1,
      DT: [],
    };
  }
};
const saveProductColorAndSize = async (productId, colorId, sizeId) => {
  try {
    await db.Product_size_color.create({
      productId,
      colorId,
      sizeId,
    });

    return {
      EM: "Save product color and size successful",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Error saving product color and size",
      EC: -1,
      DT: [],
    };
  }
};

const updateProduct = async (data, storeId, colorsAndSizes) => {
  try {
    let check = await checkNameProduct(data.product_name);
    if (check === true) {
      return {
        EM: "The product name is already exists",
        EC: 1,
        DT: "product_name",
      };
    }
    let product = await db.Product.findOne({
      where: { id: data.id },
    });
    if (product) {
      await product.update({
        product_name: data.product_name,
        storeId: data.storeId,
        categoryId: data.categoryId,
        price: data.price,
        old_price: data.old_price,
        promotion: data.promotion,
        description: data.description,
        contentHtml: data.contentHtml,
        contentMarkdown: data.contentMarkdown,
        ...(data.image && { image: data.image }),
      });

      if (colorsAndSizes && colorsAndSizes.length > 0) {
        await db.Product_size_color.destroy({
          where: { productId: data.id },
        });

        for (let colorAndSize of colorsAndSizes) {
          for (let sizeId of colorAndSize.sizeIds) {
            await db.Product_size_color.create({
              productId: data.id,
              colorId: colorAndSize.colorId,
              sizeId: sizeId,
            });
          }
        }
      }

      return {
        EM: "Update product success",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Product not found",
        EC: 2,
        DT: "",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      EM: "Something wrong with services",
      EC: -1,
      DT: [],
    };
  }
};

const deleteProduct = async (id) => {
  try {
    await db.Product_size_color.destroy({
      where: { productId: id },
    });

    let product = await db.Product.findOne({
      where: { id: id },
    });
    if (!product) {
      return {
        EM: "Product not exist",
        EC: 2,
        DT: [],
      };
    }
    await product.destroy();

    return {
      EM: "Delete product successfully!",
      EC: 0,
      DT: [],
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

const searchProduct = async (keyword) => {
  try {
    const results = await db.Product.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          {
            product_name: {
              [db.Sequelize.Op.like]: `%${keyword}%`,
            },
          },
          {
            price: {
              [db.Sequelize.Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
      attributes: ["product_name", "price", "categoryId", "id"],
      include: [
        {
          model: db.Category,
          attributes: ["category_name"],
        },
      ],
    });
    const transformedResults = results.map((result) => ({
      product_name: result.product_name,
      price: result.price,
      categoryId: result?.Category?.category_name || "",
      id: result.id,
    }));
    return {
      EM: "Ok",
      EC: 0,
      DT: transformedResults,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: `Error from server: ${error.message}`,
      EC: 1,
      DT: [],
    };
  }
};

const getAllProductWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Product.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: [
        "id",
        "product_name",
        "price",
        "old_price",
        "promotion",
        "description",
        "image",
        "promotion",
      ],
      order: [["id", "DESC"]],
      include: [{ model: db.Store, attributes: ["name", "id"] }],
    });

    if (rows && rows.length > 0) {
      rows.map((item) => {
        item.image = new Buffer.from(item.image, "base64").toString("binary");
      });
    }

    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      product: rows,
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

const getAllProductInStockForStoreOwner = async () => {
  try {
    let product = await db.Inventory.findAll({
      attributes: [
        "id",
        "quantyly",
        "currentNumber",
        "quantyly_ordered",
        "quantyly_shipped",
        "quantity_sold",
      ],
      include: [{ model: db.Product, attributes: ["product_name"] }],
      raw: false,
    });
    if (product && product.length > 0) {
      return {
        EM: "Get all product success!",
        EC: 0,
        DT: product,
      };
    } else {
      return {
        EM: "Get all product error!",
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

const getProductInStockWithPagination = async (page, limit, storeId) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Inventory.findAndCountAll({
      offset: offset,
      limit: limit,
      where: { storeId: storeId },
      attributes: [
        "id",
        "quantyly",
        "currentNumber",
        "quantyly_ordered",
        "quantyly_shipped",
        "quantity_sold",
      ],
      include: [
        { model: db.Product, attributes: ["product_name", "id"] },
        { model: db.Store, attributes: ["name", "id"] },
      ],
      order: [["id", "DESC"]],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      product: rows,
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

const deleteProductInStock = async (id) => {
  try {
    let product = await db.Inventory.findOne({
      where: { id: id },
    });
    if (product) {
      await product.destroy();
      return {
        EM: "Delete product in stock successfully",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Product not exist",
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

const updateProductInStock = async (data) => {
  try {
    let product = await db.Inventory.findOne({
      where: { id: data.id },
    });
    if (product) {
      await product.update({
        quantyly: data.quantyly,
        currentNumber: data.quantyly,
      });
      return {
        EM: "Update product in stock success",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Product not found",
        EC: 2,
        DT: "",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      EM: "Something wrong with services",
      EC: -1,
      DT: [],
    };
  }
};

const increaseCount = async (inputId) => {
  try {
    const product = await db.Product.findOne({
      where: {
        id: inputId
      }
    });
    if (!product) {
      throw new Error("Product not found");
    }
    product.view_count += 1;
    await db.Product.update(
      { view_count: product.view_count },
      { where: { id: inputId } }
    );
    return {
      EM: "Ok",
      EC: 0,
      DT: "",
    };
  } catch (error) {
    throw error;
  }
}

const getDetailProductById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter"
        })
      } else {
        let data = await db.Product.findOne({
          where: {
            id: inputId
          },
          attributes: ['price', 'old_price', 'product_name', 'description', 'image',
            'promotion', 'view_count', 'storeId', 'contentHtml', 'contentMarkdown'],
          include: [
            {
              model: db.Product_size_color,
              attributes: ["id"],
              include: [
                {
                  model: db.Color,
                  attributes: ['name']
                },
                {
                  model: db.Size,
                  attributes: ['size_value']
                }
              ],
              where: {
                [Op.and]: [
                  { sizeId: { [Op.not]: null } },
                  { colorId: { [Op.not]: null } },
                ],
              },
            },
            { model: db.Store, attributes: ['name'] }
          ],
        })
        if (!data) {
          resolve({
            errCode: 2,
            errMessage: "Product not found"
          })
        } else {
          resolve({
            errCode: 0,
            errMessage: "ok",
            data
          })
        }
      }
    } catch (e) {
      reject(e);
    }
  })
}

const getRandomProducts = async () => {
  try {
    const allProducts = await db.Product.findAll({
      attributes: ["id", "product_name", "price", "old_price", "image"],
    });
    if (allProducts && allProducts.length > 0) {
      allProducts.forEach((item) => {
        item.image = new Buffer.from(item.image, "base64").toString(
          "binary"
        );
      });
    }
    const randomProducts = getRandomItemsFromArray(allProducts, 5);
    return randomProducts;
  } catch (error) {
    throw new Error(error.message);
  }
}
const getRandomItemsFromArray = (array, numberOfItems) => {
  const shuffledArray = array.sort(() => 0.5 - Math.random());
  return shuffledArray.slice(0, numberOfItems);
};

module.exports = {
  getAllProductForStoreOwner,
  getProductWithPagination,
  createProduct,
  updateInventory,
  saveProductColorAndSize,
  updateProduct,
  deleteProduct,
  searchProduct,
  getAllProductWithPagination,
  getAllProductInStockForStoreOwner,
  getProductInStockWithPagination,
  deleteProductInStock,
  updateProductInStock,
  increaseCount,
  getDetailProductById,
  getRandomProducts,
};

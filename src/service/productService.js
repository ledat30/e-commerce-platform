import db from "../models";

const getAllProductForStoreOwner = async () => {
  try {
    let product = await db.Product.findAll({
      attributes: ["id", "product_name", "price"],
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
      attributes: ["id", "product_name", "price", "description", "image"],
      include: [
        { model: db.Category, attributes: ["category_name", "id"] },
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

const createProduct = async (data) => {
  try {
    let check = await checkNameProduct(data.product_name);
    if (check === true) {
      return {
        EM: "The product name is already exists",
        EC: 1,
        DT: "product_name",
      };
    }
    await db.Product.create({ ...data });
    return {
      EM: "Create product successful",
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

const updateProduct = async (data) => {
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
        description: data.description,
        ...(data.image && { image: data.image }),
      });
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
    console.log(error);
    return {
      EM: "Somnething wrongs with services",
      EC: -1,
      DT: [],
    };
  }
};

const deleteProduct = async (id) => {
  try {
    let product = await db.Product.findOne({
      where: { id: id },
    });
    if (product) {
      await product.destroy();
      return {
        EM: "Delete product successfully",
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

module.exports = {
  getAllProductForStoreOwner,
  getProductWithPagination,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
};

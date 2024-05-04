import db from "../models";
const { Op, where } = require("sequelize");
const { sequelize } = db;

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
            { model: db.Store, attributes: ['name', 'id'] },
            { model: db.Inventory, attributes: ['currentNumber'] }
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

const postAddToCart = async (productColorSizeId, userId, storeId, body) => {
  try {
    let order = await db.Order.findOne({ where: { userId: userId, storeId: storeId, createdAt: new Date() } });
    if (!order) {
      order = await db.Order.create({
        total_amount: 0,
        order_date: new Date(),
        status: 'pending',
        userId: userId,
        storeId: storeId,
      });
    }
    if (order.status === 'Processing') {
      return {
        EM: "This product has been ordered and is processing, please reorder later!",
        EC: -2,
        DT: [],
      };
    }

    let orderItem = await db.OrderItem.findOne({ where: { orderId: order.id, productColorSizeId: productColorSizeId } });
    if (orderItem) {
      orderItem.quantily = body.quantily;
      await orderItem.save();
    } else {
      orderItem = await db.OrderItem.create({
        orderId: order.id,
        productColorSizeId: productColorSizeId,
        quantily: body.quantily,
        price_per_item: body.price_per_item,
      });
    }

    let totalAmount = 0;
    const allOrderItems = await db.OrderItem.findAll({ where: { orderId: order.id } });
    allOrderItems.forEach(item => {
      totalAmount += (item.quantily * item.price_per_item);
    });

    order.total_amount = totalAmount;
    await order.save();

    return {
      EM: "Add to cart success!",
      EC: 0,
      DT: orderItem
    };
  } catch (error) {
    console.error(error);
    return {
      EM: "Create error",
      EC: -1,
      DT: ""
    };
  }
};

const getAllProductAddToCart = async (userId) => {
  try {
    let product = await db.Order.findAll({
      where: { userId: userId, status: 'pending' },
      attributes: ["id", "total_amount"],
      include: [{
        model: db.OrderItem, attributes: ["id", "quantily", "price_per_item"],
        order: [["id", "DESC"]],
        include: [
          {
            model: db.Product_size_color,
            attributes: ['id'],
            include: [
              {
                model: db.Product,
                attributes: ["product_name", "price", "description", 'image'],
                include: [
                  {
                    model: db.Inventory,
                    attributes: ['currentNumber', `id`],
                  },
                  { model: db.Store, attributes: ['name', 'id'] },
                ],
              },
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
      }],
    });
    const products = product.filter(order => order.OrderItems.length > 0);
    if (products && products.length > 0) {
      return {
        EM: "Get all product add to cart success!",
        EC: 0,
        DT: products,
      };
    } else {
      return {
        EM: "Get all product add to cart error!",
        EC: -1,
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
}

const deleteProductCart = async (id) => {
  try {
    let product = await db.OrderItem.findOne({
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
}

const createBuyProduct = async (orderId, productColorSizeId, storeId, body) => {

  const purchaseQuantity = parseInt(body.quantily);
  const payment_methodID = body.payment_methodID;
  const pricePerItem = parseFloat(body.price_per_item);
  const shippingFee = parseFloat(body.shippingFee);
  const transaction = await sequelize.transaction();

  try {
    const order = await db.Order.findByPk(orderId, { transaction });
    if (!order) {
      throw new Error('Order not found.');
    }

    const item = await db.OrderItem.findOne({
      where: { orderId: orderId, productColorSizeId: productColorSizeId },
      transaction
    });

    if (!item) throw new Error('Product not found in order.');

    let newOrder = null;

    if (purchaseQuantity === item.quantily) {
      await order.update({ status: 'Processing', payment_methodID: payment_methodID, total_amount: pricePerItem * purchaseQuantity + shippingFee, }, { transaction });
      await db.Invoice.create({
        orderId: order.id,
        invoice_date: new Date(),
        total_amount: pricePerItem * purchaseQuantity + shippingFee,
        payment_methodID: payment_methodID,
      }, { transaction });
    } else {
      newOrder = await db.Order.create({
        userId: order.userId,
        status: 'Processing',
        total_amount: pricePerItem * purchaseQuantity + shippingFee,
        order_date: new Date(),
        payment_methodID: payment_methodID,
        storeId: storeId,
      }, { transaction });

      await item.update({ quantily: purchaseQuantity, orderId: newOrder.id }, { transaction });
    }
    if (newOrder) {
      await db.Invoice.create({
        orderId: newOrder.id,
        invoice_date: new Date(),
        total_amount: pricePerItem * purchaseQuantity + shippingFee,
        payment_methodID: newOrder.payment_methodID,
      }, { transaction });
    }

    // Update Inventory
    const productColorSize = await db.Product_size_color.findByPk(item.productColorSizeId);
    if (!productColorSize) {
      throw new Error('Product color size not found.');
    }

    const product = await productColorSize.getProduct();
    if (!product) {
      throw new Error('Product not found.');
    }

    const inventory = await db.Inventory.findOne({ where: { productId: product.id } });
    if (!inventory) {
      throw new Error('Inventory not found.');
    }

    const updatedCurrentNumber = inventory.currentNumber - purchaseQuantity;
    const updateQuantylyOrdered = inventory.quantyly - updatedCurrentNumber;
    await inventory.update({ currentNumber: updatedCurrentNumber, quantyly_ordered: updateQuantylyOrdered }, { transaction });


    //end
    await transaction.commit();
    return {
      EM: 'Update successful',
      EC: 0,
      DT: { orderId: newOrder ? newOrder.id : order.id }
    };
  } catch (error) {
    console.error('Transaction error:', error);
    await transaction.rollback();
    throw error;
  }
};

const orderByUser = async (page, limit, storeId) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Order.findAndCountAll({
      where: { status: 'Processing', storeId: storeId },
      offset: offset,
      limit: limit,
      attributes: [`id`, `total_amount`, `order_date`],
      include: [
        { model: db.PaymentMethod, attributes: [`method_name`] },
        { model: db.User, attributes: [`username`] },
        {
          model: db.OrderItem,
          attributes: ['quantily'],
          include: [
            {
              model: db.Product_size_color,
              attributes: ['id'],
              include: [
                { model: db.Product, attributes: [`product_name`] },
                { model: db.Color, attributes: [`name`] },
                { model: db.Size, attributes: [`size_value`] }
              ]
            }
          ]
        }
      ]
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      orders: rows,
    }
    return {
      EM: 'Ok',
      EC: 0,
      DT: data,
    }
  } catch (error) {
    console.log(error);
    return {
      EM: `Something wrongs with services`,
      EC: -1,
      DT: [],
    }
  }
};

const ConfirmAllOrders = async (storeId, body) => {
  try {
    await db.Order.update(
      { status: 'confirmed' },
      { where: { status: "Processing", storeId: storeId }, returning: true }
    );

    const confirmedOrders = await db.Order.findAll({
      where: { status: "confirmed", storeId: storeId }
    });
    const confirmedOrderIds = confirmedOrders.map(order => order.id);

    const shippingUnitOrders = confirmedOrderIds.map(orderId => {
      return {
        orderId: orderId,
        shippingUnitId: body.shippingUnitId,
        status: 'Received from store',
      };
    });

    await db.Shipping_Unit_Order.bulkCreate(shippingUnitOrders);

    return { EM: `All orders have been confirmed and orderId has been updated in ShippingUnit`, EC: 0, DT: '' };
  } catch (error) {
    console.error('Error confirming orders:', error);
    return { EM: 'Failed to confirm orders', EC: -1, DT: '' };
  }
};

const getreadStatusOrderWithPagination = async (page, limit, userId) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Order.findAndCountAll({
      offset: offset,
      limit: limit,
      where: {
        userId: userId,
        status: {
          [db.Sequelize.Op.ne]: 'pending',
        }
      },
      attributes: ["id", "total_amount", 'status'],
      order: [["id", "DESC"]],
      include: [
        {
          model: db.OrderItem,
          attributes: ['id', 'quantily'],
          include: [
            {
              model: db.Product_size_color,
              attributes: ['id'],
              include: [
                {
                  model: db.Product,
                  attributes: ["product_name", 'image'],
                  include: [
                    { model: db.Store, attributes: ['name', 'id'] },
                  ]
                },
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
            }
          ]
        },
        {
          model: db.Shipping_Unit_Order,
          attributes: ['status'],
          include: [
            {
              model: db.Shipping_Unit_Order_user,
              attributes: ['status']
            }
          ]
        }
      ]
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      products: rows,
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
}

const cancelOrder = async (id) => {
  try {
    await db.OrderItem.destroy({
      where: { orderId: id }
    });

    await db.Invoice.destroy({
      where: { orderId: id }
    });

    const deletedOrderCount = await db.Order.destroy({
      where: { id: id }
    });

    if (deletedOrderCount > 0) {
      return {
        EM: "Order and related records deleted successfully!",
        EC: 0,
        DT: null,
      };
    } else {
      return {
        EM: "No order found with the provided ID!",
        EC: -1,
        DT: null,
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Error occurred while canceling the order",
      EC: -1,
      DT: null,
    };
  }
}

const readAllOrderByShipper = async (page, limit, userId) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Shipping_Unit_Order_user.findAndCountAll({
      where: { status: 'Shipper received', userId: userId },
      attributes: ['status', 'id', 'userId', 'shipping_unit_orderId'],
      offset: offset,
      limit: limit,
      include: [
        {
          model: db.Shipping_Unit_Order,
          attributes: ['id', 'orderId', 'shippingUnitId'],
          include: [
            {
              model: db.Order,
              attributes: ['id', 'total_amount', 'order_date', 'payment_methodID', 'userId', 'storeId'],
              include: [
                {
                  model: db.OrderItem,
                  attributes: [`quantily`],
                  include: [
                    {
                      model: db.Product_size_color,
                      attributes: ['id'],
                      include: [
                        { model: db.Product, attributes: [`product_name`] },
                        { model: db.Color, attributes: [`name`] },
                        { model: db.Size, attributes: [`size_value`] }
                      ]
                    }
                  ]
                },
                {
                  model: db.User,
                  attributes: ['username', 'address']
                },
                { model: db.PaymentMethod, attributes: [`method_name`] },
              ]
            },
          ]
        },
        {
          model: db.User,
          attributes: ['username', 'id']
        },
      ]
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count,
      orders: rows,
    }
    return {
      EM: 'Ok',
      EC: 0,
      DT: data,
    }
  } catch (error) {
    console.log(error);
    return {
      EM: `Something wrongs with services`,
      EC: -1,
      DT: [],
    }
  }
}

const shipperConfirmOrder = async (userId, body) => {
  try {
    await db.Shipping_Unit_Order_user.update(
      { status: 'Delivered' },
      { where: { status: "Shipper received", userId: userId, shipping_unit_orderId: body.shipping_unit_orderId }, returning: true }
    );
    return {
      EM: `The order has been delivered successfully!`,
      EC: 0,
      DT: '',
    };
  } catch (error) {
    console.error('Error confirming orders:', error);
    return {
      EM: 'Failed to confirm orders',
      EC: -1,
      DT: '',
    };
  }
}

const orderConfirmationFailed = async (userId, body) => {
  try {
    await db.Shipping_Unit_Order_user.update(
      { status: 'Order delivery failed' },
      { where: { status: "Shipper received", userId: userId, shipping_unit_orderId: body.shipping_unit_orderId }, returning: true }
    );
    return {
      EM: `Order delivery failed`,
      EC: 0,
      DT: '',
    };
  } catch (error) {
    console.error('Error confirming orders:', error);
    return {
      EM: 'Order delivery failed',
      EC: -1,
      DT: '',
    };
  }
}

module.exports = {
  getAllProductForStoreOwner,
  getProductWithPagination,
  createProduct,
  orderConfirmationFailed,
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
  postAddToCart,
  getAllProductAddToCart,
  deleteProductCart,
  createBuyProduct,
  orderByUser,
  ConfirmAllOrders,
  getreadStatusOrderWithPagination,
  cancelOrder,
  readAllOrderByShipper,
  shipperConfirmOrder,
};

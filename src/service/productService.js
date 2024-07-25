import db from "../models";
const { Op, Sequelize, where } = require("sequelize");
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

const getProductWithPagination = async (storeId, page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Product.findAndCountAll({
      distinct: true,
      offset: offset,
      limit: limit,
      where: {
        storeId: storeId,
        isDelete: null
      },
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
        {
          model: db.ProductAttribute,
          attributes: ['id'],
          include: [
            {
              model: db.AttributeValue,
              as: 'AttributeValue1',
              attributes: ['id', 'name'],
              include: [
                { model: db.Attribute, attributes: ['id', 'name'] }
              ]
            },
            {
              model: db.AttributeValue,
              as: 'AttributeValue2',
              attributes: ['id', 'name'],
              include: [
                { model: db.Attribute, attributes: ['id', 'name'] }
              ]
            }
          ]
        }
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

    const attributeValueMap = {};
    for (let variantId of data.selectedVariants) {
      const attributeValue = await db.AttributeValue.findByPk(variantId);
      if (!attributeValue) {
        throw new Error(`AttributeValue with ID ${variantId} does not exist`);
      }
      const attributeId = attributeValue.attributeId;

      if (!attributeValueMap[attributeId]) {
        attributeValueMap[attributeId] = [];
      }
      attributeValueMap[attributeId].push(variantId);
    }

    if (Object.keys(attributeValueMap).length < 2) {
      return {
        EM: "You must select values from at least two different attributes",
        EC: 1,
        DT: [],
      };
    }

    const attributeIds = Object.keys(attributeValueMap);
    const combinations = [];

    const combine = (values, currentCombo = [], index = 0) => {
      if (index === values.length) {
        combinations.push(currentCombo);
        return;
      }
      for (let value of values[index]) {
        combine(values, [...currentCombo, value], index + 1);
      }
    };

    combine(attributeIds.map(id => attributeValueMap[id]));

    // Save combinations in the product_attribute_value table
    const saveCombinationsPromises = combinations.map(async (combination) => {
      const [value1Id, value2Id] = combination;
      const productAttributeValue = await saveProductAttributeValue(newProduct.id, value1Id, value2Id);
      await updateInventory(productAttributeValue.id, data.quantyly, storeId);
    });

    await Promise.all(saveCombinationsPromises);

    return {
      EM: "Create product successful",
      EC: 0,
      DT: {
        productId: newProduct.id,
      },
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

const updateInventory = async (productAttributeValueId, quantyly, storeId) => {
  try {
    let inventoryItem = await db.Inventory.findOne({
      where: {
        product_AttributeId: productAttributeValueId,
        storeId,
      },
    });

    if (inventoryItem) {
      await inventoryItem.update({
        storeId: storeId,
      });
    } else {
      await db.Inventory.create({
        product_AttributeId: productAttributeValueId,
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
      EM: "Something went wrong with inventory update",
      EC: -1,
      DT: [],
    };
  }
};

const saveProductAttributeValue = async (productId, value1Id, value2Id) => {
  try {
    const productAttributeValue = await db.ProductAttribute.create({
      productId,
      attributeValue1Id: value1Id,
      attributeValue2Id: value2Id,
    });
    return productAttributeValue;
  } catch (error) {
    console.log('Error saving product attribute value:', error);
    return {
      EM: 'Error saving product attribute value',
      EC: -1,
      DT: [],
    };
  }
};

const updateProduct = async (data, storeId) => {
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

      const attributeValueMap = {};
      for (let variantId of data.selectedVariants) {
        const attributeValue = await db.AttributeValue.findByPk(variantId);
        if (!attributeValue) {
          throw new Error(`AttributeValue with ID ${variantId} does not exist`);
        }
        const attributeId = attributeValue.attributeId;

        if (!attributeValueMap[attributeId]) {
          attributeValueMap[attributeId] = [];
        }
        attributeValueMap[attributeId].push(variantId);
      }

      if (Object.keys(attributeValueMap).length < 2) {
        return {
          EM: "You must select values from at least two different attributes",
          EC: 1,
          DT: [],
        };
      }

      const attributeIds = Object.keys(attributeValueMap);
      const combinations = [];
      const combine = (values, currentCombo = [], index = 0) => {
        if (index === values.length) {
          combinations.push(currentCombo);
          return;
        }
        for (let value of values[index]) {
          combine(values, [...currentCombo, value], index + 1);
        }
      };
      combine(attributeIds.map(id => attributeValueMap[id]));

      for (const combination of combinations) {
        const existingProductAttribute = await db.ProductAttribute.findOne({
          where: {
            productId: data.id,
            attributeValue1Id: combination[0],
            attributeValue2Id: combination[1],
          },
        });

        if (!existingProductAttribute) {
          const newProductAttribute = await db.ProductAttribute.create({
            productId: data.id,
            attributeValue1Id: combination[0],
            attributeValue2Id: combination[1],
          });

          await db.Inventory.create({
            product_AttributeId: newProductAttribute.id,
            storeId: storeId,
            quantity: 0,
            currentNumber: 0,
            quantity_ordered: 0,
            quantity_shipped: 0,
            quantity_sold: 0,
          });
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
    await product.update({ isDelete: 1 });

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

const getAllProductWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Product.findAndCountAll({
      offset: offset,
      limit: limit,
      where: { isDelete: null },
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
      include: [
        { model: db.Store, attributes: ["name", "id"] },
      ],
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

const getProductInStockWithPagination = async (page, limit, storeId) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Inventory.findAndCountAll({
      offset: offset,
      limit: limit,
      where: { storeId: storeId, isDelete: null },
      attributes: [
        "id",
        "quantyly",
        "currentNumber",
        "quantyly_ordered",
        "quantyly_shipped",
        "quantity_sold",
      ],
      include: [
        {
          model: db.ProductAttribute, attributes: ["id"],
          include: [
            { model: db.Product, attributes: ['product_name', 'id'] },
            {
              model: db.AttributeValue,
              as: 'AttributeValue1',
              attributes: ['id', 'name'],
              include: [
                { model: db.Attribute, attributes: ['id', 'name'] }
              ]
            },
            {
              model: db.AttributeValue,
              as: 'AttributeValue2',
              attributes: ['id', 'name'],
              include: [
                { model: db.Attribute, attributes: ['id', 'name'] }
              ]
            }
          ]
        },
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
      await product.update({ isDelete: 1 });
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
              model: db.ProductAttribute,
              attributes: ['id'],
              include: [
                {
                  model: db.AttributeValue,
                  as: 'AttributeValue1',
                  attributes: ['id', 'name'],
                  include: [
                    { model: db.Attribute, attributes: ['id', 'name'] }
                  ]
                },
                {
                  model: db.AttributeValue,
                  as: 'AttributeValue2',
                  attributes: ['id', 'name'],
                  include: [
                    { model: db.Attribute, attributes: ['id', 'name'] }
                  ]
                },
                { model: db.Inventory, attributes: ['currentNumber'] }
              ]
            },
            { model: db.Store, attributes: ['name', 'id'] },
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

const buyNowProduct = async (product_attribute_value_Id, userId, storeId, body) => {
  try {
    let order = await db.Order.findOne({ where: { userId: userId, storeId: storeId, createdAt: new Date() } });
    let newOrder;
    if (!order) {
      newOrder = await db.Order.create({
        total_amount: body.total,
        order_date: new Date(),
        status: 'Processing',
        payment_methodID: body.payment_methodID,
        userId: userId,
        provinceId: body.province,
        districtId: body.district,
        wardId: body.ward,
        storeId: storeId,
        phonenumber: body.phonenumber,
        customerName: body.customerName,
        address_detail: body.address_detail,
      });
    } else {
      newOrder = order;
    }
    let orderItem = await db.OrderItem.findOne({
      where: { orderId: newOrder.id, product_AttributeId: product_attribute_value_Id }
    })
    if (!orderItem) {
      orderItem = await db.OrderItem.create({
        orderId: newOrder.id,
        product_AttributeId: product_attribute_value_Id,
        quantily: body.quantily,
        price_per_item: body.price_item,
      })
    }

    await db.Invoice.create({
      orderId: newOrder.id,
      invoice_date: new Date(),
      total_amount: body.total,
      payment_methodID: newOrder.payment_methodID,
    })

    const productColorSize = await db.ProductAttribute.findByPk(orderItem.product_AttributeId);
    if (!productColorSize) {
      throw new Error('Product color size not found.');
    }
    const inventory = await db.Inventory.findOne({ where: { product_AttributeId: productColorSize.id } });
    if (!inventory) {
      throw new Error('Inventory not found.');
    }
    const updatedCurrentNumber = inventory.currentNumber - body.quantily;
    const updateQuantylyOrdered = inventory.quantyly - updatedCurrentNumber;
    await inventory.update({ currentNumber: updatedCurrentNumber, quantyly_ordered: updateQuantylyOrdered });
    return {
      EM: "Buy now success!",
      EC: 0,
      DT: ''
    };
  } catch (error) {
    console.error(error);
    return {
      EM: "Create error",
      EC: -1,
      DT: ""
    };
  }
}

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

const postAddToCart = async (product_attribute_value_Id, userId, provinceId, districtId, wardId, storeId, body) => {
  try {
    let order = await db.Order.findOne({
      where: {
        userId: userId,
        storeId: storeId,
        order_date: {
          [Op.between]: [startOfDay, endOfDay]
        },
        status: 'pending'
      }
    });

    if (order) {
      let orderItem = await db.OrderItem.findOne({
        where: {
          orderId: order.id,
          product_AttributeId: product_attribute_value_Id
        }
      });

      if (orderItem) {
        orderItem.quantily += body.quantily;
        await orderItem.save();
      } else {
        orderItem = await db.OrderItem.create({
          orderId: order.id,
          product_AttributeId: product_attribute_value_Id,
          quantily: body.quantily,
          price_per_item: body.price_per_item
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
    }

    if (!order) {
      order = await db.Order.create({
        total_amount: 0,
        order_date: new Date(),
        status: 'pending',
        userId: userId,
        provinceId: provinceId,
        districtId: districtId,
        wardId: wardId,
        storeId: storeId,
      });

      let orderItem = await db.OrderItem.create({
        orderId: order.id,
        product_AttributeId: product_attribute_value_Id,
        quantily: body.quantily,
        price_per_item: body.price_per_item
      });

      let totalAmount = body.quantily * body.price_per_item;
      order.total_amount = totalAmount;
      await order.save();

      return {
        EM: "Add to cart success!",
        EC: 0,
        DT: orderItem
      };
    }
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
            model: db.ProductAttribute,
            attributes: ['id'],
            include: [
              {
                model: db.Product,
                attributes: ["product_name", "price", "description", 'image'],
                include: [
                  { model: db.Store, attributes: ['name', 'id'] },
                ],
              },
              {
                model: db.Inventory,
                attributes: ['currentNumber', `id`],
              },
              {
                model: db.AttributeValue,
                as: 'AttributeValue1',
                attributes: ['id', 'name'],
                include: [
                  { model: db.Attribute, attributes: ['id', 'name'] }
                ]
              },
              {
                model: db.AttributeValue,
                as: 'AttributeValue2',
                attributes: ['id', 'name'],
                include: [
                  { model: db.Attribute, attributes: ['id', 'name'] }
                ]
              }
            ],
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

    let orderId = product.orderId;

    await product.destroy();

    let remainingOrderItems = await db.OrderItem.findAll({
      where: { orderId: orderId },
    });

    if (remainingOrderItems.length === 0) {
      await db.Order.destroy({
        where: { id: orderId },
      });
    }

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

const createBuyProduct = async (orderId, product_attribute_value_Id, storeId, body) => {
  const purchaseQuantity = parseInt(body.quantily);
  const payment_methodID = body.payment_methodID;
  const pricePerItem = parseFloat(body.price_per_item);
  const shippingFee = parseFloat(body.shippingFee);
  const transaction = await sequelize.transaction();
  const wardId = body.ward;
  const provinceId = body.province;
  const districtId = body.district;
  const customerName = body.customerName;
  const address_detail = body.address_detail;
  const phonenumber = body.phonenumber;

  try {
    const order = await db.Order.findByPk(orderId, { transaction });
    if (!order) {
      throw new Error('Order not found.');
    }

    const item = await db.OrderItem.findOne({
      where: { orderId: orderId, product_AttributeId: product_attribute_value_Id },
      transaction
    });

    if (!item) throw new Error('Product not found in order.');

    let newOrder = null;

    if (purchaseQuantity === item.quantily) {
      await order.update({
        status: 'Processing', payment_methodID: payment_methodID, total_amount: pricePerItem * purchaseQuantity + shippingFee, provinceId: provinceId, districtId: districtId, wardId: wardId, customerName: customerName, phonenumber: phonenumber, address_detail: address_detail,
      }, { transaction });
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
        provinceId: provinceId,
        districtId: districtId,
        wardId: wardId,
        phonenumber: phonenumber,
        address_detail: address_detail,
        customerName: customerName,
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
    const productColorSize = await db.ProductAttribute.findByPk(item.product_AttributeId);
    if (!productColorSize) {
      throw new Error('Product color size not found.');
    }

    const inventory = await db.Inventory.findOne({ where: { product_AttributeId: productColorSize.id } });
    if (!inventory) {
      throw new Error('Inventory not found.');
    }

    const updatedCurrentNumber = inventory.currentNumber - purchaseQuantity;
    const updateQuantylyOrdered = inventory.quantyly - updatedCurrentNumber;
    const updateQuantilyShipped = inventory.quantyly - updatedCurrentNumber;
    const updateQuantilySold = updateQuantilyShipped;
    await inventory.update({ currentNumber: updatedCurrentNumber, quantyly_ordered: updateQuantylyOrdered, quantyly_shipped: updateQuantilyShipped, quantity_sold: updateQuantilySold }, { transaction });

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
              model: db.ProductAttribute,
              attributes: ['id'],
              include: [
                { model: db.Product, attributes: [`product_name`] },
                {
                  model: db.AttributeValue,
                  as: 'AttributeValue1',
                  attributes: ['id', 'name'],
                  include: [
                    { model: db.Attribute, attributes: ['id', 'name'] }
                  ]
                },
                {
                  model: db.AttributeValue,
                  as: 'AttributeValue2',
                  attributes: ['id', 'name'],
                  include: [
                    { model: db.Attribute, attributes: ['id', 'name'] }
                  ]
                }
              ]
            },
            {
              model: db.Order, attributes: ['customerName', 'phonenumber', 'address_detail']
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
      { where: { status: "Processing", storeId: storeId, payment_methodID: 1 }, returning: true }
    );

    const confirmedOrders = await db.Order.findAll({
      where: { status: "confirmed", storeId: storeId }
    });
    const confirmedOrderIds = confirmedOrders.map(order => order.id);

    const existingShippingUnitOrders = await db.Shipping_Unit_Order.findAll({
      where: {
        orderId: confirmedOrderIds,
        shippingUnitId: body.shippingUnitId
      }
    });

    const existingOrderIds = new Set(existingShippingUnitOrders.map(order => order.orderId));

    const shippingUnitOrders = confirmedOrderIds.filter(orderId => !existingOrderIds.has(orderId)).map(orderId => {
      return {
        orderId: orderId,
        shippingUnitId: body.shippingUnitId,
        status: 'Received from store',
      };
    });

    if (shippingUnitOrders.length > 0) {
      await db.Shipping_Unit_Order.bulkCreate(shippingUnitOrders);
    }

    return { EM: `All orders have been confirmed and orderId has been updated in ShippingUnit`, EC: 0, DT: '' };
  } catch (error) {
    console.error('Error confirming orders:', error);
    return { EM: 'Failed to confirm orders', EC: -1, DT: '' };
  }
};

const ConfirmOrdersByTransfer = async (storeId, body) => {
  const transaction = await sequelize.transaction();

  try {
    await db.Order.update(
      { status: 'confirmed' },
      {
        where: { status: "Processing", storeId: storeId, id: body.id },
        returning: true,
        transaction
      }
    );

    const confirmedOrder = await db.Order.findOne({
      where: { status: "confirmed", storeId: storeId, id: body.id },
      transaction
    });

    if (!confirmedOrder) {
      throw new Error('Order not found or not confirmed');
    }

    const existingShippingUnitOrder = await db.Shipping_Unit_Order.findOne({
      where: {
        orderId: confirmedOrder.id,
        shippingUnitId: body.shippingUnitId
      },
      transaction
    });

    if (!existingShippingUnitOrder) {
      await db.Shipping_Unit_Order.create({
        orderId: confirmedOrder.id,
        shippingUnitId: body.shippingUnitId,
        status: 'Received from store'
      }, { transaction });
    }

    await transaction.commit();
    return { EM: 'Order confirmed successfully', EC: 0, DT: '' };
  } catch (error) {
    await transaction.rollback();
    console.error('Error confirming order:', error);
    return { EM: 'Failed to confirm order', EC: -1, DT: '' };
  }
};

const DeleteOrdersTransfer = async (id) => {
  try {
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
  } catch (error) {
    console.error('Error confirming order:', error);
    return { EM: 'Failed to confirm order', EC: -1, DT: '' };
  }
}

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
              model: db.ProductAttribute,
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
                  model: db.AttributeValue,
                  as: 'AttributeValue1',
                  attributes: ['id', 'name'],
                  include: [
                    { model: db.Attribute, attributes: ['id', 'name'] }
                  ]
                },
                {
                  model: db.AttributeValue,
                  as: 'AttributeValue2',
                  attributes: ['id', 'name'],
                  include: [
                    { model: db.Attribute, attributes: ['id', 'name'] }
                  ]
                }
              ],
            }
          ]
        },
        {
          model: db.Shipping_Unit_Order,
          attributes: ['status'],
          include: [
            {
              model: db.Shipping_Unit_Order_user,
              attributes: ['status', 'reason']
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
    const order = await db.Order.findOne({
      where: { id: id }
    });
    if (!order) {
      return {
        EM: "No order found with the provided ID!",
        EC: -1,
        DT: null,
      };
    }
    if (order.status !== 'Processing') {
      return {
        EM: "Đơn hàng đã được xác nhận mời bạn tải lại trang để cập nhập dữ liệu mới nhất",
        EC: -2,
        DT: null,
      };
    }

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
              attributes: ['id', 'total_amount', 'order_date', 'payment_methodID', 'userId', 'storeId', 'customerName', 'phonenumber', 'address_detail'],
              include: [
                {
                  model: db.OrderItem,
                  attributes: [`quantily`],
                  include: [
                    {
                      model: db.ProductAttribute,
                      attributes: ['id'],
                      include: [
                        { model: db.Product, attributes: [`product_name`] },
                        {
                          model: db.AttributeValue,
                          as: 'AttributeValue1',
                          attributes: ['id', 'name'],
                          include: [
                            { model: db.Attribute, attributes: ['id', 'name'] }
                          ]
                        },
                        {
                          model: db.AttributeValue,
                          as: 'AttributeValue2',
                          attributes: ['id', 'name'],
                          include: [
                            { model: db.Attribute, attributes: ['id', 'name'] }
                          ]
                        }
                      ]
                    }
                  ]
                },
                { model: db.Province, attributes: ['province_name'] },
                { model: db.District, attributes: ['district_name'] },
                { model: db.Ward, attributes: ['ward_name'] },
                {
                  model: db.User,
                  attributes: ['username', 'phonenumber']
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
      { status: 'Order delivery failed', reason: body.reason },
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

const orderSuccessByShipper = async (page, limit, userId) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Shipping_Unit_Order_user.findAndCountAll({
      where: {
        status: {
          [db.Sequelize.Op.in]: ['Delivered', 'Order delivery failed']
        },
        userId: userId
      },
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
              attributes: ['id', 'total_amount', 'order_date', 'payment_methodID', 'userId', 'storeId', 'customerName', 'phonenumber', 'address_detail'],
              include: [
                {
                  model: db.OrderItem,
                  attributes: [`quantily`],
                  include: [
                    {
                      model: db.ProductAttribute,
                      attributes: ['id'],
                      include: [
                        { model: db.Product, attributes: [`product_name`] },
                        {
                          model: db.AttributeValue,
                          as: 'AttributeValue1',
                          attributes: ['id', 'name'],
                          include: [
                            { model: db.Attribute, attributes: ['id', 'name'] }
                          ]
                        },
                        {
                          model: db.AttributeValue,
                          as: 'AttributeValue2',
                          attributes: ['id', 'name'],
                          include: [
                            { model: db.Attribute, attributes: ['id', 'name'] }
                          ]
                        }
                      ]
                    }
                  ]
                },
                { model: db.Province, attributes: ['province_name'] },
                { model: db.District, attributes: ['district_name'] },
                { model: db.Ward, attributes: ['ward_name'] },
                {
                  model: db.User,
                  attributes: ['username', 'phonenumber']
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

const getSellingProductsWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Inventory.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: [
        [db.sequelize.col('ProductAttribute.Product.id'), 'id'],
        [db.sequelize.col('ProductAttribute.Product.product_name'), 'product_name'],
        [db.sequelize.col('ProductAttribute.Product.image'), 'image'],
        [db.sequelize.col('ProductAttribute.Product.price'), 'price'],
        [db.sequelize.col('ProductAttribute.Product.old_price'), 'old_price'],
        [db.sequelize.col('ProductAttribute.Product.promotion'), 'promotion'],
        [db.sequelize.fn('SUM', db.sequelize.col('quantyly_ordered')), 'total_quantity_ordered'],
      ],
      include: [
        { model: db.Store, attributes: ['id', `name`] },
        {
          model: db.ProductAttribute, attributes: [],
          include: [
            {
              model: db.Product, attributes: []
            }
          ]
        },
      ],
      group: ['ProductAttribute.Product.id'],
      order: [[db.sequelize.literal('total_quantity_ordered'), 'DESC']],
    });
    let totalPages = Math.ceil(count.length / limit);
    let data = {
      totalPages: totalPages,
      totalRow: count.length,
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
}

const shipperDashboardSummary = async (userId) => {
  try {
    const totalOrders = await db.Shipping_Unit_Order_user.count({
      where: {
        userId: userId,
      }
    });

    const totalRevenue = totalOrders * 10000;

    const totalOrderFails = await db.Shipping_Unit_Order_user.count({
      where: {
        status: 'Order delivery failed',
        userId: userId,
      }
    });
    const totalOrderSuccess = await db.Shipping_Unit_Order_user.count({
      where: {
        status: 'Delivered',
        userId: userId,
      }
    });

    const monthlyOrders = await db.Shipping_Unit_Order_user.findAll({
      attributes: [
        [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), '%Y-%m'), 'month'],
        [db.sequelize.fn('count', db.sequelize.col('shipping_unit_orderId')), 'totalOrders'],
      ],
      where: {
        userId: userId,
      },
      group: ['month'],
      order: [[db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), '%Y-%m'), 'ASC']]
    });

    return {
      EM: "Ok!",
      EC: 0,
      DT: {
        totalOrders: totalOrders,
        totalRevenue: totalRevenue,
        monthlyOrders: monthlyOrders,
        totalOrderFails: totalOrderFails,
        totalOrderSuccess: totalOrderSuccess,
      },
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

const shipperDashboardOrder = async (page, limit, userId) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Shipping_Unit_Order_user.findAndCountAll({
      offset: offset,
      limit: limit,
      where: {
        userId: userId,
      },
      attributes: [],
      order: [['id', 'DESC']],
      include: [
        {
          model: db.Shipping_Unit_Order,
          attributes: ['id'],
          include: [
            {
              model: db.Order,
              attributes: ['id', 'total_amount', 'order_date', 'payment_methodID', 'customerName', 'phonenumber', 'address_detail'],
              include: [
                {
                  model: db.PaymentMethod,
                  attributes: ['method_name']
                },
                {
                  model: db.User,
                  attributes: ['username', 'phonenumber']
                },
                {
                  model: db.OrderItem,
                  attributes: ['id', 'quantily'],
                  include: [
                    {
                      model: db.ProductAttribute,
                      attributes: ['id'],
                      include: [
                        {
                          model: db.Product,
                          attributes: ['product_name', 'id']
                        },
                        {
                          model: db.AttributeValue,
                          as: 'AttributeValue1',
                          attributes: ['id', 'name'],
                          include: [
                            { model: db.Attribute, attributes: ['id', 'name'] }
                          ]
                        },
                        {
                          model: db.AttributeValue,
                          as: 'AttributeValue2',
                          attributes: ['id', 'name'],
                          include: [
                            { model: db.Attribute, attributes: ['id', 'name'] }
                          ]
                        }
                      ],
                    }
                  ]
                }
              ]
            },
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
      EM: 'OK',
      EC: 0,
      DT: data,
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

const shipperDashboardRevenue = async (page, limit, userId) => {
  try {
    let offset = (page - 1) * limit;

    const dailyRevenue = await db.Shipping_Unit_Order_user.findAll({
      where: {
        userId: userId,
      },
      attributes: [
        [db.Sequelize.fn('DATE', db.Sequelize.col('createdAt')), 'order_date'],
        [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'order_count'],
        [db.Sequelize.literal('COUNT(id) * 10000'), 'total_revenue']
      ],
      group: [db.Sequelize.fn('DATE', db.Sequelize.col('createdAt'))],
      order: [[db.Sequelize.fn('DATE', db.Sequelize.col('createdAt')), 'DESC']],
      limit: limit,
      offset: offset,
    });

    const countResult = await db.Shipping_Unit_Order_user.findAll({
      where: {
        userId: userId,
      },
      attributes: [
        [db.Sequelize.fn('DISTINCT', db.Sequelize.fn('DATE', db.Sequelize.col('createdAt'))), 'distinct_dates']
      ],
    });

    const totalDistinctDates = countResult.length;
    const totalPages = Math.ceil(totalDistinctDates / limit);

    let data = {
      totalPages: totalPages,
      totalRow: totalDistinctDates,
      dailyRevenue: dailyRevenue,
    };

    return {
      EM: 'OK',
      EC: 0,
      DT: data,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrong with services",
      EC: -1,
      DT: [],
    };
  }
};

const shipperDashboardDetailRevenue = async (page, limit, userId, date) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.Shipping_Unit_Order_user.findAndCountAll({
      offset: offset,
      limit: limit,
      where: {
        userId: userId,
        createdAt: {
          [db.Sequelize.Op.between]: [
            `${date} 00:00:00`,
            `${date} 23:59:59`
          ]
        },
      },
      attributes: ['id'],
      order: [['id', 'DESC']],
      include: [
        {
          model: db.Shipping_Unit_Order,
          attributes: ['id'],
          include: [
            {
              model: db.Order,
              attributes: ['total_amount', 'id', 'customerName', 'phonenumber', 'address_detail'],
              include: [
                {
                  model: db.User,
                  attributes: ['username', 'id', 'phonenumber']
                },
                {
                  model: db.OrderItem,
                  attributes: ['quantily', 'id'],
                  include: [
                    {
                      model: db.ProductAttribute,
                      attributes: ['id'],
                      include: [
                        {
                          model: db.Product,
                          attributes: ['product_name', 'id']
                        },
                        {
                          model: db.AttributeValue,
                          as: 'AttributeValue1',
                          attributes: ['id', 'name'],
                          include: [
                            { model: db.Attribute, attributes: ['id', 'name'] }
                          ]
                        },
                        {
                          model: db.AttributeValue,
                          as: 'AttributeValue2',
                          attributes: ['id', 'name'],
                          include: [
                            { model: db.Attribute, attributes: ['id', 'name'] }
                          ]
                        }
                      ],
                    }
                  ]
                }
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
      EM: 'OK',
      EC: 0,
      DT: data,
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

module.exports = {
  getAllProductForStoreOwner,
  shipperDashboardOrder,
  shipperDashboardSummary,
  shipperDashboardRevenue,
  shipperDashboardDetailRevenue,
  orderSuccessByShipper,
  getProductWithPagination,
  createProduct,
  orderConfirmationFailed,
  updateInventory,
  saveProductAttributeValue,
  updateProduct,
  deleteProduct,
  getAllProductWithPagination,
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
  ConfirmOrdersByTransfer,
  DeleteOrdersTransfer,
  getreadStatusOrderWithPagination,
  cancelOrder,
  readAllOrderByShipper,
  shipperConfirmOrder,
  buyNowProduct,
  getSellingProductsWithPagination,
};

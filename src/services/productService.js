import axios from "../setup/axios";

const getAllProductsByStore = (data) => {
  return axios.get(
    `/api/product/read?page=${data.page}&limit=${data.limit}&storeId=${data.storeId}`
  );
};

const getAllProducts = (data) => {
  return axios.get(
    `/api/all-product/read?page=${data.page}&limit=${data.limit}`
  );
};

const createProduct = (productData, storeId, selectedColors, selectedSizes) => {
  const colorsAndSizes = selectedColors.map((color) => ({
    colorId: color,
    selectedSizes: selectedSizes,
  }));

  return axios.post(`/api/product/create?storeId=${storeId}`, {
    ...productData,
    colorsAndSizes: colorsAndSizes,
  });
};

const updateProduct = (productData, storeId, selectedColors, selectedSizes) => {
  const colorsAndSizes = selectedColors.map((color) => ({
    colorId: color,
    sizeIds: selectedSizes,
  }));

  return axios.put(`/api/product/update?storeId=${storeId}`, {
    ...productData,
    colorsAndSizes: colorsAndSizes,
  });
};

const deleteProduct = (product) => {
  return axios.delete(`/api/product/delete`, {
    data: { id: product.id },
  });
};

const searchProduct = (key) => {
  return axios.get(`/api/search-product?q=${key}`);
};

const getAllProductsInStockByStore = (data) => {
  return axios.get(
    `/api/inventory/read?page=${data.page}&limit=${data.limit}&storeId=${data.storeId}`
  );
};

const deleteProductInStock = (product) => {
  return axios.delete(`/api/inventory/delete`, {
    data: { id: product.id },
  });
};

const updateProductInStockByStore = (data) => {
  return axios.put(`/api/inventory/update`, data);
};

const createColorProduct = (data, storeId) => {
  return axios.post(`/api/color/create?storeId=${storeId}`, { ...data });
};

const getAllColorsProduct = (page, limit, storeId) => {
  return axios.get(
    `/api/color/read?page=${page}&limit=${limit}&storeId=${storeId}`
  );
};

const getAllColorByStore = (storeId) => {
  return axios.get(`/api/color/readByStore?storeId=${storeId}`);
};

const deleteColor = (color) => {
  return axios.delete(`/api/color/delete`, {
    data: { id: color.id },
  });
};

const updateColorProduct = (data, storeId) => {
  return axios.put(`/api/color/update?storeId=${storeId}`, { ...data });
};

const createSizeProduct = (data, storeId) => {
  return axios.post(`/api/size/create?storeId=${storeId}`, { ...data });
};

const getAllSizeProduct = (page, limit, storeId) => {
  return axios.get(
    `/api/size/read?page=${page}&limit=${limit}&storeId=${storeId}`
  );
};

const getAllSizeByStore = (storeId) => {
  return axios.get(`/api/size/readByStore?storeId=${storeId}`);
};

const deleteSize = (color) => {
  return axios.delete(`/api/size/delete`, {
    data: { id: color.id },
  });
};

const updateSizeProduct = (data, storeId) => {
  return axios.put(`/api/size/update?storeId=${storeId}`, { ...data });
};

const getDetailProductById = (id) => {
  return axios.get(`/api/detail-productById?id=${id}`);
}

const getRamdomProduct = () => {
  return axios.get(`/api/random-products`);
}

const getAllCommentByProduct = (page, limit, productId) => {
  return axios.get(
    `/api/comment/read?page=${page}&limit=${limit}&productId=${productId}`
  );
}

const createCommentProduct = (productId, userId, data) => {
  return axios.post(`/api/comment/create?productId=${productId}&userId=${userId}`, data);
};

const deleteCommentProduct = (userId, commentId) => {
  return axios.delete(`/api/comment/delete?userId=${userId}`, {
    data: { id: commentId },
  });
};

const getAllCommentByStore = (page, limit, storeId) => {
  return axios.get(
    `/api/comment/read-store_owner?page=${page}&limit=${limit}&storeId=${storeId}`
  );
}

const deleteComemnt = (comment) => {
  return axios.delete(`/api/comment/store-delete`, {
    data: { id: comment.id },
  });
};

const searchComment = (key) => {
  return axios.get(`/api/search-comment?q=${key}`);
};

const addToCart = (productColorSizeId, userId, data) => {
  return axios.post(`/api/product/add-to-cart?productColorSizeId=${productColorSizeId}&userId=${userId}`, { ...data });
}

const readProductCart = (userId) => {
  return axios.get(`/api/product/read-product-cart?userId=${userId}`);
}

const deleteProductCart = (productId) => {
  return axios.delete(`/api/product/delete-product-cart`, {
    data: { id: productId },
  });
}

export {
  getAllProductsByStore,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
  getAllProducts,
  getAllProductsInStockByStore,
  deleteProductInStock,
  updateProductInStockByStore,
  createColorProduct,
  getAllColorsProduct,
  getAllColorByStore,
  deleteColor,
  updateColorProduct,
  createSizeProduct,
  getAllSizeProduct,
  getAllSizeByStore,
  deleteSize,
  updateSizeProduct,
  getDetailProductById,
  getRamdomProduct,
  getAllCommentByProduct,
  createCommentProduct,
  deleteCommentProduct,
  getAllCommentByStore,
  deleteComemnt,
  searchComment,
  addToCart,
  readProductCart,
  deleteProductCart,
};

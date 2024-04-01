import express from "express";
import userController from "../controller/userController";
import roleController from "../controller/roleController";
import authController from "../controller/authController";
import groupController from "../controller/groupController";
import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction";
import category from "../controller/category";
import storeController from "../controller/storeController";
import shippingUnitController from "../controller/shippingUnitController";
import productController from "../controller/productController";
import paymentMethodController from "../controller/paymentMethodController";
import colorController from "../controller/colorController";
import sizeController from "../controller/sizeController";
import commentController from "../controller/commentController";

const router = express.Router();

/**
 *
 * @param {*} app : express app
 */
const initApiRouter = (app) => {
  router.all("*", checkUserJWT, checkUserPermission);
  //login
  router.post("/login", authController.handleLogin);
  router.post("/logout", authController.handleLogout);

  //user routes
  router.post("/user/create", userController.createFunc);
  router.get("/user/read", userController.readFunc);
  router.put("/user/update", userController.updateFunc);
  router.delete("/user/delete", userController.deleteFunc);
  router.get("/search-user", userController.searchUser);
  router.get("/account", userController.getUserAccount);
  router.get("/user-group-store", userController.groupStoreFunc);

  //role routes
  router.get("/role/read", roleController.readFunc);
  router.post("/role/create", roleController.createFunc);
  router.put("/role/update", roleController.updateFunc);
  router.delete("/role/delete", roleController.deleteFunc);
  router.get("/search-role", roleController.searchRole);
  router.get("/role/by-group/:groupId", roleController.getRoleByGroup);
  router.post("/role/assign-to-group", roleController.assignRoleToGroup);

  //group routes
  router.get("/group/read", groupController.readFunc);

  //category
  router.post("/category/create", category.createFunc);
  router.get("/category/read", category.readFunc);
  router.put("/category/update", category.updateFunc);
  router.delete("/category/delete", category.deleteFunc);
  router.get("/search-category", category.searchCategory);
  router.get("/get-all-detail-category-by-id", category.getDetailCategoryById);

  //store
  router.get("/store/read", storeController.readFunc);
  router.post("/store/create", storeController.createFunc);
  router.put("/store/update", storeController.updateFunc);
  router.delete("/store/delete", storeController.deleteFunc);
  router.get("/search-store", storeController.searchStore);

  //shipping unit
  router.post("/shipping-unit/create", shippingUnitController.createFunc);
  router.get("/shipping-unit/read", shippingUnitController.readFunc);
  router.delete("/shipping-unit/delete", shippingUnitController.deleteFunc);
  router.get(
    "/search/shipping-unit",
    shippingUnitController.searchShippingUnit
  );
  router.put("/shipping-unit/update", shippingUnitController.updateFunc);

  //product
  router.get("/product/read", productController.readFunc);
  router.post("/product/create", productController.createFunc);
  router.put("/product/update", productController.updateFunc);
  router.delete("/product/delete", productController.deleteFunc);
  router.get("/search-product", productController.searchProduct);
  router.get("/all-product/read", productController.readAllFunc);
  router.get("/detail-productById", productController.getDetailProductById);
  router.get('/random-products', productController.getRandomProducts);

  //comment product
  router.get("/comment/read", commentController.readFunc);
  router.post("/comment/create", commentController.createFunc);
  router.delete("/comment/delete", commentController.deleteFunc);

  //payment method
  router.post("/payment/create", paymentMethodController.createFunc);
  router.get("/payment/read", paymentMethodController.readFunc);
  router.put("/payment/update", paymentMethodController.updateFunc);
  router.delete("/payment/delete", paymentMethodController.deleteFunc);
  router.get("/search-payment", paymentMethodController.searchMethod);

  //inventory
  router.get("/inventory/read", productController.readInventory);
  router.delete("/inventory/delete", productController.deleteProductInStock);
  router.put("/inventory/update", productController.updateProductInStock);

  //color
  router.post("/color/create", colorController.createFunc);
  router.get("/color/read", colorController.readFunc);
  router.delete("/color/delete", colorController.deleteFunc);
  router.put("/color/update", colorController.updateFunc);
  router.get("/color/readByStore", colorController.readColorByStore);

  //size
  router.post("/size/create", sizeController.createFunc);
  router.get("/size/read", sizeController.readFunc);
  router.delete("/size/delete", sizeController.deleteFunc);
  router.put("/size/update", sizeController.updateFunc);
  router.get("/size/readByStore", sizeController.readSizeByStore);

  return app.use("/api", router);
};

export default initApiRouter;

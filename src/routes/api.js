import express from "express";
import userController from "../controller/userController";
import roleController from "../controller/roleController";
import authController from "../controller/authController";
import groupController from "../controller/groupController";
import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction";
import category from "../controller/category";

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

  //role routes
  router.get("/role/read", roleController.readFunc);
  router.post("/role/create", roleController.createFunc);
  // router.put("/role/update", roleController.updateFunc);
  router.delete("/role/delete", roleController.deleteFunc);
  router.get("/search-role", roleController.searchRole);
  router.get("/role/by-group/:groupId", roleController.getRoleByGroup);
  router.post("/role/assign-to-group", roleController.assignRoleToGroup);

  //group routes
  router.get("/group/read", groupController.readFunc);

  //category
  router.post("/category/create", category.createFunc);

  return app.use("/api", router);
};

export default initApiRouter;

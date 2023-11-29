import express from "express";
import userController from "../controller/userController";
import roleController from "../controller/roleController";

const router = express.Router();

/**
 *
 * @param {*} app : express app
 */
const initApiRouter = (app) => {
  //user routes
  router.post("/user/create", userController.createFunc);

  //role routes
  router.get("/role/read", roleController.readFunc);

  return app.use("/api", router);
};

export default initApiRouter;

import express from "express";

const router = express.Router();

/**
 *
 * @param {*} app : express app
 */
const initApiRouter = (app) => {
  router.get("/api", (req, res) => {
    return res.send("Hello world");
  });
  return app.use("/api", router);
};

export default initApiRouter;

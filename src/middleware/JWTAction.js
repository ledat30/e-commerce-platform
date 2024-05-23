import jwt from "jsonwebtoken";
require("dotenv").config();

const nonSecurePaths = [
  "/login",
  "/register",
  "/logout",
  "/user-group-store",
  "/user-group-shipping_unit",
  "/search-store",
  "/search-category",
  "/search-role",
  "/search-user",
  "/search/shipping-unit",
  "/search-product",
  "/search-payment",
  "/all-product/read",
  "/get-all-detail-category-by-id",
  "/random-products",
  "/search-comment",
  "/detail-productById",
  "/random-products",
  "/color/readByStore",
  "/size/readByStore",
  "/shipping-unit/read",
  "/user/edit-profile",
  "/product/read_status-order",
  "/product/cancel-order",
  "/user-group-shipper",
  "/shipping-unit/confirm",
  '/product/order_success_byShipper',
  "/store/all-product-by-store-id",
  '/store/category-by-store',
  '/product/selling-products',
  '/store/dashboard-summary-by-store',
  '/store/dashboard-order-by-store',
  '/store/dashboard-revenue-by-store',
  '/store/dashboard-revenue-by-date',
  '/shipping-unit/dashboard-summary-by-shippingUnit',
  '/shipping-unit/dashboard-order-by-shippingUnit',
  '/shipper/dashboard-summary-by-shipper',
  '/shipper/dashboard-order-by-shipper',
  '/shipper/dashboard-revenue-by-shipper',
  '/shipper/dashboard-detail-revenue-by-shipper',
  '/admin/dashboard-summary',
  '/admin/dashboard-order',
  '/admin/dashboard-product',
  '/admin/dashboard-user',
  '/admin/dashboard-revenue-by-store',
  '/admin/dashboard-revenue-store-by-date',
  '/admin/dashboard-revenue-store-detail-by-date',
];

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPRIRES_IN });
  } catch (error) {
    console.log(error);
  }
  return token;
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
  }
  return decoded;
};

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const checkUserJWT = (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) return next();
  let cookies = req.cookies;
  let tokenFromHeader = extractToken(req);
  if ((cookies && cookies.jwt) || tokenFromHeader) {
    let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;
    let decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
      req.token = token;
      next();
    } else {
      return res.status(401).json({
        EC: -1,
        DT: "",
        EM: "Not authenticated the user",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Not authenticated the user",
    });
  }
};

const checkUserPermission = (req, res, next) => {
  if (nonSecurePaths.includes(req.path) || req.path === "/account")
    return next();
  if (req.user) {
    let email = req.user.email;
    let roles = req.user.groupWithRoles.Roles;
    let currentUrl = req.path;
    if (!roles || roles.length === 0) {
      return res.status(403).json({
        EC: -1,
        DT: "",
        EM: `You don't have the permission to access this resource`,
      });
    }
    let canAccess = roles.some(
      (item) =>
        item.roleName === currentUrl || currentUrl.includes(item.roleName)
    );
    if (canAccess === true) {
      next();
    } else {
      return res.status(403).json({
        EC: -1,
        DT: "",
        EM: `You don't permission to access this resource`,
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Not authenticated the user",
    });
  }
};

module.exports = {
  createJWT,
  verifyToken,
  checkUserJWT,
  checkUserPermission,
};

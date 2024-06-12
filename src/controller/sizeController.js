// import sizeService from "../service/sizeService";

// const createFunc = async (req, res) => {
//   try {
//     let data = await sizeService.createSizeProduct(req.body, req.query.storeId);
//     return res.status(200).json({
//       EM: data.EM,
//       EC: data.EC,
//       DT: data.DT,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       EM: "Create size error",
//       EC: "-1",
//       DT: "",
//     });
//   }
// };

// const readFunc = async (req, res) => {
//   try {
//     const storeId = req.query.storeId;
//     if (req.query.page && req.query.limit) {
//       let page = req.query.page;
//       let limit = req.query.limit;

//       let data = await sizeService.getSizeWithPagination(
//         +page,
//         +limit,
//         storeId
//       );

//       return res.status(200).json({
//         EM: data.EM,
//         EC: data.EC,
//         DT: data.DT,
//       });
//     } else {
//       let data = await sizeService.getAllSizes();

//       return res.status(200).json({
//         EM: data.EM,
//         EC: data.EC,
//         DT: data.DT,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       EM: "Error",
//       EC: "-1",
//       DT: "",
//     });
//   }
// };

// const readSizeByStore = async (req, res) => {
//   try {
//     const storeId = req.query.storeId;

//     let data = await sizeService.readSizeByStore(storeId);

//     return res.status(200).json({
//       EM: data.EM,
//       EC: data.EC,
//       DT: data.DT,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       EM: "Error",
//       EC: "-1",
//       DT: "",
//     });
//   }
// };

// const deleteFunc = async (req, res) => {
//   try {
//     let data = await sizeService.deleteSize(req.body.id);
//     return res.status(200).json({
//       EM: data.EM,
//       EC: data.EC,
//       DT: data.DT,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       EM: "Error",
//       EC: "-1",
//       DT: "",
//     });
//   }
// };

// const updateFunc = async (req, res) => {
//   try {
//     let data = await sizeService.updateSize(req.body, req.query.storeId);
//     return res.status(200).json({
//       EM: data.EM,
//       EC: data.EC,
//       DT: data.DT,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       EM: "Error",
//       EC: "-1",
//       DT: "",
//     });
//   }
// };

// module.exports = {
//   createFunc,
//   readFunc,
//   readSizeByStore,
//   deleteFunc,
//   updateFunc,
// };

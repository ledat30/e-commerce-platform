import userService from "../service/userService";

const registerUser = async (req, res) => {
  try {
    let data = await userService.registerUser(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Create new user error",
      EC: "-1",
      DT: "",
    });
  }
}

const createFunc = async (req, res) => {
  try {
    let data = await userService.createNewUser(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Create new user error",
      EC: "-1",
      DT: "",
    });
  }
};

const readFunc = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;

      let data = await userService.getUserWithPagination(+page, +limit);

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await userService.getAllUsers();

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error",
      EC: "-1",
      DT: "",
    });
  }
};

const updateFunc = async (req, res) => {
  try {
    let data = await userService.updateUser(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error",
      EC: "-1",
      DT: "",
    });
  }
};

const editProfile = async (req, res) => {
  try {
    let data = await userService.editProfile(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error",
      EC: "-1",
      DT: "",
    });
  }
}

const deleteFunc = async (req, res) => {
  try {
    let data = await userService.deleteUser(req.body.id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error",
      EC: "-1",
      DT: "",
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    let data = await userService.deleteAccount(req.query.id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error",
      EC: "-1",
      DT: "",
    });
  }
};

const searchUser = async (req, res) => {
  try {
    const keyword = req.query.q;
    const data = await userService.searchUser(keyword);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error from the server",
      EC: -1,
      DT: "",
    });
  }
};

const getUserAccount = async (req, res) => {
  return res.status(200).json({
    EM: "Ok",
    EC: 0,
    DT: {
      access_token: req.token,
      groupWithRoles: req.user.groupWithRoles,
      email: req.user.email,
      phonenumber: req.user.phonenumber,
      provinceName: req.user.provinceName,
      districtName: req.user.districtName,
      wardName: req.user.wardName,
      provinceId: req.user.provinceId,
      districtId: req.user.districtId,
      wardId: req.user.wardId,
      username: req.user.username,
      id: req.user.id,
      storeId: req.user.storeId,
      nameStore: req.user.nameStore,
      shipingUnitId: req.user.shipingUnitId,
      shipingUnitName: req.user.shipingUnitName,
    },
  });
};

const groupStoreFunc = async (req, res) => {
  try {
    let data = await userService.getGroupStore();

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error",
      EC: "-1",
      DT: "",
    });
  }
};

const groupShippingUnitFunc = async (req, res) => {
  try {
    let data = await userService.groupShippingUnitFunc();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error",
      EC: "-1",
      DT: "",
    });
  }
}

const getGroupShipper = async (req, res) => {
  try {
    let data = await userService.getGroupShipper();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error",
      EC: "-1",
      DT: "",
    });
  }
}

const getAllProvinceDistrictWard = async (req, res) => {
  try {
    let data = await userService.getAllProvinceDistrictWard();

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error",
      EC: "-1",
      DT: "",
    });
  }
}

module.exports = {
  createFunc,
  readFunc,
  registerUser,
  getAllProvinceDistrictWard,
  updateFunc,
  deleteFunc,
  searchUser,
  getUserAccount,
  groupStoreFunc,
  groupShippingUnitFunc,
  editProfile,
  getGroupShipper,
  deleteAccount,
};

import userService from "../service/userService";

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

module.exports = {
  createFunc,
};

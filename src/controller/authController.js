import authSerrvice from "../service/authService";

const handleLogin = async (req, res) => {
  try {
    let data = await authSerrvice.handleUserLogin(req.body);
    //set cookie
    if (data && data.DT && data.DT.access_token) {
      res.cookie("jwt", data.DT.access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
    }
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error",
      EC: "-1",
      DT: "",
    });
  }
};

const handleLogout = (req, res) => {
  try {
    res.clearCookie("jwt");

    return res.status(200).json({
      EM: "Clear cookie done!",
      EC: 0,
      DT: "",
    });
  } catch (error) {
    return res.status(500).json({
      EM: "Error",
      EC: "-1",
      DT: "",
    });
  }
};

const searchHomePage = async (req, res) => {
  try {
    const keyword = req.query.q;
    const data = await authSerrvice.searchHomePage(keyword);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "Error",
      EC: "-1",
      DT: "",
    });
  }
}

module.exports = {
  handleLogin,
  handleLogout,
  searchHomePage,
};

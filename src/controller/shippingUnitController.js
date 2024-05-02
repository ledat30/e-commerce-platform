import shippingUnitService from "../service/shippingUnitService";

async function createFunc(req, res) {
  try {
    let data = await shippingUnitService.createShippingUnit(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Create ShippingUnit error",
      EC: "-1",
      DT: "",
    });
  }
}

const readFunc = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;

      let data = await shippingUnitService.getShippingUnitWithPagination(
        +page,
        +limit
      );

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await shippingUnitService.getAllShippingUnit();

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

const deleteFunc = async (req, res) => {
  try {
    let data = await shippingUnitService.deleteShippingUnit(req.body.id);
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

const searchShippingUnit = async (req, res) => {
  try {
    const keyword = req.query.q;
    const data = await shippingUnitService.searchShippingUnit(keyword);
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

const updateFunc = async (req, res) => {
  try {
    let data = await shippingUnitService.updateShippingUnit(req.body);
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

const readAllOrderByShippingUnit = async (req, res) => {
  try {
    const shipingUnitId = req.query.shipingUnitId;
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;

      let data = await shippingUnitService.readAllOrderByShippingUnit(+page, +limit, shipingUnitId);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error service",
      EC: -1,
      DT: "",
    })
  }

}

const confirmOrder = async (req, res) => {
  try {
    let data = await shippingUnitService.confirmOrder(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Create ShippingUnit error",
      EC: "-1",
      DT: "",
    });
  }
}

module.exports = {
  createFunc,
  readFunc,
  deleteFunc,
  searchShippingUnit,
  updateFunc,
  readAllOrderByShippingUnit,
  confirmOrder,
};

import attibuteValueService from "../service/attributeValueSevice";

const createFunc = async (req, res) => {
    try {
        let data = await attibuteValueService.createVariant(req.body, req.query.storeId);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Create color error",
            EC: "-1",
            DT: "",
        });
    }
}

const readFunc = async (req, res) => {
    try {
        const storeId = req.query.storeId;
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;

            let data = await attibuteValueService.getVariantWithPagination(
                +page,
                +limit,
                storeId
            );

            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        } else {
            let data = await attibuteValueService.getAllVariant();

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
}

const updateFunc = async (req, res) => {
    try {
        let data = await attibuteValueService.updateVariant(req.body, req.query.storeId);
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
        let data = await attibuteValueService.deleteVariant(req.body.id);
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

const readVariantByStore = async (req, res) => {
    try {
        const storeId = req.query.storeId;
        const attributeId = req.query.attributeId;

        let data = await attibuteValueService.readVariantByStore(storeId, attributeId);

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
}

module.exports = {
    createFunc, readFunc, updateFunc, deleteFunc, readVariantByStore
}
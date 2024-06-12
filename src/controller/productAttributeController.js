import productAttributeService from "../service/product_attributeService";

const createFunc = async (req, res) => {
    try {
        let data = await productAttributeService.createAttribute(req.body, req.query.storeId);
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

            let data = await productAttributeService.getAttributeWithPagination(
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
            let data = await productAttributeService.getAllAttributes();

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
        let data = await productAttributeService.updateAttribute(req.body, req.query.storeId);
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
        let data = await productAttributeService.deleteAttribute(req.body.id);
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

const readAttributeByStore = async (req, res) => {
    try {
        const storeId = req.query.storeId;
        const categoryId = req.query.categoryId;

        let data = await productAttributeService.readAttributeByStore(storeId, categoryId);

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
    createFunc, readFunc, updateFunc, deleteFunc, readAttributeByStore
}
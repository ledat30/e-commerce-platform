import dashboardAdminService from '../service/dashboardAdminService';

const adminDashboardSummary = async (req, res) => {
    try {
        let data = await dashboardAdminService.adminDashboardSummary();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(e);
        return res.status(500).json({
            EM: "Error from the server",
            EC: -1,
            DT: "",
        });
    }
}

const findInactiveAccounts = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;

            let data = await dashboardAdminService.findInactiveAccounts(+page, +limit);

            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        console.log(e);
        return res.status(500).json({
            EM: "Error from the server",
            EC: -1,
            DT: "",
        });
    }
}

const adminDashboardProduct = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;

            let data = await dashboardAdminService.adminDashboardProduct(+page, +limit);

            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        console.log(e);
        return res.status(500).json({
            EM: "Error from the server",
            EC: -1,
            DT: "",
        });
    }
}

const adminDashboardUser = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;

            let data = await dashboardAdminService.adminDashboardUser(+page, +limit);

            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        console.log(e);
        return res.status(500).json({
            EM: "Error from the server",
            EC: -1,
            DT: "",
        });
    }
}

const adminDashboardRevenueByStore = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;

            let data = await dashboardAdminService.adminDashboardRevenueByStore(+page, +limit);

            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        console.log(e);
        return res.status(500).json({
            EM: "Error from the server",
            EC: -1,
            DT: "",
        });
    }
}

const adminDashboardRevenueStoreByDate = async (req, res) => {
    try {
        const storeId = req.query.storeId;
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;

            let data = await dashboardAdminService.adminDashboardRevenueStoreByDate(+page, +limit, storeId);

            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        console.log(e);
        return res.status(500).json({
            EM: "Error from the server",
            EC: -1,
            DT: "",
        });
    }
}

const adminDashboardRevenueStoreDetailByDate = async (req, res) => {
    try {
        const storeId = req.query.storeId;
        const date = req.query.date;
        if (req.query.page && req.query.limit) {
            let page = req.query.page;
            let limit = req.query.limit;

            let data = await dashboardAdminService.adminDashboardRevenueStoreDetailByDate(+page, +limit, storeId, date);

            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT,
            });
        }
    } catch (error) {
        console.log(e);
        return res.status(500).json({
            EM: "Error from the server",
            EC: -1,
            DT: "",
        });
    }
}

const adminStatistical = async (req, res) => {
    try {
        let data = await dashboardAdminService.adminStatistical();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(e);
        return res.status(500).json({
            EM: "Error from the server",
            EC: -1,
            DT: "",
        });
    }
}

module.exports = {
    adminStatistical,
    adminDashboardSummary,
    adminDashboardRevenueStoreDetailByDate,
    adminDashboardRevenueStoreByDate,
    findInactiveAccounts,
    adminDashboardProduct,
    adminDashboardUser,
    adminDashboardRevenueByStore,
}
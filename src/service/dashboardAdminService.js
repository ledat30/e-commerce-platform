import db from "../models";
const { Sequelize, where } = require("sequelize");

const adminDashboardSummary = async () => {
    try {
        const totalOrders = await db.Order.count({
            where: {
                status: 'confirmed'
            }
        });

        const totalProducts = await db.Product.count();

        const totalUsers = await db.User.count();

        const totalRevenue = await db.Order.sum('total_amount', {
            include: [{
                model: db.Shipping_Unit_Order,
                required: true,
                include: [{
                    model: db.Shipping_Unit_Order_user,
                    required: true,
                    where: {
                        status: 'Delivered'
                    }
                }]
            }],
            where: {
                status: 'confirmed'
            }
        });

        const totalOrderFails = await db.Shipping_Unit_Order_user.count({
            where: {
                status: 'Order delivery failed',
            }
        });
        const totalOrderSuccess = await db.Shipping_Unit_Order_user.count({
            where: {
                status: 'Delivered',
            }
        });

        const monthlyOrders = await db.Shipping_Unit_Order.findAll({
            attributes: [
                [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), '%Y-%m'), 'month'],
                [db.sequelize.fn('count', db.sequelize.col('orderId')), 'totalOrders'],
            ],
            group: ['month'],
            order: [[db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), '%Y-%m'), 'ASC']]
        });

        const monthlyStoreOrders = await db.Order.findAll({
            attributes: [
                [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('Order.createdAt'), '%Y-%m'), 'month'],
                'storeId',
                [db.sequelize.fn('count', db.sequelize.col('Order.id')), 'totalOrders'],
                [db.sequelize.col('Store.name'), 'storeName'],
            ],
            where: {
                status: 'confirmed'
            },
            include: [{
                model: db.Store,
                attributes: []
            }],
            group: ['month', 'storeId', 'Store.name'],
            order: [
                [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('Order.createdAt'), '%Y-%m'), 'ASC'],
                ['storeId', 'ASC']
            ]
        });


        return {
            EM: "Get all success!",
            EC: 0,
            DT: {
                totalOrders: totalOrders,
                totalProducts: totalProducts,
                totalUsers: totalUsers,
                totalRevenue: totalRevenue,
                totalOrderFails: totalOrderFails,
                totalOrderSuccess: totalOrderSuccess,
                monthlyOrders: monthlyOrders,
                monthlyStoreOrders: monthlyStoreOrders
            },
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Somnething wrongs with services",
            EC: -1,
            DT: [],
        };
    }
}

const adminDashboardOrder = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.Order.findAndCountAll({
            offset: offset,
            limit: limit,
            where: {
                status: 'confirmed'
            },
            attributes: ['id', 'total_amount', 'order_date'],
            order: [['id', 'DESC']],
            include: [
                {
                    model: db.User,
                    attributes: ['username', 'id'],
                },
                {
                    model: db.Store,
                    attributes: ['id', 'name']
                },
                {
                    model: db.OrderItem,
                    attributes: ['id', 'quantily'],
                    include: [
                        {
                            model: db.ProductAttribute,
                            attributes: ['id'],
                            include: [
                                {
                                    model: db.Product,
                                    attributes: ['product_name', 'id']
                                },
                                {
                                    model: db.AttributeValue,
                                    as: 'AttributeValue1',
                                    attributes: ['id', 'name'],
                                    include: [
                                        { model: db.Attribute, attributes: ['id', 'name'] }
                                    ]
                                },
                                {
                                    model: db.AttributeValue,
                                    as: 'AttributeValue2',
                                    attributes: ['id', 'name'],
                                    include: [
                                        { model: db.Attribute, attributes: ['id', 'name'] }
                                    ]
                                }
                            ],
                        }
                    ]
                }
            ]
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalPages: totalPages,
            totalRow: count,
            orders: rows,
        }
        return {
            EM: 'OK',
            EC: 0,
            DT: data,
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Somnething wrongs with services",
            EC: -1,
            DT: [],
        };
    }
}

const adminDashboardProduct = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.Product.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ['id', 'product_name', 'price', 'view_count', 'promotion'],
            order: [['id', 'DESC']],
            include: [
                {
                    model: db.Store,
                    attributes: ['name', 'id']
                }
            ]
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalPages: totalPages,
            totalRow: count,
            products: rows,
        }
        return {
            EM: 'OK',
            EC: 0,
            DT: data,
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Somnething wrongs with services",
            EC: -1,
            DT: [],
        };
    }
}

const adminDashboardUser = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.User.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ['id', 'username', 'email', 'phonenumber'],
            order: [['id', 'DESC']],
            include: [
                {
                    model: db.Group,
                    attributes: ['name', 'id']
                },
                { model: db.Province, attributes: ['id', 'province_name'] },
                { model: db.District, attributes: ['id', 'district_name'] },
                { model: db.Ward, attributes: ['id', 'ward_name'] },
            ]
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalPages: totalPages,
            totalRow: count,
            users: rows,
        }
        return {
            EM: 'OK',
            EC: 0,
            DT: data,
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Somnething wrongs with services",
            EC: -1,
            DT: [],
        };
    }
}

const adminDashboardRevenueByStore = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;

        const stores = await db.Store.findAll({
            include: [
                {
                    model: db.Order,
                    required: true,
                    include: [
                        {
                            model: db.Shipping_Unit_Order,
                            required: true,
                            include: [{
                                model: db.Shipping_Unit_Order_user,
                                required: true,
                                where: {
                                    status: 'Delivered'
                                }
                            }]
                        }
                    ]
                }],
            offset: offset,
            limit: limit,
            attributes: [
                'id',
                'name',
                [db.Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM Orders AS o
                    JOIN Shipping_Unit_Orders AS suo ON suo.orderId = o.id
                    JOIN Shipping_Unit_Order_users AS suou ON suou.shipping_unit_orderId = suo.id
                    WHERE
                        o.storeId = Store.id AND
                        o.status = 'confirmed' AND
                        suou.status = 'Delivered'
                )`), 'confirmedOrdersCount'],
                [db.Sequelize.literal(`(
                    SELECT SUM(o.total_amount)
                    FROM Orders AS o
                    JOIN Shipping_Unit_Orders AS suo ON suo.orderId = o.id
                    JOIN Shipping_Unit_Order_users AS suou ON suou.shipping_unit_orderId = suo.id
                    WHERE
                        o.storeId = Store.id AND
                        o.status = 'confirmed' AND
                        suou.status = 'Delivered'
                )`), 'totalAmount']
            ],
            order: [['id', 'DESC']]
        });

        const totalStores = await db.Store.count();

        let totalPages = Math.ceil(totalStores / limit);

        let data = {
            totalPages: totalPages,
            totalRow: totalStores,
            orders: stores,
        };

        return {
            EM: 'OK',
            EC: 0,
            DT: data,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Something went wrong with services",
            EC: -1,
            DT: [],
        };
    }
};


const adminDashboardRevenueStoreByDate = async (page, limit, storeId) => {
    try {
        let offset = (page - 1) * limit;
        const dailyRevenue = await db.Order.findAll({
            include: [{
                model: db.Shipping_Unit_Order,
                required: true,
                include: [{
                    model: db.Shipping_Unit_Order_user,
                    required: true,
                    where: {
                        status: 'Delivered'
                    }
                }]
            }],
            where: {
                storeId: storeId,
                status: 'confirmed'
            },
            attributes: [
                [db.Sequelize.fn('DATE', db.Sequelize.col('order_date')), 'order_date'],
                [db.Sequelize.fn('SUM', db.Sequelize.col('total_amount')), 'total_revenue'],
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'order_count']
            ],
            group: [Sequelize.fn('DATE', Sequelize.col('order_date'))],
            order: [[Sequelize.fn('DATE', Sequelize.col('order_date')), 'DESC']],
            limit: limit,
            offset: offset,
        });
        const countResult = await db.Order.findAll({
            where: {
                storeId: storeId,
                status: 'confirmed'
            },
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.fn('DATE', Sequelize.col('order_date'))), 'distinct_dates']
            ],
        });
        const totalDistinctDates = countResult.length;
        const totalPages = Math.ceil(totalDistinctDates / limit);
        let data = {
            totalPages: totalPages,
            totalRow: totalDistinctDates,
            dailyRevenue: dailyRevenue,
        };
        return {
            EM: 'OK',
            EC: 0,
            DT: data,
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Somnething wrongs with services",
            EC: -1,
            DT: [],
        };
    }
}

const adminDashboardRevenueStoreDetailByDate = async (page, limit, storeId, date) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.Order.findAndCountAll({
            offset: offset,
            limit: limit,
            where: {
                storeId: storeId,
                status: 'confirmed',
                order_date: {
                    [db.Sequelize.Op.between]: [
                        `${date} 00:00:00`,
                        `${date} 23:59:59`
                    ]
                },
            },
            attributes: ['total_amount', 'id'],
            order: [['id', 'DESC']],
            include: [
                {
                    model: db.Shipping_Unit_Order,
                    required: true,
                    include: [{
                        model: db.Shipping_Unit_Order_user,
                        required: true,
                        where: {
                            status: 'Delivered'
                        }
                    }]
                },
                {
                    model: db.User,
                    attributes: ['username', 'id']
                },
                {
                    model: db.OrderItem,
                    attributes: ['quantily', 'id'],
                    include: [
                        {
                            model: db.ProductAttribute,
                            attributes: ['id'],
                            include: [
                                {
                                    model: db.Product,
                                    attributes: ['product_name', 'id']
                                },
                                {
                                    model: db.AttributeValue,
                                    as: 'AttributeValue1',
                                    attributes: ['id', 'name'],
                                    include: [
                                        { model: db.Attribute, attributes: ['id', 'name'] }
                                    ]
                                },
                                {
                                    model: db.AttributeValue,
                                    as: 'AttributeValue2',
                                    attributes: ['id', 'name'],
                                    include: [
                                        { model: db.Attribute, attributes: ['id', 'name'] }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalPages: totalPages,
            totalRow: count,
            orders: rows,
        }
        return {
            EM: 'OK',
            EC: 0,
            DT: data,
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Somnething wrongs with services",
            EC: -1,
            DT: [],
        };
    }
}

module.exports = {
    adminDashboardSummary,
    adminDashboardRevenueByStore,
    adminDashboardRevenueStoreDetailByDate,
    adminDashboardOrder,
    adminDashboardRevenueStoreByDate,
    adminDashboardProduct,
    adminDashboardUser,
}
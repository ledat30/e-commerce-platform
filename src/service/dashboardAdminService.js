import db from "../models";
const { Sequelize, Op } = require("sequelize");
const moment = require('moment');

const adminDashboardSummary = async () => {
    try {
        const DaysAgo = moment().subtract(2, 'days').toDate();
        const warningUsersCount = await db.User.count({
            where: {
                isDelete: null,
                groupId: 4,
                id: {
                    [Op.notIn]: db.sequelize.literal(`(
                        SELECT DISTINCT userId 
                        FROM Orders 
                        WHERE createdAt >= '${DaysAgo.toISOString()}'
                    )`)
                }
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

        const monthlyRevenueAdmin = await db.Order.findAll({
            attributes: [
                [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('Order.createdAt'), '%Y-%m'), 'month'],
                [db.sequelize.fn('sum', db.sequelize.col('Order.total_amount')), 'totalRevenue'],
                [db.sequelize.literal('sum(`Order`.`total_amount`) * 0.10'), 'adminRevenue']
            ],
            where: {
                status: 'confirmed'
            },
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
            group: [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('Order.createdAt'), '%Y-%m')],
            order: [[db.sequelize.fn('DATE_FORMAT', db.sequelize.col('createdAt'), '%Y-%m'), 'ASC']]
        });

        return {
            EM: "Get all success!",
            EC: 0,
            DT: {
                warningUsersCount: warningUsersCount,
                totalProducts: totalProducts,
                totalUsers: totalUsers,
                totalRevenue: totalRevenue,
                totalOrderFails: totalOrderFails,
                totalOrderSuccess: totalOrderSuccess,
                monthlyOrders: monthlyOrders,
                monthlyRevenueAdmin: monthlyRevenueAdmin,
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

const findInactiveAccounts = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const DaysAgo = moment().subtract(2, 'days').toDate();

        const { count, rows } = await db.User.findAndCountAll({
            where: {
                isDelete: null,
                groupId: 4,
                id: {
                    [Op.notIn]: Sequelize.literal(`(
                        SELECT DISTINCT \`userId\`
                        FROM \`Orders\`
                        WHERE \`createdAt\` >= '${DaysAgo.toISOString()}'
                    )`),
                },
            },
            attributes: [
                'id',
                'username',
                'email',
                'phonenumber',
                [
                    Sequelize.literal(`(
                        SELECT MAX(\`createdAt\`)
                        FROM \`Orders\`
                        WHERE \`Orders\`.\`userId\` = \`User\`.\`id\`
                    )`),
                    'lastOrderDate'
                ],
            ],
            offset: offset,
            limit: limit,
            order: [[Sequelize.literal('lastOrderDate IS NULL, lastOrderDate'), 'ASC']],
        });

        const users = rows.map(user => {
            const lastOrderDate = user.getDataValue('lastOrderDate');
            const inactiveDays = lastOrderDate
                ? Math.floor((new Date() - new Date(lastOrderDate)) / (1000 * 60 * 60 * 24))
                : null;
            return {
                ...user.toJSON(),
                inactiveDays,
            };
        });

        users.sort((a, b) => b.inactiveDays - a.inactiveDays);

        let totalPages = Math.ceil(count / limit);
        let data = {
            totalPages: totalPages,
            totalRow: count,
            users: users,
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
                )`), 'totalAmount'],
                [db.Sequelize.literal(`(
                    SELECT SUM(o.total_amount) * 0.10
                    FROM Orders AS o
                    JOIN Shipping_Unit_Orders AS suo ON suo.orderId = o.id
                    JOIN Shipping_Unit_Order_users AS suou ON suou.shipping_unit_orderId = suo.id
                    WHERE
                        o.storeId = Store.id AND
                        o.status = 'confirmed' AND
                        suou.status = 'Delivered'
                )`), 'adminProfit']
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

const adminStatistical = async () => {
    try {
        const topStores = await db.Inventory.findAll({
            attributes: ['storeId', [db.sequelize.fn('SUM', db.sequelize.col('quantity_sold')), 'total_quantity_sold']],
            group: ['storeId'],
            order: [[db.sequelize.fn('SUM', db.sequelize.col('quantity_sold')), 'DESC']],
            limit: 10
        });
        let topSellerProducts = [];
        for (let store of topStores) {
            let storeId = store.storeId;
            let topProducts = await db.Inventory.findAll({
                where: { storeId: storeId },
                attributes: ['quantity_sold'],
                order: [['quantity_sold', 'DESC']],
                include: [
                    {
                        model: db.ProductAttribute, attributes: ['id'],
                        include: [
                            {
                                model: db.Product,
                                attributes: ['product_name']
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
                    },
                    { model: db.Store, attributes: ['id', 'name'] }
                ],
                limit: 30,
            });
            topSellerProducts.push({
                storeId: storeId,
                products: topProducts
            });
        };

        const topRevenueStores = await db.Order.findAll({
            attributes: [
                'storeId',
                [db.sequelize.fn('SUM', db.sequelize.col('total_amount')), 'totalRevenue']
            ],
            where: {
                status: 'confirmed'
            },
            include: [{
                model: db.Shipping_Unit_Order,
                attributes: [],
                required: true,
                include: [{
                    model: db.Shipping_Unit_Order_user,
                    attributes: [],
                    required: true,
                    where: {
                        status: 'Delivered'
                    }
                }]
            },
            { model: db.Store, attributes: ['id', 'name'] }
            ],
            group: ['storeId'],
            order: [[db.sequelize.literal('totalRevenue'), 'DESC']],
            limit: 10
        });

        const listStoreNew = await db.Store.findAll({
            attributes: ['id', 'name', 'createdAt'],
            order: [['id', 'DESC']],
            limit: 10,
        });
        const formattedListStoreNew = listStoreNew.map(store => ({
            name: store.name,
            id: store.id,
            createdAt: store.createdAt.toISOString().split('T')[0],
        }));

        const topCategoryUseByStore = await db.Product.findAll({
            attributes: [
                'categoryId',
                [db.Sequelize.fn('COUNT', db.Sequelize.col('categoryId')), 'totalProducts']
            ],
            group: ['categoryId'],
            order: [[db.Sequelize.fn('COUNT', db.Sequelize.col('categoryId')), 'DESC']],
            include: [
                {
                    model: db.Category,
                    attributes: ['category_name']
                }
            ],
            limit: 10,
        });
        const formattedTopCategoryUseByStore = topCategoryUseByStore.map(category => ({
            categoryId: category.categoryId,
            totalProducts: category.dataValues.totalProducts,
            categoryName: category.Category.category_name
        }));

        return {
            EM: "Get all success!",
            EC: 0,
            DT: {
                topSellerProducts: topSellerProducts,
                topRevenueStores: topRevenueStores,
                listStoreNew: formattedListStoreNew,
                TopCategoryUseByStore: formattedTopCategoryUseByStore,
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

module.exports = {
    adminStatistical,
    adminDashboardSummary,
    adminDashboardRevenueByStore,
    adminDashboardRevenueStoreDetailByDate,
    findInactiveAccounts,
    adminDashboardRevenueStoreByDate,
    adminDashboardProduct,
    adminDashboardUser,
}
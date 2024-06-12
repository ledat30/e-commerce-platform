import db from "../models/index";

const checkNameAttribute = async (nameAttribute, storeId) => {
    try {
        let attribute = await db.Attribute.findOne({
            where: { name: nameAttribute, storeId: storeId },
        });
        if (attribute) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
    }
};

const createAttribute = async (data, storeId) => {
    try {
        let check = await checkNameAttribute(data.name, storeId);
        if (check === true) {
            return {
                EM: "The attibute name is already exists",
                EC: 1,
                DT: "name",
            };
        }
        await db.Attribute.create({
            storeId: storeId,
            name: data.name,
            categoryId: data.categoryId
        });
        return {
            EM: "Create attribute successful",
            EC: 0,
            DT: [],
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Something wrongs with services",
            EC: -1,
            DT: [],
        };
    }
}

const getAllAttributes = async () => {
    try {
        let attibute = await db.Attribute.findAll();
        if (attibute) {
            return {
                EM: "Get all attibute success!",
                EC: 0,
                DT: attibute,
            };
        } else {
            return {
                EM: "Get all attibutes error!",
                EC: 0,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Somnething wrongs with services",
            EC: -1,
            DT: [],
        };
    }
};

const getAttributeWithPagination = async (page, limit, storeId) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.Attribute.findAndCountAll({
            offset: offset,
            limit: limit,
            where: { storeId: storeId },
            include: [
                { model: db.Store, attributes: ["name", "id"] },
                { model: db.Category, attribute: ['category_name'] }
            ],
            attributes: ["id", "name"],
            order: [["id", "DESC"]],
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalPages: totalPages,
            totalRow: count,
            colors: rows,
        };
        return {
            EM: "Get all colors success!",
            EC: 0,
            DT: data,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "Somnething wrongs with services",
            EC: -1,
            DT: [],
        };
    }
};

const updateAttribute = async (data, storeId) => {
    try {
        let check = await checkNameAttribute(data.name, storeId);
        if (check === true || !data.name) {
            return {
                EM: "Please enter correct information",
                EC: 1,
                DT: "name",
            };
        }
        let attibute = await db.Attribute.findOne({
            where: { id: data.id },
        });
        if (attibute) {
            await attibute.update({
                name: data.name,
            });
            return {
                EM: "Update attibute success",
                EC: 0,
                DT: "",
            };
        } else {
            return {
                EM: "Attribute not found",
                EC: 2,
                DT: "",
            };
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

const deleteAttribute = async (id) => {
    try {
        let attibute = await db.Attribute.findOne({
            where: { id: id },
        });
        if (attibute) {
            await attibute.destroy();
            return {
                EM: "Delete attibute successfully",
                EC: 0,
                DT: [],
            };
        } else {
            return {
                EM: "Attibute not exist",
                EC: 2,
                DT: [],
            };
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Error from server",
            EC: 1,
            DT: [],
        };
    }
}

const readAttributeByStore = async (storeId, categoryId) => {
    try {
        let attibute = await db.Attribute.findAll({
            where: { storeId: storeId, categoryId: categoryId },
            include: [
                { model: db.Category, attribute: ['category_name'] }
            ]
        },
        );
        if (attibute) {
            return {
                EM: "Get all attibute success!",
                EC: 0,
                DT: attibute,
            };
        } else {
            return {
                EM: "Get all attibute error!",
                EC: 0,
                DT: [],
            };
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
    createAttribute, getAllAttributes, getAttributeWithPagination, updateAttribute, deleteAttribute, readAttributeByStore,
}
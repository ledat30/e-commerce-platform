import db from "../models/index";

const checkNameVariant = async (nameVariant) => {
    try {
        let attribute = await db.AttributeValue.findOne({
            where: { name: nameVariant },
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

const createVariant = async (data, storeId) => {
    try {
        let check = await checkNameVariant(data.name);
        if (check === true) {
            return {
                EM: "The variant name is already exists",
                EC: 1,
                DT: "name",
            };
        }
        await db.AttributeValue.create({
            name: data.name,
            attributeId: data.attributeId,
            storeId: storeId,
        });
        return {
            EM: "Create variant successful",
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

const getAllVariant = async () => {
    try {
        let variant = await db.AttributeValue.findAll();
        if (variant) {
            return {
                EM: "Get all variant success!",
                EC: 0,
                DT: variant,
            };
        } else {
            return {
                EM: "Get all variant error!",
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

const getVariantWithPagination = async (page, limit, storeId) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.AttributeValue.findAndCountAll({
            offset: offset,
            limit: limit,
            where: { storeId: storeId },
            include: [
                { model: db.Attribute, attributes: ["name", "id"] },
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
}

const updateVariant = async (data, storeId) => {
    try {
        let check = await checkNameVariant(data.name, storeId);
        if (check === true || !data.name) {
            return {
                EM: "Please enter correct information",
                EC: 1,
                DT: "name",
            };
        }
        let variant = await db.AttributeValue.findOne({
            where: { id: data.id },
        });
        if (variant) {
            await variant.update({
                name: data.name,
            });
            return {
                EM: "Update variant success",
                EC: 0,
                DT: "",
            };
        } else {
            return {
                EM: "Variant not found",
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

const deleteVariant = async (id) => {
    try {
        let variant = await db.AttributeValue.findOne({
            where: { id: id },
        });
        if (variant) {
            await variant.destroy();
            return {
                EM: "Delete variant successfully",
                EC: 0,
                DT: [],
            };
        } else {
            return {
                EM: "Variant not exist",
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

const readVariantByStore = async (storeId, attributeId) => {
    try {
        let variant = await db.AttributeValue.findAll({
            where: { storeId: storeId, attributeId: attributeId }
        });
        if (variant) {
            return {
                EM: "Get all variant success!",
                EC: 0,
                DT: variant,
            };
        } else {
            return {
                EM: "Get all variant error!",
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
    createVariant, getAllVariant, getVariantWithPagination, updateVariant, deleteVariant, readVariantByStore
}
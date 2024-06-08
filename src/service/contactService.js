import db from "../models";

const createContact = async (username, email, message) => {
    try {
        await db.Contact.create({ username, email, message });
        return {
            EM: "Create contact successful",
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

const getContactWithPagination = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.Contact.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ["id", "username", 'email', 'message'],
            order: [["id", "DESC"]],
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalPages: totalPages,
            totalRow: count,
            contacts: rows,
        };
        return {
            EM: "Ok",
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

const deleteContact = async (id) => {
    try {
        let contact = await db.Contact.findOne({
            where: { id: id },
        });
        if (contact) {
            await contact.destroy();
            return {
                EM: "Delete contact successfully",
                EC: 0,
                DT: [],
            };
        } else {
            return {
                EM: "Contact not exist",
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

module.exports = { createContact, getContactWithPagination, deleteContact }
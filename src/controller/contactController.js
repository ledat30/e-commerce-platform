import contactService from '../service/contactService';

const createFunc = async (req, res) => {
    try {
        const { username, email, message } = req.body;
        let data = await contactService.createContact(username, email, message);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            EM: "Create contact error",
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

            let data = await contactService.getContactWithPagination(+page, +limit);

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

const deleteFunc = async (req, res) => {
    try {
        let data = await contactService.deleteContact(req.body.id);
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

module.exports = {
    createFunc, readFunc, deleteFunc
}

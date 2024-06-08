import axios from "../setup/axios";

const getAllContacts = (page, limit) => {
    return axios.get(`/api/contact/read?page=${page}&limit=${limit}`);
};

const deleteContact = (contact) => {
    return axios.delete(`/api/contact/delete`, {
        data: { id: contact.id },
    });
};

const createContact = (data) => {
    return axios.post(`/api/contact/create`, data);
};

export {
    getAllContacts, deleteContact, createContact,
}
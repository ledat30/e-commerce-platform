import axios from "../setup/axios";

const createAttributeProduct = (data, storeId) => {
    return axios.post(`/api/attribute/create?storeId=${storeId}`, { ...data });
};

const getAllAttributeProduct = (page, limit, storeId) => {
    return axios.get(
        `/api/attribute/read?page=${page}&limit=${limit}&storeId=${storeId}`
    );
};

const getAllAttributes = () => {
    return axios.get(`/api/attribute/read`);
}

const updateAttributeProduct = (data, storeId) => {
    return axios.put(`/api/attribute/update?storeId=${storeId}`, { ...data });
};

const deleteAttribute = (attribute) => {
    return axios.delete(`/api/attribute/delete`, {
        data: { id: attribute.id },
    });
};

const createVariantProduct = (data, storeId) => {
    return axios.post(`/api/variant/create?storeId=${storeId}`, { ...data });
};

const getAllVariantProduct = (page, limit, storeId) => {
    return axios.get(
        `/api/variant/read?page=${page}&limit=${limit}&storeId=${storeId}`
    );
};

const updateVariantProduct = (data, storeId) => {
    return axios.put(`/api/variant/update?storeId=${storeId}`, { ...data });
};

const deleteVariant = (variant) => {
    return axios.delete(`/api/variant/delete`, {
        data: { id: variant.id },
    });
};

const readAttributeByStore = (storeId, categoryId) => {
    return axios.get(`/api/attribute/readByStore?storeId=${storeId}&categoryId=${categoryId}`);
}

const readVariantByStore = (storeId, attributeId) => {
    return axios.get(`/api/variant/readByStore?storeId=${storeId}&attributeId=${attributeId}`);
}

const getAllProvinceDistrictWard = () => {
    return axios.get(`/api/user/getAllProvinceDistrictWard`);
}

export {
    createAttributeProduct, getAllAttributeProduct, getAllAttributes, updateAttributeProduct, deleteAttribute, createVariantProduct, getAllVariantProduct, updateVariantProduct, deleteVariant, readAttributeByStore, readVariantByStore, getAllProvinceDistrictWard
}
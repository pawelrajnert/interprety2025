import api from "../../api.js";

export const getItems = async function () {
    return (await api.get("/products")).data;
}

export const getCategories = async function () {
    return (await api.get("/categories")).data;
}
// name, description, unit_price, unit_weight, category_id
export const editProduct = async function (productId, body) {
    return (await api.put(`/products/${productId}`, body));
}
export const getDescription = async function (productId) {
    return (await api.get(`/products/${productId}/description`)).data;
}

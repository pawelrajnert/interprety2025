import api from "../../api.js";

export const createOrder = async function(body){
    return await api.post("/orders", body);
}

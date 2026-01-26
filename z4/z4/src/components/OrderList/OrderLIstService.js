import api from "../../api.js";

export const getOrders = async function(){
    return (await api.get("/orders")).data;
}
export const confirmOrder = async function(orderId){
    return await api.patch(`/orders/${orderId}`, {"status_id": 2});
}
export const cancelOrder = async function(orderId){
    return await api.patch(`/orders/${orderId}`, {"status_id": 3});
}
export const finishOrder = async function(orderId){
    return await api.patch(`/orders/${orderId}`, {"status_id": 4});
}
export const getStatuses = async function(){
    return (await api.get("/status")).data
}

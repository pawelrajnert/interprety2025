import api from "../../api.js";

export const initDb = async function(body){
    return await api.post("/init", body);
}

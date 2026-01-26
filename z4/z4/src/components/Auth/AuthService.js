import api from "../../api.js";

export const postLogin = async function(body){
    return (await api.post("/login", body)).data;
}

export const postSignUp = async function(body){
    return (await api.post("/register", body)).data;
}

export const getPassword = async function(){
    return (await api.get("/password")).data;
}
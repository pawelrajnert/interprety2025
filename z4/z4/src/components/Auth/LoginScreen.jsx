import {useEffect, useState} from "react";
import {postLogin} from "./AuthService.js";

function LoginScreen() {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        let body = {"username":login, "password":password}
        let res = await postLogin(body);
        localStorage.setItem("token", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);
        window.location.href = "/";
    };

    return (
        <div className={"d-flex justify-content-center align-items-center vh-100 bg-light"}>
            <div className="card shadow p-4" style={{width: "100%", maxWidth: "400px"}}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Login</label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Enter username"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            className="form-control"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mt-3">
                        Sign In
                    </button>
                </form>
            </div>


        </div>
    );
}

export default LoginScreen;
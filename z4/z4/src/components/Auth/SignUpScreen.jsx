import {useState} from "react";
import {getPassword, postLogin, postSignUp} from "./AuthService.js";


function SignUpScreen(){

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [proposedPassword, setProposedPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        let body = {"username":login, "email": email, "password":password, "role": "KLIENT", "phone_number": phone};
        let res = await postSignUp(body);
    };

    async function handleGivePassword() {
        const newPassword = await getPassword();
        setProposedPassword(newPassword.password);
        console.log(proposedPassword)
    }

    return (
        <div className={"d-flex justify-content-center align-items-center vh-100 bg-light"}>
            <div className="card shadow p-4" style={{width: "100%", maxWidth: "400px"}}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Login</label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Wpisz login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            className="form-control"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Numer telefonu</label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Numer telefonu"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Hasło</label>
                        <input
                            className="form-control"
                            type="password"
                            placeholder="Wpisz hasło"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type={"button"} onClick={handleGivePassword} className="btn btn-secondary w-100 mt-3">Zaproponuj silne hasło</button>
                    <p>{proposedPassword}</p>
                    <button type="submit" className="btn btn-primary w-100 mt-3">
                        Sign In
                    </button>
                </form>
            </div>


        </div>
    )
}

export default SignUpScreen;
import {BrowserRouter as Router, Routes, Route, Link, Navigate} from 'react-router-dom';
// import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import ProductList from "./components/ProductList/ProductList.jsx";
import Cart from "./components/Cart/Cart.jsx";
import OrderList from "./components/OrderList/OrdersList.jsx";
import EditProduct from "./components/ProductList/EditProduct.jsx";
import LoginScreen from "./components/Auth/LoginScreen.jsx";
import SignUpScreen from "./components/Auth/SignUpScreen.jsx";
import {useAuth} from "./components/Auth/AuthContext.jsx";
import InitDb from "./components/EmployeePanel/InitDb.jsx";


function App() {
    const {user, logout} = useAuth();

    return (
        <Router>
            <div>
                <header>
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
                        <div className={"container"}>
                            <Link className="navbar-brand" to={"/"}>Shop</Link>
                            {/*<Link to={"/cart"}>Cart</Link>*/}
                            {/*<Link to={"/order"}>Orders</Link>*/}
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav ms-auto"> {/* ms-auto pushes links to the right */}
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/">Shop</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/cart">Cart</Link>
                                    </li>
                                    {user?.role === "PRACOWNIK" &&
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/order">Orders</Link>
                                        </li>
                                    }
                                    {user &&
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/signIn" onClick={logout}>Logout</Link>
                                        </li>
                                    }
                                    {!user &&
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/signIn">Sign In</Link>
                                        </li>
                                    }
                                    {user?.role === "PRACOWNIK" &&
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/panel">Panel</Link>
                                        </li>
                                    }
                                </ul>
                            </div>
                        </div>
                    </nav>
                </header>
                <Routes>
                    <Route path="/" element={<ProductList/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/order" element={<OrderList/>}/>
                    <Route path="/edit/:id" element={<EditProduct/>}/>
                    <Route path="/signIn" element={<LoginScreen/>}/>
                    <Route path="/signUp" element={<SignUpScreen/>}/>
                    <Route path="/panel" element={<InitDb/>}/>

                </Routes>
            </div>
        </Router>
    )
}

export default App

import {useEffect, useRef, useState} from "react";
import CartItem from "./CartItem.jsx";
import {createOrder} from "./CartService.js";
import * as yup from "yup";

function Cart() {

    const [cart, setCart] = useState([]);

    const itemsRef = useRef([]);

    const [errorMessage, setErrorMessage] = useState("");
    const [price, setPrice] = useState(0);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(data);
    }, []);

    const orderSchema = yup.array().of(
        yup.object({
            product_id: yup.string().required(),
            quantity: yup.number()
                .typeError("Quantity must be a number")
                .min(1, "Quantity cannot be less than 1")
                .required()
        })
    );

    function removeItem(id) {
        const cartCopy = JSON.parse(localStorage.getItem("cart"));

        const newCart = cartCopy.filter((item) => item.id !== id);
        localStorage.setItem("cart", JSON.stringify(newCart));
        setCart(newCart);
    }

    async function handleMakeOrder() {
        setErrorMessage("");
        const rawOrderItems = cart.map((item, index) => ({
            product_id: item.id,
            quantity: itemsRef.current[index].value
        }));

        try {
            const validatedData = await orderSchema.validate(rawOrderItems, {abortEarly: false});
            await createOrder(validatedData);
            setCart([]);
            localStorage.removeItem("cart")
        } catch (err) {
            setErrorMessage(err.errors[0]);
        }
    }

    function handleCalculatePrice() {
        let calc = 0;
        for (let i = 0; i < itemsRef.current.length; i++) {
            calc += itemsRef.current[i].value * cart[i].unit_price;
        }
        setPrice(calc);
    }

    // return (
    //     <div>
    //         <div>
    //             {errorMessage}
    //         </div>
    //         {cart.map((item, index) => (
    //             <div key={item.id || index}>
    //                 <CartItem {...item} onCartChange={removeItem}></CartItem>
    //                 <input
    //                     type="number"
    //                     min={1}
    //                     value={item.quantity}
    //                     defaultValue={1}
    //                     ref={(el) => itemsRef.current[index] = el}
    //                     onChange={handleCalculatePrice}
    //                 />
    //             </div>
    //         ))}
    //         <p>Łączna cena: {price}</p>
    //         {/*<form>*/}
    //         {/*    <label>Adres</label>*/}
    //             {/*<input type="text"/>*/}
    //         {/*</form>*/}
    //         <button onClick={handleMakeOrder}>Złóż zamówienie</button>
    //     </div>
    //
    // );

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Koszyk</h2>

            {errorMessage && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {errorMessage}
                </div>
            )}

            <div className="row">
                <div className="col-md-8">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body p-0">

                            {cart.length === 0 && (
                                <div className="p-4 text-center text-muted">
                                    Koszyk jest pusty.
                                </div>
                            )}

                            {cart.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className="row g-0 align-items-center border-bottom p-3"
                                >
                                    <div className="col-md-7 mb-2 mb-md-0">
                                        <CartItem {...item} onCartChange={removeItem}/>
                                    </div>

                                    <div className="col-md-5 d-flex align-items-center justify-content-md-end gap-3">
                                        <label className="text-muted small">Qty:</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            style={{width: "80px"}}
                                            min={1}
                                            value={item.quantity}
                                            ref={(el) => itemsRef.current[index] = el}
                                            onChange={(e) => handleCalculatePrice(index, e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-white">
                            <h5 className="mb-0">Detale zamówienia</h5>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Adress</label>
                                    <input type="text" className="form-control" placeholder="Miasto, kraj..."/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="text" className="form-control" placeholder="abc@email.com"/>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Phone</label>
                                    <input type="text" className="form-control" placeholder="+12 345 678 910"/>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 bg-light">
                        <div className="card-body">
                            <h5 className="card-title fw-bold mb-3">Podsumowanie</h5>

                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Ilość produktów:</span>
                                <span>{cart.length}</span>
                            </div>

                            <hr/>

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span className="h5 mb-0">Razem:</span>
                                <span className="h4 mb-0 text-primary fw-bold">
                                    ${price}
                                </span>
                            </div>

                            <button
                                onClick={handleMakeOrder}
                                className="btn btn-primary w-100 btn-lg shadow-sm"
                                disabled={cart.length === 0}
                            >
                                Złóż zamówienie
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
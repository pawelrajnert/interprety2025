import {useState} from "react";
import {useNavigate} from "react-router-dom";

function ProductListItem(props) {

    const navigate = useNavigate();

    function handleAddToCart() {

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (!cart.find(item => item.id === props.id)){
            cart.push(props);
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }

    function handleEditProduct() {
        navigate(`/edit/${props.id}`, {state:props})
    }

    // return (
    //     <div>
    //         <p> {props.name} </p>
    //         <p> {props.description} </p>
    //         <p> {props.unit_price} </p>
    //         <button onClick={handleAddToCart}>dodaj do koszyka</button>
    //         <button onClick={handleEditProduct}>edytuj</button>
    //     </div>
    // );
    return (
        <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold">{props.name}</h5>
                    <span className="badge bg-primary rounded-pill">
                        ${props.unit_price}
                    </span>
                </div>

                <p className="card-text text-muted flex-grow-1">
                    {props.description}
                </p>

                <hr className="my-3"/>

                <div className="d-grid gap-2 d-md-flex">
                    <button
                        className="btn btn-success flex-grow-1"
                        onClick={handleAddToCart}
                    >
                        Dodaj do koszyka
                    </button>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={handleEditProduct}
                    >
                        Edytuj
                    </button>
                </div>

            </div>
        </div>
    );
}

export default ProductListItem;
import {useEffect, useState} from "react";

function CartItem(props) {

    return (
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center w-100">
            <div className="mb-2 mb-sm-0">
                <h6 className="mb-0 fw-bold">{props.name}</h6>
            </div>
            <div className="d-flex align-items-center gap-3">
                <span className="fw-bold text-primary fs-5">
                    ${props.unit_price}
                </span>

                <button
                    onClick={() => props.onCartChange(props.id)}
                    className="btn btn-outline-danger btn-sm"
                    title="Remove item"
                >
                    Usuń
                </button>
            </div>
        </div>
    )
}

export default CartItem;
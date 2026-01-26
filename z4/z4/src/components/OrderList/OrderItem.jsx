import {useEffect, useState} from "react";
import {cancelOrder, confirmOrder, finishOrder} from "./OrderLIstService.js";

function OrderItem(props) {
    async function handleConfirm() {
        await confirmOrder(props.id);
        props.onStatusChange();
    }

    async function handleCancel() {
        await cancelOrder(props.id);
        props.onStatusChange();
    }

    async function handleFinish() {
        await finishOrder(props.id);
        props.onStatusChange();
    }

    const getStatusBadge = (statusId, statusName) => {
        let badgeClass = "bg-secondary"; // Default (Gray)

        if (statusId === 1) badgeClass = "bg-warning text-dark"; // Pending (Yellow)
        else if (statusId === 2) badgeClass = "bg-primary";      // In Progress (Blue)
        else if (statusId === 3) badgeClass = "bg-danger";       // Cancelled (Red)
        else if (statusId === 4) badgeClass = "bg-success";      // Finished (Green)

        return <span className={`badge ${badgeClass} fs-6`}>{statusName}</span>;
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-3">
                <div>
                    <h5 className="fw-bold mb-1">Zamówienie #{props.id}</h5>
                    <small className="text-muted">
                        Data potwierdzenia: {props.confirmation_date || "N/A"}
                    </small>
                </div>
                <div>
                    {getStatusBadge(props.status_id, props.status_name)}
                </div>
            </div>

            <div className="mb-3">
                <h6 className="text-muted small text-uppercase fw-bold mb-2">Zamówione produkty</h6>
                <ul className="list-group list-group-flush">
                    {props.items.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center px-0">
                            <span>{item.product_name}</span>

                             <span className="badge bg-light text-dark border">x{item.quantity}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                {props.status_id === 1 && (
                    <>
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleCancel}
                        >
                            Anuluj
                        </button>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handleConfirm}
                        >
                            Zrealizuj
                        </button>
                    </>
                )}

                {props.status_id === 2 && (
                    <button
                        className="btn btn-success btn-sm"
                        onClick={handleFinish}
                    >
                        Zakończ
                    </button>
                )}
            </div>
        </div>
    );
}

export default OrderItem;
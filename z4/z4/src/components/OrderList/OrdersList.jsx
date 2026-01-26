import {useEffect, useState} from "react";
import {getOrders} from "./OrderLIstService.js";
import OrderItem from "./OrderItem.jsx";
import SelectStatus from "./SelectStatus.jsx";

function OrderList() {

    const [selectedStatusId, setSelectedStatusId] = useState("")
    const [orders, setOrders] = useState([]);

    const fetchData = async function () {
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
    }

    const filteredOrders = selectedStatusId ? orders.filter((item) => item.status_id === parseInt(selectedStatusId)) : orders;

    useEffect(() => {
        fetchData();
    }, []);

    // return (<div>
    //         <SelectStatus
    //             value={selectedStatusId}
    //             onChange={(e) => setSelectedStatusId(e.target.value)}
    //         />
    //         {filteredOrders.map((order, index) => <div key={index}>
    //             <OrderItem {...order} onStatusChange={fetchData}></OrderItem>
    //         </div>)}
    //     </div>);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Zamówienia</h2>

            <div className="card shadow-sm bg-light mb-4">
                <div className="card-body d-flex align-items-end gap-3">
                    <div className="flex-grow-1">
                        <SelectStatus
                            value={selectedStatusId}
                            onChange={(e) => setSelectedStatusId(e.target.value)}
                        />
                    </div>

                    {selectedStatusId && (
                        <button
                            className="btn btn-outline-danger"
                            onClick={() => setSelectedStatusId("")}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <div className="d-flex flex-column gap-3">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                        <div key={order.id || index} className="card shadow-sm">
                            <div className="card-body">
                                <OrderItem {...order} onStatusChange={fetchData} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="alert alert-info text-center">
                        No orders found with this status.
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderList;
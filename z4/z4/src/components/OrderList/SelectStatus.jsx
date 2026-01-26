import {useEffect, useState} from "react";
import {getStatuses} from "./OrderLIstService.js";

function StatusSelect({value, onChange}) {
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async function () {
            const response = await getStatuses();
            setStatuses(response);
            setLoading(false);
        }
        fetchData().catch(console.error);
    }, []);

    if (loading) return <p>Loading statuses...</p>;

    return (
        <label>
            Filtruj za stanem zamówienia:
            <select className="form-select"
                value={value}
                onChange={onChange}
                name="id"
            >
                <option value=""> Wybierz stan </option>

                {statuses.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>
        </label>
    );
}

export default StatusSelect;
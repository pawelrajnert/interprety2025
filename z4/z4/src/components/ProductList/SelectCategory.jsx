import {useEffect, useState} from "react";
import axios from "axios";
import {getCategories} from "./ProductListService.js"; // Assuming axios

function CategorySelect({value, onChange}) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async function () {
            const response = await getCategories();
            setCategories(response);
            setLoading(false);
        }
        fetchData().catch(console.error);
    }, []);

    if (loading) return <p>Loading categories...</p>;

    return (
        <div>
            <label className="form-label fw-bold"> Kategoria: </label>
            <select
                className="form-select"
                value={value}
                onChange={onChange}
                name="category_id"
            >
                <option value="">-- Wybierz kategorię --</option>

                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                ))}
            </select>

        </div>
    );
}

export default CategorySelect;
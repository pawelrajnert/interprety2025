import ProductListItem from "./ProductListItem.jsx";
import {getItems} from "./ProductListService.js";
import {useEffect, useState} from "react";
import CategorySelect from "./SelectCategory.jsx";

function ProductList() {

    const [products, setProducts] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [nameFilter, setNameFilter] = useState("");

    useEffect(() => {
        const fetchData = async function () {
            const data = await getItems();
            setProducts(data);
        }
        fetchData().catch(console.error);
    }, []);

    const filteredProducts = products.filter(product => {
        const categoryFiltered = selectedCategoryId ? product.category_id === parseInt(selectedCategoryId) : true;
        const nameFiltered = product.name.toLowerCase().includes(nameFilter.toLowerCase());
        return categoryFiltered && nameFiltered;
    });

    return (
        <div>
            <div className="card p-3 mb-4 m-lg-5 shadow-sm bg-light">
                <div className="row g-3 align-items-end">
                    <div className="col-md-5">
                        <label className="form-label fw-bold">Nazwa:</label>
                        <input
                            className="form-control"
                            type="text"
                            value={nameFilter}
                            onChange={(e) => (setNameFilter(e.target.value))}
                        />
                    </div>
                    <div className="col-md-5">
                        {/*<label className="form-label fw-bold">Filter Category</label>*/}
                        <CategorySelect
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">

                        {selectedCategoryId && (
                            <button className="btn btn-outline-danger w-100"
                                    onClick={() => setSelectedCategoryId("")}
                                    style={{marginLeft: "10px"}}
                            >
                                <i className="bi bi-x-circle"></i> Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="row g-4 m-lg-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                        <div key={product.id || index} className="col-12 col-md-6 col-lg-4">
                            <ProductListItem {...product} />
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center p-5">
                        <h4 className="text-muted">No products found</h4>
                        <p>Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductList;
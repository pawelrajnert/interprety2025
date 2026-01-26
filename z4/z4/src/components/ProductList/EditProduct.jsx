import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import SelectCategory from "./SelectCategory.jsx";
import {editProduct, getDescription} from "./ProductListService.js";
import * as yup from "yup";


function EditProduct() {
    const {id} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const productSchema =
        yup.object({
            name: yup.string().required(),
            description: yup.string()
                .typeError("Quantity must be a number")
                .min(1, "Quantity cannot be less than 1")
                .required(),
            unit_price: yup.number().required().min(1),
            unit_weight: yup.number().required().min(1),
            category_id: yup.number().required()
        });
    const [product, setProduct] = useState(location.state || {
        name: "",
        description: "",
        unit_price: 0,
        unit_weight: 0,
        category_id: 0,
    });
    const [errorMessage, setErrorMessage] = useState("")

    function handleChange(e) {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    }

    async function handleConfirm() {
        try {
            product.description = description;
            const validatedData = await productSchema.validate(product, {abortEarly:false});
            await editProduct(id, validatedData);
            navigate("/");
        } catch (error) {
            setErrorMessage(error.errors[0]);
            console.error("Error updating:", error);
        }
    }

    async function handleGenerateDescription() {
        const data = await getDescription(id);
        setDescription(data.description);
    }


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">

                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Produkt</h4>
                        </div>

                        <div className="card-body p-4">

                            {errorMessage && (
                                <div className="alert alert-danger d-flex align-items-center" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {errorMessage}
                                </div>
                            )}

                            <form onSubmit={(e) => e.preventDefault()}>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Nazwa produktu</label>
                                    <input
                                        className="form-control"
                                        name="name"
                                        value={product.name}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Opis</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        value={description}
                                        onChange={handleChange}
                                        placeholder="Enter description"
                                        rows="3"
                                    />
                                    <button type={"button"} onClick={handleGenerateDescription} className="btn btn-secondary mt-3">Wygeneruj opis</button>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Cena</label>
                                        <div className="input-group">
                                            <span className="input-group-text">$</span>
                                            <input
                                                className="form-control"
                                                name="unit_price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={product.unit_price}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Waga</label>
                                        <div className="input-group">
                                            <input
                                                className="form-control"
                                                name="unit_weight"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={product.unit_weight}
                                                onChange={handleChange}
                                                placeholder="0"
                                            />
                                            <span className="input-group-text">kg</span>
                                        </div>
                                    </div>
                                </div>


                                <div className="mb-4">
                                    <SelectCategory
                                        value={product.category_id}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-success btn-lg"
                                        onClick={handleConfirm}
                                    >
                                        Confirm Changes
                                    </button>
                                    {/* Optional Cancel Button */}
                                    {/* <button className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button> */}
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProduct;
import {useRef, useState} from "react";
import api from "../../api";
import {initDb} from "./PanelService.js";

function initializerComponent() {

    const [selectedFile, setSelectedFile] = useState(null);
    const [status, setStatus] = useState({type: "", message: ""});
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setSelectedFile(selected);
        setStatus({type: "", message: ""});
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setStatus({type: "danger", message: "Please select a file first."});
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        setLoading(true);
        setStatus({type: "", message: ""});

        try {

            const response = await initDb(formData)
            setStatus({
                type: "success",
                message: `Dodano ${response.data.addedCount} produktów.`
            });
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            const errorMsg = "Nie udało się dodać bazę danych, być może jest już zainicjalizowana?";
            setStatus({type: "danger", message: errorMsg});
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-header bg-dark text-white">
                            <h4 className="mb-0">Zainicjalizuj bazę danych</h4>
                        </div>

                        <div className="card-body p-4">
                            <p className="text-muted mb-4">
                                Dodaj plik .json żeby zainicjalizować bazę danych.
                            </p>

                            {status.message && (
                                <div className={`alert alert-${status.type}`} role="alert">
                                    {status.message}
                                </div>
                            )}

                            <form onSubmit={handleUpload}>
                                <div className="mb-3">
                                    <label htmlFor="fileInput" className="form-label fw-bold">
                                        Wybierz plik .json
                                    </label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        id="fileInput"
                                        accept=".json"
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading || !selectedFile}
                                >
                                    {loading ? (
                                        <span>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"
                                                  aria-hidden="true"></span>
                                            Dodawanie...
                                        </span>
                                    ) : (
                                        "Dodaj dane"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default initializerComponent;
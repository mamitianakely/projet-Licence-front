import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function Updateresponsable() {
    const [nomResponsable, setNomResponsable] = useState('');
    const [motDePasse, setMotDePasse] = useState('');

    const { numResponsable } = useParams('');
    const navigate = useNavigate('');

    useEffect(() => {
        axios.get(`http://localhost:8000/updateresponsable/${numResponsable}`)
            .then(res => {
                const data = res.data[0];
                setNomResponsable(data.nomResponsable);
                setMotDePasse(data.motDePasse);
            })
            .catch(err => console.log(err));
    }, [numResponsable]);

    function handleSubmit(event) {
        event.preventDefault();
        axios.put(`http://localhost:8000/updateresponsable/${numResponsable}`, {
            nomResponsable,
            motDePasse
        })
            .then(res => {
                console.log(res);
                navigate('/listresponsable');
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="form1">
            <div className="form11">
                <div className="form111">
                    <form onSubmit={handleSubmit}>
                        <h2>MODIFIER UN RESPONSABLE</h2>

                        <div className="mb-2">
                            <label htmlFor="">Nom du Responsable : </label>
                            <input type="text" className="form-control" value={nomResponsable} onChange={e => setNomResponsable(e.target.value)} />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Mot de Passe : </label>
                            <input type="text" className="form-control" value={motDePasse} onChange={e => setMotDePasse(e.target.value )} />
                        </div>
                        <button className="btn btn-success">MODIFIER</button>
                        <a href="http://localhost:3000/listresponsable" className="btn btn-danger ms-2">ANNULER</a>
                    </form>
                </div>
            </div>
        </div>
    )
}

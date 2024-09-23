import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function Updateverificateur() {
    const [ nomVerificateur, setNomVerificateur] = useState('');
    const [ dateDescente, setDateDescente] = useState('');


    const { numVerificateur } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/updateverificateur/${numVerificateur}`)
            .then(res => {
                const data = res.data[0];
                setNomVerificateur(data.nomVerificateur);
                setDateDescente(data.dateDescente);
            })
            .catch(err => console.log(err));
    }, [numVerificateur]);

    function handleSubmit(event) {
        event.preventDefault();
        axios.put(`http://localhost:8000/updateverificateur/${numVerificateur}`, {
            nomVerificateur,
            dateDescente
        })
            .then(res => {
                console.log(res);
                navigate('/listverificateur');
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="form1">
            <div className="form11">
                <div className="form111">
                    <form onSubmit={handleSubmit}>
                        <h2>MODIFIER UN VERIFICATEUR</h2>

                        <div className="mb-2">
                            <label htmlFor="">Nom du Verificateur : </label>
                            <input type="text" className="form-control" value={nomVerificateur} onChange={e => setNomVerificateur(e.target.value)} />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Date de descente : </label>
                            <input type="date" className="form-control" value={dateDescente} onChange={e => setDateDescente(e.target.value )} />
                        </div>

                        <button className="btn btn-success">MODIFIER</button>
                        <a href="http://localhost:3000/listverificateur" className="btn btn-danger ms-2">ANNULER</a>
                    </form>
                </div>
            </div>
        </div>
    )
}
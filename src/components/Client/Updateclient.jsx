import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateClient() {
    const [ nomClient, setNomClient] = useState('');
    const [ adresse, setAdresse] = useState('');
    const [ contact, setContact] = useState('');

    const { numClient } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8000/updateclient/${numClient}`)
            .then(res => {
                const data = res.data[0];
                setNomClient(data.nomClient);
                setAdresse(data.adresse);
                setContact(data.contact);
            })
            .catch(err => console.log(err));
    }, [numClient]);

    function handleSubmit(event) {
        event.preventDefault();
        axios.put(`http://localhost:8000/updateclient/${numClient}`, {
            nomClient,
            adresse,
            contact
        })
            .then(res => {
                console.log(res);
                navigate('/listclient');
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="form1">
            <div className="form11">
                <div className="form111">
                    <form onSubmit={handleSubmit}>
                        <h2>MODIFIER UN CLIENT</h2>

                        <div className="mb-2">
                            <label htmlFor="">Nom du Client : </label>
                            <input type="text" className="form-control" value={nomClient} onChange={e => setNomClient(e.target.value)} />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Adresse du Client : </label>
                            <input type="text" className="form-control" value={adresse} onChange={e => setAdresse(e.target.value )} />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Numéro Téléphone : </label>
                            <input type="integer" className="form-control" value={contact} onChange={e => setContact(e.target.value)} />
                        </div>
                        <button className="btn btn-success">MODIFIER</button>
                        <a href="http://localhost:3000/listclient" className="btn btn-danger ms-2">ANNULER</a>
                    </form>
                </div>
            </div>
        </div>
    )
}
import React, { useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

export default function Client () {
    const [formState, setFormState] = useState({
        numClient: '',
        nomClient: '',
        adresse: '',
        contact: ''
    });

    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('http://localhost:8000/ajoutclient', formState)
            .then(res => {
                console.log(res);
                setShowDialog(true);
                // Réinitialiser le formulaire
                navigate('/listclient');
            })
            .catch(err => console.log(err));
    }
    return (
        <div className="form1">
            <div className="form11">
                <div className="form111">
                    <form onSubmit={handleSubmit}>
                        <h2>AJOUTER UNE DEMANDE</h2>

                        <div className="mb-2">
                            <label htmlFor="">Numero du Client : </label>
                            <input type="text" className="form-control" onChange={e => setFormState({...formState, numClient: e.target.value })} required />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Nom du Client : </label>
                            <input type="text" className="form-control" onChange={e => setFormState({...formState, nomClient: e.target.value })} required />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Adresse du Client : </label>
                            <input type="text" className="form-control" onChange={e => setFormState({...formState, adresse: e.target.value })} required />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Numéro Téléphone : </label>
                            <input type="text" className="form-control" onChange={e => setFormState({...formState, contact: e.target.value })} required />
                        </div>

                        <button className="btn btn-success">ENREGISTRER</button>
                    </form>
                    <Modal show={showDialog} onHide={() => setShowDialog(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Client ajouté!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Le client a été enregistré avec succès.</Modal.Body>
                    <Modal.Footer>
                        <Link to ="http://localhost:3000/listclient" onClick={() => setShowDialog(false)} className="btn btn-primary">
                             OK
                        </Link>
                    </Modal.Footer>
                </Modal>
                </div>
            </div>
        </div>
    )
}
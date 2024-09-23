import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { Modal } from "react-bootstrap";


export default function Ajoutdemande () {
    const [formState, setFormState] = useState({
        numClient: '',
        dateDemande:'',
        typeDemande:'',
        longueur:'',
        largeur:''
    })

    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('http://localhost:8000/ajoutdemande', formState)
            .then(res => {
                console.log(res);
                setShowDialog(true);
                // Réinitialiser le formulaire
                navigate('/listdemande');
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
                            <label htmlFor="">Date de la demande : </label>
                            <input type="date" className="form-control" onChange={e => setFormState({...formState, dateDemande: e.target.value })} required />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Nature de la demande : </label>
                            <input type="text" className="form-control" onChange={e => setFormState({...formState, typeDemande: e.target.value })} required />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Longueur du terrain : </label>
                            <input type="number" step="0.01" className="form-control" onChange={e => setFormState({ ...formState, longueur: e.target.value })} required />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Largeur du terrain : </label>
                            <input type="number" step="0.01" className="form-control" onChange={e => setFormState({ ...formState, largeur: e.target.value })} required />
                        </div>

                        <button className="btn btn-success">ENREGISTRER</button>
                    </form>
                    <Modal show={showDialog} onHide={() => setShowDialog(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Client ajouté!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Le client a été enregistré avec succès.</Modal.Body>
                    <Modal.Footer>
                        <Link to ="http://localhost:3000/listdemande" onClick={() => setShowDialog(false)} className="btn btn-primary">
                             OK
                        </Link>
                    </Modal.Footer>
                </Modal>
                </div>
            </div>
        </div>
    )
}
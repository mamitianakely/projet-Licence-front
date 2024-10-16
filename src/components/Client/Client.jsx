import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

export default function Client() {
    const [formState, setFormState] = useState({
        numChrono: '',
        nomClient: '',
        adresse: '',
        contact: ''
    });

    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);

    // Gérer la soumission du formulaire
    function handleSubmit(event) {
        event.preventDefault();

        // Envoyer les données au backend via POST
        axios.post('http://localhost:5000/api/clients', formState)
            .then(res => {
                console.log(res);
                setShowDialog(true); // Afficher le modal de confirmation
                // Rediriger vers la liste des clients après l'ajout
                setTimeout(() => {
                    navigate('/listclient');
                }, 2000); // Délais de 2 secondes pour montrer le message
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="form1">
            <div className="form11">
                <div className="form111">
                    <form onSubmit={handleSubmit}>
                        <h2>AJOUTER UN CLIENT</h2>

                        <div className="mb-2">
                            <label>Numero du Client : </label>
                            <input type="text" className="form-control" onChange={e => setFormState({ ...formState, numChrono: e.target.value })} required />
                        </div>

                        <div className="mb-2">
                            <label>Nom du Client : </label>
                            <input type="text" className="form-control" onChange={e => setFormState({ ...formState, nomClient: e.target.value })} required />
                        </div>

                        <div className="mb-2">
                            <label>Adresse du Client : </label>
                            <input type="text" className="form-control" onChange={e => setFormState({ ...formState, adresse: e.target.value })} required />
                        </div>

                        <div className="mb-2">
                            <label>Numéro Téléphone : </label>
                            <input type="text" className="form-control" onChange={e => setFormState({ ...formState, contact: e.target.value })} required />
                        </div>

                        <button className="btn btn-success">ENREGISTRER</button>
                    </form>

                    <Modal show={showDialog} onHide={() => setShowDialog(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Client ajouté!</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Le client a été enregistré avec succès.</Modal.Body>
                        <Modal.Footer>
                            <Link to="/listclient" onClick={() => setShowDialog(false)} className="btn btn-primary">
                                OK
                            </Link>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

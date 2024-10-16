import React, { useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
 
export default function Ajoutresponsable() {
    const [formState, setFormState] = useState ({
        numResponsable: '',
        nomResponsable: '',
        motDePasse:''
    })

    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('http://localhost:5000/api/responsables', formState)
            .then(res => {
                console.log(res);
                setShowDialog(true); // Afficher le modal de confirmation
                // Rediriger vers la liste des clients après l'ajout
                setTimeout(() => {
                    navigate('/listresponsable');
                }, 2000); // Délais de 2 secondes pour montrer le message
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
                            <label htmlFor="">Numero du Responsable : </label>
                            <input type="text" className="form-control" onChange={e => setFormState({...formState, numResponsable: e.target.value })} required />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Nom du Responsable : </label>
                            <input type="text" className="form-control" onChange={e => setFormState({...formState, nomResponsable: e.target.value })} required />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Mot de passe : </label>
                            <input type="text" className="form-control" onChange={e => setFormState({...formState, motDePasse: e.target.value })} required />
                        </div>

                        <button className="btn btn-success">ENREGISTRER</button>
                    </form>
                    <Modal show={showDialog} onHide={() => setShowDialog(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Responsable enregistré!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Le responsable a été enregistré avec succès.</Modal.Body>
                    <Modal.Footer>
                        <Link to ="http://localhost:3000/listresponsable" onClick={() => setShowDialog(false)} className="btn btn-primary">
                             OK
                        </Link>
                    </Modal.Footer>
                </Modal>
                </div>
            </div>
        </div>
    )
}
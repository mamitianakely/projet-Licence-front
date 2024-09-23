import React, { useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

export default function Client () {
    const [formState, setFormState] = useState({
        numVerificateur: '',
        nomVerificateur: '',
        dateDescente: ''
    });

    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();
        axios.post('http://localhost:8000/ajoutverificateur', formState)
            .then(res => {
                console.log(res);
                setShowDialog(true);
                // Réinitialiser le formulaire
                navigate('/listverificateur');
            })
            .catch(err => console.log(err));
    }
    return (
        <div className="form1">
            <div className="form11">
                <div className="form111">
                    <form onSubmit={handleSubmit}>
                        <h2>AJOUTER UN VERIFICATEUR</h2>

                        <div className="mb-2">
                            <label htmlFor="">Numero du verificateur : </label>
                            <input type="text" className="form-control" onChange={e => setFormState({...formState, numVerificateur: e.target.value })} required />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Nom du Verificateur : </label>
                            <input type="text" className="form-control" onChange={e => setFormState({...formState, nomVerificateur: e.target.value })} required />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Date de descente : </label>
                            <input type="date" className="form-control" onChange={e => setFormState({...formState, dateDescente: e.target.value })} required />
                        </div>

                        <button className="btn btn-success">ENREGISTRER</button>
                    </form>
                    <Modal show={showDialog} onHide={() => setShowDialog(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Verificateur ajouté!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Le verificateur a été enregistré avec succès.</Modal.Body>
                    <Modal.Footer>
                        <Link to ="http://localhost:3000/listverificateur" onClick={() => setShowDialog(false)} className="btn btn-primary">
                             OK
                        </Link>
                    </Modal.Footer>
                </Modal>
                </div>
            </div>
        </div>
    )
}
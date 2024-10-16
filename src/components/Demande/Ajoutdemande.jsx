import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal } from "react-bootstrap";


export default function Ajoutdemande() {
    const [formState, setFormState] = useState({
        numChrono: '',
        dateDemande: '',
        typeDemande: '',
        longueur: '',
        largeur: ''
    })

    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);

    function handleSubmit(event) {
        event.preventDefault();

        // Envoyer les données au backend via POST
        axios.post('http://localhost:5000/api/demandes', formState)
            .then(res => {
                console.log(res);
                setShowDialog(true); // Afficher le modal de confirmation
                // Rediriger vers la liste des clients après l'ajout
                setTimeout(() => {
                    navigate('/listdemande');
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
                            <label htmlFor="">Numero du Client : </label>
                            <input type="text" className="form-control" onChange={e => setFormState({ ...formState, numChrono: e.target.value })} required />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Date de la demande : </label>
                            <input type="date" className="form-control" onChange={e => setFormState({ ...formState, dateDemande: e.target.value })} required />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="typeDemande">Nature de la demande : </label>
                            <select id="typeDemande"className="form-control" value={formState.typeDemande} onChange={e => setFormState({ ...formState, typeDemande: e.target.value })} required >
                                <option value="">-- Sélectionner une nature de demande --</option>
                                <option value="Etablissements hôteliers">Etablissements hôtéliers</option>
                                <option value="Etablissements culturels">Etablissements culturels</option>
                                <option value="Etablissements nécessitant une étude d’impact environnemental">Etablissements nécessitant une étude d’impact environnemental</option>
                                <option value="Etablissements industriels">Etablissements industriels</option>
                                <option value="Etablissements recevant du public">Etablissements recevant du public</option>

                            </select>
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
                            <Modal.Title>Demande ajouté!</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>La demande a été enregistré avec succès.</Modal.Body>
                        <Modal.Footer>
                            <Link to="http://localhost:3000/listdemande" onClick={() => setShowDialog(false)} className="btn btn-primary">
                                OK
                            </Link>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    )
}
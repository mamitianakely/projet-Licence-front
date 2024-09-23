import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal'; // Assurez-vous d'installer react-modal

export default function Listdemande() {
    const [demande, setDemande] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedDemande, setSelectedDemande] = useState(null);

    useEffect(() => {
        const fetchDemandes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/listdemande');
                setDemande(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchDemandes();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleDelete = async (numDemande) => {
        try {
            await axios.delete(`http://localhost:8000/listdemande/${numDemande}`);
            setDemande(demande.filter(item => item.numDemande !== numDemande));
        } catch (err) {
            console.log(err);
        }
    };

    const openModal = (demande) => {
        setSelectedDemande(demande);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedDemande(null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Logique pour traiter le devis
        console.log("Devis soumis pour la demande:", selectedDemande);
        closeModal(); // Fermez la modale après soumission
    };

    const filteredDemande = demande.filter((data) => {
        return (
            data.nomClient.toLowerCase().includes(searchTerm) ||
            new Date(data.dateDemande).toLocaleDateString().includes(searchTerm) ||
            data.typeDemande.toLowerCase().includes(searchTerm)
        );
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(); // Format par défaut : 'MM/DD/YYYY'
    };

    return (
        <div className="container-fluid min-vh-100">
            <div className="aze">
                <div>
                    <form onSubmit={(e) => e.preventDefault()} className="form-control">
                        <input 
                            type="text" 
                            placeholder="Rechercher" 
                            value={searchTerm} 
                            className="recherche" 
                            id="searchInput" 
                            onChange={handleSearch} 
                        />
                    </form>
                    <Link to="/ajoutdema" className="btn btn-primary">AJOUTER</Link>
                </div>
            </div>

            <table className="table" id="table1">
                <thead>
                    <tr>
                        <th>Nom du Client</th>
                        <th>Date de demande</th>
                        <th>Nature de la demande</th>
                        <th>Longueur</th>
                        <th>Largeur</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(demande) && filteredDemande.map((data, i) => (
                        <tr key={i}>
                            <td>{data.numDemande}</td>
                            <td>{formatDate(data.dateDemande)}</td>
                            <td>{data.typeDemande}</td>
                            <td>{data.longueur}</td>
                            <td>{data.largeur}</td>
                            <td>
                                <Link to={`/updatedemande/${data.numDemande}`} className='btn btn-primary'>Modifier</Link>
                            </td>
                            <td>
                                <button className="btn btn-danger" onClick={() => handleDelete(data.numDemande)}>Supprimer</button>
                            </td>
                            <td>
                                <button className="btn btn-success" onClick={() => openModal(data)}>Accepter</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modale pour le formulaire de devis */}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                <h2>Formulaire de Devis</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Numéro de Demande:</label>
                        <input type="text" className="form-control" value={selectedDemande?.numDemande} readOnly />
                    </div>
                    <div>
                        <label>Prix longueur:</label>
                        <input type="number" className="form-control" step="0.01" required />
                    </div>
                    <div>
                        <label>Prix largeur:</label>
                        <input type="number" className="form-control" step="0.01" required />
                    </div>
                    <div>
                        <label>Montant:</label>
                        <input type="number" className="form-control" step="0.01" required />
                    </div>
                    
                    <button className="btn btn-success" type="submit">Soumettre</button>
                    <button type="button" className="btn btn-danger" onClick={closeModal}>Annuler</button>
                </form>
            </Modal>
        </div>
    );
}

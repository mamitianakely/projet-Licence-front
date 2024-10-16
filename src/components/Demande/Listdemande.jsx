import React, { useEffect, useState } from "react";
import axios from 'axios';
import Modal from 'react-modal';
import Dashboard from '../Dashboard/Dashboard';
import { Pencil, Trash, Check } from 'lucide-react';

export default function Listdemande() {
    const [demande, setDemande] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState('devis'); // To control which tab is active
    const [prixLongueur, setPrixLongueur] = useState(0);
    const [prixLargeur, setPrixLargeur] = useState(0);
    const [montant, setMontant] = useState(0);
    const [isDevisSubmitted, setIsDevisSubmitted] = useState(false);
    // const [numDevis, setNumDevis] = useState(0);

    const [formState, setFormState] = useState({
        numDemande: '',
        numChrono: '',
        dateDemande: '',
        typeDemande: '',
        longueur: '',
        largeur: '',
        lieu: ''
    });
    const [selectedDemande, setSelectedDemande] = useState(null); // Stores selected demand for editing

    const openModal = (demandeData) => {
        // Récupérer les valeurs de longueur et largeur depuis les données de la demande sélectionnée
        const longueur = demandeData.longueur;
        const largeur = demandeData.largeur;

        // Calculer prixLongueur, prixLargeur et le montant total
        const calculatedPrixLongueur = longueur * 500;
        const calculatedPrixLargeur = largeur * 500;
        const calculatedMontant = calculatedPrixLongueur + calculatedPrixLargeur;

        // Mettre à jour l'état avec les données de la demande sélectionnée et les valeurs calculées
        setSelectedDemande({
            ...demandeData,
            dateAvis: new Date().toISOString().split("T")[0], // Définit la date d'aujourd'hui
        });
        setPrixLongueur(calculatedPrixLongueur);
        setPrixLargeur(calculatedPrixLargeur);
        setMontant(calculatedMontant);

        // Ouvrir la fenêtre modale
        setModalIsOpen(true);
    };

    useEffect(() => {
        const fetchDemandes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/demandes');
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
            await axios.delete(`http://localhost:5000/api/demandes/${numDemande}`);
            setDemande(demande.filter(item => item.numDemande !== numDemande));
        } catch (err) {
            console.log(err);
        }
    };

    const openAddModal = () => {
        setFormState({
            numDemande: '',
            numChrono: '',
            dateDemande: '',
            typeDemande: '',
            longueur: '',
            largeur: '',
            lieu: ''
        });
        setAddModalIsOpen(true);
    };

    const openEditModal = (demandeData) => {
        setFormState({
            numDemande: demandeData.numDemande,
            numChrono: demandeData.numChrono,
            dateDemande: demandeData.dateDemande,
            typeDemande: demandeData.typeDemande,
            longueur: demandeData.longueur,
            largeur: demandeData.largeur,
            lieu: demandeData.lieu
        });
        setEditModalIsOpen(true);
    };

    const closeModal = () => {
        setAddModalIsOpen(false);
        setEditModalIsOpen(false);
        setModalIsOpen(false);
    };

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    const handleAddSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/demandes', formState);
            setDemande([...demande, response.data]);
            closeModal();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/demandes/${formState.numDemande}`, formState);
            setDemande(demande.map(d => d.numDemande === formState.numDemande ? formState : d));
            closeModal();
        } catch (err) {
            console.error(err);
        }
    };

    const filteredDemande = demande.filter((data) => {
        return (
            (data.nomClient && data.nomClient.toLowerCase().includes(searchTerm)) ||  // Vérifie si nomClient existe
            (data.dateDemande && new Date(data.dateDemande).toLocaleDateString().includes(searchTerm)) ||  // Vérifie si dateDemande existe
            (data.typeDemande && data.typeDemande.toLowerCase().includes(searchTerm))  // Vérifie si typeDemande existe
        );
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(); // Format par défaut : 'MM/DD/YYYY'
    };



    const handleDevisSubmit = async (e, selectedDemande) => {
        e.preventDefault();
        const prixLongueur = selectedDemande.longueur * 500;
        const prixLargeur = selectedDemande.largeur * 500;
        const montant = prixLongueur + prixLargeur;

        const devisData = {
            numDevis: selectedDemande.numDevis, // Assurez-vous que ce champ est bien défini
            numDemande: selectedDemande.numDemande, // Ajoutez ce champ si nécessaire
            prixLongueur,
            prixLargeur,
            montant,
        };

        console.log('Données envoyées:', devisData); // Ajoute cette ligne pour voir les données

        try {
            const response = await fetch(`http://localhost:5000/api/devis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(devisData),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'enregistrement du devis');
            }
            setIsDevisSubmitted(true); // Enable 'Avis de Paiement' tab
            handleTabClick('avis');
            // closeModal();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };


    const handleAvisSubmit = async (e) => {
        e.preventDefault();

        const avisData = {
            numAvis: selectedDemande.numAvis, // Assurez-vous que ce champ est bien défini
            numDevis: selectedDemande.numDevis, // Récupérer le numDevis de selectedDemande
            numQuittance: selectedDemande.numQuittance,
            dateAvis: selectedDemande.dateAvis, // Date d'aujourd'hui
        };

        try {
            const response = await fetch(`http://localhost:5000/api/avis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(avisData),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'enregistrement de l\'avis de paiement');
            }

            // Fermez le modal ou effectuez d'autres actions après la soumission
            closeModal();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    return (

        <div className="min-h-screen bg-gray-100">
            <Dashboard >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md">
                            <input type="text" placeholder="Rechercher" value={searchTerm} onChange={handleSearch}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </form>
                        <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={openAddModal}>AJOUTER</button>
                    </div>
                </div>

                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="w-full text-left bg-gray-200">
                            <th className="p-2">N° DE DEMANDE</th>
                            <th className="p-2">NOM DU CLIENT</th>
                            <th className="p-2">DATE DE DEMANDE</th>
                            <th className="p-2">NATURE DE DEMANDE</th>
                            <th className="p-2">LONGUEUR</th>
                            <th className="p-2">LARGEUR</th>
                            <th className="p-2">LIEU DE CONSTRUCTION</th>
                            <th className="p-2"></th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(demande) &&
                            filteredDemande.map((data, i) => (
                                <tr key={i} className="border-t">
                                    <td className="py-3 px-6 text-left">{data.numDemande}</td>
                                    <td className="py-3 px-6 text-left">{data.nomClient}</td>
                                    <td className="py-3 px-6 text-left">{formatDate(data.dateDemande)}</td>
                                    <td className="py-3 px-6 text-left">{data.typeDemande}</td>
                                    <td className="py-3 px-6 text-left">{data.longueur}</td>
                                    <td className="py-3 px-6 text-left">{data.largeur}</td>
                                    <td className="py-3 px-6 text-left">{data.lieu}</td>
                                    <td className="py-3 px-6 text-left">
                                        <div className="flex space-x-2"> {/* Conteneur flex avec espacement */}
                                            <button className="flex items-center bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => openEditModal(data)}>
                                                <Pencil className="mr-1" /> {/* Icône pour Modifier */}
                                            </button>
                                            <button className="flex items-center bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(data.numDemande)}>
                                                <Trash className="mr-1" /> {/* Icône pour Supprimer */}
                                            </button>
                                            <button className="flex items-center bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" onClick={() => openModal(data)}>
                                                <Check className="mr-1" /> {/* Icône pour Accepter */}
                                            </button>
                                        </div>
                                    </td>


                                </tr>
                            ))}
                    </tbody>
                </table>

                {/* Modal for adding demande */}
                <Modal isOpen={addModalIsOpen} onRequestClose={closeModal}>
                    <h2 className="text-2xl font-bold mb-4">NOUVELLE DEMANDE</h2>
                    <form onSubmit={handleAddSubmit}>
                        <div className="mb-4">
                            <label>Numero du Client :</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded" value={formState.numChrono} onChange={(e) =>
                                setFormState({ ...formState, numChrono: e.target.value })} required />
                        </div>

                        <div className="mb-4">
                            <label>Date de la demande :</label>
                            <input type="date" className="w-full p-2 border border-gray-300 rounded" value={formState.dateDemande} onChange={(e) =>
                                setFormState({ ...formState, dateDemande: e.target.value })} required />
                        </div>

                        <div className="mb-4">
                            <label>Nature de la demande :</label>
                            <select className="w-full p-2 border border-gray-300 rounded" value={formState.typeDemande} onChange={(e) =>
                                setFormState({ ...formState, typeDemande: e.target.value })} required>
                                <option value="">-- Sélectionner une nature de demande --</option>
                                <option value="Etablissements hôteliers">Etablissements hôteliers</option>
                                <option value="Etablissements culturels">Etablissements culturels</option>
                                <option value="Etablissements nécessitant une étude d’impact environnemental">Etablissements nécessitant une étude d’impact environnemental</option>
                                <option value="Etablissements industriels">Etablissements industriels</option>
                                <option value="Etablissements recevant du public">Etablissements recevant du public</option>
                                <option value="Autres">Autres</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label>Longueur du terrain :</label>
                            <input type="number" step="0.01" className="w-full p-2 border border-gray-300 rounded" value={formState.longueur} onChange={(e) =>
                                setFormState({ ...formState, longueur: e.target.value })} required />
                        </div>

                        <div className="mb-4">
                            <label>Largeur du terrain :</label>
                            <input type="number" step="0.01" className="w-full p-2 border border-gray-300 rounded" value={formState.largeur} onChange={(e) =>
                                setFormState({ ...formState, largeur: e.target.value })} required />
                        </div>

                        <div className="mb-4">
                            <label>Lieu de construction :</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded" value={formState.lieu} onChange={(e) =>
                                setFormState({ ...formState, lieu: e.target.value })} required />
                        </div>

                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">ENREGISTRER</button>
                        <button type="button" className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={closeModal}>Annuler</button>
                    </form>
                </Modal>

                {/* Modal for editing demande */}
                <Modal isOpen={editModalIsOpen} onRequestClose={closeModal}>
                    <h2 className="text-2xl font-bold mb-4">MODIFIER UNE DEMANDE</h2>
                    <form onSubmit={handleEditSubmit}>
                        <div className="mb-4">
                            <label>Date de la demande :</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded" value={formatDate(formState.dateDemande)} onChange={(e) =>
                                setFormState({ ...formState, dateDemande: e.target.value })} required />
                        </div>

                        <div className="mb-4">
                            <label>Nature de la demande :</label>
                            <select className="w-full p-2 border border-gray-300 rounded" value={formState.typeDemande} onChange={(e) =>
                                setFormState({ ...formState, typeDemande: e.target.value })} required>
                                <option value="">-- Sélectionner une nature de demande --</option>
                                <option value="Etablissements hôteliers">Etablissements hôteliers</option>
                                <option value="Etablissements culturels">Etablissements culturels</option>
                                <option value="Etablissements nécessitant une étude d’impact environnemental">Etablissements nécessitant une étude d’impact environnemental</option>
                                <option value="Etablissements industriels">Etablissements industriels</option>
                                <option value="Etablissements recevant du public">Etablissements recevant du public</option>
                                <option value="Autres">Autres</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label>Longueur du terrain :</label>
                            <input type="number" step="0.01" className="w-full p-2 border border-gray-300 rounded" value={formState.longueur} onChange={(e) =>
                                setFormState({ ...formState, longueur: e.target.value })} required />
                        </div>

                        <div className="mb-4">
                            <label>Largeur du terrain :</label>
                            <input type="number" step="0.01" className="w-full p-2 border border-gray-300 rounded" value={formState.largeur} onChange={(e) =>
                                setFormState({ ...formState, largeur: e.target.value })} required />
                        </div>

                        <div className="mb-4">
                            <label>Lieu de construction :</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded" value={formState.lieu} onChange={(e) =>
                                setFormState({ ...formState, lieu: e.target.value })} required />
                        </div>

                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">ENREGISTRER</button>
                        <button type="button" className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={closeModal}>Annuler</button>
                    </form>
                </Modal>


                {/* Modal for 'Devis' and 'Avis de paiement' */}
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                    <h2 className="text-xl font-bold mb-4">Devis de la demande numero - {selectedDemande?.numDemande}</h2>

                    <div className="flex space-x-4 mb-4">
                        <button className={`px-4 py-2 rounded ${selectedTab === 'devis' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => handleTabClick('devis')}>
                            Devis
                        </button>
                        <button className={`px-4 py-2 rounded ${selectedTab === 'avis' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => isDevisSubmitted && handleTabClick('avis')} // Only allow click if Devis is submitted
                            disabled={!isDevisSubmitted} style={{ cursor: isDevisSubmitted ? 'pointer' : 'not-allowed', opacity: isDevisSubmitted ? 1 : 0.5 }}>
                            Avis de Paiement
                        </button>
                    </div>

                    {selectedTab === 'devis' && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Formulaire de Devis</h3>
                            <form onSubmit={(e) => handleDevisSubmit(e, selectedDemande)}>
                                {/* Champ Numéro de Devis */}
                                <div className="mb-4">
                                    <label className="block">Numéro de Devis :</label>
                                    <input type="text" className="mt-1 p-2 border border-gray-300 rounded w-full" value={selectedDemande?.numDevis || ''}
                                        onChange={(e) => setSelectedDemande({ ...selectedDemande, numDevis: e.target.value })} required />
                                </div>

                                {/* Champ Prix Longueur (calculé) */}
                                <div className="mb-4">
                                    <label className="block">Prix Longueur :</label>
                                    <input type="number" step="0.01" className="mt-1 p-2 border border-gray-300 rounded w-full" value={prixLongueur || ''}
                                        readOnly />
                                </div>

                                {/* Champ Prix Largeur (calculé) */}
                                <div className="mb-4">
                                    <label className="block">Prix Largeur :</label>
                                    <input type="number" step="0.01" className="mt-1 p-2 border border-gray-300 rounded w-full" value={prixLargeur || ''}
                                        readOnly />
                                </div>

                                {/* Champ Montant Total (calculé) */}
                                <div className="mb-4">
                                    <label className="block">Montant Total :</label>
                                    <input type="number" step="0.01" className="mt-1 p-2 border border-gray-300 rounded w-full" value={montant || ''}
                                        readOnly />
                                </div>

                                {/* Bouton Enregistrer */}
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Enregistrer Devis</button>
                                <button type="button" className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={closeModal}>Fermer</button>
                            </form>
                        </div>
                    )}

                    {selectedTab === 'avis' && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Formulaire d'Avis de Paiement</h3>
                            <form onSubmit={(e) => handleAvisSubmit(e, selectedDemande)}>
                                {/* Avis de Paiement form fields */}
                                <div className="mb-4">
                                    <label className="block">Numéro de l'Avis :</label>
                                    <input type="text" className="mt-1 p-2 border border-gray-300 rounded w-full" value={selectedDemande?.numAvis || ''}
                                        onChange={(e) => setSelectedDemande({ ...selectedDemande, numAvis: e.target.value })} required />
                                </div>
                                <div className="mb-4">
                                    <label className="block">Numéro du devis :</label>
                                    <input type="text" className="mt-1 p-2 border border-gray-300 rounded w-full" value={selectedDemande?.numDevis || ''} readOnly required />
                                </div>

                                <div className="mb-4">
                                    <label className="block">Numero de la quittance :</label>
                                    <input type="integer" className="mt-1 p-2 border border-gray-300 rounded w-full" value={selectedDemande?.numQuittance || ''}
                                        onChange={(e) => setSelectedDemande({ ...selectedDemande, numQuittance: e.target.value })} required />
                                </div>
                                <div className="mb-4">
                                    <label className="block">Date de l'avis de paiement :</label>
                                    <input type="date" className="mt-1 p-2 border border-gray-300 rounded w-full" value={selectedDemande?.dateAvis || ''}
                                        onChange={(e) => setSelectedDemande({ ...selectedDemande, dateAvis: e.target.value })} required />
                                </div>
                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Enregistrer Avis</button>
                                <button type="button" className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={closeModal}>Fermer</button>
                            </form>
                        </div>
                    )}
                </Modal>

            </Dashboard>
        </div>
    );
}

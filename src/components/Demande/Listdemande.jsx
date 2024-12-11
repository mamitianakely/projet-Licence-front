import React, { useEffect, useState } from "react";
import axios from '../../AxiosConfig';
import Modal from 'react-modal';
import Dashboard from '../Dashboard/Dashboard';
import { Pencil, Trash, Check, Search, Plus, RefreshCcw } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

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
    const [isDevisCreated, setIsDevisCreated] = useState(false); // Devis créé ou non
    const [isDevisSubmitted, setIsDevisSubmitted] = useState(false); // Suivi de la soumission du devis

    const [activeRowIndex, setActiveRowIndex] = useState(null);

    const toggleButtons = (index) => {
        setActiveRowIndex((prevIndex) => (prevIndex === index ? null : index));
    };


    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

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
        const prixUnitaireLongueur = demandeData.prixUnitaireLongueur || 0; // Valeur par défaut
        const prixUnitaireLargeur = demandeData.prixUnitaireLargeur || 0;   // Valeur par défaut

        // Calculer prixLongueur, prixLargeur et le montant total
        const calculatedPrixLongueur = longueur * prixUnitaireLongueur;
        const calculatedPrixLargeur = largeur * prixUnitaireLargeur;
        const calculatedMontant = calculatedPrixLongueur + calculatedPrixLargeur;

        // Mettre à jour l'état avec les données de la demande sélectionnée et les valeurs calculées
        setSelectedDemande({
            ...demandeData,

            dateAvis: new Date().toISOString().split("T")[0], // Définit la date d'aujourd'hui
            prixUnitaireLongueur,
            prixUnitaireLargeur,
        });
        setPrixLongueur(calculatedPrixLongueur);
        setPrixLargeur(calculatedPrixLargeur);
        setMontant(calculatedMontant);

        // Ouvrir la fenêtre modale
        setModalIsOpen(true);
    };

    // Modification pour que les champs réagissent au changement de prix unitaire
    const handleInputChange = (e, field) => {
        const value = parseFloat(e.target.value) || 0;  // Mettre 0 par défaut si la valeur est vide ou invalide

        setSelectedDemande({
            ...selectedDemande,
            [field]: value, // Mise à jour du champ spécifique (prixUnitaireLongueur ou prixUnitaireLargeur)
        });

        // Recalcul des valeurs dès que l'utilisateur modifie un prix unitaire
        const prixLongueur = selectedDemande.longueur * (field === 'prixUnitaireLongueur' ? value : selectedDemande.prixUnitaireLongueur);
        const prixLargeur = selectedDemande.largeur * (field === 'prixUnitaireLargeur' ? value : selectedDemande.prixUnitaireLargeur);
        setPrixLongueur(prixLongueur);
        setPrixLargeur(prixLargeur);
        setMontant(prixLongueur + prixLargeur);  // Mettre à jour le montant total
    };


    // Récupérer les demandes
    useEffect(() => {
        const fetchDemandes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/demandes/stats/withdevis');
                setDemande(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        // fetch nom client
        fetchDemandes();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };


    //recherche deux dates
    const handleDateSearch = async () => {
        // Vérifie que les deux dates sont présentes
        if (!startDate || !endDate) {
            alert("Veuillez sélectionner les dates de début et de fin.");
            return;
        }

        try {
            // Requête pour rechercher les permis entre les deux dates
            const response = await axios.get(`http://localhost:5000/api/demandes/search/searchDateDemands`, {
                params: { startDate, endDate }
            });
            setDemande(response.data);
        } catch (err) {
            console.log(err);
            alert("Erreur lors de la recherche des demandes.");
        }
    };

    // Rafraîchir les données en rechargeant depuis l'API
    const handleRefresh = () => {
        // Appelle directement le même code que dans le useEffect
        axios
            .get('http://localhost:5000/api/demandes/stats/withdevis')
            .then((res) => {
                console.log('Rafraîchissement des données:', res.data);
                setDemande(res.data); // Remet à jour la liste
            })
            .catch((err) => console.error(err));
    };

    // supprimer une demande
    const handleDelete = async (numDemande) => {
        // Affiche une boîte de dialogue de confirmation
        confirmAlert({
            title: "Confirmation de suppression",
            message: "Voulez-vous vraiment supprimer cette demande ?",
            buttons: [
                {
                    label: "Oui",
                    onClick: async () => {
                        try {
                            await axios.delete(`http://localhost:5000/api/demandes/${numDemande}`);
                            // Mettre à jour l'état local pour supprimer l'avis supprimé
                            setDemande(prevDemande => prevDemande.filter(demande => demande.numDemande !== numDemande));
                            // Mettre à jour l'interface après suppression

                            // Afficher une notification de succès
                            toast.success('Demande supprimé avec succès!', {
                                position: "top-right",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored"
                            });

                        } catch (error) {
                            console.error(error);
                            toast.error('Erreur lors de la suppression. Veuillez réessayer.', {
                                position: "top-right",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored"
                            });
                        }
                    },
                },
                {
                    label: "Non",
                    onClick: () => console.log("Suppression annulée")
                }
            ],
            overlayClassName: "custom-overlay",
            className: "custom-ui",
        });
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

    //ajouter demande
    const handleAddSubmit = async (event) => {
        event.preventDefault();
        try {
            // Ajout de la demande
            const response = await axios.post('http://localhost:5000/api/demandes', formState);

            // Récupération des demandes avec le nomClient
            const demandeResponse = await axios.get('http://localhost:5000/api/demandes');
            setDemande(demandeResponse.data); // Mettre à jour l'état avec les nouvelles données

            closeModal();
            // Afficher une notification de succès avec react-toastify
            toast.success('Demande ajouté avec succès!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            })

            // Réinitialiser les états pour rendre le bouton Check réactif à la création d'une nouvelle demande
            setIsDevisCreated(false);
            // setIsAvisCreated(false);
        } catch (err) {
            console.error(err);
            toast.error('Erreur lors de l’ajout du demande.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:5000/api/demandes/${formState.numDemande}`, 
                formState
            );
    
            // Récupérer les données mises à jour depuis le backend
            const updatedDemande = response.data;
    
            // Mettre à jour l'état avec les données renvoyées par le backend
            setDemande(demande.map(d => 
                d.numDemande === updatedDemande.numDemande ? updatedDemande : d
            ));
    
            closeModal();
            toast.success('Demande modifiée avec succès!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        } catch (err) {
            console.error(err);
            toast.error("Erreur lors de la modification de la demande.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    };
    

    //filtrer demande
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDemandes = filteredDemande.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredDemande.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }


    // Ajouter devis
    const handleDevisSubmit = async (e, selectedDemande) => {
        e.preventDefault();

        const prixUnitaireLongueur = selectedDemande.prixUnitaireLongueur || 0;  // Valeur par défaut
        const prixUnitaireLargeur = selectedDemande.prixUnitaireLargeur || 0;    // Valeur par défaut

        // Calcul des prix et du montant
        const prixLongueur = selectedDemande.longueur * prixUnitaireLongueur;
        const prixLargeur = selectedDemande.largeur * prixUnitaireLargeur;
        const montant = prixLongueur + prixLargeur;

        const devisData = {
            numDevis: selectedDemande.numDevis,
            numDemande: selectedDemande.numDemande,
            prixLongueur,
            prixLargeur,
            montant,
        };

        try {
            const response = await axios.post('http://localhost:5000/api/devis', devisData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const createdNumDevis = response.data.numDevis;

            // Mettre à jour selectedDemande avec numDevis
            setSelectedDemande((prevState) => ({
                ...prevState,
                numDevis: createdNumDevis,
            }));


            toast.success('Demande ajouté avec succès!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });


            setIsDevisCreated(true);
            setIsDevisSubmitted(true);
            closeModal(true); // Le devis a été soumis
            // handleTabClick('avis');
        } catch (error) {
            console.error('Erreur:', error.response ? error.response.data : error.message);
            toast.error('Erreur lors de l’ajout du devis.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
        }
    };


    return (

        <div className="min-h-screen bg-gray-100">
            <Dashboard >
                <ToastContainer />

                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md">
                            <input type="text" placeholder="Rechercher" value={searchTerm} onChange={handleSearch}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </form>

                        <div className="flex space-x-2">
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button onClick={handleDateSearch} className="px-4 py-2 bg-[#293855] text-white rounded-md hover:bg-[#3e3c6e]">
                                <Search className="text-black-500 " size={20} />
                            </button>
                            <button className="ml-4 px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600" onClick={openAddModal}>
                                <Plus className="mr-1" />
                            </button>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleRefresh}>
                                <RefreshCcw className="mr-1" />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">

                    </div>

                </div>

                <h2 className="text-2xl font-bold mb-4 text-[#032f30]">LISTE DES DEMANDES</h2>


                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-[#209CFF] text-gray-900 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-center">NUMERO</th>
                            <th className="py-3 px-6 text-center">CLIENT</th>
                            <th className="py-3 px-6 text-center">DATE</th>
                            <th className="py-3 px-6 text-center">NATURE</th>
                            <th className="py-3 px-6 text-center">LONGUEUR</th>
                            <th className="py-3 px-6 text-center">LARGEUR</th>
                            <th className="py-3 px-6 text-center">LIEU</th>
                            <th className="py-3 px-6 text-center"></th>
                            <th className="py-3 px-6 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(currentDemandes) && currentDemandes.map((data, i) => (

                            <tr key={i} className="border-t">
                                <td className="py-3 px-6 text-center">{data.hasDevis && <span className="text-blue-500 text-lg">●</span>}{data.numDemande}</td>
                                <td className="py-3 px-6 text-center">{data.nomClient}</td>
                                <td className="py-3 px-6 text-center">{formatDate(data.dateDemande)}</td>
                                <td className="py-3 px-6 text-center">{data.typeDemande}</td>
                                <td className="py-3 px-6 text-center">{data.longueur}</td>
                                <td className="py-3 px-6 text-center">{data.largeur}</td>
                                <td className="py-3 px-6 text-center">{data.lieu}</td>

                                <td className="py-3 px-6 text-center">
                                    <div className="flex space-x-2">
                                        {/* Bouton pour afficher/masquer les autres boutons */}
                                        <button className="flex items-center bg-[#293855] text-white px-2 py-1 rounded hover:bg-gray-600" 
                                        onClick={() => toggleButtons(i)}>...</button>

                                        {/* Affichage conditionnel des boutons */}
                                        {activeRowIndex === i && (
                                            <div className="flex space-x-2">
                                                <button className="flex items-center bg-[#246bfd] text-white px-2 py-1 rounded hover:bg-[#30a0e0]" onClick={() => openEditModal(data)}>
                                                    <Pencil className="mr-1" /> {/* Icône pour Modifier */}
                                                </button>
                                                <button className="flex items-center bg-[#E95354] text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(data.numDemande)}>
                                                    <Trash className="mr-1" /> {/* Icône pour Supprimer */}
                                                </button>
                                                <button className="flex items-center bg-[#0a7075] hover:bg-cyan-600 px-2 py-1 rounded" onClick={() => openModal(data)}>
                                                    <Check className="mr-1" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>


                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex mt-4">
                    {pageNumbers.map((number) => (
                        <button key={number} onClick={() => paginate(number)} className={`mx-1 px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                            {number}
                        </button>
                    ))}
                </div>



                {/* Modal for adding demande */}
                <Modal isOpen={addModalIsOpen} onRequestClose={closeModal} className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">NOUVELLE DEMANDE</h2>
                        <form onSubmit={handleAddSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Groupe 1 */}
                                <div className="mb-4">
                                    <label>Numero de la demande :</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded" value={formState.numDemande}
                                        onChange={(e) => setFormState({ ...formState, numDemande: e.target.value })} required />
                                </div>
                                <div className="mb-4">
                                    <label>Numero du Client :</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded" value={formState.numChrono}
                                        onChange={(e) => setFormState({ ...formState, numChrono: e.target.value })} required />
                                </div>

                                {/* Groupe 2 */}
                                <div className="mb-4">
                                    <label>Date de la demande :</label>
                                    <input type="date" className="w-full p-2 border border-gray-300 rounded" value={formState.dateDemande}
                                        onChange={(e) => setFormState({ ...formState, dateDemande: e.target.value })} required />
                                </div>
                                <div className="mb-4">
                                    <label>Nature de la demande :</label>
                                    <select className="w-full p-2 border border-gray-300 rounded" value={formState.typeDemande}
                                        onChange={(e) => setFormState({ ...formState, typeDemande: e.target.value })} required>
                                        <option value="">-- Sélectionner une nature de demande --</option>
                                        <option value="Etablissements hôteliers">Etablissements hôteliers</option>
                                        <option value="Etablissements culturels">Etablissements culturels</option>
                                        <option value="Etablissements nécessitant une étude d’impact environnemental">Etablissements nécessitant une étude d’impact environnemental</option>
                                        <option value="Etablissements industriels">Etablissements industriels</option>
                                        <option value="Etablissements recevant du public">Etablissements recevant du public</option>
                                        <option value="Autres">Autres</option>
                                    </select>
                                </div>

                                {/* Groupe 3 */}
                                <div className="mb-4">
                                    <label>Longueur du terrain :</label>
                                    <input type="number" step="0.01" className="w-full p-2 border border-gray-300 rounded" value={formState.longueur}
                                        onChange={(e) => setFormState({ ...formState, longueur: e.target.value })} required />
                                </div>
                                <div className="mb-4">
                                    <label>Largeur du terrain :</label>
                                    <input type="number" step="0.01" className="w-full p-2 border border-gray-300 rounded" value={formState.largeur}
                                        onChange={(e) => setFormState({ ...formState, largeur: e.target.value })} required />
                                </div>

                                {/* Groupe 4 */}
                                <div className="col-span-2 mb-4">
                                    <label>Lieu de construction :</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded" value={formState.lieu}
                                        onChange={(e) => setFormState({ ...formState, lieu: e.target.value })} required />
                                </div>
                            </div>
                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">ENREGISTRER</button>
                            <button type="button" className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={closeModal}>Annuler</button>
                        </form>
                    </div>
                </Modal>

                {/* Modal for editing demande */}
                <Modal isOpen={editModalIsOpen} onRequestClose={closeModal} className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4">MODIFIER UNE DEMANDE</h2>
                        <form onSubmit={handleEditSubmit}>

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
                    </div>
                </Modal>


                {/* Modal for 'Devis' */}
                <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="fixed inset-0 flex justify-center items-center z-50">
                    <div className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Devis de la demande numéro - {selectedDemande?.numDemande}</h2>

                        <div className="flex space-x-4 mb-4">
                            <button className="px-4 py-2 rounded bg-blue-500 text-white">
                                Devis
                            </button>
                        </div>

                        {/* Section du formulaire de Devis */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Formulaire de Devis</h3>
                            <form onSubmit={(e) => handleDevisSubmit(e, selectedDemande)}>
                                {/* Prix Unitaire Longueur */}
                                <div className="mb-4">
                                    <label className="block">Prix Unitaire Longueur :</label>
                                    <input type="number" className="mt-1 p-2 border border-gray-300 rounded w-full" value={selectedDemande?.prixUnitaireLongueur || ''} onChange={(e) => handleInputChange(e, 'prixUnitaireLongueur')} required />
                                </div>

                                {/* Prix Unitaire Largeur */}
                                <div className="mb-4">
                                    <label className="block">Prix Unitaire Largeur :</label>
                                    <input type="number" className="mt-1 p-2 border border-gray-300 rounded w-full" value={selectedDemande?.prixUnitaireLargeur || ''} onChange={(e) => handleInputChange(e, 'prixUnitaireLargeur')} required />
                                </div>

                                {/* Prix Longueur (calculé) */}
                                <div className="mb-4">
                                    <label className="block">Prix Longueur :</label>
                                    <input type="number" step="0.01" className="mt-1 p-2 border border-gray-300 rounded w-full" value={prixLongueur || ''} readOnly />
                                </div>

                                {/* Prix Largeur (calculé) */}
                                <div className="mb-4">
                                    <label className="block">Prix Largeur :</label>
                                    <input type="number" step="0.01" className="mt-1 p-2 border border-gray-300 rounded w-full" value={prixLargeur || ''} readOnly />
                                </div>

                                {/* Montant Total (calculé) */}
                                <div className="mb-4">
                                    <label className="block">Montant Total :</label>
                                    <input type="number" step="0.01" className="mt-1 p-2 border border-gray-300 rounded w-full" value={montant || ''} readOnly />
                                </div>

                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Enregistrer Devis</button>
                                <button type="button" className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={closeModal}>Fermer</button>
                            </form>
                        </div>
                    </div>
                </Modal>
            </Dashboard>
        </div>
    );
}

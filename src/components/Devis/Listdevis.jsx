import React, { useEffect, useState } from "react";
import axios from '../../AxiosConfig';
import Dashboard from "../Dashboard/Dashboard";
import { Trash, FileText, Circle, CheckCircle, Filter, RefreshCcw } from 'lucide-react';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';


export default function Listdevis() {
    const [devis, setDevis] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const [activeRowIndex, setActiveRowIndex] = useState(null);

    const toggleButtons = (index) => {
        setActiveRowIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const [isOpen, setIsOpen] = useState(false);

    // Fonction pour basculer l'état du dropdown
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };



    // récupérer la liste des devis
    useEffect(() => {
        axios.get(`http://localhost:5000/api/devis/tri/withPermisAndClient`)
            .then(res => {
                console.log('Données reçues:', res.data);
                res.data.forEach(devis => {
                    console.log('Devis:', devis.numDevis, 'hasPermis:', devis.hasPermis);
                });
                setDevis(res.data)
            })
            .catch(err => console.log(err));
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleDelete = async (numDevis) => {
        confirmAlert({
            title: "Confirmation de suppression",
            message: "Voulez-vous vraiment supprimer ce devis ?",
            buttons: [
                {
                    label: "Oui",
                    onClick: async () => {
                        try {
                            // Effectuer la suppression du devis via l'API
                            await axios.delete(`http://localhost:5000/api/devis/${numDevis}`);

                            // Affichage d'une notification de succès
                            toast.success('Devis supprimé avec succès!', {
                                position: "top-right",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                            });

                            // Optionnel: mettre à jour l'interface locale (ex. suppression du devis de la liste)
                            setDevis((prevDevis) => prevDevis.filter((devis) => devis.numDevis !== numDevis));
                        } catch (error) {
                            console.error("Erreur lors de la suppression du devis:", error);
                            // Affichage d'une notification d'erreur
                            toast.error('Erreur lors de la suppression du devis. Veuillez réessayer.', {
                                position: "top-right",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
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
    //ajout de numQuittance et datePermis
    const handleModalSubmit = async (numDevis) => {
        try {
            // Appel à l'API pour mettre à jour l'état de l'avis à "payé"
            await axios.put(`http://localhost:5000/api/devis/${numDevis}/payer`);

            // Mise à jour locale des avis pour refléter le changement
            setDevis(prevDevis =>
                prevDevis.map(item =>
                    item.numDevis === numDevis ? { ...item, etat: 'payé' } : item
                )
            );

            // Affiche une notification de succès
            toast.success('Paiement avec succès!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            })
        } catch (err) {
            console.error("Erreur lors de la mise à jour de l'état :", err);
        }
    };




    const [selectedDevis, setSelectedDevis] = useState(null); // Stocker le devis sélectionné
    const [numDevis, setNumDevis] = useState('');  // Champ numDevis à pré-remplir
    const [datePermis, setDatePermis] = useState('');
    const [numQuittance, setNumQuittance] = useState('');

    const openModal = (devis) => {
        setSelectedDevis(devis);  // Met à jour selectedDevis avec le devis spécifique
        setNumDevis(devis.numDevis); // Pré-remplir numDevis
        setDatePermis(new Date().toISOString().split('T')[0]); // Pré-remplir datePermis avec la date actuelle
        setModalIsOpen(true);
    };

    // Fonction pour fermer le modal
    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedDevis(null); // Réinitialiser après la fermeture
    };

    const handlePermisSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDevis || !selectedDevis.numDevis) {
            console.error("Numéro de devis manquant");
            return; // Afficher un message d'erreur si numDevis est manquant
        }

        try {
            await axios.post(`http://localhost:5000/api/devis/permis`, {
                numDevis: selectedDevis.numDevis,
                numQuittance: numQuittance,
                datePermis: datePermis
            });
            toast.success("Permis enregistré avec succès!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            });
            closeModal();
        } catch (err) {
            console.error("Erreur lors de la soumission du permis:", err);
        }
    };


    // télécharger le facture
    const downloadDevisPDF = async (numDevis) => {
        confirmAlert({
            title: "Confirmation",
            message: "Voulez-vous vraiment générer cette facture ?",
            buttons: [
                {
                    label: "Oui",
                    onClick: async () => {
                        try {
                            const response = await axios.get(`http://localhost:5000/api/devis/get-pdf/${numDevis}`, {
                                responseType: 'blob', // Nécessaire pour télécharger les fichiers
                            });

                            // Crée un lien pour télécharger le fichier
                            const url = window.URL.createObjectURL(new Blob([response.data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `devis_${numDevis}.pdf`); // Nom du fichier
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                        } catch (error) {
                            console.error('Erreur lors du téléchargement du devis :', error);
                            alert('Impossible de télécharger le devis. Veuillez réessayer.');
                        }
                    },
                },
                {
                    label: "Non",
                    onClick: () => console.log("Téléchargement annulé"),
                },
            ],
            overlayClassName: "custom-overlay",
            className: "custom-ui",
        });
    };

    // Filtrage par nom du client
    const handleSortByClientName = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/devis/tri/sorted-by-client');
            setDevis(response.data);
        } catch (err) {
            console.error('Error fetching sorted devis:', err);
        }
    };

    // Rafraîchir les données en rechargeant depuis l'API
    const handleRefresh = () => {
        // Appelle directement le même code que dans le useEffect
        axios
            .get('http://localhost:5000/api/devis/tri/withPermisAndClient')
            .then((res) => {
                console.log('Rafraîchissement des données:', res.data);
                setDevis(res.data); // Remet à jour la liste
            })
            .catch((err) => console.error(err));
    };



    // filtrer les recherches
    const filteredDevis = devis.filter((data) => {
        return (
            (data.nomClient.toLowerCase().includes(searchTerm)) ||  // Comparer les nombres comme des chaînes
            (data.prixLongueur && data.prixLongueur.toString().includes(searchTerm)) ||  // Comparer les nombres comme des chaînes
            (data.prixLargeur && data.prixLargeur.toString().includes(searchTerm)) ||    // Comparer les nombres comme des chaînes
            (data.montant && data.montant.toString().includes(searchTerm))               // Comparer les nombres comme des chaînes
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDevis = filteredDevis.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredDevis.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }


    return (

        <div className="min-h-screen bg-gray-100">
            <Dashboard >
                <ToastContainer />
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md">
                            <input type="text" placeholder="Rechercher" value={searchTerm} onChange={handleSearch}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </form>
                        <div className="flex space-x-1">
                            <button className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600" onClick={handleSortByClientName}>
                                <Filter className="mr-1" />
                            </button>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleRefresh}>
                                <RefreshCcw className="mr-1" />
                            </button>
                        </div>


                        {/* <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={openAddModal}>AJOUTER</button> */}
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-[#032f30]">LISTE DES DEVIS</h2>

                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-[#209CFF] text-gray-900 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-center">N° DE DEVIS</th>
                            <th className="py-3 px-6 text-center">NOM DU CLIENT</th>
                            <th className="py-3 px-6 text-center">PRIX DE LA LONGUEUR</th>
                            <th className="py-3 px-6 text-center">PRIX DE LA LARGEUR</th>
                            <th className="py-3 px-6 text-center">MONTANT A PAYER</th>
                            <th className="py-3 px-6 text-center">ETAT</th>
                            <th className="py-3 px-6 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(currentDevis) && currentDevis.map((data, i) => (
                            <tr key={i} className="border-t">
                                <td className="py-3 px-6 text-center">{data.hasPermis && <span className="text-blue-500 text-lg">●</span>}{data.numDevis}</td>
                                <td className="py-3 px-6 text-center">{data.nomClient}</td>
                                <td className="py-3 px-6 text-center">{data.prixLongueur}</td>
                                <td className="py-3 px-6 text-center">{data.prixLargeur}</td>
                                <td className="py-3 px-6 text-center">{data.montant}</td>
                                <td className="py-3 px-6 text-center">{data.etat}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex space-x-2">
                                        {/* Bouton pour afficher/masquer les autres boutons */}
                                        <button className="flex items-center bg-[#293855] text-white px-2 py-1 rounded hover:bg-gray-600" 
                                           onClick={() => toggleButtons(i)}>...</button>
                                        {activeRowIndex === i && (
                                            <div className="flex space-x-2">
                                                {/* <button className="flex items-center bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" onClick={() => handleDownloadPdf(data.numDevis)}>
                                                    <FileText className="mr-1" />
                                                </button> */}
                                                <button className="flex items-center bg-[#4165D5] text-white px-2 py-1 rounded hover:bg-[#246af3]"
                                                    onClick={() => downloadDevisPDF(data.numDevis)}>
                                                    <FileText className="mr-1" />
                                                </button>
                                                {data.etat === 'non payé' ? (
                                                    <button className="flex items-center bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                                        onClick={() => handleModalSubmit(data.numDevis)}
                                                    >
                                                        <Circle className="mr-1" />
                                                    </button>
                                                ) : (
                                                    <div className="relative">
                                                        {/* Bouton 'payé' qui déclenche l'ouverture du dropdown */}
                                                        <button
                                                            className="flex items-center bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                                            onClick={toggleDropdown} // On clique pour ouvrir/fermer le dropdown
                                                        >
                                                            <CheckCircle className="mr-1" />
                                                        </button>

                                                        {/* Dropdown - seulement visible quand 'isOpen' est true */}
                                                        {isOpen && (
                                                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg">
                                                                <ul className="py-2">
                                                                    <li>
                                                                        {/* Le bouton pour ouvrir le modal */}
                                                                        <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => openModal(data)} >
                                                                            Permis
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                                <button className="flex items-center bg-[#E95354] text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(data.numDevis)}>
                                                    <Trash className="mr-1" />
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

                    {/* Modal */}
                    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="fixed inset-0 flex justify-center items-center z-50">
                        <div className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-lg">


                            {/* Section du formulaire de Devis */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">INFORMATIONS SUPPLEMENTAIRES POUR LE PERMIS</h3>
                                <form onSubmit={(e) => handlePermisSubmit(e)}>
                                    {/* Numéro de devis */}
                                    <div className="mb-4">
                                        <label className="block">Numéro de devis</label>
                                        <input type="text" value={numDevis} className="mt-1 p-2 border border-gray-300 rounded w-full" readOnly />
                                    </div>
                                    {/* Numéro de quittance */}
                                    <div className="mb-4">
                                        <label className="block">Numéro de la quittance</label>
                                        <input type="text" value={numQuittance} onChange={(e) => setNumQuittance(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded w-full" required />
                                    </div>

                                    {/* Date de délivrance */}
                                    <div className="mb-4">
                                        <label className="block">Date de délivrance :</label>
                                        <input type="date" value={datePermis} onChange={(e) => setDatePermis(e.target.value)} className="mt-1 p-2 border border-gray-300 rounded w-full" required />
                                    </div>
                                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Enregistrer</button>
                                    <button type="button" className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={closeModal}>Fermer</button>
                                </form>
                            </div>
                        </div>
                    </Modal>
                </div>
            </Dashboard>
        </div>
    );
}
import React, { useEffect, useState } from "react";
import axios from '../../AxiosConfig';
import Dashboard from "../Dashboard/Dashboard";
import Modal from 'react-modal';
import { Pencil, Trash, Plus, RefreshCcw } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";


export default function Listclient() {
    const [client, setClient] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [formState, setFormState] = useState({
        numChrono: '',
        nomClient: '',
        adresse: '',
        contact: ''
    });

    const [showButtons, setShowButtons] = useState(false);
    const toggleButtons = () => {
        setShowButtons(!showButtons); // Basculer l'affichage des boutons
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const openAddModal = () => {
        setFormState({
            numChrono: '',
            nomClient: '',
            adresse: '',
            contact: ''
        });
        setAddModalIsOpen(true);
    };

    const handleAddSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/clients', formState);
            setClient([...client, response.data]);
            closeModal();

            // Afficher une notification de succès avec react-toastify
            toast.success('Client ajouté avec succès!', {
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
            console.error(err);
            // Afficher une notification d'erreur si quelque chose ne va pas
            toast.error('Erreur lors de l’ajout du client.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
            })
        }
    };

    const openEditModal = (clientData) => {
        setFormState({
            numChrono: clientData.numChrono,
            nomClient: clientData.nomClient,
            adresse: clientData.adresse,
            contact: clientData.contact,
        });
        setEditModalIsOpen(true);
    }

    const closeModal = () => {
        setAddModalIsOpen(false);
        setEditModalIsOpen(false);
        // setModalIsOpen(false);
    };

    // Gérer la recherche
    const handleSearch = (event) => {
        event.preventDefault();
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/clients/${formState.numChrono}`, formState);
            setClient(client.map(d => d.numChrono === formState.numChrono ? formState : d));
            closeModal();
            // Affiche une notification de succès
            toast.success('Client modifié avec succès!', {
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
            console.error(err);
            // Affiche une notification d'erreur en cas de problème
            toast.error("Erreur lors de la modification du client.", {
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
    // Gérer la suppression d'un client
    const handleDelete = async (numChrono) => {
        // Affiche une boîte de dialogue de confirmation
        confirmAlert({
            title: "Confirmation de suppression",
            message: "Voulez-vous vraiment supprimer ce client ?",
            buttons: [
                {
                    label: "Oui",
                    onClick: async () => {
                        try {
                            await axios.delete(`http://localhost:5000/api/clients/${numChrono}`);
                            // Mettre à jour l'état local pour supprimer l'avis supprimé
                            setClient(prevClient => prevClient.filter(client => client.numChrono !== numChrono));
                            // Mettre à jour l'interface après suppression

                            // Afficher une notification de succès
                            toast.success('Client supprimé avec succès!', {
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

    // Récupérer tous les clients au chargement du composant
    useEffect(() => {
        axios.get('http://localhost:5000/api/clients/stats/withdemandes')
            .then(res => {
                console.log('Données reçues:', res.data); // Afficher les données complètes
                res.data.forEach(client => {
                    console.log('Client:', client.nomClient, 'hasDemande:', client.hasDemande);
                });
                setClient(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    // Rafraîchir les données en rechargeant depuis l'API
     const handleRefresh = () => {
        // Appelle directement le même code que dans le useEffect
        axios.get('http://localhost:5000/api/clients/stats/withdemandes')
        .then((res) => {
            console.log('Rafraîchissement des données:', res.data);
            setClient(res.data); // Remet à jour la liste
        })
        .catch((err) => console.error(err));
    };


    // Filtrer les clients en fonction de la recherche
    const filteredClient = client.filter((data) => {
        return (
            data.nomClient.toLowerCase().includes(searchTerm) ||
            data.adresse.toLowerCase().includes(searchTerm) ||
            data.contact.toLowerCase().includes(searchTerm)
        );
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentClients = filteredClient.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredClient.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Dashboard>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md">
                            <input type="text" placeholder="Rechercher" value={searchTerm} onChange={handleSearch}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </form>

                        <button className="ml-4 px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600" onClick={openAddModal}>
                            <Plus className="mr-1" />
                        </button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleRefresh}>
                                <RefreshCcw className="mr-1" />
                            </button>
                    </div>

                    <h2 className="text-2xl font-bold mb-4 text-[#032f30]">LISTE DES CLIENTS</h2>

                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-[#209CFF] text-gray-900 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-center">Numero du Client</th>
                                <th className="py-3 px-6 text-center">Nom du Client</th>
                                <th className="py-3 px-6 text-center">Adresse</th>
                                <th className="py-3 px-6 text-center">Contact</th>
                                <th className="py-3 px-6"></th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                            {Array.isArray(currentClients) && currentClients.map((data, i) => (
                                <tr key={i} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-center">{data.hasDemande && <span className="text-blue-500 text-lg">●</span>}    {data.numChrono}</td>
                                    <td className="py-3 px-6 text-center">{data.nomClient}</td>
                                    <td className="py-3 px-6 text-center">{data.adresse}</td>
                                    <td className="py-3 px-6 text-center">{data.contact}</td>
                                    <td className="py-3 px-6 text-right flex space-x-2">
                                        {/* Bouton pour afficher/masquer les autres boutons */}
                                        <button className="flex items-center bg-[#293855] text-white px-2 py-1 rounded hover:bg-gray-600" onClick={toggleButtons}>...</button>

                                        {/* Affichage conditionnel des boutons */}
                                        {showButtons && (
                                            <div className="flex space-x-2"> {/* Conteneur flex avec espacement */}
                                                <button className="flex items-center bg-[#246bfd] text-white px-2 py-1 rounded hover:bg-[#30a0e0]" onClick={() => openEditModal(data)}>
                                                    <Pencil className="mr-1" /> {/* Icône pour Modifier */}
                                                </button>
                                                <button className="flex items-center bg-[#E95354] text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(data.numChrono)}>
                                                    <Trash className="mr-1" /> {/* Icône pour Supprimer */}
                                                </button>
                                            </div>
                                        )}
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
                    {/* Modal for adding client*/}
                    <Modal isOpen={addModalIsOpen} onRequestClose={closeModal} className="fixed inset-0 flex justify-center items-center z-50">
                        <div className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">NOUVEAU CLIENT</h2>
                            <form onSubmit={handleAddSubmit}>

                                <div className="mb-2">
                                    <label htmlFor="">Nom du client : </label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded" onChange={e => setFormState({ ...formState, nomClient: e.target.value })} required />
                                </div>

                                <div className="mb-2">
                                    <label htmlFor="">Adresse du client : </label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded" onChange={e => setFormState({ ...formState, adresse: e.target.value })} required />
                                </div>

                                <div className="mb-2">
                                    <label htmlFor="">Numéro du téléphone : </label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded" onChange={e => setFormState({ ...formState, contact: e.target.value })} required />
                                </div>

                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                > ENREGISTRER
                                </button>
                                <button type="button" className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    onClick={closeModal} >
                                    Annuler
                                </button>
                            </form>
                        </div>
                    </Modal>

                    {/* Modal for editing client */}
                    <Modal isOpen={editModalIsOpen} onRequestClose={closeModal} className="fixed inset-0 flex justify-center items-center z-50">
                        <div className="max-w-2xl w-full p-6 bg-white rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-4">MODIFIER UN CLIENT</h2>
                            <form onSubmit={handleEditSubmit}>
                                <div className="mb-2">
                                    <label htmlFor="">Nom du client : </label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded" value={formState.nomClient} onChange={(e) =>
                                        setFormState({ ...formState, nomClient: e.target.value })} required />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="">Adresse du client : </label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded" value={formState.adresse} onChange={(e) =>
                                        setFormState({ ...formState, adresse: e.target.value })} required />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="">Numéro du téléphone : </label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded" value={formState.contact} onChange={(e) =>
                                        setFormState({ ...formState, contact: e.target.value })} required />
                                </div>


                                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">ENREGISTRER</button>
                                <button type="button" className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={closeModal}>Annuler</button>
                            </form>
                        </div>
                    </Modal>
                </div>
                <ToastContainer />
            </Dashboard>
        </div>
    );
}

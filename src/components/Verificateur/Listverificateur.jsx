import React, { useEffect, useState } from "react";
import axios from 'axios';
import Modal from 'react-modal';
import Dashboard from "../Dashboard/Dashboard";
import { Pencil, Trash } from 'lucide-react';

export default function Listverificateur() {
    const [verificateur, setVerificateur] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [addModalIsOpen, setAddModalIsOpen] = useState(false);
    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [formState, setFormState] = useState({
        numVerificateur: '',
        nomVerificateur: '',
        dateDescente: ''
    });


    const openAddModal = () => {
        setFormState({
            numVerificateur: '',
            nomVerificateur: '',
            dateDescente: ''
        });
        setAddModalIsOpen(true);
    };

    const handleAddSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/verificateurs', formState);
            setVerificateur([...verificateur, response.data]);
            closeModal();
        } catch (err) {
            console.error(err);
        }
    };

    const openEditModal = (verificateurData) => {
        setFormState({
            numVerificateur: verificateurData.numVerificateur,
            nomVerificateur: verificateurData.nomVerificateur,
            dateDescente: verificateurData.dateDescente
        });
        setEditModalIsOpen(true);
    }


    const closeModal = () => {
        setAddModalIsOpen(false);
        setEditModalIsOpen(false);
        // setModalIsOpen(false);
    };

    const handleEditSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/verificateurs/${formState.numVerificateur}`, formState);
            setVerificateur(verificateur.map(d => d.numVerificateur === formState.numVerificateur ? formState : d));
            closeModal();
        } catch (err) {
            console.error(err);
        }
    };

    // Handle search input
    const handleSearch = (event) => {
        event.preventDefault();
        setSearchTerm(event.target.value.toLowerCase());
    };

    // Handle delete request
    const handleDelete = async (numVerificateur) => {
        try {
            await axios.delete(`http://localhost:5000/api/verificateursµ/${numVerificateur}`);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    // Fetch verificateur data on component load
    useEffect(() => {
        const fetchVerificateur = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/verificateurs');
                setVerificateur(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchVerificateur();
    }, []);

    // Filter verificateur based on search input
    const filteredVerificateur = verificateur.filter((data) => {
        return (
            data.nomVerificateur.toLowerCase().includes(searchTerm) ||
            new Date(data.dateDescente).toLocaleDateString().includes(searchTerm)
        );
    });

    // Format date in 'MM/DD/YYYY'
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

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
                        <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={openAddModal}>
                            AJOUTER
                        </button>
                    </div>

                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Numero du verificateur</th>
                                <th className="py-3 px-6 text-left">Nom du verificateur</th>
                                <th className="py-3 px-6 text-left">Date de Descente</th>
                                <th className="py-3 px-6"></th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                            {Array.isArray(verificateur) && filteredVerificateur.map((data, i) => (
                                <tr key={i} className="border-b border-gray-200 hover:bg-gray-100">
                                    <td className="py-3 px-6 text-left">{data.numVerificateur}</td>
                                    <td className="py-3 px-6 text-left">{data.nomVerificateur}</td>
                                    <td className="py-3 px-6 text-left">{formatDate(data.dateDescente)}</td>
                                    <td className="py-3 px-6 text-left">
                                        <div className="flex space-x-2"> {/* Conteneur flex avec espacement */}
                                            <button className="flex items-center bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => openEditModal(data)}>
                                                <Pencil className="mr-1" /> {/* Icône pour Modifier */}
                                            </button>
                                            <button className="flex items-center bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(data.numVerificateur)}>
                                                <Trash className="mr-1" /> {/* Icône pour Supprimer */}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Modal for adding verificateur*/}
                    <Modal isOpen={addModalIsOpen} onRequestClose={closeModal}>
                        <h2 className="text-2xl font-bold mb-4">ANOUVEAU VERIFICATEUR</h2>
                        <form onSubmit={handleAddSubmit}>
                            <div className="mb-2">
                                <label htmlFor="">Numero du verificateur : </label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded" onChange={e => setFormState({ ...formState, numVerificateur: e.target.value })} required />
                            </div>

                            <div className="mb-2">
                                <label htmlFor="">Nom du Verificateur : </label>
                                <input type="text" className="w-full p-2 border border-gray-300 rounded" onChange={e => setFormState({ ...formState, nomVerificateur: e.target.value })} required />
                            </div>

                            <div className="mb-2">
                                <label htmlFor="">Date de descente : </label>
                                <input type="date" className="w-full p-2 border border-gray-300 rounded" onChange={e => setFormState({ ...formState, dateDescente: e.target.value })} required />
                            </div>

                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            > ENREGISTRER
                            </button>
                            <button type="button" className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={closeModal} >
                                Annuler
                            </button>
                        </form>
                    </Modal>
                    {/* Modal for editing verificateur */}
                    <Modal isOpen={editModalIsOpen} onRequestClose={closeModal}>
                        <h2 className="text-2xl font-bold mb-4">MODIFIER UN VERIFICATEUR</h2>
                        <form onSubmit={handleEditSubmit}>
                        <div className="mb-2">
                            <label htmlFor="">Nom du Verificateur : </label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded" value={formState.nomVerificateur} onChange={(e) =>
                                    setFormState({ ...formState, nomVerificateur: e.target.value })                                }
                                required
                            />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Date de descente : </label>
                            <input type="date" className="w-full p-2 border border-gray-300 rounded"
                                value={formatDate(formState.dateDescente)}
                                onChange={(e) =>
                                    setFormState({ ...formState, dateDescente: e.target.value })
                                }
                                required
                            />
                        </div>

                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">ENREGISTRER</button>
                        <button type="button" className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={closeModal}>Annuler</button>
                        </form>
                    </Modal>
                </div>
            </Dashboard>
        </div>
    );
}

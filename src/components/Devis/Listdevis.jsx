import React, { useEffect, useState } from "react";
import axios from '../../AxiosConfig';
import Dashboard from "../Dashboard/Dashboard";
import { Trash } from 'lucide-react';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Listdevis() {
    const [devis, setDevis] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    

    useEffect(() => {
        const fetchDevis = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/devis`);
                setDevis(response.data)
            } catch (err) {
                console.log(err);
            }
        };
        fetchDevis();
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
                        {/* <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={openAddModal}>AJOUTER</button> */}
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-4 text-black">LISTE DES DEVIS</h2>

                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-cyan-700 text-gray-900 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-center">N° DE DEVIS</th>
                            <th className="py-3 px-6 text-center">NOM DU CLIENT</th>
                            <th className="py-3 px-6 text-center">PRIX POUR LA LONGUEUR</th>
                            <th className="py-3 px-6 text-center">PRIX POUR LA LARGEUR</th>
                            <th className="py-3 px-6 text-center">MONTANT A PAYER</th>
                            <th className="py-3 px-6 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(currentDevis) && currentDevis.map((data, i)=>  (
                            <tr key={i} className="border-t">
                                <td className="py-3 px-6 text-center">{data.numDevis}</td>
                                <td className="py-3 px-6 text-center">{data.nomClient}</td>
                                <td className="py-3 px-6 text-center">{data.prixLongueur}</td>
                                <td className="py-3 px-6 text-center">{data.prixLargeur}</td>
                                <td className="py-3 px-6 text-center">{data.montant}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex space-x-2"> {/* Conteneur flex avec espacement */}
                                        {/* <button className="flex items-center bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" onClick={() => openEditModal(data)}>
                                                <Pencil className="mr-1" /> {/* Icône pour Modifier */}
                                        {/* </button> */} 
                                        <button className="flex items-center bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(data.numDevis)}>
                                            <Trash className="mr-1" /> {/* Icône pour Supprimer */}
                                        </button>
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
            </Dashboard>
        </div>
    );
}
import React, { useEffect, useState } from "react";
import axios from '../../AxiosConfig';
import Dashboard from "../Dashboard/Dashboard";
import { Trash, Circle, CheckCircle, FileText, Search } from 'lucide-react';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Listavis() {
    const [avis, setAvis] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [showButtons, setShowButtons] = useState(false);
    const toggleButtons = () => {
        setShowButtons(!showButtons); // Basculer l'affichage des boutons
    };

    useEffect(() => {
        const fetchAvis = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/avis`);
                setAvis(response.data)
            } catch (err) {
                console.log(err);
            }
        };
        fetchAvis();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleDateSearch = async () => {
        // Vérifie que les deux dates sont présentes
        if (!startDate || !endDate) {
            alert("Veuillez sélectionner les dates de début et de fin.");
            return;
        }

        try {
            // Requête pour rechercher les permis entre les deux dates
            const response = await axios.get(`http://localhost:5000/api/avis/searchDates`, {
                params: { startDate, endDate }
            });
            setAvis(response.data);
        } catch (err) {
            console.log(err);
            alert("Erreur lors de la recherche des permis.");
        }
    };

    const handleDelete = async (numAvis) => {
        confirmAlert({
            title: "Confirmation de suppression",
            message: "Voulez-vous vraiment supprimer cette avis de paiement ?",
            buttons: [
                {
                    label: "Oui",
                    onClick: async () => {
                        try {
                            // Effectuer la suppression via l'API
                            await axios.delete(`http://localhost:5000/api/avis/${numAvis}`);
                            
                            // Mettre à jour l'état local pour supprimer l'avis supprimé
                            setAvis(prevAvis => prevAvis.filter(avis => avis.numAvis !== numAvis));
    
                            // Afficher une notification de succès
                            toast.success('Avis supprimé avec succès!', {
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
                            console.error("Erreur lors de la suppression :", error);
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
    
    const handleEtatChange = async (numAvis) => {
        try {
            // Appel à l'API pour mettre à jour l'état de l'avis à "payé"
            await axios.put(`http://localhost:5000/api/avis/${numAvis}/payer`);

            // Mise à jour locale des avis pour refléter le changement
            setAvis(prevAvis =>
                prevAvis.map(item =>
                    item.numAvis === numAvis ? { ...item, etat: 'payé' } : item
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
            theme: "colored"})
        } catch (err) {
            console.error("Erreur lors de la mise à jour de l'état :", err);
        }
    };

    const handleDownloadPdf = async (numAvis) => {
        // Afficher la boîte de confirmation avant de télécharger la facture
    confirmAlert({
        title: "Confirmation",
        message: "Voulez-vous vraiment générer cette facture ?",
        buttons: [
            {
                label: "Oui",
                onClick: async () => {
                    try {
                        const response = await axios.get(`http://localhost:5000/api/avis/pdf/${numAvis}`, {
                            responseType: 'blob', // Important pour les fichiers PDF
                        });

                        if (response.status === 200) {
                            const url = window.URL.createObjectURL(new Blob([response.data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `avis-${numAvis}.pdf`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        } else {
                            console.error('Erreur lors du téléchargement du PDF:', response);
                        }
                    } catch (err) {
                        console.error('Erreur lors du téléchargement du PDF:', err);
                        alert('Impossible de télécharger le PDF. Veuillez réessayer plus tard.');
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

    const filteredAvis = avis.filter((data) => {
        return (
            (data.nomClient && data.nomClient.toString().includes(searchTerm)) ||  // Comparer les nombres comme des chaînes
            (data.numQuittance && data.numQuittance.toString().includes(searchTerm)) ||    // Comparer les nombres comme des chaînes
            (data.dateAvis && new Date(data.dateAvis).toLocaleDateString().includes(searchTerm))               // Comparer les nombres comme des chaînes
        );
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(); // Format par défaut : 'MM/DD/YYYY'
    };


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAvis = filteredAvis.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredAvis.length / itemsPerPage); i++) {
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
                        <div className="flex space-x-2">
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <button onClick={handleDateSearch} className="px-4 py-2 bg-[#70aaf5] text-white rounded-md hover:bg-cyan-600">
                            <Search className="text-black-500 " size={20} />
                        </button>
                    </div>
                        {/* <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={openAddModal}>AJOUTER</button> */}
                    </div>

                    
                </div>

                <h2 className="text-2xl font-bold mb-4 text-black">LISTE DES AVIS DE PAIEMENT</h2>

                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-cyan-700 text-gray-900 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-center">NUMERO</th>
                            <th className="py-3 px-6 text-center">NOM DU CLIENT</th>
                            <th className="py-3 px-6 text-center">N° DE QUITTANCE</th>
                            <th className="py-3 px-6 text-center">DATE</th>
                            <th className="py-3 px-6 text-center">MONTANT</th>
                            <th className="py-3 px-6 text-center">ETAT</th>
                            <th className="py-3 px-6 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(currentAvis) && currentAvis.map((data, i)=> (
                            <tr key={i} className="border-t">
                                <td className="py-3 px-6 text-center">{data.numAvis}</td>
                                <td className="py-3 px-6 text-center">{data.nomClient}</td>
                                <td className="py-3 px-6 text-center">{data.numQuittance}</td>
                                <td className="py-3 px-6 text-center">{formatDate(data.dateAvis)}</td>
                                <td className="py-3 px-6 text-center">{data.montant}</td>
                                <td className="py-3 px-6 text-center">{data.etat}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex space-x-2">
                                        {/* Bouton pour afficher/masquer les autres boutons */}
                                        <button className="flex items-center bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600" onClick={toggleButtons}>...</button>
                                        {showButtons && (
                                            <div className="flex space-x-2">
                                        <button className="flex items-center bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(data.numAvis)}>
                                            <Trash className="mr-1" />
                                        </button>
                                        {data.etat === 'non payé' ? (
                                            <button className="flex items-center bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600" onClick={() => handleEtatChange(data.numAvis)}>
                                                <Circle className="mr-1" /> Non payé
                                            </button>
                                        ) : (
                                            <button className="flex items-center bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" disabled>
                                                <CheckCircle className="mr-1" /> Payé
                                            </button>
                                        )}
                                        <button className="flex items-center bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" onClick={() => handleDownloadPdf(data.numAvis)}>
                                            <FileText className="mr-1" />
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
            </Dashboard>
        </div>
    );
}
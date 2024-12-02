import React, { useEffect, useState } from "react";
import axios from '../../AxiosConfig';
import Dashboard from "../Dashboard/Dashboard";
import { Trash, FileText, Search, RefreshCcw } from 'lucide-react';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";


export default function Listpermis() {
    const [permis, setPermis] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const [activeRowIndex, setActiveRowIndex] = useState(null);

    const toggleButtons = (index) => {
        setActiveRowIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    useEffect(() => {
        const fetchPermis = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/permis`);
                setPermis(response.data)
            } catch (err) {
                console.log(err);
            }
        };

        fetchPermis();
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
            const response = await axios.get(`http://localhost:5000/api/permis/search`, {
                params: { startDate, endDate }
            });
            setPermis(response.data);
        } catch (err) {
            console.log(err);
            alert("Erreur lors de la recherche des permis.");
        }
    };

    // Rafraîchir les données en rechargeant depuis l'API
    const handleRefresh = () => {
        // Appelle directement le même code que dans le useEffect
        axios
            .get('http://localhost:5000/api/permis')
            .then((res) => {
                console.log('Rafraîchissement des données:', res.data);
                setPermis(res.data); // Remet à jour la liste
            })
            .catch((err) => console.error(err));
    };


    // const handleDelete = async (numPermis) => {
    //     confirmAlert({
    //         title: "Confirmation de suppression",
    //         message: "Voulez-vous vraiment supprimer ce permis ?",
    //         buttons: [
    //             {
    //                 label: "Oui",
    //                 onClick: async () => {
    //                     try {
    //                         await axios.delete(`http://localhost:5000/api/permis/${numPermis}`);
    //                         // Mettre à jour l'interface après suppression
    //                     } catch (error) {
    //                         console.error(error);
    //                     }
    //                 },
    //             },
    //             {
    //                 label: "Non",
    //                 onClick: () => console.log("Suppression annulée")
    //             }
    //         ],
    //         overlayClassName: "custom-overlay",
    //         className: "custom-ui",
    //     });
    // };

    const handleDelete = async (numPermis) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/permis/${numPermis}`);
            console.log(response.data);
            // Actualiser la liste des permis après suppression
            setPermis(prevPermis => prevPermis.filter(permis => permis.numPermis !== numPermis));
        } catch (error) {
            console.error('Erreur lors de la suppression du permis:', error);
        }
    };



    // télécharger le permis
    const handleDownloadPdf = async (numPermis) => {
        // Afficher la boîte de confirmation avant de télécharger le PDF
        confirmAlert({
            title: "Confirmation",
            message: "Voulez-vous vraiment générer ce PDF ?",
            buttons: [
                {
                    label: "Oui",
                    onClick: async () => {
                        try {
                            const response = await axios.get(`http://localhost:5000/api/permis/pdf/${numPermis}`, {
                                responseType: 'blob', // Important pour les fichiers PDF
                            });

                            if (response.status === 200) {
                                const url = window.URL.createObjectURL(new Blob([response.data]));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', `permis-${numPermis}.pdf`);
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

    // filtrer les recherches

    const filteredPermis = permis.filter((data) => {
        const normalizedSearchTerm = searchTerm.toLowerCase(); // Normaliser le terme de recherche

        const matchesSearchTerm = (value) =>
            value && value.toString().toLowerCase().includes(normalizedSearchTerm); // Vérifie si la valeur inclut le terme normalisé

        return (
            matchesSearchTerm(data.nomClient) ||
            matchesSearchTerm(data.numDevis) ||
            matchesSearchTerm(data.numQuittance) ||
            matchesSearchTerm(data.montant) ||
            matchesSearchTerm(data.lieu) ||
            (data.datePermis && new Date(data.datePermis).toLocaleDateString().toLowerCase().includes(normalizedSearchTerm))
        );
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(); // Format par défaut : 'MM/DD/YYYY'
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPermis = filteredPermis.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredPermis.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (

        <div className="min-h-screen bg-gray-100">
            <Dashboard >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md">
                            <input type="text" placeholder="Rechercher" value={searchTerm} onChange={handleSearch}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </form>
                        <div className="flex space-x-2">
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button onClick={handleDateSearch} className="px-4 py-2 bg-[#293855] text-white rounded-md hover:bg-[#3e3c6e]">
                                <Search className="text-black-500 " size={20} />
                            </button>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleRefresh}>
                                <RefreshCcw className="mr-1" />
                            </button>
                        </div>
                        {/* <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={openAddModal}>AJOUTER</button> */}
                    </div>

                </div>

                <h2 className="text-2xl font-bold mb-4 text-[#032f30]">LISTE DES PERMIS</h2>

                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-[#209CFF] text-gray-900 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-center">NUMERO</th>
                            <th className="py-3 px-6 text-center">CLIENT</th>
                            <th className="py-3 px-6 text-center">DEVIS CORRESPONDANT</th>
                            <th className="py-3 px-6 text-center">QUITTANCE</th>
                            <th className="py-3 px-6 text-center">DATE</th>
                            <th className="py-3 px-6 text-center">MONTANT</th>
                            <th className="py-3 px-6 text-center">LIEU</th>
                            <th className="py-3 px-6 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(currentPermis) && currentPermis.map((data, i) => (
                            <tr key={i} className="border-t">
                                <td className="py-3 px-6 text-center">{data.numPermis}</td>
                                <td className="py-3 px-6 text-center">{data.nomClient}</td>
                                <td className="py-3 px-6 text-center">{data.numDevis}</td>
                                <td className="py-3 px-6 text-center">{data.numQuittance}</td>
                                <td className="py-3 px-6 text-center">{formatDate(data.datePermis)}</td>
                                <td className="py-3 px-6 text-center">{data.montant}</td>
                                <td className="py-3 px-6 text-center">{data.lieu}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex space-x-2">
                                        {/* Bouton pour afficher/masquer les autres boutons */}
                                        <button className="flex items-center bg-[#293855] text-white px-2 py-1 rounded hover:bg-gray-600" 
                                            onClick={() => toggleButtons(i)}>...</button>

                                        {/* Affichage conditionnel des boutons */}
                                        {activeRowIndex === i && (
                                            <div className="flex space-x-2">
                                                <button className="flex items-center bg-[#4165D5] text-white px-2 py-1 rounded hover:bg-[#246af3]" onClick={() => handleDownloadPdf(data.numPermis)}>
                                                    <FileText className="mr-1" />
                                                </button>
                                                <button className="flex items-center bg-[#E95354] text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(data.numPermis)}>
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
                </div>
            </Dashboard>
        </div>
    );
}
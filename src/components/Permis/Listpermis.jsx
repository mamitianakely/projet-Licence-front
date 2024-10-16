import React, { useEffect, useState } from "react";
import axios from 'axios';
import Dashboard from "../Dashboard/Dashboard";
import { Trash, FileText } from 'lucide-react';

export default function Listpermis() {
    const [permis, setPermis] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleDelete = async (numPermis) => {
        try {
            await axios.delete(`http://localhost:5000/api/avis/${numPermis}`);
            setPermis(permis.filter(item => item.numPermis !== numPermis));
        } catch (err) {
            console.log(err);
        }
    };


    const handleDownloadPdf = async (numPermis) => {
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
    };
    

    /*const handleEtatChange = async (numAvis) => {
        try {
            // Appel à l'API pour mettre à jour l'état de l'avis à "payé"
            await axios.put(`http://localhost:5000/api/avis/${numAvis}/payer`);
    
            // Mise à jour locale des avis pour refléter le changement
            setAvis(prevAvis =>
                prevAvis.map(item =>
                    item.numAvis === numAvis ? { ...item, etat: 'payé' } : item
                )
            );
        } catch (err) {
            console.error("Erreur lors de la mise à jour de l'état :", err);
        }
    };*/

    const filteredPermis = permis.filter((data) => {
        const normalizedSearchTerm = searchTerm.toLowerCase(); // Normaliser le terme de recherche

        const matchesSearchTerm = (value) =>
            value && value.toString().toLowerCase().includes(normalizedSearchTerm); // Vérifie si la valeur inclut le terme normalisé

        return (
            matchesSearchTerm(data.nomClient) ||
            matchesSearchTerm(data.numAvis) ||
            matchesSearchTerm(data.numQuittance) ||
            matchesSearchTerm(data.montant) ||
            matchesSearchTerm(data.lieu) ||
            (data.datePermis && new Date(data.datePermis).toLocaleDateString().toLowerCase().includes(normalizedSearchTerm))
        );
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(); // Format par défaut : 'MM/DD/YYYY'
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
                        {/* <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={openAddModal}>AJOUTER</button> */}
                    </div>
                </div>

                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="w-full text-left bg-gray-200">
                            <th className="p-2">N° PERMIS</th>
                            <th className="p-2">NOM DU CLIENT</th>
                            <th className="p-2">N° DE L'AVIS CORRESPONDANT</th>
                            <th className="p-2">N° DE QUITTANCE</th>
                            <th className="p-2">DATE DELIVRANCE</th>
                            <th className="p-2">MONTANT PAYE</th>
                            <th className="p-2">LIEU DE CONSTRUCTION</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(permis) && filteredPermis.map((data, i) => (
                            <tr key={i} className="border-t">
                                <td className="py-3 px-6 text-left">{data.numPermis}</td>
                                <td className="py-3 px-6 text-left">{data.nomClient}</td>
                                <td className="py-3 px-6 text-left">{data.numAvis}</td>
                                <td className="py-3 px-6 text-left">{data.numQuittance}</td>
                                <td className="py-3 px-6 text-left">{formatDate(data.datePermis)}</td>
                                <td className="py-3 px-6 text-left">{data.montant}</td>
                                <td className="py-3 px-6 text-left">{data.lieu}</td>
                                <td className="py-3 px-6 text-left">
                                    <div className="flex space-x-2">
                                        <button className="flex items-center bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" onClick={() => handleDownloadPdf(data.numPermis)}>
                                            <FileText className="mr-1" />
                                        </button>
                                        <button className="flex items-center bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(data.numAvis)}>
                                            <Trash className="mr-1" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </Dashboard>
        </div>
    );
}
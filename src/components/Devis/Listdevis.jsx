import React, { useEffect, useState } from "react";
import axios from 'axios';
import Dashboard from "../Dashboard/Dashboard";
import { Trash } from 'lucide-react';

export default function Listdevis() {
    const [devis, setDevis] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

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
        try {
            await axios.delete(`http://localhost:5000/api/devis/${numDevis}`);
            setDevis(devis.filter(item => item.numDevis !== numDevis));
        } catch (err) {
            console.log(err);
        }
    };

    const filteredDevis = devis.filter((data) => {
        return (
            (data.prixLongueur && data.prixLongueur.toString().includes(searchTerm)) ||  // Comparer les nombres comme des chaînes
            (data.prixLargeur && data.prixLargeur.toString().includes(searchTerm)) ||    // Comparer les nombres comme des chaînes
            (data.montant && data.montant.toString().includes(searchTerm))               // Comparer les nombres comme des chaînes
        );
    });

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
                            <th className="p-2">N° DE DEVIS</th>
                            <th className="p-2">NOM DU CLIENT</th>
                            <th className="p-2">PRIX POUR LA LONGUEUR</th>
                            <th className="p-2">PRIX POUR LA LARGEUR</th>
                            <th className="p-2">MONTANT A PAYER</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(devis) && filteredDevis.map((data, i) => (
                            <tr key={i} className="border-t">
                                <td className="py-3 px-6 text-left">{data.numDevis}</td>
                                <td className="py-3 px-6 text-left">{data.nomClient}</td>
                                <td className="py-3 px-6 text-left">{data.prixLongueur}</td>
                                <td className="py-3 px-6 text-left">{data.prixLargeur}</td>
                                <td className="py-3 px-6 text-left">{data.montant}</td>
                                <td className="py-3 px-6 text-left">
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
            </Dashboard>
        </div>
    );
}
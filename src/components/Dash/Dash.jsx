import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from "axios";


export default function Dash() {
    const [totalClients, setTotalClients] = useState(0); // State to hold the total number of clients
    const [pendingDemandesCount, setPendingDemandesCount] = useState(0);
    const [demandesByType, setDemandesByType] = useState({ labels: [], datasets: [] });
    const [demandesByMonth, setDemandesByMonth] = useState({ labels: [], datasets: [] });
    const [totalDemandes, setTotalDemandes] = useState(0);
    const [totalDevis, setTotalDevis] = useState(0);
    const [averageMontant, setAverageMontant] = useState(0);
    const [minMontant, setMinMontant] = useState(0);
    const [maxMontant, setMaxMontant] = useState(0);

    useEffect(() => {
        const fetchTotalClients = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/clients/stats/total'); // Update this to your API endpoint
                const text = await response.text(); // Read the response as text
                console.log('Response:', text); // Log the response text
                const data = JSON.parse(text); // Attempt to parse as JSON
                setTotalClients(data.totalClients); // Set the total clients from the response
            } catch (error) {
                console.error('Error fetching total clients:', error);
            }
        };

        const fetchPendingDemandesCount = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/demandes/pending/count'); // Update this to your API endpoint
                const result = await response.json();
                setPendingDemandesCount(result.pendingDemandesCount);
            } catch (error) {
                console.error('Error fetching pending demandes:', error);
            }
        };

        const fetchDemandesByType = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/demandes/stats/type-by-month');
                const result = await response.json();

                // Log the result to check its structure
                console.log("Demandes by Type Response:", result);

                // Prepare data for the chart
                const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const types = {};

                result.forEach(item => {
                    const monthLabel = labels[item.month - 1]; // Convert month number to label
                    if (!types[item.typeDemande]) {
                        types[item.typeDemande] = Array(12).fill(0); // Initialize data array for each type
                    }
                    types[item.typeDemande][item.month - 1] = item.count;
                });

                const datasets = Object.keys(types).map(type => ({
                    label: type,
                    data: types[type],
                    backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
                    borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                }));

                setDemandesByType({ labels, datasets });
            } catch (error) {
                console.error('Error fetching demandes by type:', error);
            }
        };
        const fetchDemandesByMonth = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/demandes/stats/monthly');
                const result = await response.json();
                console.log("Réponse de l'API Demandes par Mois :", result);

                const data = Array(12).fill(0);

                result.forEach(item => {
                    const { month, total } = item;

                    // Extraire le numéro de mois de la chaîne '2024-09' pour obtenir 9
                    const monthNumber = parseInt(month.split('-')[1], 10);

                    // Vérifiez que monthNumber et total sont valides
                    if (Number.isInteger(monthNumber) && monthNumber >= 1 && monthNumber <= 12 && Number.isInteger(parseInt(total, 10))) {
                        data[monthNumber - 1] = parseInt(total, 10);
                    } else {
                        console.warn(`Entrée de données invalide:`, item);
                    }
                });

                console.log("Données préparées pour le graphique :", data);

                setDemandesByMonth({
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
                    datasets: [
                        {
                            label: 'Demandes par Mois',
                            data: data,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.4,
                        },
                    ],
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des demandes par mois:', error);
            }
        };

        const fetchTotalDemandes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/demandes/stats/total');
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Erreur réseau: ${errorData.error}`);
                }
                const data = await response.json();
                setTotalDemandes(data.total);
            } catch (error) {
                console.error('Erreur lors de la récupération du total des demandes:', error);
            }
        };

        const fetchTotalDevis = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/devis/total-devis', {
                    timeout: 5000, // temps d'attente de 5 secondes
                });
                setTotalDevis(response.data.total);
            } catch (error) {
                console.error('Erreur lors de la récupération du total des devis:', error);
            }
        };

        const fetchAverageDevis = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/devis/average');
                setAverageMontant(response.data.averageMontant); // Vérifiez ici que la réponse est correcte
            } catch (error) {
                console.error('Erreur lors de la récupération du montant moyen des devis:', error);
            }
        };

        const fetchMinMaxDevis = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/devis/minmax');
                const { minMontant, maxMontant } = response.data;
                setMinMontant(minMontant);
                setMaxMontant(maxMontant);
            } catch (error) {
                console.error('Erreur lors de la récupération des montants min et max des devis:', error);
            }
        };


        fetchTotalClients(); // Call the function to fetch total clients
        fetchPendingDemandesCount(); // Fetch pending demandes count
        fetchDemandesByType(); // Fetch the demandes data
        fetchDemandesByMonth();
        fetchTotalDemandes();
        fetchTotalDevis(); // Call the new function
        fetchAverageDevis();
        fetchMinMaxDevis();
    }, []); // Empty dependency array ensures this runs once when the component mounts


    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Server Resources',
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: true },
        },
    };

    const totalViewsData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Total Views',
                data: [15000, 18000, 3000, 5000, 25000, 35000, 45800],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const reportsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Reports Submitted',
                data: [10000, 11000, 9500, 8500, 6500, 5820],
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
            },
        ],
    };

    const socialProfilesData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                label: 'Active Social Profiles',
                data: [5200, 4900, 4800, 4517.82],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Dashboard>
                <div className="flex space-x-4">
                    {/* Bandwidth Reports Section */}
                    <div className="bg-white p-4 rounded-lg shadow-md flex-1">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl items-center font-semibold">Permit Reports</h2>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-md flex-1">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-xl font-bold text-gray-800">{totalDemandes}</p>
                                    <p className="text-sm text-gray-500">Total des demandes</p>
                                    <div className="w-full bg-gray-200 h-2 rounded-full">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${totalDemandes}%` }}></div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xl font-bold text-gray-800">{pendingDemandesCount}</p>
                                    <p className="text-sm text-gray-500">Demandes en attente</p>
                                    <div className="w-full bg-gray-200 h-2 rounded-full">
                                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${pendingDemandesCount}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <h2 className="text-lg font-semibold">Demandes par Mois</h2>
                            {/* Ajoutez ici le code pour afficher les demandes par mois */}


                            <div className="h-32">
                                <Line data={demandesByMonth} options={options} />
                            </div>

                            <h2 className="text-lg font-semibold">Type de Demandes par Mois</h2>
                            <div className="h-32">
                                <Bar data={demandesByType} options={options} />
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards Section */}
                    <div className="grid grid-cols-2 gap-4 flex-1">
                        <div className="bg-blue-200 p-4 rounded-lg text-center">
                            <p className="text-xl font-bold text-gray-800">{totalDevis}</p> {/* Updated to show total devis */}
                            <p className="text-sm text-gray-600">Total des devis</p>
                        </div>

                        <div className="bg-purple-200 p-4 rounded-lg text-center">
                            <h3 className="text-xl font-bold text-gray-800">Montant des devis</h3>
                            <p className="text-sm text-gray-600">Moyen : {averageMontant.toFixed(2)} Ariary</p>
                            <p className="text-sm text-gray-600">Minimum: {minMontant} Ariary</p>
                            <p className="text-sm text-gray-600">Maximum: {maxMontant} Ariary</p>
                        </div>

                        {/* Total Clients Card */}
                        <div className="bg-red-200 p-4 rounded-lg text-center">
                            <p className="text-3xl font-bold text-gray-800">{totalClients}</p>
                            <p className="text-sm text-gray-600">Total Clients</p>
                            <p className="text-sm text-red-700">↗ 175.5%</p>
                        </div>
                        {/* New card for pending demandes */}
                        <div className="bg-yellow-200 p-4 rounded-lg text-center">
                            <p className="text-3xl font-bold text-gray-800">{pendingDemandesCount}</p>
                            <p className="text-sm text-gray-600">Demandes en attente</p>
                            <p className="text-sm text-yellow-700">↗ 14.3%</p>
                        </div>
                    </div>
                </div>

                {/* Additional Statistics Section */}
                <div className="mt-8 grid grid-cols-3 gap-4">
                    {/* Total Views */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold">45.8k</h2>
                        <p className="text-sm text-gray-500">Total Views</p>
                        <p className="text-green-500">↑ 175.5%</p>
                        <div className="h-32 mt-4">
                            <Line data={totalViewsData} options={options} />
                        </div>
                    </div>



                    {/* Reports Submitted */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold">5.82k</h2>
                        <p className="text-sm text-gray-500">Reports Submitted</p>
                        <p className="text-red-500">↓ 54.1%</p>
                        <div className="h-32 mt-4">
                            <Bar data={reportsData} options={options} />
                        </div>
                    </div>

                    {/* Active Social Profiles */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold">4.5k</h2>
                        <p className="text-sm text-gray-500">Active Social Profiles</p>
                        <p className="text-blue-500">↑ 22.1%</p>
                        <div className="h-32 mt-4">
                            <Line data={socialProfilesData} options={options} />
                        </div>
                    </div>
                </div>
            </Dashboard >
        </div >
    );
}

import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from '../../AxiosConfig';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function Dash() {
    const [totalClients, setTotalClients] = useState(0);
    const [pendingDemandesCount, setPendingDemandesCount] = useState(0);
    const [totalDemandes, setTotalDemandes] = useState(0);
    const [demandesByType, setDemandesByType] = useState({ labels: [], datasets: [] });
    const [demandesByMonth, setDemandesByMonth] = useState({ labels: [], datasets: [] });
    const [totalDevis, setTotalDevis] = useState(0);
    const [averageMontant, setAverageMontant] = useState(0);
    const [minMontant, setMinMontant] = useState(0);
    const [maxMontant, setMaxMontant] = useState(0);
    const [totalPermis, setTotalPermis] = useState(0);
    const [tauxApprobation, setTauxApprobation] = useState({ approved: 0, nonApproved: 0 });
    const [totalMontant, setTotalMontant] = useState(0);
    const [clientsWithoutDemands, setClientsWithoutDemands] = useState(0);
    const [demandesSansDevis, setDemandesSansDevis] = useState(0);
    const [demandesParEtatDevis, setDemandesParEtatDevis] = useState({
        labels: [],
        datasets: [],
    });

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverOffset: 4,
            },
        ],
    });


    const [clientsDistributionByRegion, setClientsDistributionByRegion] = useState([]);
    // Déclarez l'état pour afficher les régions et gérer le bouton "Voir plus"
    const [visibleRegions, setVisibleRegions] = useState(clientsDistributionByRegion.slice(0, 2)); // Affichez d'abord 2 régions
    const [showAllRegions, setShowAllRegions] = useState(false); // Etat pour savoir si on doit afficher toutes les régions

    // Gérer l'affichage de plus de régions
    const handleShowMoreRegions = () => {
        setVisibleRegions(clientsDistributionByRegion); // Afficher toutes les régions
        setShowAllRegions(true); // Modifier l'état pour indiquer que toutes les régions sont affichées
    };



    useEffect(() => {
        //total des clients
        const fetchTotalClients = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/clients/stats/total`);
                console.log('Response:', response.data);
                setTotalClients(response.data.totalClients);
            } catch (error) {
                console.error('Error fecthing total clients:', error);
            }
        };

        // Demande en attente
        const fetchPendingDemandesCount = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/demandes/pending/count');
                console.log('Response:', response.data);
                setPendingDemandesCount(response.data.pendingDemandesCount);
            } catch (error) {
                console.error('Error fetching pending demandes:', error);
            }
        };

        // total des demande
        const fetchTotalDemandes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/demandes/stats/total'); // Utilisation d'axios pour récupérer les données
                const data = response.data; // La réponse est directement dans response.data

                setTotalDemandes(data.total); // Mise à jour de l'état avec la valeur récupérée
            } catch (error) {
                console.error('Erreur lors de la récupération du total des demandes:', error.response ? error.response.data : error.message); // Gestion des erreurs
            }
        };

        // demande par type
        const fetchDemandesByType = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/demandes/stats/type-by-month'); // Utilisation de axios pour récupérer les données
                const result = response.data; // Récupérer directement la réponse

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
                console.error('Error fetching demandes by type:', error); // Gestion de l'erreur si la requête échoue
            }
        };

        // demande par mois
        const fetchDemandesByMonth = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/demandes/stats/monthly'); // Utilisation de axios pour récupérer les données
                const result = response.data; // Récupérer directement la réponse

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
                console.error('Erreur lors de la récupération des demandes par mois:', error); // Gestion de l'erreur si la requête échoue
            }
        };

        //client par quartier   
        const fetchClientsDistributionByRegion = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/clients/stats/distribution');
                const data = response.data;

                // Stocker les données brutes pour un affichage sous forme de liste
                setClientsDistributionByRegion(data);
            } catch (error) {
                console.error('Erreur lors de la récupération de la distribution des clients par région:', error);
            }
        };

        // total des devis
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

        // average montant
        const fetchAverageDevis = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/devis/average');
                setAverageMontant(response.data.averageMontant); // Vérifiez ici que la réponse est correcte
            } catch (error) {
                console.error('Erreur lors de la récupération du montant moyen des devis:', error);
            }
        };

        // montant min et max
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

        // total permis

        const fetchTotalPermis = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/permis/total-permis');
                setTotalPermis(response.data.total); // Mettre à jour le state avec le total des permis
            } catch (error) {
                console.error('Erreur lors de la récupération du total des permis:', error);
            }
        };

        // Taux d'approbation de demandes en permis

        const fetchTauxApprobation = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/permis/taux-approbation');
                const { totalDemandes, totalPermis, tauxApprobation } = response.data;

                const approved = totalPermis;
                const nonApproved = totalDemandes - totalPermis;

                setTauxApprobation({ approved, nonApproved });
            } catch (error) {
                console.error('Error fetching approval rate:', error);
            }
        };

        // montant total de permis
        const fetchTotalMontant = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/permis/montant-quittances');
                setTotalMontant(response.data.montantTotalQuittances || 0); // Utiliser || 0 pour éviter undefined
            } catch (error) {
                console.error('Erreur lors de la récupération du montant total:', error);
            }
        };

        // Fonction pour récupérer le nombre de clients sans demande
        const fetchClientsWithoutDemands = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/clients/stats/sans-demands');
                setClientsWithoutDemands(response.data.clientsSansDemande);
            } catch (error) {
                console.error("Erreur lors de la récupération des clients sans demande:", error);
            }
        };

        // Fonction pour récupérer le nombre de demandes sans devis
        const fetchDemandsAwaitingDevisCount = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/demandes/stats/count-awaiting-devis"); // Adaptez l'URL si nécessaire
                setDemandesSansDevis(response.data.count);
            } catch (err) {
                console.error("Erreur lors de la récupération des demandes en attente de devis:", err);

            }
        };

        // Fonction pour récupérer les demandes par état de devis
        const fetchDemandsByDevisState = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/devis/states/demands-by-devis-state");
                console.log("Demandes par état de devis:", response.data);

                // Préparer les données pour le graphique
                const labels = response.data.map(item => item.etat); // Les états (e.g., 'validé', 'en attente')
                const data = response.data.map(item => item.total); // Les totaux par état
                const backgroundColors = labels.map(() =>
                    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
                );

                setDemandesParEtatDevis({
                    labels,
                    datasets: [
                        {
                            label: "Demandes par état de devis",
                            data,
                            backgroundColor: backgroundColors,
                            hoverBackgroundColor: backgroundColors.map(color =>
                                color.replace('0.6', '0.8')
                            ),
                        },
                    ],
                });
            } catch (error) {
                console.error("Erreur lors de la récupération des demandes par état de devis:", error);
            }
        };

        // Fonction pour récupérer les données du backend
        const fetchPermisStats = async () => {
            try {
                const token = localStorage.getItem('token');  // Récupérer le token JWT depuis localStorage ou autre source

                const response = await fetch('http://localhost:5000/api/permis/permistaille/repartition', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,  // Ajouter le jeton dans l'en-tête Authorization
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP: ${response.status}`);
                }

                const data = await response.json();

                // Log des données pour débogage
                console.log('Données reçues :', data);

                if (data && Array.isArray(data.data)) {
                    const labels = data.data.map(item => item.taille_projet);
                    const counts = data.data.map(item => item.nombre_permis);

                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                data: counts,
                                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                                hoverOffset: 4,
                            },
                        ],
                    });
                } else {
                    console.error('La structure des données est incorrecte');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données de permis', error);
            }
        };


        fetchTotalClients();
        fetchPendingDemandesCount();
        fetchTotalDemandes();
        fetchDemandesByType();
        fetchDemandesByMonth();
        fetchTotalDevis();
        fetchAverageDevis();
        fetchMinMaxDevis();
        fetchTotalPermis();
        fetchTauxApprobation();
        fetchTotalMontant();
        fetchClientsWithoutDemands();
        fetchDemandsAwaitingDevisCount();
        fetchDemandsByDevisState();
        fetchClientsDistributionByRegion();
        fetchPermisStats();
    }, []);

    const data = {
        labels: ['Permis approuvé', 'Permis non approuvé'],
        datasets: [{
            data: [tauxApprobation.approved, tauxApprobation.nonApproved],
            backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)',
            ],
            hoverBackgroundColor: [
                'rgba(75, 192, 192, 0.8)',
                'rgba(255, 99, 132, 0.8)',
            ],
        }],
    };

    const options = {
        maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: true },
        },
    };

    const option = {
        maintainAspectRatio: false,
        responsive: true,  // Assure que le graphique est responsive
        cutout: "70%",     // Ajuste la largeur du donut
        plugins: {
            legend: {
                position: "bottom",
            },
        },
    };

    const optionss = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
        },
        maintainAspectRatio: false,
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Dashboard>
                <div className="flex space-x-3">
                    {/* Bandwidth Reports Section */}
                    <div className="bg-white p-1 rounded-lg shadow-md flex-1">
                        <div className="flex justify-center items-center mb-1">
                            <h2 className="text-lg font-semibold text-[#213a58] mb-3">Rapports pour le permis</h2>
                        </div>


                        <div className="bg-white p-3 rounded-lg shadow-md flex-1">
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                {/* Total Demandes */}
                                <div>
                                    <p className="text-lg font-bold text-indigo-800">{totalDemandes}</p>
                                    <p className="text-xs text-[#oc6478]">Total des demandes</p>
                                    <div className="w-full bg-gray-200 h-1 rounded-full">
                                        <div className="bg-[#108ab1] h-1 rounded-full" style={{ width: `${totalDemandes}%` }}></div>
                                    </div>
                                </div>

                                {/* Pending Demandes */}
                                <div>
                                    <p className="text-lg font-bold text-indigo-800">{pendingDemandesCount}</p>
                                    <p className="text-xs text-[#oc6478]">Demandes en attente</p>
                                    <div className="w-full bg-gray-200 h-1 rounded-full">
                                        <div className="bg-[#108ab1] h-1 rounded-full" style={{ width: `${pendingDemandesCount}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Graphs */}
                            <h2 className="text-sm font-semibold p-2 text-indigo-800">Demandes par Mois</h2>
                            <div className="h-24">
                                <Line data={demandesByMonth} options={options} />
                            </div>

                            <h2 className="text-sm font-semibold p-2 text-indigo-800 mt-3">Type de Demandes par Mois</h2>
                            <div className="h-24">
                                <Bar data={demandesByType} options={options} />
                            </div>
                        </div>
                    </div>


                    {/* Statistics Cards Section */}
                    <div className="grid grid-cols-2 gap-3 flex-1">
                        {/* Total Devis */}
                        <div className="bg-gradient-to-r from-[#68e0cf] to-[#209cff] p-3 h-55 rounded-lg text-center">
                            <h3 className="text-lg font-bold text-gray-800 mb-3 mt-2">Devis et permis</h3>
                            <p className="text-2xs text-gray-600">Total des devis : <span className="font-semibold text-gray-700">{totalDevis}</span></p>
                            <p className="text-2xs text-gray-600">Total des permis : <span className="font-semibold text-gray-700">{totalPermis}</span></p>
                            <p className="text-2xs text-gray-600">Bénéfice : <span className="font-semibold text-gray-700">{totalMontant || 0} Ariary</span></p>
                        </div>


                        {/* Montant des devis */}
                        <div className="bg-gradient-to-r from-[#2f5cff] to-[#dbf4ff] p-4 rounded-lg shadow-md text-center">
                            <h3 className="text-lg font-bold text-[#023336] mb-3 mt-2">Montant des devis</h3>

                            {/* Montant avec icône Dollar */}
                            <div className="flex items-center justify-center space-x-2 text-sm font-medium text-gray-700 border-b border-gray-300 pb-2 mb-2">
                                <DollarSign className="text-green-600" size={18} />
                                <span className="text-gray-800">{averageMontant.toFixed(2)} Ariary</span>
                            </div>

                            {/* Montant avec icône TrendingDown */}
                            <div className="flex items-center justify-center space-x-2 text-sm font-medium text-gray-700 border-b border-gray-300 pb-2 mb-2">
                                <TrendingDown className="text-red-500" size={18} />
                                <span className="text-gray-800">{minMontant} Ariary</span>
                            </div>

                            {/* Montant avec icône TrendingUp */}
                            <div className="flex items-center justify-center space-x-2 text-sm font-medium text-gray-700">
                                <TrendingUp className="text-blue-600" size={18} />
                                <span className="text-gray-800">{maxMontant} Ariary</span>
                            </div>
                        </div>




                        {/* Statistics Cards Section */}
                        <div className="bg-gradient-to-r from-[#2f5cff] to-[#dbf4ff] p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold text-[#023336] text-center mb-4 mt-6">Répartition des Clients par Quartier</h2>


                            <div className="space-y-3">
                                {showAllRegions && (
                                    <div>
                                        {visibleRegions.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:bg-indigo-50 transition-colors">
                                                <span className="text-sm font-medium text-gray-700">{item.region}</span>
                                                <span className="text-sm font-semibold text-indigo-600">{item.clientCount}</span>
                                            </div>
                                        ))}
                                        {/* Bouton pour fermer la liste */}
                                        <div className="text-right mt-2">
                                            <button
                                                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                onClick={() => setShowAllRegions(false)}
                                            >
                                                &#x2715; {/* Icône de croix */}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {!showAllRegions && (
                                <div className="text-center mt-4">
                                    <button className="px-10 py-2 bg-blue-500 text-black text-sm font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        onClick={handleShowMoreRegions}>
                                        Voir
                                    </button>

                                </div>
                            )}
                        </div>



                        {/* Clients sans demande et demandes sans devis */}
                        {/* Clients sans demande et demandes sans devis */}
                        <div className="bg-gradient-to-r from-[#68e0cf] to-[#209cff] p-4 rounded-lg shadow-md text-center">
                            <h3 className="text-lg font-bold text-gray-800 mb-3 mt-2">Client et demande</h3>
                            <p className="text-2xs text-gray-700">
                                Total Clients : <span className="font-bold text-indigo-600">{totalClients}</span>
                            </p>
                            <p className="text-2xs text-gray-700">
                                Clients Sans Demande : <span className="font-bold text-indigo-600">{clientsWithoutDemands}</span>
                            </p>
                            <p className="text-2xs text-gray-700">
                                Demandes Sans Devis : <span className="font-bold text-indigo-600">{demandesSansDevis}</span>
                            </p>
                        </div>


                    </div>
                </div>


                {/* Additional Statistics Section */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {/* Avis de Paiement Acceptés */}
                    <div className="bg-white p-3 rounded-md shadow-sm border border-indigo-200">
                        <h2 className="text-sm font-bold text-[#032f30] mb-3">Statistiques des Permis par Taille de Projet</h2>

                        <div style={{ height: "60%" }}>
                            <Pie data={chartData} options={optionss} />
                        </div>
                    </div>

                    {/* Statistiques des Demandes */}
                    <div className="flex space-x-4">
    {/* Doughnut Chart for Demands by Devis State */}
    <div className="bg-white p-4 rounded-lg shadow-md flex-1">
        <h3 className="text-sm font-bold text-[#032f30] mb-3">Demandes par État de Devis</h3>
        <div style={{ height: "75%" }}>
            <Doughnut data={demandesParEtatDevis} options={option} />
        </div>
    </div>

    {/* Reports Submitted */}
    <div className="bg-white p-3 rounded-md shadow-sm border border-cyan-200 flex-1">
        <h2 className="text-sm font-bold text-[#032f30] mb-3">Taux d'Approbation de demande en permis</h2>
        <div style={{ height: "75%" }}>
            <Pie data={data} options={{ maintainAspectRatio: false }} />
        </div>
    </div>
</div>

                </div>
            </Dashboard >
        </div >
    );
}

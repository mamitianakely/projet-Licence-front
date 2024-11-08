import React, { useEffect, useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from "axios";
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

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
    const [acceptedAvisPaiement, setAcceptedAvisPaiement] = useState(0);
    const [totalAvisPaiement, setTotalAvisPaiement] = useState(0);
    const [totalPermis, setTotalPermis] = useState(0);
    const [tauxApprobation, setTauxApprobation] = useState({ approved: 0, nonApproved: 0 });
    const [totalMontant, setTotalMontant] = useState(0); // New state for total amount
    const [clientsWithoutDemands, setClientsWithoutDemands] = useState(0);
    const [demandesSansDevis, setDemandesSansDevis] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [percentageWithAvis, setPercentageWithAvis] = useState(0);


    const [clientsDistributionByRegion, setClientsDistributionByRegion] = useState([]);
    // Déclarez l'état pour afficher les régions et gérer le bouton "Voir plus"
    const [visibleRegions, setVisibleRegions] = useState(clientsDistributionByRegion.slice(0, 2)); // Affichez d'abord 2 régions
    const [showAllRegions, setShowAllRegions] = useState(false); // Etat pour savoir si on doit afficher toutes les régions

    // Gérer l'affichage de plus de régions
    const handleShowMoreRegions = () => {
        setVisibleRegions(clientsDistributionByRegion); // Afficher toutes les régions
        setShowAllRegions(true); // Modifier l'état pour indiquer que toutes les régions sont affichées
    };



    // Donut chart data for payment states
    const [paiementsByState, setPaiementsByState] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
            ],
        }],
    });

    // Données pour le graphique Doughnut
    const doughnutData = {
        labels: ['Avec avis de paiement', 'Sans avis de paiement'],
        datasets: [{
            data: [percentageWithAvis, 100 - percentageWithAvis],
            backgroundColor: [
                'rgba(54, 162, 235, 0.6)', // Couleur pour les demandes avec avis
                'rgba(255, 99, 132, 0.6)', // Couleur pour les demandes sans avis
            ],
            hoverBackgroundColor: [
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 99, 132, 0.8)',
            ],
        }],
    };

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

        const fetchAcceptedAvisPaiement = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/avis/accepted-paiement-count');
                setAcceptedAvisPaiement(response.data.acceptedCount);
            } catch (error) {
                console.error('Erreur lors de la récupération des avis de paiement acceptés:', error);
            }
        };

        const fetchPaiementsByState = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/avis/paiements-by-state');
                const data = response.data;

                // Prepare data for the donut chart
                const labels = data.map(item => item.etat); // Extract labels
                const values = data.map(item => item.count); // Extract values

                setPaiementsByState({
                    labels,
                    datasets: [{
                        data: values,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                        ],
                    }],
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des paiements par état:', error);
            }
        };

        const fetchTotalAvisPaiement = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/avis/paiementsTotal'); // Met à jour cette URL avec ton point de terminaison API
                setTotalAvisPaiement(response.data.total); // Définit le total des avis de paiement à partir de la réponse
            } catch (error) {
                console.error('Erreur lors de la récupération du total des avis de paiement:', error);
            }
        };

        const fetchTotalPermis = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/permis/total-permis');
                setTotalPermis(response.data.total); // Mettre à jour le state avec le total des permis
            } catch (error) {
                console.error('Erreur lors de la récupération du total des permis:', error);
            }
        };

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
        // Add this function to fetch the total amount
        const fetchTotalMontant = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/permis/montant-quittances');
                setTotalMontant(response.data.montantTotalQuittances || 0); // Utiliser || 0 pour éviter undefined
            } catch (error) {
                console.error('Erreur lors de la récupération du montant total:', error);
            }
        };
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


        // Fonction pour récupérer le nombre de clients sans demande
        const fetchClientsWithoutDemands = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/clients/stats/sans-demands');
                setClientsWithoutDemands(response.data.clientsSansDemande);
            } catch (error) {
                console.error("Erreur lors de la récupération des clients sans demande:", error);
            }
        };

        const fetchDemandesWithoutDevis = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/demandes/stats/count-awaiting-devis');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json(); // Pas besoin de parser manuellement ici
                console.log('Response:', data); // Log the response object

                // Assurez-vous d'utiliser "count" comme clé
                setDemandesSansDevis(data.count); // Met à jour l'état avec la valeur de count
            } catch (error) {
                console.error('Error fetching demandes without devis:', error);
            }
        };

        const fetchPercentage = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/demandes/stats/conversion-rate"); // Assurez-vous que l'API renvoie bien le pourcentage
                setPercentage(response.data.percentage || 50); // Par défaut, on affiche 50%
            } catch (error) {
                console.error("Erreur lors de la récupération du pourcentage:", error);
                setPercentage(50); // Valeur par défaut en cas d'erreur
            }
        };

        // Fonction pour récupérer le pourcentage des demandes avec un avis de paiement
        const fetchPercentageWithAvis = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/demandes/stats/percentage-with-avis');
                setPercentageWithAvis(response.data.percentage);
            } catch (error) {
                console.error('Erreur lors de la récupération du pourcentage des demandes avec avis de paiement:', error);
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
        fetchAcceptedAvisPaiement();
        fetchPaiementsByState();
        fetchTotalAvisPaiement();
        fetchTotalPermis();
        fetchTauxApprobation();
        fetchTotalMontant();
        fetchClientsDistributionByRegion();
        fetchClientsWithoutDemands();
        fetchDemandesWithoutDevis();
        fetchPercentage();
        fetchPercentageWithAvis();
    }, []); // Empty dependency array ensures this runs once when the component mounts


    const data = {
        labels: ['Permis aprprové', 'Permis non apprové'],
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





    return (
        <div className="min-h-screen bg-gray-100">
            <Dashboard>
                <div className="flex space-x-3">
                    {/* Bandwidth Reports Section */}
                    <div className="bg-white p-3 rounded-lg shadow-md flex-1">
                        <div className="flex justify-center items-center mb-3">
                            <h2 className="text-lg font-semibold text-indigo-800">Permit Reports</h2>
                        </div>


                        <div className="bg-white p-3 rounded-lg shadow-md flex-1">
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                {/* Total Demandes */}
                                <div>
                                    <p className="text-lg font-bold text-indigo-800">{totalDemandes}</p>
                                    <p className="text-xs text-amber-500">Total des demandes</p>
                                    <div className="w-full bg-gray-200 h-1 rounded-full">
                                        <div className="bg-amber-500 h-1 rounded-full" style={{ width: `${totalDemandes}%` }}></div>
                                    </div>
                                </div>

                                {/* Pending Demandes */}
                                <div>
                                    <p className="text-lg font-bold text-indigo-800">{pendingDemandesCount}</p>
                                    <p className="text-xs text-amber-500">Demandes en attente</p>
                                    <div className="w-full bg-gray-200 h-1 rounded-full">
                                        <div className="bg-cyan-500 h-1 rounded-full" style={{ width: `${pendingDemandesCount}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Graphs */}
                            <h2 className="text-sm font-semibold text-indigo-800">Demandes par Mois</h2>
                            <div className="h-24">
                                <Line data={demandesByMonth} options={options} />
                            </div>

                            <h2 className="text-sm font-semibold text-indigo-800 mt-3">Type de Demandes par Mois</h2>
                            <div className="h-24">
                                <Bar data={demandesByType} options={options} />
                            </div>
                        </div>
                    </div>


                    {/* Statistics Cards Section */}
                    <div className="grid grid-cols-2 gap-3 flex-1">
                        {/* Total Devis */}
                        <div className="bg-indigo-200 p-3 rounded-lg text-center">
                            <p className="text-lg font-bold text-gray-800">{totalDevis}</p>
                            <p className="text-xs text-gray-600">Total des devis</p>
                        </div>




                        {/* Montant des devis */}
                        <div className="bg-cyan-100 p-4 rounded-lg shadow-md text-center">
                            <h3 className="text-lg font-bold text-gray-800 mb-3">Montant des devis</h3>

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
                        <div className="bg-indigo-100 p-6 rounded-lg shadow-lg">
                            <h2 className="text-lg font-semibold text-indigo-700 text-center mb-4">Répartition des Clients par Quartier</h2>


                            <div className="space-y-3">
                                {visibleRegions.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:bg-indigo-50 transition-colors">
                                        <span className="text-sm font-medium text-gray-700">{item.region}</span>
                                        <span className="text-sm font-semibold text-indigo-600">{item.clientCount}</span>
                                    </div>
                                ))}
                            </div>

                            {!showAllRegions && (
                                <div className="text-center mt-4">
                                    <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        onClick={handleShowMoreRegions}>
                                        Voir plus
                                    </button>
                                </div>
                            )}
                        </div>



                        {/* Clients sans demande et demandes sans devis */}
                        {/* Clients sans demande et demandes sans devis */}
                        <div className="bg-cyan-100 p-4 rounded-lg shadow-md text-center">
                            <p className="text-sm text-gray-700">
                                Total Clients : <span className="font-bold text-indigo-700">{totalClients}</span>
                            </p>
                            <p className="text-sm text-gray-700">
                                Clients Sans Demande : <span className="font-bold text-cyan-600">{clientsWithoutDemands}</span>
                            </p>
                            <p className="text-sm text-gray-700">
                                Demandes Sans Devis : <span className="font-bold text-cyan-600">{demandesSansDevis}</span>
                            </p>
                        </div>


                    </div>
                </div>


                {/* Additional Statistics Section */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {/* Avis de Paiement Acceptés */}
                    <div className="bg-indigo-100 p-3 rounded-md shadow-sm border border-indigo-200">
                        <h2 className="text-sm font-bold text-indigo-800 mb-1">Avis de Paiement</h2>
                        <p className="text-xs text-gray-600">Total : <span className="font-semibold text-amber-500">{totalAvisPaiement}</span></p>
                        <p className="text-xs text-gray-600">Paiement effectué : <span className="font-semibold text-cyan-600">{acceptedAvisPaiement}</span></p>
                        <div className="h-20 mt-2 flex items-center justify-center">
                            <Doughnut data={paiementsByState} options={{ maintainAspectRatio: false }} />
                        </div>
                        <p className="text-xs font-semibold text-indigo-700 mt-2">Variation des paiements</p>
                    </div>

                    {/* Reports Submitted */}
                    <div className="bg-cyan-100 p-3 rounded-md shadow-sm border border-cyan-200">
                        <h2 className="text-sm font-bold text-cyan-800 mb-1">Permis Délivrés</h2>
                        <p className="text-xs text-gray-600">Total : <span className="font-semibold text-amber-500">{totalPermis}</span></p>
                        <p className="text-xs text-gray-600">Montant généré : <span className="font-semibold text-amber-500">{totalMontant || 0} Ariary</span></p>
                        <div className="h-20 mt-2 flex items-center justify-center">
                            <Pie data={data} options={{ maintainAspectRatio: false }} />
                        </div>
                        <p className="text-xs font-semibold text-cyan-700 mt-2">Taux d'Approbation</p>
                    </div>

                    {/* Statistiques des Demandes */}
                    <div className="bg-indigo-100 p-3 rounded-md shadow-sm border border-indigo-200">
                        <h2 className="text-sm font-bold text-indigo-800 mb-1">Statistiques des Demandes</h2>
                        <div className="h-20 mt-2 flex items-center justify-center">
                            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
                        </div>
                        <p className="text-xs font-semibold text-indigo-700 mt-2">Distribution des Demandes</p>
                    </div>
                </div>



            </Dashboard >
        </div >
    );
}

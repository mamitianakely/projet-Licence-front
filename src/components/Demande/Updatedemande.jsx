import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function Updatedemande() {
    const [dateDemande, setDateDemande] = useState('');
    const [typeDemande, setTypeDemande] = useState('');
    const [longueur, setLongueur] = useState('');
    const [largeur, setLargeur] = useState('');
    const [error, setError] = useState(null);  // État pour gérer les erreurs

    const { numDemande } = useParams();  // Récupère numDemande à partir de l'URL
    const navigate = useNavigate();

    // Fonction pour charger les données de la demande existante
    useEffect(() => {
        if (!numDemande) {
            setError("numDemande est manquant ou invalide.");
            return; // Empêche d'exécuter une requête avec un numDemande non défini
        }

        // Appel à l'API pour récupérer les données
        axios.get(`http://localhost:8000/updatedemande/${numDemande}`)
            .then(res => {
                if (res.data.length === 0) {
                    setError("Aucune demande trouvée avec ce numéro.");
                } else {
                    const data = res.data[0];
                    setDateDemande(data.dateDemande);
                    setTypeDemande(data.typeDemande);
                    setLongueur(data.longueur);
                    setLargeur(data.largeur);
                }
            })
            .catch(err => {
                setError("Erreur lors de la récupération de la demande.");
                console.error(err);
            });
    }, [numDemande]);

    // Fonction pour soumettre le formulaire
    function handleSubmit(event) {
        event.preventDefault();
        
        if (!numDemande) {
            setError("numDemande est manquant. Impossible de procéder.");
            return;
        }

        axios.put(`http://localhost:8000/updatedemande/${numDemande}`, {
            dateDemande,
            typeDemande,
            longueur,
            largeur
        })
        .then(res => {
            navigate('/listdemande'); // Redirige vers la liste des demandes après la mise à jour
        })
        .catch(err => {
            setError("Erreur lors de la mise à jour de la demande.");
            console.error(err);
        });
    }

    return (
        <div className="form1">
            <div className="form11">
                <div className="form111">
                    <form onSubmit={handleSubmit}>
                        <h2>MODIFIER UNE DEMANDE</h2>

                        {error && <div className="alert alert-danger">{error}</div>}  {/* Affiche les erreurs */}

                        <div className="mb-2">
                            <label htmlFor="">Date de la demande : </label>
                            <input type=" text" className="form-control" value={dateDemande} onChange={e => setDateDemande(e.target.value)} />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Nature de la demande : </label>
                            <input type="text" className="form-control" value={typeDemande} onChange={e => setTypeDemande(e.target.value )} />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Longueur : </label>
                            <input type="number" step="0.01" className="form-control" value={longueur} onChange={e => setLongueur(e.target.value)} />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="">Largeur : </label>
                            <input type="number" step="0.01" className="form-control" value={largeur} onChange={e => setLargeur(e.target.value)} />
                        </div>

                        <button type="submit" className="btn btn-success">MODIFIER</button>
                        <a href="/listdemande" className="btn btn-danger ms-2">ANNULER</a>
                    </form>
                </div>
            </div>
        </div>
    );
}

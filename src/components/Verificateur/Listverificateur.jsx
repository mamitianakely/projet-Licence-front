import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Listverificateur() {
    const [verificateur, setVerificateur] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    

    const handleSearch = (event) => {
        event.preventDefault();
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleDelete = async (numVerificateur) => {
        try {
            await axios.delete(`http://localhost:8000/ajoutverificateur/${numVerificateur}`);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }
    

    useEffect(() => {
        axios.get('http://localhost:8000/listverificateur')
            .then(res => setVerificateur(res.data))
            .catch(err => console.log(err));
    }, []);
    

    const filteredVerificateur = verificateur.filter((data) => {
        return (
            data.nomVerificateur.toLowerCase().includes(searchTerm) ||
            new Date(data.dateDescente).toLocaleDateString().includes(searchTerm)
        );
    });

 // Formatage de la date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(); // Format par défaut : 'MM/DD/YYYY'
    };

    return (
        <div className="container-fluid min-vh-100">
            <div className="aze" >
                <div>
                    <form onSubmit={(e) => e.preventDefault()} className="form-control">
                        <label htmlFor="searchInput" />
                        <input type="text" placeholder="Rechercher" value={searchTerm} className="recherche" id="searchInput" onChange={handleSearch}
                        />
                    </form>
                    <a href="http://localhost:3000/ajoutverificateur" className="btn btn-primary">AJOUTER</a>
                </div>
            </div>
            <table className="table" id="table1">
                <thead>
                    <tr>
                        <th>Numero du verificateur</th>
                        <th>Nom du verificateur</th>
                        <th>Date de Descente</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(verificateur) && filteredVerificateur.map((data, i) => (
                        <tr key={i}>
                            <td>{data.numVerificateur}</td>
                            <td>{data.nomVerificateur}</td>
                            <td>{formatDate(data.dateDescente)}</td>
                            <td><Link to={`/updateverificateur/${data.numVerificateur}`} className='btn btn-primary'>Modifier</Link></td>
                            <td><button className="btn btn-danger" onClick={e => handleDelete(data.numVerificateur)}>Supprimer</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}
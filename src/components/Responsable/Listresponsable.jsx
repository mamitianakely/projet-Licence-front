import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Listresponsable() {
    const [responsable, setResponsable] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        event.preventDefault();
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleDelete = async (numResponsable) => {
        try {
            await axios.delete(`http://localhost:8000/ajoutresponsable/${numResponsable}`);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        axios.get('http://localhost:8000/listresponsable')
            .then(res => setResponsable(res.data))
            .catch(err => console.log(err));
    }, []);
    

    const filteredResponsable = responsable.filter((data) => {
        return (
            data.nomResponsable.toLowerCase().includes(searchTerm) ||
            data.motDePasse.toLowerCase().includes(searchTerm)
        );
    });

    return (
        <div className="container-fluid min-vh-100">
            <div className="aze" >
                <div>
                    <form onSubmit={(e) => e.preventDefault()} className="form-control">
                        <label htmlFor="searchInput" />
                        <input type="text" placeholder="Rechercher" value={searchTerm} className="recherche" id="searchInput" onChange={handleSearch}
                        />
                    </form>
                    <a href="http://localhost:3000/ajoutresponsable" className="btn btn-primary">AJOUTER</a>
                </div>
            </div>
            <table className="table" id="table1">
                <thead>
                    <tr>
                        <th>Numero du Responsable</th>
                        <th>Nom du Responsable</th>
                        <th>Mot de Passe</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(responsable) && filteredResponsable.map((data, i) => (
                        <tr key={i}>
                            <td>{data.numResponsable}</td>
                            <td>{data.nomResponsable}</td>
                            <td>{data.motDePasse}</td>
                            <td><Link to={`/updateresponsable/${data.numResponsable}`} className='btn btn-primary'>Modifier</Link></td>
                            <td><button className="btn btn-danger" onClick={e => handleDelete(data.numResponsable)}>Supprimer</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}
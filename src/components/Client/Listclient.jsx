import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Listclient() {
    const [client, setClient] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    

    const handleSearch = (event) => {
        event.preventDefault();
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleDelete = async (numClient) => {
        try {
            await axios.delete(`http://localhost:8000/client/${numClient}`);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }
    

    useEffect(() => {
        axios.get('http://localhost:8000/listclient')
            .then(res => setClient(res.data))
            .catch(err => console.log(err));
    }, []);
    

    const filteredClient = client.filter((data) => {
        return (
            data.nomClient.toLowerCase().includes(searchTerm) ||
            data.adresse.toLowerCase().includes(searchTerm) ||
            data.contact.toLowerCase().includes(searchTerm)
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
                    <a href="http://localhost:3000/client" className="btn btn-primary">AJOUTER</a>
                </div>
            </div>
            <table className="table" id="table1">
                <thead>
                    <tr>
                        <th>Numero du Client</th>
                        <th>Nom du Client</th>
                        <th>Adresse</th>
                        <th>Contact</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(client) && filteredClient.map((data, i) => (
                        <tr key={i}>
                            <td>{data.numClient}</td>
                            <td>{data.nomClient}</td>
                            <td>{data.adresse}</td>
                            <td>{data.contact}</td>
                            <td><Link to={`/updateclient/${data.numClient}`} className='btn btn-primary'>Modifier</Link></td>
                            <td><button className="btn btn-danger" onClick={e => handleDelete(data.numClient)}>Supprimer</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}
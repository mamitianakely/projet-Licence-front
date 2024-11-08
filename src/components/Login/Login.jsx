import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage from '../../assets/login.png';
import axios from 'axios';

const Login = () => {
    const [identifier, setIdentifier] = useState(''); // Renommé en 'identifier'
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { identifier, password });
            const { token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('username', identifier); // Stocke le nom d'utilisateur ou email

            navigate('/dash');
            alert('Connexion réussie');
        } catch (err) {
            setError('Identifiants invalides. Veuillez réessayer.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cyan-50">
            {/* Outer container div for image and form */}
            <div className="flex flex-col lg:flex-row items-center justify-between w-4/5 max-w-4xl bg-white p-8 rounded-lg shadow-lg">
                {/* Image Section */}
                <div className="hidden lg:block">
                    <img src={loginImage} alt="Secure Login" className="w-96 h-auto" />
                </div>
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">CONNEXION</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-indigo-700 mb-2" htmlFor="identifier">Nom d'utilisateur ou Email</label>
                            <input type="text" id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="border border-cyan-300 p-2 w-full rounded focus:ring-2 focus:ring-cyan-900" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-indigo-700 mb-2" htmlFor="password">Mot de passe</label>
                            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-cyan-300 p-2 w-full rounded focus:ring-2 focus:ring-cyan-900" required />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full hover:bg-indigo-600">SE CONNECTER</button>
                    </form>
                    <div className="mt-4 text-center">
                        <span className="text-sm text-indigo-700">Avez-vous déjà un compte?</span>
                        <a href="http://localhost:3000/register" className="text-blue-600 ml-2 hover:underline text-sm">Créer un compte</a>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;

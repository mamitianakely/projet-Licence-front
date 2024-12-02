// Register.js
import React, { useState } from 'react';
import axios from 'axios';
import RegisterImage from '../../assets/register.png';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Responsable'); // Par défaut, le rôle est Responsable
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', { username, password, role, fullName, email, phone });
            console.log('Inscription réussie:', response.data);
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error.response.data);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#209CFF] to-[#68E0CF]">
            <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-4xl bg-white p-6 lg:p-8 rounded-lg shadow-lg">
                
                {/* Image Section */}
                <div className="hidden lg:block mb-8 lg:mb-0">
                    <img src={RegisterImage} alt="Secure Login" className="w-80 h-auto" />
                </div>
                
                {/* Form Section */}
                <div className="bg-white p-6 lg:p-8 rounded-lg shadow-md w-full lg:w-96">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg">
                        <h2 className="text-2xl font-bold mb-4 text-center text-[#13547A]">INSCRIPTION</h2>
    
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                            {/* First Row - Username & Password */}
                            <div>
                                <label className="block text-indigo-700 mb-1 text-sm" htmlFor="username">Nom d'utilisateur</label>
                                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="border border-cyan-300 px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-cyan-900 shadow-sm text-sm" required/>
                            </div>
                            <div>
                                <label className="block text-indigo-700 mb-1 text-sm" htmlFor="password">Mot de passe</label>
                                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-cyan-300 px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-cyan-900 shadow-sm text-sm" required/>
                            </div>
                        </div>
    
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                            {/* Second Row - Full Name & Email */}
                            <div>
                                <label className="block text-indigo-700 mb-1 text-sm" htmlFor="fullName">Nom complet</label>
                                <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="border border-cyan-300 px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-cyan-900 shadow-sm text-sm" required/>
                            </div>
                            <div>
                                <label className="block text-indigo-700 mb-1 text-sm" htmlFor="email">Email</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-cyan-300 px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-cyan-900 shadow-sm text-sm" required/>
                            </div>
                        </div>
    
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                            {/* Third Row - Phone Number & Role */}
                            <div>
                                <label className="block text-indigo-700 mb-1 text-sm" htmlFor="phone">Numéro de téléphone</label>
                                <input type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="border border-cyan-300 px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-cyan-900 shadow-sm text-sm" required/>
                            </div>
                            <div>
                                <label className="block text-indigo-700  mb-1 text-sm" htmlFor="role">Rôle</label>
                                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="border border-cyan-300 px-4 py-2 w-full rounded-md focus:ring-2 focus:ring-cyan-900 shadow-sm text-sm"> 
                                    <option value="Responsable">Responsable</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="bg-[#4FACFE] text-white px-4 py-2 rounded-md w-full hover:bg-[#80D0C7] focus:ring-2 focus:ring-indigo-500 transition duration-300">S'INSCRIRE</button>
                    </form>
                    <div className="mt-4 text-center">
                        <span className="text-sm text-indigo-700">Avez-vous déjà un compte?</span>
                        <a href="http://localhost:3000/" className="text-blue-600 ml-2 hover:underline text-sm">Connectez-vous</a>
                    </div>
                </div>
            </div>
        </div>
    );
     
};

export default Register;

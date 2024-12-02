import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, Home, Users, FileText, FileSignature, CreditCard, Building, CheckCircle } from 'lucide-react';
import logopermit from '../../assets/logopermit.png'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


const Dashboard = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // État pour le menu déroulant
  const location = useLocation();
  const navigate = useNavigate(); // Utiliser useNavigate pour la navigation
  const username = localStorage.getItem('username'); // Récupérez le nom d'utilisateur

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fonction pour basculer l'état du menu déroulant
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    console.log('Dropdown state:', !isDropdownOpen);
  };

  const handleLogout = () => {
    confirmAlert({
      title: 'Confirmation',
      message: 'Voulez-vous vraiment vous déconnecter ?',
      buttons: [
        {
          label: 'Oui',
          onClick: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            navigate('/'); // Redirige vers la page de connexion
          },
        },
        {
          label: 'Non',
          onClick: () => setIsDropdownOpen(false), // Ferme le dropdown si annulation
        },
      ],
    });
  };
  const navItems = [
    { path: '/dash', icon: Home, label: 'Tableau de bord' },
    { path: '/listdemande', icon: FileText, label: 'Demande' },
    { path: '/listclient', icon: Users, label: 'Client' },
    { path: '/listdevis', icon: FileSignature, label: 'Devis' },
    // { path: '/listavis', icon: CreditCard, label: 'Avis de paiement' },
    { path: '/listpermis', icon: Building, label: 'Permis' },
    { path: '/listverificateur', icon: CheckCircle, label: 'Verificateur' },
  ];

  return (
    <div className="flex h-screen bg-indigo-50">
      {/* Sidebar */}
      <aside className={`bg-gradient-to-r from-[#209CFF] to-[#68E0CF] text-white transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-20'} h-full space-y-6 py-7 px-2 absolute inset-y-0 left-0`}>
        <div className="flex items-center justify-between mb-6">
          <div className={`text-3xl font-semibold text-black text-center mb-8 flex items-center ${sidebarOpen ? '' : 'hidden'}`}>
            <img src={logopermit} alt="" className="w-8 h-8 mr-2 " />PermisTrack</div>
        </div>
        <nav>
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={`flex items-center text-gray-950 py-3 px-4 text-3xs rounded transition duration-200 hover:bg-[#50ADBF] no-underline ${location.pathname === item.path ? 'bg-[#c6cedc]' : ''}`}
            >
              <item.icon className={`inline-block ${sidebarOpen ? '' : 'mx-auto'}`} size={25} />
              <span className={`ml-2 ${sidebarOpen ? '' : 'hidden'}`}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Navbar */}
        <header className="bg-gradient-to-r from-[#68E0CF] to-[#209CFF] shadow-md">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none focus:text-gray-700 hidden md:flex">
                <Menu size={24} />
              </button>
            </div>

            <div className="flex items-center">
              <div className="relative">
                <button className="flex items-center text-gray-700 focus:outline-none" onClick={handleDropdownToggle}>
                  <User className="h-6 w-6 text-gray-700" />
                  <span className="ml-2 bg-[#D8EFF7] py-2.5 px-4 rounded transition duration-200 hover:bg-[#61CBFF]">{username ? username : 'Utilisateur'}</span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                    <button className="block px-4 py-2 text-gray-700 hover:bg-gray-200" onClick={handleLogout}>Déconnexion</button>
                    {/* Ajoutez d'autres options de menu ici si nécessaire */}
                  </div>
                )}
              </div>
              <Link to="/" className="ml-4 text-gray-700 hover:text-gray-900">
                <LogOut className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-indigo-50">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

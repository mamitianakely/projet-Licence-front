import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Client from './components/Client/Client';
import Listclient from './components/Client/Listclient';
import UpdateClient from './components/Client/Updateclient';
import Ajoutresponsable from './components/Responsable/Ajoutresponsable';
import Listresponsable from './components/Responsable/Listresponsable';
import Updateresponsable from './components/Responsable/Updateresponsable';
import Ajoutverificateur from './components/Verificateur/Ajoutverificateur';
import Listverificateur from './components/Verificateur/Listverificateur';
import Updateverificateur from './components/Verificateur/Updateverificateur';
import Ajoutdemande from './components/Demande/Ajoutdemande';
import Listdemande from './components/Demande/Listdemande';
import Updatedemande from './components/Demande/Updatedemande';
//import Dashboard from './components/Dashboard/Dashboard';//
import Listdevis from './components/Devis/Listdevis';
import Listavis from './components/Avispaiement/Listavis';
import Listpermis from './components/Permis/Listpermis';
import Dash from './components/Dash/Dash';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import ProtectedRoute from './components/Login/ProtectedRoute';



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>



          <Route path="/" element={<Login />} />
          <Route path='/register' element={<Register />}></Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/dash" element={<Dash />} />
            <Route path='/client' element={<Client />}></Route>
            <Route path='/listclient' element={<Listclient />}></Route>
            <Route path='/updateclient/:numChrono' element={<UpdateClient />}></Route>
            <Route path='/ajoutresponsable' element={<Ajoutresponsable />}></Route>
            <Route path='/listresponsable' element={<Listresponsable />}></Route>
            <Route path='/updateresponsable/:numResponsable' element={<Updateresponsable />}></Route>
            <Route path='/ajoutverificateur' element={<Ajoutverificateur />}></Route>
            <Route path='/listverificateur' element={<Listverificateur />}></Route>
            <Route path='/updateverificateur/:numVerificateur' element={<Updateverificateur />}></Route>
            <Route path='/ajoutdemande' element={<Ajoutdemande />}></Route>
            <Route path='/listdemande' element={<Listdemande />}></Route>
            <Route path="/updatedemande/:numDemande" element={<Updatedemande />} />
            <Route path="/listdevis" element={<Listdevis />} />
            <Route path="/listavis" element={<Listavis />} />
            <Route path="/listpermis" element={<Listpermis />} />
          </Route>
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;

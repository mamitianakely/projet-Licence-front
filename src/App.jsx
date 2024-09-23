import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
            <Route path='/sidebar' element={<Sidebar />}></Route>
            <Route path='/client' element={<Client />}></Route>
            <Route path='/listclient' element={<Listclient />}></Route>
            <Route path='/updateclient/:numClient' element={<UpdateClient />}></Route>
            <Route path='/ajoutresponsable' element={<Ajoutresponsable />}></Route>
            <Route path='/listresponsable' element={<Listresponsable />}></Route>
            <Route path='/updateresponsable/:numResponsable' element={<Updateresponsable />}></Route>
            <Route path='/ajoutverificateur' element={<Ajoutverificateur />}></Route>
            <Route path='/listverificateur' element={<Listverificateur />}></Route>
            <Route path='/updateverificateur/:numVerificateur' element={<Updateverificateur />}></Route>
            <Route path='/ajoutdemande' element={<Ajoutdemande />}></Route>
            <Route path='/listdemande' element={<Listdemande />}></Route>
            <Route path="/updatedemande/:numDemande" element={<Updatedemande />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import LoginAkun from './pages/loginakun.jsx'
import RegisterAkun from './pages/registerakun.jsx'
import Pencari from './pages/pencari.jsx'
import DaftarKos from './pages/daftarkos.jsx'
import CreateKos from './pages/createkos.jsx'
import EditKos from './pages/editkos.jsx';
import Profile from './pages/profile.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/loginakun" element={<LoginAkun />} />
        <Route path="/registerakun" element={<RegisterAkun />} />
        <Route path="/pencari" element={<Pencari />} />
        <Route path="/daftarkos" element={<DaftarKos />} />
        <Route path="/createkos" element={<CreateKos />} />
        <Route path="/editkos/:id" element={<EditKos />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

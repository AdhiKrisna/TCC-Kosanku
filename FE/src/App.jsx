import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useNavigate } from 'react-router-dom'


function App() {
const navigate = useNavigate();

  return (
    <>
      <div>
        <h1 className='font-utama'>Apa Peranmu?</h1>
      </div>

      <div className="card ">
        <button className='button-peran'  onClick={() => navigate('/loginakun')}>
          Pemilik Kos
        </button>
        <br/>
        <button className='button-peran' onClick={() => navigate('/pencari')}>
          Pencari Kos
        </button>
      </div>
    </>
  )
}

export default App

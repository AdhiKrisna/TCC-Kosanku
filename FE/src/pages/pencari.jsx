import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Pencari() {
  const navigate = useNavigate();
  const [kosList, setKosList] = useState([]);

  useEffect(() => {
    fetch('https://kosanku-tcc-363721261053.us-central1.run.app/kos')
      .then((res) => res.json())
      .then(async (data) => {
        // Untuk setiap kos, ambil gambar dari endpoint /kos-images/kos/:id
        const kosWithImages = await Promise.all(
          (data.data || []).map(async (kos) => {
            try {
              const imgRes = await fetch(`https://kosanku-tcc-363721261053.us-central1.run.app/kos-images/kos/${kos.kos_id}`);
              const imgData = await imgRes.json();
              return {
                ...kos,
                images_url: imgData.data || []
              };
            } catch {
              return { ...kos, images_url: [] };
            }
          })
        );
        setKosList(kosWithImages);
      });
  }, []);

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%' }}>
      {/* Tombol Info Profile di pojok kiri atas */}
      <button
        type="button"
        onClick={() => navigate('/profile')}
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          background: '#133E87',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '8px 18px',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          zIndex: 1100
        }}
      >
        ℹ️ Profile
      </button>
      {/* Tombol Kembali di pojok kanan atas */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          background: '#eee',
          color: '#133E87',
          border: '1.5px solid #133E87',
          borderRadius: 8,
          padding: '8px 18px',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        ← Kembali
      </button>
      <MapContainer center={[-7.797068, 110.370529]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {kosList.map((kos, i) => (
          <Marker key={kos.kos_id} position={[kos.kos_latitude, kos.kos_longitude]}>
            <Popup>
              <div style={{minWidth: 120}}>
                {Array.isArray(kos.images_url) && kos.images_url.length > 0 && kos.images_url[0]?.image_url && (
                  <img
                    src={kos.images_url[0].image_url}
                    alt={kos.kos_name}
                    style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 6, marginBottom: 6 }}
                  />
                )}
                <b>{kos.kos_name}</b>
                <br />
                <button
                  style={{
                    marginTop: 8,
                    background: '#133E87',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '4px 12px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 14
                  }}
                  onClick={() => window.location.href = `/editkos/${kos.kos_id}`}
                >
                  Info Kos
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Pencari;

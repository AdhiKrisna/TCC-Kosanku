import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

function Pencari() {
  const [kosList, setKosList] = useState([]);

  useEffect(() => {
    fetch('https://kosanku-tcc-363721261053.us-central1.run.app/kos')
      .then((res) => res.json())
      .then((data) => {
        setKosList(data.data); // Sesuaikan dengan struktur response baru
      });
  }, []);

  return (
    <MapContainer center={[-7.797068, 110.370529]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {kosList.map((kos, i) => (
        <Marker key={kos.kos_id} position={[kos.kos_latitude, kos.kos_longitude]}>
          <Popup>{kos.kos_name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default Pencari;

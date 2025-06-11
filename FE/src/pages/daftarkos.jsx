import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

console.log('DAFTARKOS FILE LOADED'); // Debug: cek file dieksekusi

const API_URL = 'https://kosanku-tcc-363721261053.us-central1.run.app/kos';

const DaftarKos = () => {
  const [kosList, setKosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(API_URL)
      .then(async (res) => {
        // Ambil gambar untuk setiap kos
        const kosWithImages = await Promise.all(
          (res.data.data || []).map(async (kos) => {
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
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredKos = kosList.filter(kos =>
    kos.kos_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kos.kos_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kos.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: 24, position: 'relative' }}>
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
          zIndex: 11
        }}
      >
        ℹ️ Profile
      </button>
      {/* Tombol Kembali di pojok kanan atas */}
      <button
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
          zIndex: 10
        }}
      >
        ← Kembali
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight: 60 }}>
        <h1>Daftar Kos</h1>
        <button
          style={{
            background: '#133E87',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: 18,
            fontWeight: 600,
            cursor: 'pointer',
            marginRight: 8
          }}
          onClick={() => navigate('/createkos')}
        >
          Tambah Kos
        </button>
      </div>
      <input
        type="text"
        placeholder="Cari kos (nama/alamat/kategori)..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{
          margin: '24px 0 16px 0',
          padding: 14,
          borderRadius: 8,
          border: '1.5px solid #133E87',
          width: 420,
          fontSize: 20
        }}
      />
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 24,
        maxHeight: '80vh',
        overflowY: 'auto',
        justifyContent: 'center',
      }}>
        {filteredKos && filteredKos.length === 0 && <div>Tidak ada kos ditemukan.</div>}
        {filteredKos && filteredKos.length > 0 && filteredKos.map((kos) => (
          <div key={kos.kos_id} style={{
            border: '1px solid #ddd',
            borderRadius: 12,
            padding: 18,
            width: 320,
            background: '#fff',
            boxShadow: '0 2px 8px #eee',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            {/* Gambar kos jika ada, fallback jika tidak ada */}
            {Array.isArray(kos.images_url) && kos.images_url.length > 0 && kos.images_url[0]?.image_url ? (
              <img src={kos.images_url[0].image_url} alt={kos.kos_name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
            ) : (
              <div style={{ width: '100%', height: 180, background: '#eee', borderRadius: 8, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                Tidak ada gambar
              </div>
            )}
            <h2 style={{ margin: '8px 0', fontSize: 22 }}>{kos.kos_name}</h2>
            <div style={{ marginBottom: 4 }}><b>Alamat:</b> {kos.kos_address}</div>
            <div style={{ marginBottom: 4 }}><b>Deskripsi:</b> {kos.kos_description}</div>
            <div style={{ marginBottom: 4 }}><b>Aturan:</b> {kos.kos_rules}</div>
            <div style={{ marginBottom: 4 }}><b>Kategori:</b> {kos.category}</div>
            <div style={{ marginBottom: 4 }}><b>Harga:</b> Rp{kos.min_price?.toLocaleString()} - Rp{kos.max_price?.toLocaleString()}</div>
            <div style={{ marginBottom: 4 }}><b>Kamar Tersedia:</b> {kos.room_available}</div>
            <div style={{ marginBottom: 4 }}><b>Pemilik:</b> {kos.owner?.user_name} ({kos.owner?.user_phone})</div>
            <a href={kos.link_gmaps} target="_blank" rel="noopener noreferrer" style={{ color: '#133E87', marginTop: 8 }}>Lihat di Google Maps</a>
            <button
              style={{ marginTop: 12, background: '#78B3CE', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => navigate(`/editkos/${kos.kos_id}`)}
            >
              Edit
            </button>
            <button
              style={{ marginTop: 12, marginLeft: 8, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', cursor: 'pointer', fontWeight: 600 }}
              onClick={async () => {
                if (window.confirm('Yakin ingin menghapus kos ini?')) {
                  try {
                    const token = localStorage.getItem('accessToken');
                    await axios.delete(`${API_URL}/${kos.kos_id}`, {
                      headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {})
                      }
                    });
                    setKosList((prev) => prev.filter((k) => k.kos_id !== kos.kos_id));
                  } catch (err) {
                    alert(err.response?.data?.message || err.message);
                  }
                }
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaftarKos;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://kosanku-tcc-363721261053.us-central1.run.app/profile';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('Anda belum login.');
      setLoading(false);
      return;
    }
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setProfile(data.data);
        } else {
          setError(data.message || 'Gagal mengambil data profil');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', position: 'relative' }}>
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
          zIndex: 10
        }}
      >
        ← Kembali
      </button>
      <h1 style={{ marginBottom: 24 }}>Profil Saya</h1>
      <div style={{ fontSize: 18 }}>
        <div><b>Nama:</b> {profile.user_name}</div>
        <div><b>Email:</b> {profile.user_email}</div>
        <div><b>No. HP:</b> {profile.user_phone}</div>
        <div><b>Role:</b> {profile.role}</div>
      </div>
    </div>
  );
};

export default Profile;

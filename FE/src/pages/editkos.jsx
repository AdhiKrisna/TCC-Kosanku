import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'https://kosanku-tcc-363721261053.us-central1.run.app/kos';

const EditKos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    kos_name: '',
    kos_address: '',
    kos_description: '',
    kos_rules: '',
    category: '',
    link_gmaps: '',
    room_available: '',
    max_price: '',
    min_price: '',
    owner_kos_id: '',
    kos_latitude: '',
    kos_longitude: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Fetch kos by id
    axios.get(`${API_URL}/${id}`)
      .then(res => {
        const data = res.data.data;
        setForm({
          kos_name: data.kos_name || '',
          kos_address: data.kos_address || '',
          kos_description: data.kos_description || '',
          kos_rules: data.kos_rules || '',
          category: data.category || '',
          link_gmaps: data.link_gmaps || '',
          room_available: data.room_available || '',
          max_price: data.max_price || '',
          min_price: data.min_price || '',
          owner_kos_id: data.owner_kos_id || '',
          kos_latitude: data.kos_latitude || '',
          kos_longitude: data.kos_longitude || '',
          images: [] // gambar baru, tidak prefill
        });
      })
      .catch(err => setError(err.response?.data?.message || err.message));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, images: files });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('kos_name', form.kos_name);
      formData.append('kos_address', form.kos_address);
      formData.append('kos_description', form.kos_description);
      formData.append('kos_rules', form.kos_rules);
      formData.append('category', form.category);
      formData.append('link_gmaps', form.link_gmaps);
      formData.append('room_available', form.room_available);
      formData.append('min_price', form.min_price);
      formData.append('max_price', form.max_price);
      formData.append('owner_kos_id', form.owner_kos_id);
      formData.append('kos_latitude', form.kos_latitude);
      formData.append('kos_longitude', form.kos_longitude);
      for (let i = 0; i < form.images.length; i++) {
        formData.append('image_url', form.images[i]);
      }
      // Jika tidak ada gambar baru, jangan kirim field image_url
      // (Sudah dicek di atas, hanya mengirim jika ada file di form.images)
      // Jika ingin menghapus semua gambar lama, perlu endpoint khusus di backend
      const token = localStorage.getItem('accessToken');
      await axios.put(
        `${API_URL}/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );
      setSuccess('Kos berhasil diupdate!');
      setTimeout(() => navigate('/daftarkos'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee', position: 'relative' }}>
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
        type="button"
        onClick={() => navigate('/daftarkos')}
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
      <h1 style={{ marginBottom: 24 }}>Edit Kos</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nama Kos</label><br />
          <input name="kos_name" value={form.kos_name} onChange={handleChange} required className="inputfield" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Alamat</label><br />
          <input name="kos_address" value={form.kos_address} onChange={handleChange} required className="inputfield" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Deskripsi</label><br />
          <textarea name="kos_description" value={form.kos_description} onChange={handleChange} className="inputfield" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Aturan</label><br />
          <textarea name="kos_rules" value={form.kos_rules} onChange={handleChange} className="inputfield" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Kategori</label><br />
          <select name="category" value={form.category} onChange={handleChange} required className="inputfield">
            <option value="">Pilih Kategori</option>
            <option value="Putra">Putra</option>
            <option value="Putri">Putri</option>
            <option value="Campur">Campur</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Link Google Maps</label><br />
          <input name="link_gmaps" value={form.link_gmaps} onChange={handleChange} required className="inputfield" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Jumlah Kamar Tersedia</label><br />
          <input name="room_available" type="number" value={form.room_available} onChange={handleChange} required className="inputfield" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Harga Minimum</label><br />
          <input name="min_price" type="number" value={form.min_price} onChange={handleChange} required className="inputfield" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Harga Maksimum</label><br />
          <input name="max_price" type="number" value={form.max_price} onChange={handleChange} required className="inputfield" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>ID Pemilik Kos</label><br />
          <input name="owner_kos_id" type="number" value={form.owner_kos_id} onChange={handleChange} required className="inputfield" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Latitude</label><br />
          <input name="kos_latitude" type="number" value={form.kos_latitude} onChange={handleChange} required className="inputfield" step="any" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Longitude</label><br />
          <input name="kos_longitude" type="number" value={form.kos_longitude} onChange={handleChange} required className="inputfield" step="any" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Gambar Kos (bisa lebih dari satu, kosongkan jika tidak ingin ganti)</label><br />
          <input name="images" type="file" accept="image/*" multiple onChange={handleChange} className="inputfield" />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
        <button className="button-tombol" type="submit" disabled={loading}>{loading ? 'Menyimpan...' : 'Update Kos'}</button>
        <button type="button" className="button-tombol" style={{ marginLeft: 16 }} onClick={() => navigate('/daftarkos')}>Batal</button>
      </form>
    </div>
  );
};

export default EditKos;

import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function RegisterAkun() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    user_name: '',
    user_phone: '',
    user_email: '',
    user_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.user_password !== form.confirm_password) {
      setError('Password dan konfirmasi tidak sama');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://kosanku-tcc-363721261053.us-central1.run.app/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: form.user_name,
          user_phone: form.user_phone,
          user_email: form.user_email,
          user_password: form.user_password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal register');
      setSuccess('Registrasi berhasil! Silakan login.');
      setTimeout(() => navigate('/loginakun'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-utama">Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <p>Username</p>
          <input type="text" className="inputfield" name="user_name" value={form.user_name} onChange={handleChange} required />
        </div>
        <div>
          <p>No HP</p>
          <input type="text" className="inputfield" name="user_phone" value={form.user_phone} onChange={handleChange} required />
        </div>
        <div>
          <p>Email</p>
          <input type="email" className="inputfield" name="user_email" value={form.user_email} onChange={handleChange} required />
        </div>
        <div>
          <p>Password</p>
          <input type="password" className="inputfield" name="user_password" value={form.user_password} onChange={handleChange} required />
        </div>
        <div>
          <p>Ulangi Password</p>
          <input type="password" className="inputfield" name="confirm_password" value={form.confirm_password} onChange={handleChange} required />
        </div>
        <br />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
        <button className="button-tombol" type="submit" disabled={loading}>{loading ? 'Mendaftar...' : 'Register'}</button>
        <button type="button" className="button-tombol" style={{ marginLeft: 16 }} onClick={() => navigate('/loginakun')}>Login</button>
      </form>
    </div>
  );
}

export default RegisterAkun;

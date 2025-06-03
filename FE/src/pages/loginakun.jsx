import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function LoginAkun() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    user_email: '',
    user_password: ''
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
    setLoading(true);
    try {
      const res = await fetch('https://kosanku-tcc-363721261053.us-central1.run.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gagal login');
      setSuccess('Login berhasil!');
      localStorage.setItem('accessToken', data.accessToken);
      setTimeout(() => navigate('/daftarkos'), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-utama">Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <p>Email</p>
          <input type="email" className="inputfield" name="user_email" value={form.user_email} onChange={handleChange} required />
        </div>
        <div>
          <p>Password</p>
          <input type="password" className="inputfield" name="user_password" value={form.user_password} onChange={handleChange} required />
        </div>
        <div>
          <p>Belum punya akun?</p> <button type="button" onClick={() => navigate('/registerakun')}> Register</button>
        </div>
        <br />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
        <button className="button-tombol" type="submit" disabled={loading}>{loading ? 'Login...' : 'Login'}</button>
      </form>
    </div>
  );
}

export default LoginAkun;

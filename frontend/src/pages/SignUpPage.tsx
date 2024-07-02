import '../styles/signUpPage.css';
import { backEndApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { FormEvent, useState } from 'react';

function SignUpPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await backEndApi.post('/api/users/register/', {
        username,
        password,
        email,
      });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate('/login');
    } catch (error) {
      alert('Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='register-background'>
      <div className='register-container'>
        <form onSubmit={handleSubmit}>
          <h1>Create Profile</h1>
          <div className='input-box'>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Create username'
              required
            />
          </div>
          <div className='input-box'>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Create password'
              required
            />
          </div>
          <div className='input-box'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter email'
              required
            />
          </div>
          <button className='login' type='submit' disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;

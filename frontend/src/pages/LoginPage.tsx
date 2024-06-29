import '../styles/loginPage.css'
import { backEndApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { FormEvent, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';


function LoginPage() {

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await backEndApi.post('/api/users/token/', {username, password})
            localStorage.setItem(ACCESS_TOKEN, res.data.access)
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
            navigate('/')
        } 
        catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return (  
        <>
            <div className="login-background">
                <div className="login-container">
                    <form onSubmit={handleSubmit}>
                        <h1>Login</h1>
                        <div className="input-box">
                            <input 
                                type='text'
                                value={username}
                                onChange={(e) => setUsername(e.target.value) }
                                placeholder='Username'
                                required

                                />         
                        </div>
                        <div className="input-box">
                            <input 
                                type='text'
                                value={password}
                                onChange={(e) => setPassword(e.target.value) }
                                placeholder='Password'
                                required
                                />
                        </div>
                        <div className="remember-forgot">
                            <label><input type="checkbox"/>Remember me</label>
                            <a href="#">Forgot Password?</a>
                        </div>

                        <button className="login" type="submit">Login</button>

                        <div className="register-link">
                            <p>Don't have an account?</p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default LoginPage;
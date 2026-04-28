import { useState } from 'react';
import axios from 'axios';
import './Login.css';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isRegister ? '/api/register' : '/api/login';
      const response = await axios.post(`http://localhost:3000${endpoint}`, formData);
      
      if (isRegister) {
        // Auto login after register
        const loginRes = await axios.post('http://localhost:3000/api/login', {
          email: formData.email,
          password: formData.password
        });
        onLogin(loginRes.data.user, loginRes.data.token);
      } else {
        onLogin(response.data.user, response.data.token);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao processar solicitação');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass-card">
        <h2 className="text-center mb-6">{isRegister ? 'Criar Conta' : 'Acesse sua Conta'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="form-group">
              <label>Nome</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Senha</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary w-full mt-4">
            {isRegister ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>
        
        <div className="login-footer text-center mt-4">
          <p>
            {isRegister ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
            <button 
              className="btn-link" 
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Faça login' : 'Cadastre-se'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { API_URL } from '../config';
import './Login.css';

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister && formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    try {
      const endpoint = isRegister ? '/api/register' : '/api/login';
      const response = await axios.post(`${API_URL}${endpoint}`, formData);
      
      if (isRegister) {
        // Auto login after register
        const loginRes = await axios.post(`${API_URL}/api/login`, {
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
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
              <button 
                type="button" 
                className="btn-eye" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Confirmar Senha</label>
              <div className="password-input-wrapper">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  required 
                />
                <button 
                  type="button" 
                  className="btn-eye" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}
          
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

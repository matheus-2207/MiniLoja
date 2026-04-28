import { useState } from 'react';
import axios from 'axios';
import './Profile.css';

export default function Profile({ user, setUser }) {
  const [formData, setFormData] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    cpf: user?.cpf || '',
    phone: user?.phone || '',
    birthdate: user?.birthdate || '',
    cep: user?.cep || '',
    address: user?.address || '',
    password: '' 
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3000/api/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setFormData(prev => ({ ...prev, password: '' })); // clear password field
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Erro ao atualizar perfil' });
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-card glass-card">
        <h2 className="text-center mb-6">Meu Perfil</h2>
        
        {message.text && (
          <div className={message.type === 'success' ? 'success-message' : 'error-message'}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Nome Completo</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
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
            <label>CPF</label>
            <input 
              type="text" 
              name="cpf" 
              value={formData.cpf} 
              onChange={handleChange} 
              placeholder="000.000.000-00"
            />
          </div>

          <div className="form-group">
            <label>Data de Nascimento</label>
            <input 
              type="date" 
              name="birthdate" 
              value={formData.birthdate} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-group">
            <label>Telefone</label>
            <input 
              type="text" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="form-group">
            <label>CEP</label>
            <input 
              type="text" 
              name="cep" 
              value={formData.cep} 
              onChange={handleChange} 
              placeholder="00000-000"
            />
          </div>

          <div className="form-group full-width">
            <label>Endereço Completo</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              placeholder="Rua, Número, Bairro, Cidade - Estado"
            />
          </div>
          
          <div className="form-group full-width">
            <label>Nova Senha (opcional)</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Deixe em branco para não alterar sua senha atual"
            />
          </div>
          
          <div className="form-group full-width" style={{ marginTop: '10px' }}>
            <button type="submit" className="btn-primary w-full">
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

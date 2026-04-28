import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Trash2, PlusCircle, Pencil, XCircle } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Whey', price: '', description: '', image_url: '' });
  const [editMode, setEditMode] = useState(null);
  
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, prodRes] = await Promise.all([
        axios.get('http://localhost:3000/api/admin/stats/monthly', { headers }),
        axios.get('http://localhost:3000/api/products')
      ]);
      setStats(statsRes.data);
      setProducts(prodRes.data);
    } catch (error) {
      console.error('Erro ao buscar dados do admin:', error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`http://localhost:3000/api/products/${editMode}`, {
          ...newProduct,
          price: parseFloat(newProduct.price)
        }, { headers });
        setEditMode(null);
      } else {
        await axios.post('http://localhost:3000/api/products', {
          ...newProduct,
          price: parseFloat(newProduct.price)
        }, { headers });
      }
      setNewProduct({ name: '', category: 'Whey', price: '', description: '', image_url: '' });
      fetchData();
    } catch (error) {
      console.error('Erro ao salvar produto', error);
      alert('Erro ao salvar produto');
    }
  };

  const handleEditClick = (product) => {
    setEditMode(product.id);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      description: product.description,
      image_url: product.image_url
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Certeza que deseja deletar este produto?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`, { headers });
      fetchData();
    } catch (error) {
      console.error('Erro ao deletar produto', error);
      alert('Erro ao deletar');
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 className="mb-6">Painel Administrativo</h1>
      
      <div className="dashboard-grid">
        <div className="dashboard-card glass-card span-2">
          <h2>Vendas por Mês</h2>
          <div className="chart-container">
            {stats.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                  <Bar dataKey="total_profit" fill="#f97316" name="Lucro (R$)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted text-center mt-4">Nenhum dado de venda disponível.</p>
            )}
          </div>
        </div>

        <div className="dashboard-card glass-card">
          <h2>{editMode ? 'Editar Produto' : 'Adicionar Produto'}</h2>
          <form onSubmit={handleAddProduct} className="admin-form mt-4">
            <input type="text" placeholder="Nome do Produto" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
            <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
              <option value="Whey">Whey</option>
              <option value="Creatina">Creatina</option>
              <option value="Pre Treino">Pré Treino</option>
              <option value="Outros">Outros</option>
            </select>
            <input type="number" step="0.01" placeholder="Preço (R$)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
            <textarea placeholder="Descrição" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required />
            <input type="text" placeholder="URL da Imagem (Ex: /imagens/whey.png)" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary flex items-center justify-center gap-2" style={{ flex: 1 }}>
                {editMode ? <Pencil size={20} /> : <PlusCircle size={20} />}
                {editMode ? 'Salvar Alterações' : 'Adicionar'}
              </button>
              {editMode && (
                <button type="button" className="btn-secondary flex items-center justify-center" onClick={() => {
                  setEditMode(null);
                  setNewProduct({ name: '', category: 'Whey', price: '', description: '', image_url: '' });
                }}>
                  <XCircle size={20} />
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="dashboard-card glass-card span-2">
          <h2>Gerenciar Produtos</h2>
          <div className="admin-product-list mt-4">
            {products.map(p => (
              <div key={p.id} className="admin-product-item">
                <img src={p.image_url} alt={p.name} className="admin-product-img" />
                <div className="admin-product-details">
                  <strong>{p.name}</strong>
                  <span className="text-muted">{p.category} - R$ {p.price.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEditClick(p)} className="btn-icon" title="Editar" style={{ color: 'var(--primary-color)' }}>
                    <Pencil size={20} />
                  </button>
                  <button onClick={() => handleDeleteProduct(p.id)} className="btn-icon text-danger" title="Deletar">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

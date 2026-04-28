import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { Search } from 'lucide-react';
import './Home.css';

export default function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`, {
        params: { search, category }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleBuy = (product) => {
    addToCart(product);
  };

  return (
    <div className="home-page">
      <header className="hero-section text-center">
        <h1>Alcance seus resultados com a <span className="text-primary">PowerSupps</span></h1>
        <p className="hero-subtitle">Os melhores suplementos com qualidade comprovada para o seu treino.</p>
        
        <div className="search-bar glass-card">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Pesquise por whey, creatina..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Todas as categorias</option>
            <option value="Whey">Whey Protein</option>
            <option value="Creatina">Creatina</option>
            <option value="Pre Treino">Pré Treino</option>
          </select>
        </div>
      </header>

      <section className="products-section">
        <h2 className="section-title">Nossos Produtos</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card glass-card">
              <div className="product-image">
                <img src={product.image_url} alt={product.name} />
                <span className="product-category">{product.category}</span>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">R$ {product.price.toFixed(2)}</span>
                  <button onClick={() => handleBuy(product)} className="btn-primary">Comprar</button>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="no-products text-center">
              <p>Nenhum produto encontrado.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

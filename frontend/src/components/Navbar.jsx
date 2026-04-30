import { Link } from 'react-router-dom';
import { Dumbbell, ShoppingCart, LogOut, User, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar({ user, onLogout, cart = [], removeFromCart, clearCart }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const invoiceHTML = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Nota Fiscal</title>
      </head>
      <body style="font-family: Arial, sans-serif;">
        <h1 style="color: #f97316;">PowerSupps - Loja de Suplementos</h1>
        <h2>Obrigado por comprar com a gente!</h2>
        <hr>
        <h3>Itens Comprados:</h3>
        <ul>
          ${cart.map(item => `<li>${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
        </ul>
        <hr>
        <h2 style="color: #22c55e;">Total da Compra: R$ ${cartTotal.toFixed(2)}</h2>
      </body>
      </html>
    `;

    const blob = new Blob(['\\ufeff', invoiceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Nota_Fiscal_PowerSupps.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    clearCart();
    setIsCartOpen(false);
    alert('Compra finalizada com sucesso! A sua Nota Fiscal foi baixada.');
  };

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-container">
          <Link to="/" className="navbar-logo">
            <img src="./images/logo.png" alt="PowerSupps Logo" className="logo-img" />
          </Link>
          
          <div className="navbar-actions">
            <div className="cart-wrapper">
              <button className="btn-icon cart-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
                <ShoppingCart size={24} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </div>
            
            {user ? (
              <div className="user-menu">
                <span className="user-greeting">Olá, {user.name}</span>
                <Link to="/profile" className="btn-icon" title="Meu Perfil">
                  <User size={24} />
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn-secondary">Painel Admin</Link>
                )}
                <button onClick={onLogout} className="btn-icon text-danger" title="Sair">
                  <LogOut size={24} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary flex items-center gap-2">
                <User size={18} />
                <span>Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {isCartOpen && (
        <>
          <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
          <div className="cart-sidebar">
            <div className="cart-header">
              <h3>Seu Carrinho</h3>
              <button className="btn-icon" onClick={() => setIsCartOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="text-muted text-center mt-4">Seu carrinho está vazio.</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <strong>{item.name}</strong>
                      <span className="text-muted">{item.quantity}x R$ {item.price.toFixed(2)}</span>
                    </div>
                    <button className="btn-icon text-danger" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="flex justify-between mb-4">
                  <strong>Total:</strong>
                  <strong className="text-success">R$ {cartTotal.toFixed(2)}</strong>
                </div>
                <button className="btn-primary w-full" onClick={handleCheckout}>
                  Finalizar Compra
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

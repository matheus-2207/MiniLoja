import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ShoppingCart,
  LogOut,
  User,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./Navbar.css";

export default function Navbar({
  user,
  onLogout,
  cart = [],
  removeFromCart,
  clearCart,
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartPanel = useRef(null);
  const currency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  useEffect(() => {
    if (!isCartOpen) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const main = document.querySelector("main");
    if (main) main.inert = true;
    cartPanel.current?.querySelector("button")?.focus();
    const handleKey = (event) => {
      if (event.key === "Escape") setIsCartOpen(false);
      if (event.key !== "Tab") return;
      const items = cartPanel.current?.querySelectorAll(
        "button:not(:disabled), a[href]",
      );
      if (!items?.length) return;
      const first = items[0],
        last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = overflow;
      if (main) main.inert = false;
      document.removeEventListener("keydown", handleKey);
      previous?.focus();
    };
  }, [isCartOpen]);
  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const escapeHTML = (value) =>
      String(value).replace(
        /[&<>"']/g,
        (character) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[character],
      );
    const invoiceHTML = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Resumo do carrinho</title>
      </head>
      <body style="font-family: Arial, sans-serif;">
        <h1 style="color: #f97316;">PowerSupps - Loja de Suplementos</h1>
        <h2>Demonstração — nenhum pagamento processado.</h2>
        <hr>
        <h3>Itens selecionados:</h3>
        <ul>
          ${cart.map((item) => `<li>${item.quantity}x ${escapeHTML(item.name)} - R$ ${(item.price * item.quantity).toFixed(2)}</li>`).join("")}
        </ul>
        <hr>
        <h2 style="color: #22c55e;">Total da Compra: R$ ${cartTotal.toFixed(2)}</h2>
      </body>
      </html>
    `;

    const blob = new Blob(["\\ufeff", invoiceHTML], {
      type: "application/msword",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Resumo_PowerSupps.doc";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    clearCart();
    setIsCartOpen(false);
    alert("Resumo de demonstração baixado. Nenhum pagamento foi processado.");
  };

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-container">
          <Link to="/" className="navbar-logo">
            <span className="brand-word">
              power<span>supps</span>
            </span>
            <ArrowUpRight className="brand-symbol" size={23} />
          </Link>

          <div className="nav-links">
            <Link
              to="/"
              onClick={() =>
                setTimeout(
                  () =>
                    document
                      .getElementById("produtos")
                      ?.scrollIntoView({ behavior: "smooth" }),
                  0,
                )
              }
            >
              Suplementos
            </Link>
            <Link
              to="/"
              onClick={() =>
                setTimeout(
                  () =>
                    document
                      .getElementById("formula")
                      ?.scrollIntoView({ behavior: "smooth" }),
                  0,
                )
              }
            >
              Por dentro da fórmula
            </Link>
            <Link
              to="/"
              onClick={() =>
                setTimeout(
                  () =>
                    document
                      .getElementById("kits")
                      ?.scrollIntoView({ behavior: "smooth" }),
                  0,
                )
              }
            >
              Escolha seu kit <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="navbar-actions">
            <div className="cart-wrapper">
              <button
                aria-label={`Abrir carrinho com ${cartCount} itens`}
                className="btn-icon cart-btn"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <ShoppingCart size={19} />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </button>
            </div>

            {user ? (
              <div className="user-menu">
                <span className="user-greeting">Olá, {user.name}</span>
                <Link to="/profile" className="btn-icon" title="Meu Perfil">
                  <User size={24} />
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin" className="btn-secondary">
                    Painel Admin
                  </Link>
                )}
                <button
                  onClick={onLogout}
                  className="btn-icon text-danger"
                  title="Sair"
                >
                  <LogOut size={24} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-link">
                <User size={18} />
                <span>Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {isCartOpen && (
        <>
          <div
            className="cart-overlay"
            onClick={() => setIsCartOpen(false)}
          ></div>
          <div
            ref={cartPanel}
            className="cart-sidebar"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            <div className="cart-header">
              <h3 id="cart-title">Seu Carrinho</h3>
              <button
                aria-label="Fechar carrinho"
                className="btn-icon"
                onClick={() => setIsCartOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="text-muted text-center mt-4">
                  Seu carrinho está vazio.
                </p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <strong>{item.name}</strong>
                      <span className="text-muted">
                        {item.quantity}x {currency(item.price)}
                      </span>
                    </div>
                    <button
                      aria-label={`Remover ${item.name}`}
                      className="btn-icon text-danger"
                      onClick={() => removeFromCart(item.id)}
                    >
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
                  <strong className="text-success">
                    {currency(cartTotal)}
                  </strong>
                </div>
                <button className="btn-primary w-full" onClick={handleCheckout}>
                  Gerar resumo do carrinho
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

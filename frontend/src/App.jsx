import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { lazy, Suspense, useState } from "react";
const Login = lazy(() => import("./pages/Login"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Profile = lazy(() => import("./pages/Profile"));

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [cart, setCart] = useState([]);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <Router>
      <div className="app">
        <Navbar
          user={user}
          onLogout={handleLogout}
          cart={cart}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
        />
        <a
          className="skip-link"
          href="#main-content"
          onClick={(event) => {
            event.preventDefault();
            document.getElementById("main-content").focus();
          }}
        >
          Ir para o conteúdo
        </a>
        <main id="main-content" className="app-main" tabIndex={-1}>
          <Suspense fallback={<p className="text-center mt-4">Carregando…</p>}>
            <Routes>
              <Route path="/" element={<Home addToCart={addToCart} />} />
              <Route
                path="/login"
                element={
                  !user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />
                }
              />
              <Route
                path="/profile"
                element={
                  user ? (
                    <Profile user={user} setUser={setUser} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/admin"
                element={
                  user && user.role === "admin" ? (
                    <AdminDashboard />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;

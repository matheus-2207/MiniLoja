const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'super_secret_suplementos_2026';

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Error opening database', err.message);
  else {
    console.log('Connected to SQLite database.');
    
    // Create tables
    db.serialize(() => {
      // Users table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'client'
      )`);

      // Products table
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        category TEXT,
        price REAL,
        description TEXT,
        image_url TEXT
      )`);

      // Orders table (for statistics)
      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        total_price REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Order items table
      db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        product_id INTEGER,
        quantity INTEGER,
        price REAL
      )`);

      // Seed initial admin user if not exists
      db.get("SELECT * FROM users WHERE role = 'admin'", (err, row) => {
        if (!row) {
          const hash = bcrypt.hashSync('admin123', 10);
          db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", ['Admin', 'admin@admin.com', hash, 'admin']);
        }
      });
      
      // Seed initial products if empty
      db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
        if (row && row.count === 0) {
          const stmt = db.prepare("INSERT INTO products (name, category, price, description, image_url) VALUES (?, ?, ?, ?, ?)");
          stmt.run('Whey Protein Concentrado 1KG', 'Whey', 109.90, 'Suplemento proteico para ganho de massa muscular.', './images/whey.png');
          stmt.run('Creatina Monohidratada 300g', 'Creatina', 89.90, 'Auxilia no aumento do desempenho físico.', './images/creatina.png');
          stmt.run('Pré Treino Insane', 'Pre Treino', 149.90, 'Energia extrema para seus treinos.', './images/pre_treino.png');
          stmt.finalize();
          
          // Seed fake sales for graphics
          db.run("INSERT INTO orders (user_id, total_price, created_at) VALUES (1, 109.90, '2026-01-15 10:00:00')");
          db.run("INSERT INTO orders (user_id, total_price, created_at) VALUES (1, 199.80, '2026-02-10 10:00:00')");
          db.run("INSERT INTO orders (user_id, total_price, created_at) VALUES (1, 89.90, '2026-03-05 10:00:00')");
          db.run("INSERT INTO orders (user_id, total_price, created_at) VALUES (1, 239.80, '2026-04-01 10:00:00')");
          
          db.run("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (1, 1, 1, 109.90)");
          db.run("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (2, 1, 1, 109.90)");
          db.run("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (2, 2, 1, 89.90)");
          db.run("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (3, 2, 1, 89.90)");
          db.run("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (4, 3, 1, 149.90)");
          db.run("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (4, 2, 1, 89.90)");
        }
      });
    });
  }
});

// Middleware for authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') return res.status(403).json({ error: 'Requires admin privileges' });
  next();
};

// Auth Routes
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if(!name || !email || !password) return res.status(400).json({ error: 'Preencha todos os campos' });

  const hash = bcrypt.hashSync(password, 10);
  db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hash], function(err) {
    if (err) return res.status(400).json({ error: 'Email já cadastrado' });
    res.json({ id: this.lastID, name, email });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Usuário não encontrado' });
    
    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      // Remove password before sending
      const { password: _, ...userWithoutPassword } = user;
      res.json({ token, user: userWithoutPassword });
    } else {
      res.status(401).json({ error: 'Senha incorreta' });
    }
  });
});

app.put('/api/profile', authenticate, (req, res) => {
  const { name, email, password, cpf, phone, birthdate, cep, address } = req.body;
  
  const callback = (err) => {
    if (err) return res.status(400).json({ error: 'Erro ao atualizar. Email talvez já em uso.' });
    db.get("SELECT id, name, email, role, cpf, phone, birthdate, cep, address FROM users WHERE id = ?", [req.userId], (err, user) => {
      res.json({ message: 'Perfil atualizado', user });
    });
  };

  if (password) {
    const hash = bcrypt.hashSync(password, 10);
    db.run("UPDATE users SET name = ?, email = ?, password = ?, cpf = ?, phone = ?, birthdate = ?, cep = ?, address = ? WHERE id = ?", 
      [name, email, hash, cpf, phone, birthdate, cep, address, req.userId], callback);
  } else {
    db.run("UPDATE users SET name = ?, email = ?, cpf = ?, phone = ?, birthdate = ?, cep = ?, address = ? WHERE id = ?", 
      [name, email, cpf, phone, birthdate, cep, address, req.userId], callback);
  }
});

// Products Routes
app.get('/api/products', (req, res) => {
  const { search, category } = req.query;
  let query = "SELECT * FROM products WHERE 1=1";
  let params = [];
  
  if (search) {
    query += " AND name LIKE ?";
    params.push(`%${search}%`);
  }
  if (category) {
    query += " AND category = ?";
    params.push(category);
  }
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/products', authenticate, isAdmin, (req, res) => {
  const { name, category, price, description, image_url } = req.body;
  db.run("INSERT INTO products (name, category, price, description, image_url) VALUES (?, ?, ?, ?, ?)", 
    [name, category, price, description, image_url || './images/logo.png'], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, category, price });
  });
});

app.put('/api/products/:id', authenticate, isAdmin, (req, res) => {
  const { name, category, price, description, image_url } = req.body;
  const id = req.params.id;
  db.run("UPDATE products SET name = ?, category = ?, price = ?, description = ?, image_url = ? WHERE id = ?", 
    [name, category, price, description, image_url || './images/logo.png', id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Produto atualizado' });
  });
});

app.delete('/api/products/:id', authenticate, isAdmin, (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM products WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Produto deletado' });
  });
});

// Order Routes
app.post('/api/orders', authenticate, (req, res) => {
  const { items, total_price } = req.body;
  
  db.run("INSERT INTO orders (user_id, total_price) VALUES (?, ?)", [req.userId, total_price], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    const orderId = this.lastID;
    
    const stmt = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    items.forEach(item => {
      stmt.run(orderId, item.product_id, item.quantity, item.price);
    });
    stmt.finalize();
    
    res.json({ message: 'Pedido realizado com sucesso!', orderId });
  });
});

// Admin Statistics Routes
app.get('/api/admin/stats/monthly', authenticate, isAdmin, (req, res) => {
  const query = `
    SELECT strftime('%Y-%m', created_at) as month, SUM(total_price) as total_profit
    FROM orders
    GROUP BY strftime('%Y-%m', created_at)
    ORDER BY month ASC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/admin/stats/products', authenticate, isAdmin, (req, res) => {
  const query = `
    SELECT p.name, SUM(oi.quantity * oi.price) as total_profit
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    GROUP BY p.id
    ORDER BY total_profit DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

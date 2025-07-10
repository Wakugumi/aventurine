
-- Config table
CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL UNIQUE,
  currency VARCHAR(255) NOT NULL
);

-- Category table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Product table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER,
  title VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Transaction Header table
CREATE TABLE IF NOT EXISTS transaction_headers (
  pk INTEGER PRIMARY KEY AUTOINCREMENT,
  id TEXT NOT NULL UNIQUE, -- UUID as TEXT
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
  subtotal REAL DEFAULT 0
);

-- Transaction Detail table
CREATE TABLE IF NOT EXISTS transaction_details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transaction_id INTEGER,
  product_id INTEGER,
  quantity INTEGER DEFAULT 1,
  total REAL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (transaction_id) REFERENCES transaction_headers(pk)
);

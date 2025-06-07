# Turso Database API Setup and Usage Guide

This guide provides comprehensive instructions for setting up and using Turso database API in any application. Use this as a template for implementing Turso database functionality in your projects.

## Table of Contents
1. [Overview](#overview)
2. [Initial Setup](#initial-setup)
3. [Database Creation](#database-creation)
4. [API Configuration](#api-configuration)
5. [Credential Management](#credential-management)
6. [Database Operations](#database-operations)
7. [Table Management](#table-management)
8. [Best Practices](#best-practices)

## Overview

Turso is a SQLite-compatible database service that provides:
- **Edge Database**: Fast, distributed SQLite databases
- **HTTP API**: RESTful API for database operations
- **Automatic Scaling**: Handles traffic spikes automatically
- **Global Distribution**: Deploy databases close to users

## Initial Setup

### 1. Turso Account Setup

1. Sign up at [turso.tech](https://turso.tech)
2. Install Turso CLI: `curl -sSfL https://get.tur.so/install.sh | bash`
3. Login: `turso auth login`
4. Create organization: `turso org create your-org-name`

### 2. Environment Configuration

Create environment variables for your Turso setup:

```javascript
// env.js or .env file
const ENV = {
  TURSO_ORG_TOKEN: process.env.TURSO_ORG_TOKEN || 'your-organization-token',
  TURSO_ORG_NAME: process.env.TURSO_ORG_NAME || 'your-org-name',
  TURSO_DB_GROUP: process.env.TURSO_DB_GROUP || 'default',
  // Add other environment variables as needed
};
export default ENV;
```

### 3. Get Organization Token

```bash
# Get your organization token
turso auth token

# Create a database group (optional)
turso group create your-group-name --location lhr
```

## Database Creation

### 1. Create Database via API

```typescript
const createTursoDatabase = async (databaseName: string, orgName: string, orgToken: string, group?: string) => {
  const response = await fetch(`https://api.turso.tech/v1/organizations/${orgName}/databases`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${orgToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: databaseName,
      group: group || "default"
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create database: ${error}`);
  }

  const dbData = await response.json();
  return dbData;
};
```

### 2. Create Database via CLI

```bash
# Create a new database
turso db create my-database

# Create database in specific group
turso db create my-database --group my-group

# Create database in specific location
turso db create my-database --location lhr
```

### 3. Get Database Token

```typescript
const getDatabaseToken = async (databaseName: string, orgName: string, orgToken: string) => {
  const response = await fetch(`https://api.turso.tech/v1/organizations/${orgName}/databases/${databaseName}/auth/tokens`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${orgToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      permissions: {
        read_attach: {
          databases: [databaseName]
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to create database token');
  }

  const tokenData = await response.json();
  return tokenData.jwt;
};
```

### 4. Database Name Formatting

```typescript
const formatDatabaseName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')  // Replace special chars with hyphens
    .replace(/-+/g, '-')          // Remove multiple consecutive hyphens
    .replace(/^-|-$/g, '')        // Remove leading/trailing hyphens
    .substring(0, 32);            // Limit length
};
```

## API Configuration

### 1. Database URL Construction

```typescript
const constructDatabaseUrl = (dbName: string, orgName: string, region?: string): string => {
  // Default region is usually the one closest to your organization
  const dbRegion = region || 'lhr'; // London Heathrow as default
  return `https://${dbName}-${orgName}.turso.io`;
};

const constructApiUrl = (dbName: string, orgName: string, region?: string): string => {
  const baseUrl = constructDatabaseUrl(dbName, orgName, region);
  return `${baseUrl}/v2/pipeline`;
};
```

### 2. Request Headers

```typescript
const getHeaders = (dbToken: string) => ({
  'Authorization': `Bearer ${dbToken}`,
  'Content-Type': 'application/json'
});
```

### 3. Database Configuration Object

```typescript
interface TursoConfig {
  dbName: string;
  dbToken: string;
  orgName: string;
  region?: string;
  apiUrl?: string;
}

const createTursoConfig = (dbName: string, dbToken: string, orgName: string, region?: string): TursoConfig => {
  return {
    dbName,
    dbToken,
    orgName,
    region,
    apiUrl: constructApiUrl(dbName, orgName, region)
  };
};
```

## Credential Management

### 1. Local Storage for Credentials

```typescript
// utils/credentialStorage.ts
interface TursoCredentials {
  dbName: string;
  dbToken: string;
  orgName: string;
  region?: string;
  createdAt: string;
}

export const storeTursoCredentials = async (credentials: TursoCredentials): Promise<void> => {
  try {
    const credentialsWithTimestamp = {
      ...credentials,
      createdAt: new Date().toISOString()
    };

    // For React Native
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('turso_credentials', JSON.stringify(credentialsWithTimestamp));
    }
    // For React Native with AsyncStorage
    else {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      await AsyncStorage.setItem('turso_credentials', JSON.stringify(credentialsWithTimestamp));
    }
  } catch (error) {
    console.error('Failed to store credentials:', error);
    throw error;
  }
};

export const getTursoCredentials = async (): Promise<TursoCredentials | null> => {
  try {
    let credentialsJson: string | null = null;

    // For Web
    if (typeof window !== 'undefined' && window.localStorage) {
      credentialsJson = localStorage.getItem('turso_credentials');
    }
    // For React Native with AsyncStorage
    else {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      credentialsJson = await AsyncStorage.getItem('turso_credentials');
    }

    if (!credentialsJson) return null;

    return JSON.parse(credentialsJson);
  } catch (error) {
    console.error('Failed to get credentials:', error);
    return null;
  }
};

export const clearTursoCredentials = async (): Promise<void> => {
  try {
    // For Web
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('turso_credentials');
    }
    // For React Native with AsyncStorage
    else {
      const AsyncStorage = require('@react-native-async-storage/async-storage');
      await AsyncStorage.removeItem('turso_credentials');
    }
  } catch (error) {
    console.error('Failed to clear credentials:', error);
  }
};
```

### 2. React Hook for Credentials

```typescript
// hooks/useTursoCredentials.ts
import { useState, useEffect, useCallback } from 'react';
import { getTursoCredentials, TursoCredentials } from '../utils/credentialStorage';

export const useTursoCredentials = () => {
  const [credentials, setCredentials] = useState<TursoCredentials | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredentials = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const creds = await getTursoCredentials();
      setCredentials(creds);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch credentials');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredentials();
  }, [fetchCredentials]);

  return {
    credentials,
    isLoading,
    error,
    refetch: fetchCredentials
  };
};
```

### 3. Environment-based Configuration

```typescript
// config/turso.ts
export const getTursoConfigFromEnv = (): Partial<TursoCredentials> => {
  return {
    orgName: process.env.TURSO_ORG_NAME || process.env.REACT_APP_TURSO_ORG_NAME,
    region: process.env.TURSO_REGION || process.env.REACT_APP_TURSO_REGION || 'lhr',
    // Note: Never store tokens in environment variables for production
    // This is only for development/testing
  };
};
```

## Database Operations

### 1. Database Service Class

```typescript
// services/tursoService.ts
export interface TursoCredentials {
  dbName: string;
  dbToken: string;
  orgName: string;
  region?: string;
}

export interface QueryRequest {
  type: 'execute';
  stmt: {
    sql: string;
    args?: any[];
  };
}

export interface TursoResponse<T = any> {
  results: Array<{
    type: 'ok' | 'error';
    response?: {
      result: {
        rows: any[][];
        columns: string[];
        affected_row_count?: number;
        last_insert_rowid?: string;
      };
    };
    error?: {
      message: string;
      code: string;
    };
  }>;
}

export class TursoService {
  private config: TursoCredentials;
  private apiUrl: string;

  constructor(config: TursoCredentials) {
    this.config = config;
    this.apiUrl = constructApiUrl(config.dbName, config.orgName, config.region);
  }

  async executeQuery<T = any>(
    sql: string,
    args: any[] = [],
    retries = 3
  ): Promise<TursoResponse<T>> {
    const request: QueryRequest = {
      type: 'execute',
      stmt: { sql, args }
    };

    return this.executeRequests([request], retries);
  }

  async executeTransaction(
    queries: QueryRequest[],
    retries = 3
  ): Promise<TursoResponse[]> {
    return this.executeRequests(queries, retries);
  }

  private async executeRequests(
    requests: QueryRequest[],
    retries = 3
  ): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.dbToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ requests })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Turso API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();

        // Check for database errors in the response
        if (data.results) {
          for (const result of data.results) {
            if (result.type === 'error') {
              throw new Error(`Database error: ${result.error?.message || 'Unknown error'}`);
            }
          }
        }

        return data;
      } catch (error) {
        console.error(`Turso request attempt ${attempt} failed:`, error);

        if (attempt === retries) {
          throw error;
        }

        // Exponential backoff
        await new Promise(resolve =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }

    throw new Error('All Turso request attempts failed');
  }

  // Helper method to get the first result row as an object
  getFirstRow(response: TursoResponse, columns?: string[]): Record<string, any> | null {
    const result = response.results?.[0]?.response?.result;
    if (!result?.rows?.length) return null;

    const cols = columns || result.columns;
    const row = result.rows[0];

    return cols.reduce((obj, col, index) => {
      obj[col] = row[index];
      return obj;
    }, {} as Record<string, any>);
  }

  // Helper method to get all rows as objects
  getAllRows(response: TursoResponse, columns?: string[]): Record<string, any>[] {
    const result = response.results?.[0]?.response?.result;
    if (!result?.rows?.length) return [];

    const cols = columns || result.columns;

    return result.rows.map(row =>
      cols.reduce((obj, col, index) => {
        obj[col] = row[index];
        return obj;
      }, {} as Record<string, any>)
    );
  }
}
```

### 2. Basic Query Operations

```typescript
// Initialize Turso service
const tursoConfig = {
  dbName: 'my-database',
  dbToken: 'your-database-token',
  orgName: 'your-org-name',
  region: 'lhr'
};

const turso = new TursoService(tursoConfig);

// Single query execution
const result = await turso.executeQuery(
  'SELECT * FROM products WHERE category = ?',
  ['electronics']
);

// Get results as objects
const products = turso.getAllRows(result);
console.log('Products:', products);

// Insert data
const insertResult = await turso.executeQuery(
  'INSERT INTO products (title, price, category) VALUES (?, ?, ?)',
  ['New Product', 29.99, 'electronics']
);

// Update data
const updateResult = await turso.executeQuery(
  'UPDATE products SET price = ? WHERE id = ?',
  [24.99, 1]
);

// Delete data
const deleteResult = await turso.executeQuery(
  'DELETE FROM products WHERE id = ?',
  [1]
);
```

### 3. Transaction Operations

```typescript
// Multiple queries in a transaction
const queries = [
  {
    type: 'execute',
    stmt: {
      sql: 'INSERT INTO products (title, price) VALUES (?, ?)',
      args: ['Product 1', 29.99]
    }
  },
  {
    type: 'execute',
    stmt: {
      sql: 'UPDATE inventory SET quantity = quantity - 1 WHERE product_id = ?',
      args: [1]
    }
  },
  {
    type: 'execute',
    stmt: {
      sql: 'INSERT INTO order_items (product_id, quantity, price) VALUES (?, ?, ?)',
      args: [1, 1, 29.99]
    }
  }
];

const results = await turso.executeTransaction(queries);
```

### 4. Data Fetching with Pagination

```typescript
class ProductService {
  constructor(private turso: TursoService) {}

  async fetchProducts(options: {
    limit?: number;
    offset?: number;
    searchQuery?: string;
    filters?: Record<string, any>;
  } = {}) {
    const { limit = 50, offset = 0, searchQuery = '', filters = {} } = options;

    let sql = `
      SELECT id, title, image, price, category, vendor, brand, stock, created_at
      FROM products
    `;

    const conditions: string[] = [];
    const args: any[] = [];

    // Add search condition
    if (searchQuery.trim()) {
      conditions.push('(title LIKE ? OR category LIKE ?)');
      args.push(`%${searchQuery}%`, `%${searchQuery}%`);
    }

    // Add filter conditions
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        conditions.push(`${key} = ?`);
        args.push(value);
      }
    });

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    args.push(limit, offset);

    const result = await this.turso.executeQuery(sql, args);
    return this.turso.getAllRows(result);
  }

  async getProductById(id: number) {
    const result = await this.turso.executeQuery(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    return this.turso.getFirstRow(result);
  }

  async createProduct(product: {
    title: string;
    price: number;
    category: string;
    vendor?: string;
    brand?: string;
    stock?: number;
  }) {
    const result = await this.turso.executeQuery(
      `INSERT INTO products (title, price, category, vendor, brand, stock, created_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        product.title,
        product.price,
        product.category,
        product.vendor || null,
        product.brand || null,
        product.stock || 0
      ]
    );

    return result.results[0]?.response?.result?.last_insert_rowid;
  }
}
```

## Table Management

### 1. Table Creation Utility

```typescript
// utils/tableManager.ts
export class TableManager {
  constructor(private turso: TursoService) {}

  async createTable(tableName: string, schema: string): Promise<boolean> {
    try {
      const result = await this.turso.executeQuery(
        `CREATE TABLE IF NOT EXISTS ${tableName} ${schema}`
      );

      console.log(`✅ Table ${tableName} created successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to create table ${tableName}:`, error);
      return false;
    }
  }

  async dropTable(tableName: string): Promise<boolean> {
    try {
      const result = await this.turso.executeQuery(`DROP TABLE IF EXISTS ${tableName}`);
      console.log(`✅ Table ${tableName} dropped successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to drop table ${tableName}:`, error);
      return false;
    }
  }

  async tableExists(tableName: string): Promise<boolean> {
    try {
      const result = await this.turso.executeQuery(
        `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
        [tableName]
      );

      const rows = this.turso.getAllRows(result);
      return rows.length > 0;
    } catch (error) {
      console.error(`❌ Failed to check if table ${tableName} exists:`, error);
      return false;
    }
  }

  async getTableSchema(tableName: string): Promise<any[]> {
    try {
      const result = await this.turso.executeQuery(`PRAGMA table_info(${tableName})`);
      return this.turso.getAllRows(result);
    } catch (error) {
      console.error(`❌ Failed to get schema for table ${tableName}:`, error);
      return [];
    }
  }

  async listTables(): Promise<string[]> {
    try {
      const result = await this.turso.executeQuery(
        `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`
      );

      const rows = this.turso.getAllRows(result);
      return rows.map(row => row.name);
    } catch (error) {
      console.error('❌ Failed to list tables:', error);
      return [];
    }
  }
}
```

### 2. Common Table Schemas

```typescript
// schemas/commonTables.ts
export const TABLE_SCHEMAS = {
  users: `(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,

  products: `(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    vendor TEXT,
    brand TEXT,
    stock INTEGER DEFAULT 0,
    image_url TEXT,
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )`,

  orders: `(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`,

  order_items: `(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  )`,

  categories: `(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (parent_id) REFERENCES categories (id)
  )`
};
```

### 3. Database Initialization

```typescript
// utils/databaseInit.ts
export const initializeDatabase = async (turso: TursoService): Promise<boolean> => {
  const tableManager = new TableManager(turso);

  try {
    console.log('🚀 Initializing database...');

    // Create tables in order (respecting foreign key dependencies)
    const tablesToCreate = [
      { name: 'users', schema: TABLE_SCHEMAS.users },
      { name: 'categories', schema: TABLE_SCHEMAS.categories },
      { name: 'products', schema: TABLE_SCHEMAS.products },
      { name: 'orders', schema: TABLE_SCHEMAS.orders },
      { name: 'order_items', schema: TABLE_SCHEMAS.order_items }
    ];

    for (const table of tablesToCreate) {
      const exists = await tableManager.tableExists(table.name);
      if (!exists) {
        console.log(`📋 Creating table: ${table.name}`);
        await tableManager.createTable(table.name, table.schema);
      } else {
        console.log(`✅ Table ${table.name} already exists`);
      }
    }

    console.log('🎉 Database initialization completed');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return false;
  }
};
```

### 4. Table Creation Example

```typescript
// Example usage
const setupDatabase = async () => {
  // Initialize Turso service
  const credentials = await getTursoCredentials();
  if (!credentials) {
    throw new Error('No Turso credentials found');
  }

  const turso = new TursoService(credentials);

  // Initialize database with common tables
  await initializeDatabase(turso);

  // Create custom table
  const tableManager = new TableManager(turso);
  await tableManager.createTable('custom_table', `(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    data TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  // Verify tables
  const tables = await tableManager.listTables();
  console.log('Available tables:', tables);
};
```

## Best Practices

### 1. Error Handling

```typescript
// Always wrap database operations in try-catch blocks
const safeExecuteQuery = async (turso: TursoService, sql: string, args: any[] = []) => {
  try {
    const result = await turso.executeQuery(sql, args);
    return { success: true, data: turso.getAllRows(result) };
  } catch (error) {
    console.error('Database operation failed:', error);
    return { success: false, error: error.message };
  }
};

// Implement retry logic for critical operations
const executeWithRetry = async (
  operation: () => Promise<any>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<any> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;

      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
};
```

### 2. SQL Injection Prevention

```typescript
// Always use parameterized queries
// ❌ Bad - vulnerable to SQL injection
const badQuery = `SELECT * FROM products WHERE title = '${userInput}'`;

// ✅ Good - safe parameterized query
const goodQuery = 'SELECT * FROM products WHERE title = ?';
const result = await turso.executeQuery(goodQuery, [userInput]);

// ✅ Good - multiple parameters
const complexQuery = `
  SELECT * FROM products
  WHERE category = ? AND price BETWEEN ? AND ?
  ORDER BY created_at DESC
`;
const result2 = await turso.executeQuery(complexQuery, [category, minPrice, maxPrice]);
```

### 3. Connection Management

```typescript
// Use singleton pattern for Turso service
class TursoManager {
  private static instance: TursoService | null = null;

  static async getInstance(): Promise<TursoService> {
    if (!this.instance) {
      const credentials = await getTursoCredentials();
      if (!credentials) {
        throw new Error('No Turso credentials available');
      }
      this.instance = new TursoService(credentials);
    }
    return this.instance;
  }

  static reset() {
    this.instance = null;
  }

  static async refreshCredentials() {
    this.reset();
    return this.getInstance();
  }
}

// Usage
const turso = await TursoManager.getInstance();
```

### 4. Performance Optimization

```typescript
// Use transactions for multiple related operations
const bulkInsertProducts = async (turso: TursoService, products: Product[]) => {
  const queries = products.map(product => ({
    type: 'execute' as const,
    stmt: {
      sql: 'INSERT INTO products (title, price, category, created_at) VALUES (?, ?, ?, datetime("now"))',
      args: [product.title, product.price, product.category]
    }
  }));

  return await turso.executeTransaction(queries);
};

// Use pagination for large datasets
const fetchProductsPaginated = async (
  turso: TursoService,
  page: number,
  pageSize: number = 50
) => {
  const offset = (page - 1) * pageSize;
  const result = await turso.executeQuery(
    'SELECT * FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [pageSize, offset]
  );
  return turso.getAllRows(result);
};

// Use indexes for better query performance
const createIndexes = async (turso: TursoService) => {
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)',
    'CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)',
    'CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at)',
    'CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)'
  ];

  for (const indexSQL of indexes) {
    await turso.executeQuery(indexSQL);
  }
};
```

### 5. Data Validation

```typescript
// Create validation schemas
interface ProductInput {
  title: string;
  price: number;
  category: string;
  description?: string;
  stock?: number;
}

const validateProduct = (product: any): product is ProductInput => {
  if (!product.title || typeof product.title !== 'string' || product.title.trim().length === 0) {
    return false;
  }
  if (!product.price || typeof product.price !== 'number' || product.price < 0) {
    return false;
  }
  if (!product.category || typeof product.category !== 'string') {
    return false;
  }
  return true;
};

const insertProduct = async (turso: TursoService, product: any) => {
  if (!validateProduct(product)) {
    throw new Error('Invalid product data');
  }

  const result = await turso.executeQuery(
    `INSERT INTO products (title, price, category, description, stock, created_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    [
      product.title.trim(),
      product.price,
      product.category,
      product.description || null,
      product.stock || 0
    ]
  );

  return result.results[0]?.response?.result?.last_insert_rowid;
};
```

### 6. Environment-Specific Configuration

```typescript
// config/turso.ts
export const getTursoConfig = (): TursoCredentials => {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return {
        dbName: process.env.TURSO_DB_NAME_PROD!,
        dbToken: process.env.TURSO_DB_TOKEN_PROD!,
        orgName: process.env.TURSO_ORG_NAME!,
        region: 'lhr'
      };

    case 'staging':
      return {
        dbName: process.env.TURSO_DB_NAME_STAGING!,
        dbToken: process.env.TURSO_DB_TOKEN_STAGING!,
        orgName: process.env.TURSO_ORG_NAME!,
        region: 'lhr'
      };

    default: // development
      return {
        dbName: process.env.TURSO_DB_NAME_DEV!,
        dbToken: process.env.TURSO_DB_TOKEN_DEV!,
        orgName: process.env.TURSO_ORG_NAME!,
        region: 'lhr'
      };
  }
};
```

## Usage Examples

### 1. Complete Setup Flow

```typescript
// Complete application setup with Turso
const setupApplication = async () => {
  try {
    console.log('🚀 Setting up Turso application...');

    // 1. Get or create database credentials
    let credentials = await getTursoCredentials();

    if (!credentials) {
      // Create new database if no credentials exist
      const orgToken = process.env.TURSO_ORG_TOKEN!;
      const orgName = process.env.TURSO_ORG_NAME!;
      const dbName = formatDatabaseName('my-app-db');

      // Create database
      const dbData = await createTursoDatabase(dbName, orgName, orgToken);

      // Get database token
      const dbToken = await getDatabaseToken(dbName, orgName, orgToken);

      // Store credentials
      credentials = {
        dbName,
        dbToken,
        orgName,
        region: 'lhr'
      };

      await storeTursoCredentials(credentials);
    }

    // 2. Initialize Turso service
    const turso = new TursoService(credentials);

    // 3. Initialize database schema
    await initializeDatabase(turso);

    console.log('✅ Application setup complete');
    return turso;
  } catch (error) {
    console.error('❌ Application setup failed:', error);
    throw error;
  }
};
```

### 2. Product Management Example

```typescript
// Complete product management implementation
interface Product {
  id?: number;
  title: string;
  description?: string;
  price: number;
  category: string;
  vendor?: string;
  brand?: string;
  stock: number;
  image_url?: string;
  status: 'active' | 'inactive' | 'draft';
}

interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  vendor?: string;
  brand?: string;
}

class ProductManager {
  constructor(private turso: TursoService) {}

  async createProduct(product: Omit<Product, 'id'>): Promise<string | null> {
    const sql = `
      INSERT INTO products (title, description, price, category, vendor, brand, stock, image_url, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `;

    const args = [
      product.title,
      product.description || null,
      product.price,
      product.category,
      product.vendor || null,
      product.brand || null,
      product.stock,
      product.image_url || null,
      product.status
    ];

    const result = await this.turso.executeQuery(sql, args);
    return result.results[0]?.response?.result?.last_insert_rowid || null;
  }

  async getProducts(filters: ProductFilters = {}, limit = 50, offset = 0): Promise<Product[]> {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const args: any[] = [];

    if (filters.category) {
      sql += ' AND category = ?';
      args.push(filters.category);
    }

    if (filters.minPrice !== undefined) {
      sql += ' AND price >= ?';
      args.push(filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      sql += ' AND price <= ?';
      args.push(filters.maxPrice);
    }

    if (filters.status) {
      sql += ' AND status = ?';
      args.push(filters.status);
    }

    if (filters.vendor) {
      sql += ' AND vendor = ?';
      args.push(filters.vendor);
    }

    if (filters.brand) {
      sql += ' AND brand = ?';
      args.push(filters.brand);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    args.push(limit, offset);

    const result = await this.turso.executeQuery(sql, args);
    return this.turso.getAllRows(result) as Product[];
  }

  async getProductById(id: number): Promise<Product | null> {
    const result = await this.turso.executeQuery(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    return this.turso.getFirstRow(result) as Product | null;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<boolean> {
    const fields = Object.keys(updates).filter(key => key !== 'id');
    const values = fields.map(field => updates[field as keyof Product]);

    if (fields.length === 0) return false;

    const sql = `
      UPDATE products
      SET ${fields.map(field => `${field} = ?`).join(', ')}, updated_at = datetime('now')
      WHERE id = ?
    `;

    const result = await this.turso.executeQuery(sql, [...values, id]);
    return (result.results[0]?.response?.result?.affected_row_count || 0) > 0;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await this.turso.executeQuery(
      'DELETE FROM products WHERE id = ?',
      [id]
    );
    return (result.results[0]?.response?.result?.affected_row_count || 0) > 0;
  }

  async searchProducts(query: string, limit = 20): Promise<Product[]> {
    const sql = `
      SELECT * FROM products
      WHERE (title LIKE ? OR description LIKE ? OR category LIKE ?)
      AND status = 'active'
      ORDER BY created_at DESC
      LIMIT ?
    `;

    const searchTerm = `%${query}%`;
    const result = await this.turso.executeQuery(sql, [searchTerm, searchTerm, searchTerm, limit]);
    return this.turso.getAllRows(result) as Product[];
  }
}
```

### 3. React Component Integration

```typescript
// React component using Turso database
import React, { useState, useEffect } from 'react';

const ProductList: React.FC = () => {
  const { credentials, isLoading: credentialsLoading } = useTursoCredentials();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productManager, setProductManager] = useState<ProductManager | null>(null);

  useEffect(() => {
    if (credentials) {
      const turso = new TursoService(credentials);
      setProductManager(new ProductManager(turso));
    }
  }, [credentials]);

  useEffect(() => {
    if (productManager) {
      loadProducts();
    }
  }, [productManager]);

  const loadProducts = async () => {
    if (!productManager) return;

    setLoading(true);
    setError(null);

    try {
      const productList = await productManager.getProducts({ status: 'active' });
      setProducts(productList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!productManager) return;

    try {
      await productManager.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  if (credentialsLoading) return <div>Loading credentials...</div>;
  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Products</h2>
      <button onClick={loadProducts}>Refresh</button>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Category: {product.category}</p>
              <p>Stock: {product.stock}</p>
              <button onClick={() => handleDeleteProduct(product.id!)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Product form component
const ProductForm: React.FC<{ onProductCreated: () => void }> = ({ onProductCreated }) => {
  const { credentials } = useTursoCredentials();
  const [productManager, setProductManager] = useState<ProductManager | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    status: 'active' as const
  });

  useEffect(() => {
    if (credentials) {
      const turso = new TursoService(credentials);
      setProductManager(new ProductManager(turso));
    }
  }, [credentials]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productManager) return;

    try {
      await productManager.createProduct(formData);
      setFormData({
        title: '',
        description: '',
        price: 0,
        category: '',
        stock: 0,
        status: 'active'
      });
      onProductCreated();
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Product Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Stock"
        value={formData.stock}
        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
        required
      />
      <button type="submit">Create Product</button>
    </form>
  );
};
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   ```
   Error: Turso API error (401): Unauthorized
   ```
   - **Solution**: Check if your database token is valid and not expired
   - **Fix**: Regenerate database token using Turso CLI or API

2. **Database Not Found**
   ```
   Error: Turso API error (404): Database not found
   ```
   - **Solution**: Verify database name and organization
   - **Fix**: Check database exists with `turso db list`

3. **SQL Syntax Errors**
   ```
   Error: Database error: near "SELCT": syntax error
   ```
   - **Solution**: Use proper SQLite syntax
   - **Fix**: Validate SQL queries before execution

4. **Network Timeouts**
   ```
   Error: fetch failed
   ```
   - **Solution**: Implement retry logic with exponential backoff
   - **Fix**: Check network connectivity and Turso service status

5. **Token Expiration**
   ```
   Error: Turso API error (403): Token expired
   ```
   - **Solution**: Refresh database tokens periodically
   - **Fix**: Implement token refresh mechanism

### Debug Tips

```typescript
// Enable detailed logging
const debugTurso = (turso: TursoService) => {
  const originalExecuteQuery = turso.executeQuery.bind(turso);

  turso.executeQuery = async (sql: string, args: any[] = []) => {
    console.log('🔍 Executing SQL:', sql);
    console.log('📝 Arguments:', args);

    const start = Date.now();
    try {
      const result = await originalExecuteQuery(sql, args);
      const duration = Date.now() - start;

      console.log(`⏱️ Query completed in ${duration}ms`);
      console.log('📊 Result:', result);

      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`❌ Query failed after ${duration}ms:`, error);
      throw error;
    }
  };

  return turso;
};

// Usage
const turso = debugTurso(new TursoService(credentials));
```

### Health Check

```typescript
// Database health check
const checkDatabaseHealth = async (turso: TursoService): Promise<boolean> => {
  try {
    const result = await turso.executeQuery('SELECT 1 as health_check');
    const healthData = turso.getFirstRow(result);
    return healthData?.health_check === 1;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

// Connection test
const testConnection = async () => {
  const credentials = await getTursoCredentials();
  if (!credentials) {
    console.error('No credentials available');
    return false;
  }

  const turso = new TursoService(credentials);
  const isHealthy = await checkDatabaseHealth(turso);

  console.log(`Database health: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}`);
  return isHealthy;
};
```

---

## Quick Start Template

Use this template to quickly set up Turso in your project:

```typescript
// 1. Install dependencies (if using React Native)
// npm install @react-native-async-storage/async-storage

// 2. Set up environment variables
// TURSO_ORG_NAME=your-org-name
// TURSO_ORG_TOKEN=your-org-token

// 3. Initialize Turso service
const initTurso = async () => {
  const credentials = await getTursoCredentials();
  if (!credentials) {
    throw new Error('No Turso credentials found');
  }

  const turso = new TursoService(credentials);
  await initializeDatabase(turso);

  return turso;
};

// 4. Use in your application
const App = () => {
  const [turso, setTurso] = useState<TursoService | null>(null);

  useEffect(() => {
    initTurso().then(setTurso);
  }, []);

  if (!turso) return <div>Loading...</div>;

  return <YourAppComponents turso={turso} />;
};
```

This comprehensive guide covers all aspects of Turso database implementation. Use it as a reference for implementing Turso functionality in any application.
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Ensure API tokens are valid and not expired
2. **Database Not Found**: Verify database name formatting and existence
3. **SQL Syntax Errors**: Use proper SQLite syntax and parameterized queries
4. **Network Timeouts**: Implement retry logic with exponential backoff
5. **Credential Caching**: Clear cache when switching users or updating credentials

### Debug Tips

```typescript
// Enable detailed logging
const debugQuery = async (sql: string, args: any[] = []) => {
  console.log('🔍 Executing SQL:', sql);
  console.log('📝 Arguments:', args);

  const start = Date.now();
  const result = await databaseService.executeQuery(sql, args);
  const duration = Date.now() - start;

  console.log(`⏱️ Query completed in ${duration}ms`);
  console.log('📊 Result:', result);

  return result;
};
```

This comprehensive guide covers all aspects of Turso database setup and usage based on the tar1 project implementation. Use it as a reference for implementing similar functionality in your React Native applications.
```
```
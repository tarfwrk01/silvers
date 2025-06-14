import { Product, TursoApiResponse, TursoProduct } from '../types';

// Turso database configuration
const TURSO_URL = 'https://skjsilverssmithgmailcom-tarframework.turso.io/v2/pipeline';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDkxNTQ0NzYsImlkIjoiNTMxNmFiZjEtMmU5ZC00ZjRjLTljMTItMmU4ODdkMmRhNjgyIiwicmlkIjoiZjRmYWQ0ODAtNmNmNC00NGEyLTk3MTAtMWI1OTJkNzdkNTE5In0.08KY_FG0_xEpdOIbjS4ilzzrjU2HvXJSZNC4_Gk6hGXsTCHi09fpSdT2MhiDNTSwB7oA24hQ6cKFkEHybrtcAQ';

export class TursoApiService {
  private async executeQuery(sql: string, args?: any[]): Promise<TursoApiResponse> {
    try {
      const stmt: any = { sql };
      if (args && args.length > 0) {
        // Format arguments for Turso API - each argument needs to be wrapped with type information
        stmt.args = args.map(arg => {
          if (arg === null || arg === undefined) {
            return { type: 'null' };
          } else if (typeof arg === 'string') {
            return { type: 'text', value: arg };
          } else if (typeof arg === 'number') {
            if (Number.isInteger(arg)) {
              return { type: 'integer', value: arg.toString() };
            } else {
              return { type: 'float', value: arg };
            }
          } else if (typeof arg === 'boolean') {
            return { type: 'integer', value: arg ? '1' : '0' };
          } else {
            // For other types, convert to string
            return { type: 'text', value: String(arg) };
          }
        });
      }

      const requestBody = {
        requests: [
          {
            type: 'execute',
            stmt: stmt,
          },
        ],
      };

      console.log('Turso API Request:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(TURSO_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TURSO_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Turso API HTTP error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log('Turso API Response:', JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error('Turso API error:', error);
      throw error;
    }
  }

  private parseRowData(cols: Array<{ name: string; decltype: string }>, row: Array<{ type: string; value: string }>): TursoProduct {
    const product: any = {};
    
    cols.forEach((col, index) => {
      const value = row[index]?.value;
      const type = row[index]?.type;
      
      // Convert values based on type
      switch (type) {
        case 'integer':
          product[col.name] = value ? parseInt(value, 10) : 0;
          break;
        case 'float':
          product[col.name] = value ? parseFloat(value) : 0;
          break;
        case 'text':
        default:
          product[col.name] = value || '';
          break;
      }
    });

    return product as TursoProduct;
  }

  private transformToProduct(tursoProduct: TursoProduct): Product {
    // Parse JSON fields safely
    const parseJsonField = (field: string, fallback: any = []) => {
      try {
        return field ? JSON.parse(field) : fallback;
      } catch {
        return fallback;
      }
    };

    // Extract images from medias and main image
    const medias = parseJsonField(tursoProduct.medias, []);
    const images = [tursoProduct.image, ...medias].filter(Boolean);

    // Parse options for variants/specifications
    const rawOptions = parseJsonField(tursoProduct.options, []);
    const metafields = parseJsonField(tursoProduct.metafields, {});
    const seoData = parseJsonField(tursoProduct.seo, {});

    // Transform options to ProductOption format
    const options: any[] = rawOptions.map((option: any) => ({
      id: option.id || Math.random(),
      title: option.title || '',
      value: option.value || '',
      identifierType: option.identifierType || 'text',
      identifierValue: option.identifierValue || option.value || '',
      group: option.group || 'default'
    }));

    // Generate specifications from metafields only (not options)
    const specifications: Record<string, string> = {
      ...metafields,
    };

    // Parse tags
    const tags = tursoProduct.tags ? tursoProduct.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

    // Calculate rating and review count (mock data for now)
    const rating = Math.min(5, Math.max(3, 4 + Math.random()));
    const reviewCount = Math.floor(Math.random() * 100) + 10;

    return {
      id: tursoProduct.id.toString(),
      name: tursoProduct.title,
      description: tursoProduct.excerpt || tursoProduct.notes || '',
      price: tursoProduct.saleprice > 0 ? tursoProduct.saleprice : tursoProduct.price,
      originalPrice: tursoProduct.saleprice > 0 ? tursoProduct.price : undefined,
      images: images.length > 0 ? images : ['https://via.placeholder.com/400x400?text=No+Image'],
      category: tursoProduct.category,
      categoryId: tursoProduct.category.toLowerCase().replace(/\s+/g, '-'),
      collection: tursoProduct.collection || undefined,
      brand: tursoProduct.brand || 'Unknown',
      vendor: tursoProduct.vendor && tursoProduct.vendor.trim() !== '' ? tursoProduct.vendor : undefined,
      rating: Math.round(rating * 10) / 10,
      reviewCount: reviewCount,
      inStock: tursoProduct.stock > 0,
      stockQuantity: tursoProduct.stock,
      tags: tags,
      features: [], // Could be extracted from notes or description
      options: options.length > 0 ? options : undefined,
      specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
      createdAt: tursoProduct.createdat,
      updatedAt: tursoProduct.updatedat,
    };
  }

  async fetchProducts(): Promise<Product[]> {
    try {
      const response = await this.executeQuery('SELECT * FROM products WHERE publish = "published" OR publish = "draft"');
      
      if (!response.results || response.results.length === 0) {
        return [];
      }

      const result = response.results[0];
      if (result.type !== 'ok' || !result.response?.result?.rows) {
        throw new Error('Invalid response format');
      }

      const { cols, rows } = result.response.result;
      
      const tursoProducts = rows.map(row => this.parseRowData(cols, row));
      const products = tursoProducts.map(tursoProduct => this.transformToProduct(tursoProduct));
      
      return products;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }

  async fetchFeaturedProducts(): Promise<Product[]> {
    try {
      const response = await this.executeQuery('SELECT * FROM products WHERE featured = 1 AND (publish = "published" OR publish = "draft") LIMIT 10');
      
      if (!response.results || response.results.length === 0) {
        return [];
      }

      const result = response.results[0];
      if (result.type !== 'ok' || !result.response?.result?.rows) {
        throw new Error('Invalid response format');
      }

      const { cols, rows } = result.response.result;
      
      const tursoProducts = rows.map(row => this.parseRowData(cols, row));
      const products = tursoProducts.map(tursoProduct => this.transformToProduct(tursoProduct));
      
      return products;
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      throw error;
    }
  }

  async fetchProductById(id: string): Promise<Product | null> {
    try {
      const response = await this.executeQuery(`SELECT * FROM products WHERE id = ${id} LIMIT 1`);

      if (!response.results || response.results.length === 0) {
        return null;
      }

      const result = response.results[0];
      if (result.type !== 'ok' || !result.response?.result?.rows || result.response.result.rows.length === 0) {
        return null;
      }

      const { cols, rows } = result.response.result;
      const tursoProduct = this.parseRowData(cols, rows[0]);

      return this.transformToProduct(tursoProduct);
    } catch (error) {
      console.error('Failed to fetch product by ID:', error);
      return null;
    }
  }

  async fetchCollections(): Promise<any[]> {
    try {
      const response = await this.executeQuery('SELECT * FROM collections ORDER BY name ASC');

      if (!response.results || response.results.length === 0) {
        return [];
      }

      const result = response.results[0];
      if (result.type !== 'ok' || !result.response?.result?.rows) {
        throw new Error('Invalid response format');
      }

      const { cols, rows } = result.response.result;

      const collections = rows.map(row => {
        const collection: any = {};
        cols.forEach((col, index) => {
          const value = row[index]?.value;
          collection[col.name] = value;
        });
        return collection;
      });

      console.log('Available collections:', collections.map(c => ({ id: c.id, name: c.name })));
      return collections;
    } catch (error) {
      console.error('Failed to fetch collections:', error);
      throw error;
    }
  }

  async fetchProductsByCollection(collectionName: string): Promise<Product[]> {
    try {
      const response = await this.executeQuery(
        'SELECT * FROM products WHERE collection = ? AND (publish = "published" OR publish = "draft") ORDER BY title ASC',
        [collectionName]
      );

      if (!response.results || response.results.length === 0) {
        return [];
      }

      const result = response.results[0];
      if (result.type !== 'ok' || !result.response?.result?.rows) {
        throw new Error('Invalid response format');
      }

      const { cols, rows } = result.response.result;

      const tursoProducts = rows.map(row => this.parseRowData(cols, row));
      const products = tursoProducts.map(tursoProduct => this.transformToProduct(tursoProduct));

      return products;
    } catch (error) {
      console.error('Failed to fetch products by collection:', error);
      throw error;
    }
  }

  async fetchCollectionById(id: number): Promise<any | null> {
    try {
      console.log('Executing query for collection ID:', id);
      const response = await this.executeQuery('SELECT * FROM collections WHERE id = ? LIMIT 1', [id]);
      console.log('Raw response:', JSON.stringify(response, null, 2));

      if (!response.results || response.results.length === 0) {
        console.log('No results in response');
        return null;
      }

      const result = response.results[0];
      console.log('First result:', JSON.stringify(result, null, 2));

      if (result.type !== 'ok' || !result.response?.result?.rows || result.response.result.rows.length === 0) {
        console.log('Result type not ok or no rows');
        return null;
      }

      const { cols, rows } = result.response.result;
      console.log('Columns:', cols);
      console.log('Rows:', rows);

      const collection: any = {};
      cols.forEach((col, index) => {
        const value = rows[0][index]?.value;
        collection[col.name] = value;
      });

      console.log('Parsed collection:', collection);
      return collection;
    } catch (error) {
      console.error('Failed to fetch collection by ID:', error);
      return null;
    }
  }

  async fetchCategories(): Promise<any[]> {
    try {
      const response = await this.executeQuery('SELECT * FROM categories ORDER BY name ASC');

      if (!response.results || response.results.length === 0) {
        return [];
      }

      const result = response.results[0];
      if (result.type !== 'ok' || !result.response?.result?.rows) {
        throw new Error('Invalid response format');
      }

      const { cols, rows } = result.response.result;

      const categories = rows.map(row => {
        const category: any = {};
        cols.forEach((col, index) => {
          const value = row[index]?.value;
          const type = row[index]?.type;

          // Convert values based on type
          switch (type) {
            case 'integer':
              category[col.name] = value ? parseInt(value, 10) : 0;
              break;
            case 'float':
              category[col.name] = value ? parseFloat(value) : 0;
              break;
            case 'text':
            default:
              category[col.name] = value || '';
              break;
          }
        });
        return category;
      });

      console.log('Available categories:', categories.map(c => ({ id: c.id, name: c.name })));
      return categories;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }

  // Order Management Methods
  async testDatabaseConnection(): Promise<boolean> {
    try {
      console.log('Testing database connection...');
      const response = await this.executeQuery("SELECT 1 as test");
      console.log('Database connection test response:', JSON.stringify(response, null, 2));
      return response.results && response.results.length > 0 && response.results[0].type === 'ok';
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  async checkOrderTablesExist(): Promise<boolean> {
    try {
      console.log('Checking if order tables exist...');

      // Check what tables exist
      const tablesResponse = await this.executeQuery("SELECT name FROM sqlite_master WHERE type='table'");
      console.log('Existing tables:', JSON.stringify(tablesResponse, null, 2));

      if (!tablesResponse.results || tablesResponse.results.length === 0) {
        return false;
      }

      const result = tablesResponse.results[0];
      if (result.type !== 'ok' || !result.response?.result?.rows) {
        return false;
      }

      const tableNames = result.response.result.rows.map(row => row[0].value);
      const hasOrdersTable = tableNames.includes('orders');
      const hasOrderItemsTable = tableNames.includes('orderitems');

      console.log('Orders table exists:', hasOrdersTable);
      console.log('OrderItems table exists:', hasOrderItemsTable);

      // If tables exist, check their schema
      if (hasOrdersTable) {
        await this.checkTableSchema('orders');
      }
      if (hasOrderItemsTable) {
        await this.checkTableSchema('orderitems');
      }

      return hasOrdersTable && hasOrderItemsTable;
    } catch (error) {
      console.error('Failed to check order tables exist:', error);
      return false;
    }
  }

  async checkTableSchema(tableName: string): Promise<void> {
    try {
      console.log(`Checking schema for table: ${tableName}`);

      // Get table schema
      const schemaResponse = await this.executeQuery(`PRAGMA table_info(${tableName})`);
      console.log(`${tableName} schema:`, JSON.stringify(schemaResponse, null, 2));

      // Also get the CREATE statement - use parameterized query
      const createResponse = await this.executeQuery(
        `SELECT sql FROM sqlite_master WHERE type='table' AND name='${tableName}'`
      );
      console.log(`${tableName} CREATE statement:`, JSON.stringify(createResponse, null, 2));
    } catch (error) {
      console.error(`Failed to check schema for ${tableName}:`, error);
    }
  }

  async createOrder(orderData: any): Promise<number | null> {
    try {
      console.log('Creating order with data:', orderData);

      const {
        referid,
        customerid,
        name,
        email,
        phone,
        status = 'pending',
        fulfill = 'pending',
        currency = 'USD',
        subtotal,
        total,
        tax,
        discount = 0,
        shipping,
        shipaddrs,
        billaddrs
      } = orderData;

      // Use a simpler INSERT statement without datetime functions
      const sql = `
        INSERT INTO orders (
          referid, customerid, name, email, phone, status, fulfill, currency,
          subtotal, total, tax, discount, shipping, shipaddrs, billaddrs
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const args = [
        referid, customerid, name, email, phone, status, fulfill, currency,
        subtotal, total, tax, discount, shipping, shipaddrs, billaddrs
      ];

      console.log('Executing SQL:', sql);
      console.log('With args:', args);

      const response = await this.executeQuery(sql, args);
      console.log('Order creation response:', JSON.stringify(response, null, 2));

      if (!response.results || response.results.length === 0) {
        throw new Error('Failed to create order');
      }

      const result = response.results[0];
      if (result.type !== 'ok') {
        console.error('Order creation failed:', result);
        throw new Error(`Failed to create order: ${JSON.stringify(result)}`);
      }

      const orderId = result.response?.result?.last_insert_rowid;
      console.log('Created order with ID:', orderId);

      return orderId ? parseInt(orderId, 10) : null;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  async createOrderItem(orderItemData: any): Promise<boolean> {
    try {
      console.log('Creating order item with data:', orderItemData);

      const {
        orderid,
        title,
        varianttitle = '',
        sku = '',
        qty,
        price,
        total,
        taxrate = 0,
        taxamt = 0
      } = orderItemData;

      const sql = `
        INSERT INTO orderitems (
          orderid, title, varianttitle, sku, qty, price, total, taxrate, taxamt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const args = [orderid, title, varianttitle, sku, qty, price, total, taxrate, taxamt];

      console.log('Executing SQL:', sql);
      console.log('With args:', args);

      const response = await this.executeQuery(sql, args);
      console.log('Order item creation response:', JSON.stringify(response, null, 2));

      if (!response.results || response.results.length === 0) {
        throw new Error('Failed to create order item');
      }

      const result = response.results[0];
      if (result.type !== 'ok') {
        console.error('Order item creation failed:', result);
        throw new Error(`Failed to create order item: ${JSON.stringify(result)}`);
      }

      return true;
    } catch (error) {
      console.error('Failed to create order item:', error);
      throw error;
    }
  }

  async placeOrder(cartItems: any[], customerInfo: any): Promise<string | null> {
    try {
      console.log('🛒 STARTING ORDER PLACEMENT');
      console.log('Cart items count:', cartItems.length);
      console.log('Cart items:', JSON.stringify(cartItems, null, 2));
      console.log('Customer info:', JSON.stringify(customerInfo, null, 2));

      // Test database connection first
      console.log('🔗 Testing database connection...');
      const connectionOk = await this.testDatabaseConnection();
      if (!connectionOk) {
        throw new Error('Database connection failed');
      }
      console.log('✅ Database connection successful');

      // Check if order tables exist (they should already exist)
      console.log('📋 Checking order tables...');
      const tablesExist = await this.checkOrderTablesExist();
      if (!tablesExist) {
        throw new Error('Order tables do not exist in database');
      }
      console.log('✅ Order tables exist');

      // Generate unique reference ID
      const referid = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log('🆔 Generated order reference:', referid);

      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

      // Store GST number in tax column as requested
      const tax = customerInfo.gstNo || ''; // Store GST number directly in tax column

      const shipping = subtotal >= 75 ? 0 : 9.99; // Free shipping over $75
      const total = subtotal + shipping; // Total without tax calculation since GST is stored as identifier

      console.log('💰 Order totals calculated:', { subtotal, tax, shipping, total });

      // Create order
      console.log('📝 Creating order record...');

      // Format shipping address
      const shippingAddress = customerInfo.shippingAddress || {};
      const shipaddrs = `${shippingAddress.street || ''}, ${shippingAddress.city || ''}`.trim().replace(/^,\s*|,\s*$/g, '');

      // Format billing address (same as shipping for now)
      const billingAddress = customerInfo.billingAddress || customerInfo.shippingAddress || {};
      const billaddrs = `${billingAddress.street || ''}, ${billingAddress.city || ''}`.trim().replace(/^,\s*|,\s*$/g, '');

      const orderData = {
        referid,
        customerid: null, // For guest checkout
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone || '',
        subtotal,
        total,
        tax,
        shipping,
        shipaddrs: shipaddrs || 'Address not provided',
        billaddrs: billaddrs || 'Address not provided'
      };
      console.log('Order data to create:', JSON.stringify(orderData, null, 2));

      const orderId = await this.createOrder(orderData);
      console.log('📋 Order created with ID:', orderId);

      if (!orderId) {
        throw new Error('Failed to create order - no order ID returned');
      }

      // Create order items
      console.log('📦 Creating order items...');
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        console.log(`Creating order item ${i + 1}/${cartItems.length}:`, item);

        const variantTitle = item.selectedOptions
          ? Object.values(item.selectedOptions).map((opt: any) => opt.identifierValue || opt.value).join(', ')
          : '';

        const orderItemData = {
          orderid: orderId,
          title: item.product.name,
          varianttitle: variantTitle,
          sku: item.product.id,
          qty: item.quantity,
          price: item.product.price,
          total: item.product.price * item.quantity,
          taxrate: 0, // No tax rate calculation since GST is stored as identifier
          taxamt: 0 // No tax amount calculation since GST is stored as identifier
        };

        console.log('Order item data:', JSON.stringify(orderItemData, null, 2));
        await this.createOrderItem(orderItemData);
        console.log(`✅ Order item ${i + 1} created successfully`);
      }

      console.log('🎉 ORDER PLACEMENT COMPLETED SUCCESSFULLY');
      console.log('Order reference:', referid);

      // Verify the order was created
      await this.verifyOrderCreated(referid);

      return referid;
    } catch (error) {
      console.error('❌ FAILED TO PLACE ORDER:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  async verifyOrderCreated(referid: string): Promise<void> {
    try {
      console.log('🔍 Verifying order was created:', referid);

      // Check if order exists
      const orderResponse = await this.executeQuery(
        'SELECT * FROM orders WHERE referid = ?',
        [referid]
      );

      console.log('Order verification response:', JSON.stringify(orderResponse, null, 2));

      if (orderResponse.results && orderResponse.results[0]?.type === 'ok') {
        const rows = orderResponse.results[0].response?.result?.rows || [];
        if (rows.length > 0) {
          console.log('✅ Order verified in database');

          // Also check order items
          const orderItemsResponse = await this.executeQuery(
            'SELECT * FROM orderitems WHERE orderid = (SELECT id FROM orders WHERE referid = ?)',
            [referid]
          );

          console.log('Order items verification:', JSON.stringify(orderItemsResponse, null, 2));

          if (orderItemsResponse.results && orderItemsResponse.results[0]?.type === 'ok') {
            const itemRows = orderItemsResponse.results[0].response?.result?.rows || [];
            console.log(`✅ Found ${itemRows.length} order items in database`);
          }
        } else {
          console.log('❌ Order not found in database');
        }
      }
    } catch (error) {
      console.error('Failed to verify order:', error);
    }
  }

  async listAllOrders(): Promise<void> {
    try {
      console.log('📋 Listing all orders in database...');

      const response = await this.executeQuery('SELECT * FROM orders ORDER BY id DESC LIMIT 10');
      console.log('All orders response:', JSON.stringify(response, null, 2));

      if (response.results && response.results[0]?.type === 'ok') {
        const rows = response.results[0].response?.result?.rows || [];
        console.log(`Found ${rows.length} orders in database`);

        if (rows.length > 0) {
          const cols = response.results[0].response?.result?.cols || [];
          rows.forEach((row, index) => {
            const orderData = this.parseRowData(cols, row);
            console.log(`Order ${index + 1}:`, orderData);
          });
        }
      }
    } catch (error) {
      console.error('Failed to list orders:', error);
    }
  }

  async testOrderPlacement(): Promise<void> {
    try {
      console.log('🧪 TESTING ORDER PLACEMENT');

      // Create test cart items
      const testCartItems = [
        {
          product: {
            id: 'test-product-1',
            name: 'Test Product 1',
            price: 29.99
          },
          quantity: 2,
          selectedOptions: {}
        },
        {
          product: {
            id: 'test-product-2',
            name: 'Test Product 2',
            price: 19.99
          },
          quantity: 1,
          selectedOptions: {}
        }
      ];

      // Create test customer info
      const testCustomerInfo = {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '123-456-7890',
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'US'
        }
      };

      console.log('🧪 Placing test order...');
      const orderRef = await this.placeOrder(testCartItems, testCustomerInfo);
      console.log('🧪 Test order placed successfully:', orderRef);

      // List all orders to verify
      await this.listAllOrders();

    } catch (error) {
      console.error('🧪 Test order placement failed:', error);
    }
  }
}

// Export singleton instance
export const tursoApi = new TursoApiService();

// Make it globally available for debugging
if (typeof window !== 'undefined') {
  (window as any).tursoApi = tursoApi;
  console.log('🔧 tursoApi is now available globally for debugging');
  console.log('🔧 Try: tursoApi.testOrderPlacement() or tursoApi.listAllOrders()');
}

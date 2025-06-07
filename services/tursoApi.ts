import { TursoApiResponse, TursoProduct, Product } from '../types';

// Turso database configuration
const TURSO_URL = 'https://skjsilverssmithgmailcom-tarframework.turso.io/v2/pipeline';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDkxNTQ0NzYsImlkIjoiNTMxNmFiZjEtMmU5ZC00ZjRjLTljMTItMmU4ODdkMmRhNjgyIiwicmlkIjoiZjRmYWQ0ODAtNmNmNC00NGEyLTk3MTAtMWI1OTJkNzdkNTE5In0.08KY_FG0_xEpdOIbjS4ilzzrjU2HvXJSZNC4_Gk6hGXsTCHi09fpSdT2MhiDNTSwB7oA24hQ6cKFkEHybrtcAQ';

export class TursoApiService {
  private async executeQuery(sql: string): Promise<TursoApiResponse> {
    try {
      const response = await fetch(TURSO_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TURSO_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              type: 'execute',
              stmt: {
                sql: sql,
              },
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
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
    const options = parseJsonField(tursoProduct.options, []);
    const metafields = parseJsonField(tursoProduct.metafields, {});
    const seoData = parseJsonField(tursoProduct.seo, {});

    // Generate specifications from metafields and options
    const specifications: Record<string, string> = {
      ...metafields,
    };

    // Add options as specifications
    options.forEach((option: any) => {
      if (option.title && option.value) {
        specifications[option.title] = option.value;
      }
    });

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
      brand: tursoProduct.brand || tursoProduct.vendor || 'Unknown',
      rating: Math.round(rating * 10) / 10,
      reviewCount: reviewCount,
      inStock: tursoProduct.stock > 0,
      stockQuantity: tursoProduct.stock,
      tags: tags,
      features: [], // Could be extracted from notes or description
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
}

// Export singleton instance
export const tursoApi = new TursoApiService();

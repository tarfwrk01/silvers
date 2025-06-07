# Turso Database Integration

This document describes the integration of Turso database API for fetching products in the Silvers ecommerce application.

## Overview

The application now fetches real product data from a Turso database instead of using static sample data. The integration includes:

- **API Service**: `services/tursoApi.ts` - Handles all Turso database communication
- **Products Context**: `contexts/ProductsContext.tsx` - Manages product state and caching
- **Data Transformation**: Converts Turso database format to application Product interface
- **Error Handling**: Comprehensive error handling with retry functionality
- **Loading States**: Loading indicators throughout the application

## API Configuration

### Database Connection
- **URL**: `https://skjsilverssmithgmailcom-tarframework.turso.io/v2/pipeline`
- **Authentication**: Bearer token authentication
- **Format**: JSON requests with SQL statements

### Sample API Call
```bash
curl --location 'https://skjsilverssmithgmailcom-tarframework.turso.io/v2/pipeline' \
--header 'Authorization: Bearer [TOKEN]' \
--header 'content-type: application/json' \
--data '{
  "requests": [
    {
      "type": "execute",
      "stmt": {
        "sql": "SELECT * FROM products"
      }
    }
  ]
}'
```

## Data Transformation

### Turso Database Schema
The products table includes these key fields:
- `id` (INTEGER) - Product ID
- `title` (TEXT) - Product name
- `image` (TEXT) - Main product image URL
- `medias` (TEXT) - JSON array of additional images
- `price` (REAL) - Regular price
- `saleprice` (REAL) - Sale price
- `category` (TEXT) - Product category
- `brand` (TEXT) - Product brand
- `stock` (INTEGER) - Stock quantity
- `options` (TEXT) - JSON array of product options
- `metafields` (TEXT) - JSON object with additional data
- `featured` (INTEGER) - Featured product flag
- `publish` (TEXT) - Publication status

### Application Product Interface
The Turso data is transformed to match the application's Product interface:
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  categoryId: string;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  features: string[];
  specifications?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}
```

## Implementation Details

### TursoApiService Class
Located in `services/tursoApi.ts`, provides methods:
- `fetchProducts()` - Get all published products
- `fetchFeaturedProducts()` - Get featured products only
- `fetchProductById(id)` - Get single product by ID

### ProductsContext
Located in `contexts/ProductsContext.tsx`, provides:
- State management for products and featured products
- Loading and error states
- Automatic caching (5-minute cache duration)
- Retry functionality

### Updated Screens
1. **Home Screen** (`app/(tabs)/home.tsx`)
   - Uses `useProducts()` hook
   - Displays featured products from database
   - Loading and error states with retry

2. **Shop Screen** (`app/(tabs)/shop.tsx`)
   - Uses `useProducts()` hook
   - Filters and searches real product data
   - Loading and error states with retry

3. **Product Detail** (`app/product/[id].tsx`)
   - Uses `useProduct(id)` hook
   - Fetches individual product if not in cache
   - Loading and error states

## Error Handling

The integration includes comprehensive error handling:
- Network errors are caught and displayed to users
- Retry buttons allow users to attempt refetching data
- Fallback to empty states when no data is available
- Loading indicators during data fetching

## Caching Strategy

- Products are cached for 5 minutes to reduce API calls
- Cache is automatically refreshed when expired
- Manual refresh available through retry buttons
- Individual products are fetched on-demand if not in cache

## Testing

A test script is available at `scripts/test-turso-api.js` to verify the API connection:

```bash
node scripts/test-turso-api.js
```

## Future Enhancements

Potential improvements for the integration:
1. **Pagination**: Implement pagination for large product catalogs
2. **Real-time Updates**: Add WebSocket support for real-time inventory updates
3. **Advanced Filtering**: Server-side filtering and search
4. **Image Optimization**: Implement image resizing and optimization
5. **Offline Support**: Cache products locally for offline browsing
6. **Analytics**: Track product views and user interactions

## Security Considerations

- API tokens should be stored securely (consider environment variables)
- Implement rate limiting to prevent API abuse
- Validate all data received from the API
- Consider implementing API key rotation

## Troubleshooting

### Common Issues
1. **Network Errors**: Check internet connection and API endpoint
2. **Authentication Errors**: Verify API token is valid and not expired
3. **Data Format Errors**: Ensure database schema matches expected format
4. **Performance Issues**: Consider implementing pagination for large datasets

### Debug Mode
Enable debug logging by adding console.log statements in the TursoApiService methods to trace API calls and responses.

# Collection Detail Screen Import Fix

This document describes the fix for the import error in the collection detail screen.

## Error Description

The collection detail screen was throwing a ReferenceError:

```
ERROR  Warning: ReferenceError: Property 'useProducts' doesn't exist
```

## Root Cause

The error was caused by missing imports in the collection detail screen:

1. **Missing `useProducts` import**: The `useProducts` hook was being used but not imported from the ProductsContext
2. **Missing `useMemo` import**: The `useMemo` hook was being used but not imported from React

## Fix Applied

### Before (Broken Imports)
```typescript
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
// ... other imports
import ProductCard from '../../components/ProductCard';
import { tursoApi } from '../../services/tursoApi';
import { Collection, Product } from '../../types';

export default function CollectionDetailScreen() {
  const { products: allProducts, loading: productsLoading } = useProducts(); // ❌ useProducts not imported
  
  const filteredProducts = useMemo(() => { // ❌ useMemo not imported
    // ... filtering logic
  }, [allProducts, collection]);
}
```

### After (Fixed Imports)
```typescript
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useMemo } from 'react'; // ✅ Added useMemo
// ... other imports
import ProductCard from '../../components/ProductCard';
import { useProducts } from '../../contexts/ProductsContext'; // ✅ Added useProducts import
import { tursoApi } from '../../services/tursoApi';
import { Collection, Product } from '../../types';

export default function CollectionDetailScreen() {
  const { products: allProducts, loading: productsLoading } = useProducts(); // ✅ Now works
  
  const filteredProducts = useMemo(() => { // ✅ Now works
    // ... filtering logic
  }, [allProducts, collection]);
}
```

## Changes Made

### 1. Added `useMemo` to React imports
```typescript
// Before
import React, { useEffect, useState } from 'react';

// After
import React, { useEffect, useState, useMemo } from 'react';
```

### 2. Added `useProducts` import
```typescript
// Added this import
import { useProducts } from '../../contexts/ProductsContext';
```

## Verification

After applying the fix:
- ✅ No compilation errors
- ✅ No runtime errors
- ✅ Collection detail screen loads correctly
- ✅ Products are filtered properly using the optimized approach
- ✅ All functionality works as expected

## File Updated

- `app/collection/[id].tsx` - Fixed missing imports

## Testing Results

- ✅ App builds successfully
- ✅ No import errors
- ✅ Collection detail screen accessible
- ✅ Product filtering works correctly
- ✅ Navigation functions properly

## Lesson Learned

When refactoring code to use different hooks or contexts, always ensure:
1. All required imports are added
2. React hooks like `useMemo`, `useCallback`, `useEffect` are imported from React
3. Custom hooks are imported from their respective contexts
4. Run diagnostics to catch import errors early

This type of error is common when:
- Moving code between files
- Refactoring to use different hooks
- Adding new functionality that requires additional imports
- Copy-pasting code without checking dependencies

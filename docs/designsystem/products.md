# Products Design System Documentation

This document outlines the complete design system for the products interface, including tabs, tiles, and component patterns used in the products.tsx file. Use this as a reference for implementing consistent product management interfaces.

## Table of Contents
1. [Vertical Tab System](#vertical-tab-system)
2. [Tile System](#tile-system)
3. [Modal Design Patterns](#modal-design-patterns)
4. [List & Grid Components](#list--grid-components)
5. [Form Elements](#form-elements)
6. [Status & Feedback](#status--feedback)
7. [Implementation Guidelines](#implementation-guidelines)

## Vertical Tab System

### Tab Structure
The vertical tab system uses a left sidebar with icon-based navigation:

```typescript
interface TabItem {
  key: string;
  icon: string;
  label: string;
  iconLibrary?: 'Ionicons' | 'MaterialIcons';
}

const productTabs = [
  { key: 'core', icon: 'cube-outline', label: 'Core' },
  { key: 'metafields', icon: 'numbers', label: 'Metafields', iconLibrary: 'MaterialIcons' },
  { key: 'organization', icon: 'folder-outline', label: 'Organization' },
  { key: 'media', icon: 'images-outline', label: 'Media' },
  { key: 'notes', icon: 'document-text-outline', label: 'Notes' },
  { key: 'storefront', icon: 'storefront-outline', label: 'Storefront' },
  { key: 'options', icon: 'options-outline', label: 'Options' },
  { key: 'inventory', icon: 'layers-outline', label: 'Inventory' }
];
```

### Tab Bar Styling
```typescript
const tabBarStyles = {
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  tabBar: {
    width: 50,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    paddingTop: 0,
    justifyContent: 'space-between',
  },
  regularTabsContainer: {
    flex: 1,
  },
  bottomTabContainer: {
    paddingBottom: 16,
  },
  tab: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 0,
    borderLeftColor: 'transparent',
  },
  bottomTab: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 8,
  },
  activeTab: {
    borderLeftWidth: 3,
    borderLeftColor: '#0066CC',
    backgroundColor: '#f0f7ff',
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for scrolling
  },
};
```

### Tab Icon System
```typescript
const renderIcon = (tab: TabItem, isActive: boolean) => {
  const color = isActive ? '#0066CC' : '#666';
  const size = 24;

  if (tab.iconLibrary === 'MaterialIcons') {
    return <MaterialIcons name={tab.icon} size={size} color={color} />;
  } else {
    return <Ionicons name={tab.icon} size={size} color={color} />;
  }
};
```

## Tile System

### Core Tile Structure
The tile system is the foundation of the product interface, providing a grid-based layout for data display and interaction.

```typescript
const tileStyles = {
  // Main container
  tilesContainer: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#ffffff',
    marginBottom: 16,
    marginHorizontal: -16,
  },

  // Row layout
  tilesRow: {
    flexDirection: 'row',
  },

  // Base tile
  tile: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
};
```

### Pricing Tiles (Square Layout)
```typescript
const pricingTileStyles = {
  // Left tile (Price)
  tileLeft: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    aspectRatio: 1,
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
  },

  // Middle tile (Sale Price)
  tileMiddle: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    aspectRatio: 1,
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
  },

  // Right tile (Cost)
  tileRight: {
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    aspectRatio: 1,
  },

  // Tile content styling
  priceTileLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  priceTileValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
};
```

### Media Tiles (Image, QR, Stock)
```typescript
const mediaTileStyles = {
  // Image tile
  fullImageTileContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },

  productImageTile: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },

  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // QR Code tile
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },

  qrCodeImage: {
    width: 40,
    height: 40,
    backgroundColor: '#000',
    borderRadius: 4,
    position: 'relative',
    marginBottom: 8,
  },

  qrPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  qrDot: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#fff',
  },

  qrCodeValue: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },

  // Stock tile
  stockRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },

  stockTileValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },

  stockTileUnit: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
};
```

### Status Tiles (POS, Website)
```typescript
const statusTileStyles = {
  statusTileLeft: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    aspectRatio: 2,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
  },

  statusTileRight: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    aspectRatio: 2,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },

  statusTileLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    alignSelf: 'center',
  },

  statusTileValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    alignSelf: 'center',
  },
};
```

### Organization Tiles (Single Row Layout)
```typescript
const organizationTileStyles = {
  orgTilesContainer: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#ffffff',
    marginBottom: 16,
    marginHorizontal: -16,
    marginTop: 0,
  },

  orgTileSingle: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    aspectRatio: 4,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },

  // Special styling for main action tiles
  optionsModifiersTile: {
    backgroundColor: '#f0f8ff',
  },

  orgTileLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    alignSelf: 'center',
  },

  orgTileValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    alignSelf: 'center',
    textTransform: 'capitalize',
  },
};
```

### Identifier Tiles (Options System)
```typescript
const identifierTileStyles = {
  identifierTilesContainer: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#ffffff',
    marginBottom: 16,
    marginTop: 0,
    marginHorizontal: -16,
  },

  identifierTilesRow: {
    flexDirection: 'row',
  },

  identifierTile: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
  },

  identifierTileRight: {
    borderRightWidth: 0,
  },

  selectedIdentifierTile: {
    backgroundColor: '#e3f2fd',
  },

  identifierTileLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },

  // Identifier thumbnails
  identifierThumbnail: {
    width: 50,
    height: 50,
  },

  textThumbnail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
};
```

## Modal Design Patterns

### Full Screen Modal Structure
```typescript
const modalStyles = {
  fullScreenModal: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 50,
    backgroundColor: 'white',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 1,
  },

  headerSpacer: {
    width: 32,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },

  saveButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
};
```

### Bottom Drawer Pattern
```typescript
const bottomDrawerStyles = {
  bottomDrawerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  bottomDrawerBackdrop: {
    flex: 1,
  },

  bottomDrawerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '90%',
  },

  bottomDrawerHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  bottomDrawerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  bottomDrawerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  bottomDrawerOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
};
```

### Color Picker Modal
```typescript
const colorPickerStyles = {
  colorPickerContainer: {
    padding: 16,
  },

  colorPreviewLarge: {
    alignItems: 'center',
    marginBottom: 24,
  },

  colorPreviewCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  colorValueText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },

  colorInputSection: {
    marginBottom: 24,
  },

  colorHexInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },

  colorPresetsSection: {
    marginBottom: 24,
  },

  colorPresetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  colorPresetItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
};
```

## List & Grid Components

### Product List Item
```typescript
const productListStyles = {
  simpleProductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },

  productImageContainer: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },

  productListImage: {
    width: '100%',
    height: '100%',
  },

  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },

  simpleProductTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
};
```

### Category List (Hierarchical)
```typescript
const categoryListStyles = {
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },

  categoryContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  categoryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },

  categoryNotes: {
    fontSize: 14,
    color: '#666',
  },

  // Hierarchical structure
  categoryGroup: {
    marginBottom: 0,
  },

  parentCategoryRow: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
  },

  parentCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  childrenContainer: {
    paddingLeft: 16,
  },

  childCategoryRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },

  childCategoryTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },

  grandchildrenContainer: {
    paddingLeft: 32,
  },

  grandchildCategoryRow: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },

  grandchildCategoryTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
  },
};
```

## Form Elements

### Input Styles
```typescript
const formStyles = {
  formField: {
    marginBottom: 16,
  },

  // Notion-style title input
  notionTitleInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    padding: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    textAlignVertical: 'top',
    fontFamily: 'System',
  },

  // Standard input
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },

  // Notes input (Google Keep style)
  notesInput: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    padding: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    minHeight: 120,
    textAlignVertical: 'top',
    fontFamily: 'System',
  },

  // Excerpt input
  excerptInput: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    padding: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    minHeight: 60,
    textAlignVertical: 'top',
    fontFamily: 'System',
  },

  // Custom title input in drawers
  customTitleInput: {
    fontSize: 16,
    color: '#333',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
};
```

### Search Components
```typescript
const searchStyles = {
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 12,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },

  categorySearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
};
```

## Status & Feedback

### Loading States
```typescript
const loadingStyles = {
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },

  paginationLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },

  paginationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
};
```

### Empty States
```typescript
const emptyStateStyles = {
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },

  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
  },

  refreshButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },

  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
};
```

### Selection States
```typescript
const selectionStyles = {
  selectedProductItem: {
    backgroundColor: '#f0f7ff',
    borderLeftWidth: 3,
    borderLeftColor: '#0066CC',
  },

  selectedTile: {
    borderColor: '#0066CC',
    backgroundColor: '#F3F9FF',
  },

  disabledTile: {
    opacity: 0.6,
  },

  selectionInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f7ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  selectionText: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '500',
  },
};
```

## Implementation Guidelines

### Tile Layout Patterns

#### 1. Core Product Tiles (3x3 Grid)
```
┌─────────┬─────────┬─────────┐
│  Price  │ Sale $  │  Cost   │
│ $29.99  │ $24.99  │ $15.00  │
├─────────┼─────────┼─────────┤
│  Image  │   QR    │  Stock  │
│   📷    │  ▣▣▣▣   │ 100 pcs │
├─────────┴─────────┼─────────┤
│      POS: Active  │Website: │
│                   │ Active  │
└───────────────────┴─────────┘
```

#### 2. Organization Tiles (Single Column)
```
┌─────────────────────────────┐
│ Type              Physical │
├─────────────────────────────┤
│ Featured               Yes │
├─────────────────────────────┤
│ Category         Electronics│
├─────────────────────────────┤
│ Collection        Featured │
└─────────────────────────────┘
```

#### 3. Identifier Tiles (Options)
```
┌─────────┬─────────┬─────────┐
│  Color  │  Size   │Material │
│   🔴    │   XL    │ Cotton  │
└─────────┴─────────┴─────────┘
```

### Color Usage Guidelines

- **Primary Blue (#0066CC)**: Active states, selected items, primary actions
- **Light Blue (#f0f7ff)**: Selected backgrounds, active tab backgrounds
- **Light Blue (#f0f8ff)**: Special action tiles (Options, Metafields)
- **Gray Borders (#e9ecef)**: Tile borders, dividers
- **Light Gray (#f8f9fa)**: Input backgrounds, placeholder areas
- **Text Colors**: #333 (primary), #666 (secondary), #999 (tertiary)

### Spacing Guidelines

- **Tile Padding**: 16px internal padding
- **Container Margins**: -16px horizontal to extend to screen edges
- **Border Width**: 1px for all borders
- **Border Radius**: 4px for inputs, 8px for images, 12px for modals

### Typography Guidelines

- **Tile Labels**: 14px, medium weight (500), uppercase with letter spacing
- **Tile Values**: 18px for prices, 24px for stock, 14px for text
- **Modal Titles**: 20px, semibold (600)
- **Input Text**: 16px for standard inputs, 24px for title inputs

### Interactive Guidelines

- **Touch Targets**: Minimum 44px height for interactive elements
- **Active States**: 3px left border for tabs, background color change for tiles
- **Disabled States**: 60% opacity
- **Loading States**: ActivityIndicator with brand blue color (#0066CC)

### Accessibility Guidelines

- **Color Contrast**: Ensure 4.5:1 ratio for text on backgrounds
- **Touch Targets**: Minimum 44x44px for interactive elements
- **Focus States**: Clear visual indication for keyboard navigation
- **Screen Reader**: Meaningful labels and descriptions for all interactive elements

This design system ensures consistency across the entire products interface and provides clear guidelines for implementing similar patterns in other parts of the application.
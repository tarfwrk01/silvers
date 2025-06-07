# Design System Documentation

This document outlines the complete design system used in the tar1 project, including colors, typography, spacing, icons, emojis, and component patterns. Use this as a reference for maintaining design consistency across the application.

## Table of Contents
1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Icons & Visual Elements](#icons--visual-elements)
5. [Component Patterns](#component-patterns)
6. [Status Bar & Navigation](#status-bar--navigation)
7. [Interactive Elements](#interactive-elements)
8. [Design Tokens](#design-tokens)

## Color Palette

### Primary Colors
```typescript
const colors = {
  // Primary Brand Color
  primary: '#0066CC',           // Main brand blue
  primaryLight: '#F3F9FF',      // Light blue background
  primaryHover: '#99c2e8',      // Disabled/hover state

  // Neutral Colors
  white: '#ffffff',             // Pure white
  black: '#000000',             // Pure black

  // Text Colors
  textPrimary: '#333',          // Main text color
  textSecondary: '#666',        // Secondary text
  textTertiary: '#999',         // Inactive/placeholder text

  // Background Colors
  background: '#fff',           // Main background
  backgroundSecondary: '#f8f9fa', // Secondary background
  backgroundTertiary: '#f0f0f0', // Tertiary background

  // Border Colors
  border: '#E0E0E0',           // Default border
  borderLight: '#f0f0f0',      // Light border
  borderActive: '#0066CC',     // Active/selected border

  // Status Colors
  success: '#4CAF50',          // Success green
  error: '#F44336',            // Error red
  warning: '#FFA500',          // Warning orange
  info: '#0066CC',             // Info blue
};
```

### Color Presets (Used in Product Options)
```typescript
const colorPresets = [
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FFA500', // Orange
  '#800080', // Purple
  '#FFC0CB', // Pink
  '#A52A2A', // Brown
  '#808080', // Gray
  '#000000'  // Black
];
```

## Typography

### Font Sizes
```typescript
const typography = {
  // Headers
  h1: 28,          // Main titles
  h2: 24,          // Section titles
  h3: 20,          // Subsection titles
  h4: 18,          // Card titles

  // Body Text
  body: 16,        // Default body text
  bodySmall: 14,   // Small body text
  caption: 12,     // Captions and labels

  // Special
  emoji: 64,       // Large emojis in onboarding
  emojiSmall: 18,  // Small emojis in navigation
};
```

### Font Weights
```typescript
const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: 'bold',
};
```

### Text Styles
```typescript
const textStyles = {
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },

  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },

  body: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },

  caption: {
    fontSize: 14,
    color: '#666',
  },

  error: {
    fontSize: 14,
    color: '#F44336',
  },
};
```

## Spacing & Layout

### Spacing Scale
```typescript
const spacing = {
  xs: 4,           // Extra small spacing
  sm: 8,           // Small spacing
  md: 12,          // Medium spacing
  lg: 16,          // Large spacing
  xl: 20,          // Extra large spacing
  xxl: 24,         // Double extra large
  xxxl: 32,        // Triple extra large
  huge: 40,        // Huge spacing
  massive: 50,     // Massive spacing
};
```

### Layout Patterns
```typescript
const layout = {
  // Container padding
  containerPadding: 16,
  contentPadding: 20,
  modalPadding: 24,

  // Component spacing
  componentMargin: 4,      // Between list items
  sectionMargin: 16,       // Between sections
  headerMargin: 12,        // Below headers

  // Border radius
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    circle: 25,            // For circular elements
  },

  // Heights
  heights: {
    topBar: 56,
    tabBar: 50,
    button: 48,
    input: 44,
    tile: 'auto',
  },
};
```

## Icons & Visual Elements

### Icon Libraries Used
```typescript
// Primary icon libraries
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
```

### Common Icons
```typescript
const iconMap = {
  // Navigation
  back: 'arrow-back',              // Ionicons
  close: 'chevron-down',           // Ionicons
  menu: 'menu',                    // Ionicons

  // Actions
  add: 'add',                      // Ionicons
  edit: 'create-outline',          // Ionicons
  delete: 'trash-outline',         // Ionicons
  save: 'checkmark',               // Ionicons

  // Status
  check: 'checkmark-circle',       // Ionicons
  error: 'close-circle',           // Ionicons
  warning: 'warning',              // Ionicons
  info: 'information-circle',      // Ionicons

  // Content
  image: 'image-outline',          // Ionicons
  camera: 'camera-outline',        // Ionicons
  search: 'search',                // Ionicons
  filter: 'filter',                // Ionicons

  // Tab Bar Icons
  workspace: 'workspaces-outline', // MaterialIcons
  tasks: 'play-outline',           // Ionicons
  chat: 'square',                  // Feather
  people: 'at-circle-outline',     // Ionicons
};
```

### Icon Sizes
```typescript
const iconSizes = {
  small: 16,       // Small icons in text
  medium: 20,      // Default icon size
  large: 24,       // Navigation icons
  xlarge: 28,      // Modal close buttons
  huge: 32,        // Feature icons
};
```

### Emoji Usage
```typescript
const emojiSystem = {
  // Onboarding Steps
  initializing: '⚡',
  database: '🗄️',
  access: '🔑',
  tables: '📋',
  complete: '✅',

  // Status States
  loading: '🚀',
  success: '⭐',
  error: '💫',

  // Navigation (Bottom Icons)
  agents: '🕹️',
  profile: '👋',
  settings: '🎮',

  // General Usage
  celebration: '🎉',
  rocket: '🚀',
  star: '⭐',
  warning: '⚠️',
  checkmark: '✓',
  cross: '✗',
};
```

## Component Patterns

### Button Styles
```typescript
const buttonStyles = {
  primary: {
    backgroundColor: '#0066CC',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
  },

  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  disabled: {
    backgroundColor: '#99c2e8',
  },

  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0066CC',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
  },

  secondaryText: {
    color: '#0066CC',
    fontSize: 16,
    fontWeight: '600',
  },

  small: {
    backgroundColor: '#0066CC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },

  smallText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
};
```

### Card/Tile Styles
```typescript
const cardStyles = {
  tile: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 16,
    marginVertical: 4,
  },

  selectedTile: {
    borderColor: '#0066CC',
    backgroundColor: '#F3F9FF',
  },

  disabledTile: {
    opacity: 0.6,
  },

  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  selectedProductItem: {
    backgroundColor: '#f0f7ff',
    borderLeftWidth: 3,
    borderLeftColor: '#0066CC',
  },
};
```

### Input Styles
```typescript
const inputStyles = {
  default: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },

  bordered: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },

  colorHex: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },

  label: {
    fontSize: 16,
    marginBottom: 12,
    color: '#000',
  },

  error: {
    color: 'red',
    marginBottom: 16,
    fontSize: 14,
  },

  placeholder: {
    color: '#999',
  },
};
```

### Modal Styles
```typescript
const modalStyles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  content: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    maxHeight: '90%',
    overflow: 'hidden',
  },

  fullScreen: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 50,
    backgroundColor: 'white',
  },

  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
};
```

## Status Bar & Navigation

### Status Bar Configuration
```typescript
const statusBarConfig = {
  style: 'dark',                    // Dark content on light background
  backgroundColor: '#000000',       // Black background
  translucent: true,               // Allow content behind status bar

  // Android specific
  android: {
    backgroundColor: '#00000000',   // Transparent background
    barStyle: 'dark-content',
  },
};
```

### Navigation Bar Configuration
```typescript
const navigationBarConfig = {
  // Android navigation bar
  backgroundColor: '#000000',       // Black background
  barStyle: 'light-content',       // Light content on dark background
  visible: true,

  // Tab bar styling
  tabBar: {
    activeTintColor: '#000000',     // Active tab color
    inactiveTintColor: '#999',      // Inactive tab color
    showLabel: false,               // Hide tab labels
    height: 50,                     // Base height
    paddingBottom: 5,               // iOS padding
    paddingTop: 5,                  // Top padding
  },
};
```

### Top Bar Styling
```typescript
const topBarStyles = {
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 1,
  },

  menuCard: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  menuCardText: {
    fontSize: 14,
    color: '#333',
  },

  backButton: {
    padding: 4,
    width: 32,
  },

  rightPlaceholder: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
```

## Interactive Elements

### Touch Feedback
```typescript
const touchFeedback = {
  // Disable press effects for consistent UI
  activeOpacity: 1,                // Prevent opacity change on press

  // Button press states
  buttonPress: {
    activeOpacity: 0.8,           // Slight opacity change for buttons
  },

  // List item press states
  listItemPress: {
    activeOpacity: 0.95,          // Very subtle feedback
  },
};
```

### Animation Settings
```typescript
const animations = {
  // Disable animations for instant transitions
  screenTransition: 'none',

  // Modal animations
  modalAnimation: 'fade',

  // Loading animations
  fadeIn: {
    duration: 300,
    useNativeDriver: true,
  },

  // Step progress animations
  stepProgress: {
    duration: 200,
    useNativeDriver: false,
  },
};
```

### Shadow Styles
```typescript
const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,                 // Android elevation
  },

  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  colorPreview: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
};
```

## Design Tokens

### Complete Design Token System
```typescript
export const designTokens = {
  colors: {
    primary: '#0066CC',
    primaryLight: '#F3F9FF',
    primaryHover: '#99c2e8',
    white: '#ffffff',
    black: '#000000',
    textPrimary: '#333',
    textSecondary: '#666',
    textTertiary: '#999',
    background: '#fff',
    backgroundSecondary: '#f8f9fa',
    backgroundTertiary: '#f0f0f0',
    border: '#E0E0E0',
    borderLight: '#f0f0f0',
    borderActive: '#0066CC',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFA500',
    info: '#0066CC',
  },

  typography: {
    sizes: {
      h1: 28,
      h2: 24,
      h3: 20,
      h4: 18,
      body: 16,
      bodySmall: 14,
      caption: 12,
      emoji: 64,
      emojiSmall: 18,
    },
    weights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: 'bold',
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
    massive: 50,
  },

  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    circle: 25,
  },

  heights: {
    topBar: 56,
    tabBar: 50,
    button: 48,
    input: 44,
  },

  iconSizes: {
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 28,
    huge: 32,
  },
};
```

## Usage Guidelines

### Color Usage
- **Primary Blue (#0066CC)**: Use for primary actions, active states, and brand elements
- **Text Colors**: Use #333 for primary text, #666 for secondary text, #999 for inactive text
- **Background Colors**: Use #fff for main backgrounds, #f8f9fa for secondary areas
- **Status Colors**: Use semantic colors (green for success, red for error, etc.)

### Typography Guidelines
- **Headers**: Use bold weights for titles and section headers
- **Body Text**: Use 16px as the default body text size
- **Labels**: Use medium weight (500) for form labels and important text
- **Captions**: Use 14px for secondary information and captions

### Spacing Guidelines
- **Container Padding**: Use 16px for main container padding
- **Component Spacing**: Use 4px between list items, 16px between sections
- **Modal Padding**: Use 24px for modal content padding

### Icon Guidelines
- **Size Consistency**: Use 24px for navigation icons, 20px for content icons
- **Color Consistency**: Use #666 for inactive icons, #0066CC for active icons
- **Library Preference**: Prefer Ionicons for most use cases, MaterialIcons for specific needs

### Interactive Guidelines
- **Touch Feedback**: Use activeOpacity: 1 to disable press effects for consistent UI
- **Button States**: Provide clear visual feedback for disabled states
- **Loading States**: Use ActivityIndicator with appropriate colors

### Emoji Guidelines
- **Onboarding**: Use large emojis (64px) for onboarding steps and status
- **Navigation**: Use small emojis (18px) for navigation elements
- **Consistency**: Stick to the defined emoji system for consistent meaning

This design system ensures consistency across the entire application and provides clear guidelines for future development and maintenance.
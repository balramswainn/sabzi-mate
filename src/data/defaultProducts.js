/**
 * Default product catalog, categories, and initial data for SabziMate.
 */

export const CATEGORIES = [
  'All',
  'Vegetables',
  'Fruits',
  'Dairy',
  'Groceries',
  'Other',
]

export const STARTER_PRODUCTS = [
  { id: 'prod-1', name: 'Tomatoes', emoji: '🍅', category: 'Vegetables', rate: 40, unit: 'kg', defaultQuantity: 1000 },
  { id: 'prod-2', name: 'Potatoes (Aloo)', emoji: '🥔', category: 'Vegetables', rate: 30, unit: 'kg', defaultQuantity: 1000 },
  { id: 'prod-3', name: 'Onions (Pyaaz)', emoji: '🧅', category: 'Vegetables', rate: 35, unit: 'kg', defaultQuantity: 1000 },
  { id: 'prod-4', name: 'Capsicum (Shimla Mirch)', emoji: '🫑', category: 'Vegetables', rate: 60, unit: 'kg', defaultQuantity: 500 },
  { id: 'prod-5', name: 'Carrots (Gajar)', emoji: '🥕', category: 'Vegetables', rate: 50, unit: 'kg', defaultQuantity: 500 },
  { id: 'prod-6', name: 'Spinach (Palak)', emoji: '🥬', category: 'Vegetables', rate: 20, unit: 'bundle', defaultQuantity: 2 },
  { id: 'prod-7', name: 'Coriander (Dhaniya)', emoji: '🌿', category: 'Vegetables', rate: 15, unit: 'bundle', defaultQuantity: 1 },
  { id: 'prod-8', name: 'Green Chillies (Mirchi)', emoji: '🌶️', category: 'Vegetables', rate: 80, unit: 'kg', defaultQuantity: 100 },
  { id: 'prod-9', name: 'Ginger (Adrak)', emoji: '🫚', category: 'Vegetables', rate: 120, unit: 'kg', defaultQuantity: 250 },
  { id: 'prod-10', name: 'Garlic (Lahsun)', emoji: '🧄', category: 'Vegetables', rate: 180, unit: 'kg', defaultQuantity: 250 },
  { id: 'prod-11', name: 'Bananas (Kela)', emoji: '🍌', category: 'Fruits', rate: 60, unit: 'dozen', defaultQuantity: 12 },
  { id: 'prod-12', name: 'Apples (Seb)', emoji: '🍎', category: 'Fruits', rate: 160, unit: 'kg', defaultQuantity: 1000 },
  { id: 'prod-13', name: 'Oranges (Santra)', emoji: '🍊', category: 'Fruits', rate: 80, unit: 'kg', defaultQuantity: 1000 },
  { id: 'prod-14', name: 'Lemons (Nimbu)', emoji: '🍋', category: 'Fruits', rate: 10, unit: 'piece', defaultQuantity: 4 },
  { id: 'prod-15', name: 'Milk (Full Cream)', emoji: '🥛', category: 'Dairy', rate: 68, unit: 'litre', defaultQuantity: 1000 },
  { id: 'prod-16', name: 'Paneer (Fresh)', emoji: '🧈', category: 'Dairy', rate: 380, unit: 'kg', defaultQuantity: 250 },
  { id: 'prod-17', name: 'Curd / Dahi', emoji: '🥣', category: 'Dairy', rate: 35, unit: 'packet', defaultQuantity: 1 },
  { id: 'prod-18', name: 'Eggs (Tray of 30)', emoji: '🥚', category: 'Groceries', rate: 190, unit: 'tray', defaultQuantity: 1 },
  { id: 'prod-19', name: 'Bread (Brown/White)', emoji: '🍞', category: 'Groceries', rate: 45, unit: 'packet', defaultQuantity: 1 },
]

export const INITIAL_SHOPPING_ITEMS = [
  {
    id: 1,
    name: 'Tomatoes',
    category: 'Vegetables',
    emoji: '🍅',
    rate: 40,
    unit: 'kg',
    quantity: 789,
    purchased: false,
    notes: 'Fresh salad tomatoes',
  },
  {
    id: 2,
    name: 'Capsicum',
    category: 'Vegetables',
    emoji: '🫑',
    rate: 60,
    unit: 'kg',
    quantity: 1270,
    purchased: true,
    notes: 'For mixed stir fry',
  },
  {
    id: 3,
    name: 'Bananas',
    category: 'Fruits',
    emoji: '🍌',
    rate: 60,
    unit: 'dozen',
    quantity: 7,
    purchased: true,
    notes: '7 pieces (just over half a dozen)',
  },
  {
    id: 4,
    name: 'Milk',
    category: 'Dairy',
    emoji: '🥛',
    rate: 80,
    unit: 'litre',
    quantity: 750,
    purchased: false,
    notes: 'Morning tea and coffee',
  },
]

export const DEFAULT_BUDGET = 500

export const BUDGET_PRESETS = [300, 500, 1000, 1500, 2000, 3000]


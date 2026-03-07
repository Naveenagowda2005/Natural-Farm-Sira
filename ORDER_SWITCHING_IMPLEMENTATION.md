# Order Switching Implementation for Categories, Subcategories, and Products

## Overview
Added drag-and-drop order switching functionality for Categories, Subcategories, and Products in the admin dashboard, similar to the existing Banners feature.

## Database Changes

### Migration File
Created: `backend/database/add-display-order.sql`

This migration adds:
- `display_order` column to categories, subcategories, and products tables
- Indexes for better performance
- Initializes display_order values based on existing created_at timestamps

**IMPORTANT**: Run this migration in Supabase SQL Editor before using the feature.

## Backend Changes

### 1. Entity Updates
Updated interfaces to include `display_order: number`:
- `backend/src/categories/category.entity.ts`
- `backend/src/subcategories/subcategory.entity.ts`
- `backend/src/products/product.entity.ts`

### 2. DTOs Created
New reorder DTOs for validation:
- `backend/src/categories/dto/reorder-categories.dto.ts`
- `backend/src/subcategories/dto/reorder-subcategories.dto.ts`
- `backend/src/products/dto/reorder-products.dto.ts`

### 3. Service Updates
Updated services to:
- Sort by `display_order` instead of `created_at` in `findAll()`
- Set next `display_order` value in `create()` methods
- Add `reorder()` method to update display orders

### 4. Controller Updates
Added `PUT /reorder` endpoints to:
- `backend/src/categories/categories.controller.ts`
- `backend/src/subcategories/subcategories.controller.ts`
- `backend/src/products/products.controller.ts`

## Frontend Changes

### 1. API Client Updates
Updated `src/lib/api.ts`:
- Added `display_order` to Category, SubCategory, and Product interfaces
- Added `reorder()` methods to categoriesApi, subCategoriesApi, and productsApi

### 2. Admin Pages Updates
Updated admin pages with reorder UI:


#### Categories (`src/pages/admin/Categories.tsx`)
- Added ChevronUp/ChevronDown icons
- Added reorder mutation
- Added handleMoveUp/handleMoveDown functions
- Updated UI with up/down arrow buttons for each category card

#### Subcategories (`src/pages/admin/SubCategories.tsx`)
- Added ChevronUp/ChevronDown icons
- Added reorder mutation
- Added handleMoveUp/handleMoveDown functions (handles reordering within category groups)
- Updated UI with up/down arrow buttons for each subcategory card

#### Products (`src/pages/admin/Products.tsx`)
- Added ChevronUp/ChevronDown icons
- Added reorder mutation
- Added handleMoveUp/handleMoveDown functions
- Updated UI with up/down arrow buttons:
  - Overlaid on product image (top-left) if image exists
  - Above product title if no image

## How It Works

1. **Display Order**: Each item has a `display_order` field (0, 1, 2, ...)
2. **Sorting**: Items are fetched sorted by `display_order` ascending
3. **Reordering**: 
   - Click up/down arrows to swap positions
   - Frontend swaps items in array and recalculates display_order
   - Sends all updated orders to backend in single request
   - Backend updates each item's display_order
   - Returns updated list

## Testing Steps

1. **Run Migration**: Execute `backend/database/add-display-order.sql` in Supabase SQL Editor
2. **Test Backend**: Start backend server (`npm run start:dev`)
3. **Test Frontend**: Start frontend (`npm run dev`)
4. **Test Reordering**:
   - Go to Categories admin page
   - Click up/down arrows to reorder
   - Verify order persists after page refresh
   - Repeat for Subcategories and Products

## Notes

- Subcategories are reordered within their parent category
- Products are reordered globally (not per subcategory)
- Reorder buttons are disabled at boundaries (first item can't move up, last can't move down)
- Changes are saved automatically when arrows are clicked
- Toast notifications confirm successful reordering

## Status
✅ Implementation complete - NOT COMMITTED (awaiting user permission)

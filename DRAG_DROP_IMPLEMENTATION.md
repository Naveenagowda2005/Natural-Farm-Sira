# Drag-and-Drop Reordering Implementation

## Overview
Implemented drag-and-drop functionality for Gallery and Videos admin pages, matching the existing Banners implementation. SubCategories retain up/down arrow buttons as requested.

## Changes Made

### Database Changes
**File:** `backend/database/add-display-order-gallery-videos.sql`
- Added `display_order` column to `gallery_images` table
- Added `display_order` column to `videos` table
- Created indexes for better query performance
- Migrated existing records with sequential display_order values

### Backend Changes

#### Gallery Module
1. **Entity** (`backend/src/gallery/gallery-image.entity.ts`)
   - Added `display_order: number` field

2. **DTO** (`backend/src/gallery/dto/reorder-gallery.dto.ts`)
   - Created new DTO for reordering gallery images

3. **Service** (`backend/src/gallery/gallery.service.ts`)
   - Updated `findAll()` to order by `display_order` instead of `created_at`
   - Added `reorder()` method to update display order

4. **Controller** (`backend/src/gallery/gallery.controller.ts`)
   - Added `PUT /api/gallery/reorder` endpoint

#### Videos Module
1. **Entity** (`backend/src/videos/video.entity.ts`)
   - Added `display_order: number` field

2. **DTO** (`backend/src/videos/dto/reorder-videos.dto.ts`)
   - Created new DTO for reordering videos

3. **Service** (`backend/src/videos/videos.service.ts`)
   - Updated `findAll()` to order by `display_order` instead of `created_at`
   - Added `reorder()` method to update display order

4. **Controller** (`backend/src/videos/videos.controller.ts`)
   - Added `PUT /api/videos/reorder` endpoint

### Frontend Changes

#### API Client (`src/lib/api.ts`)
1. **GalleryImage Interface**
   - Added `display_order: number` field

2. **Video Interface**
   - Added `display_order: number` field

3. **galleryApi**
   - Added `reorder()` method

4. **videosApi**
   - Added `reorder()` method

#### Gallery Admin Page (`src/pages/admin/Gallery.tsx`)
- Added `@dnd-kit` imports for drag-and-drop functionality
- Created `SortableImage` component with drag handle
- Added sensors for pointer and keyboard interactions
- Implemented `reorderMutation` for API calls
- Added `handleDragEnd` to handle drag events
- Wrapped gallery grid with `DndContext` and `SortableContext`
- Updated page description to mention drag-to-reorder
- Drag handle appears on hover in top-right corner

#### Videos Admin Page (`src/pages/admin/Videos.tsx`)
- Added `@dnd-kit` imports for drag-and-drop functionality
- Created `SortableVideo` component with drag handle
- Added sensors for pointer and keyboard interactions
- Implemented `reorderMutation` for API calls
- Added `handleDragEnd` to handle drag events
- Wrapped videos grid with `DndContext` and `SortableContext`
- Updated page description to mention drag-to-reorder
- Drag handle appears in top-right corner of each video card

## Features

### Gallery
- Drag any image to reorder
- Checkbox selection for bulk delete (unchanged)
- Drag handle appears on hover
- Grid layout with responsive columns
- Order saved automatically on drop

### Videos
- Drag any video card to reorder
- Edit and delete buttons (unchanged)
- Drag handle visible in top-right corner
- Grid layout with responsive columns
- Order saved automatically on drop
- Supports both URL and uploaded video types

### SubCategories
- Kept up/down arrow buttons as requested
- No drag-and-drop functionality

## Usage

### Running the Migration
```bash
# Connect to your database and run:
psql -U your_user -d your_database -f backend/database/add-display-order-gallery-videos.sql
```

Or use your database management tool to execute the SQL file.

### Testing
1. Navigate to Admin > Gallery
2. Upload multiple images
3. Drag images to reorder them
4. Verify order is saved (refresh page to confirm)

5. Navigate to Admin > Videos
6. Add multiple videos
7. Drag video cards to reorder them
8. Verify order is saved (refresh page to confirm)

## Technical Details

### Drag-and-Drop Library
Using `@dnd-kit` library which provides:
- Touch and mouse support
- Keyboard navigation
- Accessibility features
- Smooth animations
- Collision detection

### Sorting Strategy
- Gallery: `rectSortingStrategy` (for grid layouts)
- Videos: `rectSortingStrategy` (for grid layouts)
- Banners: `verticalListSortingStrategy` (for vertical lists)

### Display Order
- New items get `display_order = 0` by default
- Reordering updates all affected items
- Frontend uses array index as new display_order
- Backend updates database with new values

## Status
✅ Database migration created
✅ Backend endpoints implemented
✅ Frontend drag-and-drop added to Gallery
✅ Frontend drag-and-drop added to Videos
✅ SubCategories kept with up/down arrows
✅ API client updated

## Next Steps
1. Run the database migration on your production database
2. Test the drag-and-drop functionality
3. Verify order persistence after page refresh

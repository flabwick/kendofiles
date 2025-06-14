
# File Manager Application Analysis & PostgreSQL Integration Requirements

## Technical Stack Overview

- **Frontend Framework**: React.js 18.2.0
- **UI Components**: Kendo UI React components (v10.0.0)
- **Build Tool**: Create React App
- **Language**: TypeScript 4.0.0
- **Package Manager**: npm

## Current Application Structure

### Core Components
1. **App.tsx** - Main application component handling state and coordination
2. **FolderTree.tsx** - Left side folder navigation tree
3. **ListView.tsx** - Center content area with file listings
4. **FileInformation.tsx** - Right side file details panel
5. **FileManagerToolbar.tsx** - Top toolbar with actions (new folder, upload, search, etc.)
6. **Dialog.tsx** - Contains dialogs for rename and delete operations
7. **ContextMenu.tsx** - Right-click context menu

### Data Structure
The application currently uses a static in-memory data structure defined in data.ts. Files and folders are represented as nested objects with the following properties:
- `path`: String path to the file/folder (e.g., "Home/Documents/file.txt")
- `size`: File size in bytes
- `dateCreated`: Creation timestamp
- `dateModified`: Last modified timestamp
- `items`: Array of child items (for folders)

### Current Features
- Folder navigation via tree view
- Multiple view options (grid/list)
- File/folder operations (create, rename, delete)
- File upload (UI only, no actual storage)
- Detail panel for file information
- Sorting and searching

## PostgreSQL Database Integration Requirements
I'll update the PostgreSQL integration requirements with a focus on creating new optimized sample data instead of migrating the existing data structure. Let me revise the approach:

# File Manager Application Analysis & PostgreSQL Integration Requirements

## Technical Stack Overview

- **Frontend Framework**: React.js 18.2.0
- **UI Components**: Kendo UI React components (v10.0.0)
- **Build Tool**: Create React App
- **Language**: TypeScript 4.0.0
- **Package Manager**: npm

## Database Schema Optimization

### 1. Folders Table
```
folders
- id (PK, SERIAL)
- name (VARCHAR, NOT NULL)
- parent_id (FK to folders.id, nullable for root folders)
- path (VARCHAR, NOT NULL, UNIQUE) - Computed/denormalized field for performance
- is_root (BOOLEAN, default false)
- date_created (TIMESTAMP WITH TIME ZONE)
- date_modified (TIMESTAMP WITH TIME ZONE)
- size (BIGINT, calculated from child content)
```

### 2. Files Table
```
files
- id (PK, SERIAL)
- name (VARCHAR, NOT NULL)
- folder_id (FK to folders.id, NOT NULL)
- extension (VARCHAR) - Extracted from name for easier querying
- mime_type (VARCHAR)
- size (BIGINT)
- content (BYTEA) - For small files only
- content_path (VARCHAR) - For large files stored on filesystem
- date_created (TIMESTAMP WITH TIME ZONE)
- date_modified (TIMESTAMP WITH TIME ZONE)
```

## Sample Data Structure

The following sample data structure should replace the existing data in data.ts and is optimized for a folder-based system:

### Sample Folders
```
[
  { id: 1, name: "Home", parent_id: null, path: "Home", is_root: true },
  { id: 2, name: "Documents", parent_id: 1, path: "Home/Documents" },
  { id: 3, name: "Images", parent_id: 1, path: "Home/Images" },
  { id: 4, name: "Work", parent_id: 2, path: "Home/Documents/Work" },
  { id: 5, name: "Personal", parent_id: 2, path: "Home/Documents/Personal" },
  { id: 6, name: "Projects", parent_id: 4, path: "Home/Documents/Work/Projects" },
  { id: 7, name: "Vacations", parent_id: 3, path: "Home/Images/Vacations" },
  { id: 8, name: "Italy2024", parent_id: 7, path: "Home/Images/Vacations/Italy2024" }
]
```

### Sample Files
```
[
  { id: 1, name: "resume.pdf", folder_id: 4, extension: "pdf", size: 2500000 },
  { id: 2, name: "meeting_notes.txt", folder_id: 4, extension: "txt", size: 15000 },
  { id: 3, name: "project_plan.md", folder_id: 6, extension: "md", size: 50000 },
  { id: 4, name: "data.json", folder_id: 6, extension: "json", size: 120000 },
  { id: 5, name: "expenses.csv", folder_id: 5, extension: "csv", size: 75000 },
  { id: 6, name: "novel.epub", folder_id: 5, extension: "epub", size: 5000000 },
  { id: 7, name: "beach.jpg", folder_id: 8, extension: "jpg", size: 3500000 },
  { id: 8, name: "mountains.jpg", folder_id: 8, extension: "jpg", size: 4200000 }
]
```

## API Endpoints

### Folder Operations
1. **GET /api/folders** - Get folders (with query params: parent_id, path, etc.)
2. **GET /api/folders/:id** - Get folder by ID
3. **GET /api/folders/:id/contents** - Get folder contents (files and subfolders)
4. **GET /api/folders/:id/tree** - Get folder with recursive tree of subfolders
5. **POST /api/folders** - Create new folder
6. **PUT /api/folders/:id** - Update folder
7. **DELETE /api/folders/:id** - Delete folder and optionally its contents

### File Operations
1. **GET /api/files** - Get files (with query params: folder_id, extension, etc.)
2. **GET /api/files/:id** - Get file metadata
3. **GET /api/files/:id/content** - Download file content
4. **POST /api/files** - Upload new file(s)
5. **PUT /api/files/:id** - Update file metadata
6. **PUT /api/files/:id/content** - Update file content
7. **DELETE /api/files/:id** - Delete file

### Management Operations
1. **POST /api/operations/copy** - Copy files/folders
2. **POST /api/operations/move** - Move files/folders
3. **GET /api/search** - Search for files/folders

## File Type Support

The PostgreSQL database should support specific handling for the following file types:

1. **Text-based files** (.txt, .md, .json):
   - Store directly in database for small files
   - Enable text search capabilities
   - Implement content preview functionality

2. **Document files** (.pdf, .epub):
   - Store reference to filesystem for large files
   - Extract metadata (if possible)
   - Generate thumbnails if applicable

3. **Data files** (.csv):
   - Potential parsing capabilities for preview
   - Support for basic data analysis functions

## Backend Integration Requirements

1. **Folder Structure Handling**:
   - Use recursive CTE queries in PostgreSQL for efficient tree traversal
   - Automatically update paths when parent relationships change
   - Implement proper constraints to prevent circular references

2. **File Content Management**:
   - Store small files (< 1MB) directly in database
   - Store larger files on filesystem with references
   - Implement efficient batch upload handling

3. **Performance Optimizations**:
   - Add GIN indexes for text search
   - Path-based indexes for fast hierarchy navigation
   - Materialized views for common queries

## Frontend Adaptations

1. **Data Service Layer**:
   - Create API client services to replace direct data access
   - Implement proper error handling and loading states
   - Add caching for frequently accessed data

2. **UI Enhancements**:
   - Add file type preview capabilities
   - Implement file upload progress indicators
   - Add drag-and-drop file management

3. **Feature Extensions**:
   - File version history
   - Folder size calculations
   - File type filtering

## Implementation Strategy

1. **Phase 1: Database Setup**
   - Create PostgreSQL schema
   - Set up initial sample data
   - Implement core API endpoints

2. **Phase 2: Backend Integration**
   - Develop Node.js/Express API layer
   - Implement file upload/download functionality
   - Create folders/files management endpoints

3. **Phase 3: Frontend Connection**
   - Replace in-memory data with API calls
   - Update UI for asynchronous operations
   - Implement error handling

4. **Phase 4: Feature Enhancement**
   - Add advanced search capabilities
   - Implement file previews
   - Create batch operations functionality

This implementation plan focuses on building a new optimized system from the ground up rather than migrating existing data, providing a more robust solution for folder-based file management with PostgreSQL.
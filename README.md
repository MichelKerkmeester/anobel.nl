# Custom Blog Filter System for Webflow

A lightweight, flexible blog filtering system designed specifically for Webflow CMS collections. Unlike Finsweet or Osmo solutions, this uses simple div-based tabs instead of radio inputs.

## ✨ Features

- **Search Functionality** - Real-time search through blog content
- **Category Filtering** - Using div-based tabs (no radio inputs!)
- **Sorting** - Sort by date, title, or any CMS field
- **Results Count** - Dynamic count that updates with filters
- **Load More** - Pagination with customizable items per page
- **Empty States** - Shows when no results match filters
- **URL State Management** - (Enhanced version) Shareable filter URLs
- **Smooth Animations** - (Enhanced version) Fade transitions

## 📁 Project Structure

```
├── src/js/
│   ├── Filter system.js          # Core filtering logic
│   ├── filter-system-enhanced.js # Enhanced version with animations
│   └── example-usage.js          # Usage examples
├── docs/
│   └── webflow-implementation.md # Detailed Webflow setup guide
├── demo/
│   └── simple-implementation.html # Working demo
└── README.md
```

## 🚀 Quick Start

### 1. Copy the Code to Slater

Copy the contents of `src/js/Filter system.js` to your Slater project.

### 2. Add HTML Structure in Webflow

```html
<!-- Collection List -->
<div data-filter="list" class="blog-grid">
  <!-- Your CMS items here -->
</div>

<!-- Collection Item (inside list) -->
<div data-filter="item" 
     data-category="{Category-Field}" 
     class="blog-item">
  <div data-date="{Publish-Date}" style="display:none;"></div>
  <h3 data-title>{Name}</h3>
  <!-- Your content -->
</div>
```

### 3. Add Filter Controls

```html
<!-- Search -->
<input type="text" data-filter="search" placeholder="Search...">

<!-- Category Tabs (No Radio Inputs!) -->
<div class="category-tabs">
  <div data-filter="category-tab" 
       data-category-value="all" 
       class="tab active">All</div>
  <div data-filter="category-tab" 
       data-category-value="news" 
       class="tab">News</div>
</div>

<!-- Sort -->
<select data-filter="sort">
  <option value="date-desc">Newest First</option>
  <option value="date-asc">Oldest First</option>
</select>

<!-- Results Count -->
<span data-filter="results-count">0 artikelen</span>

<!-- Load More -->
<button data-filter="load-more">Load More</button>
```

## 🎨 Key Differences from Finsweet/Osmo

1. **No Radio Inputs** - Uses simple div elements with click handlers
2. **Lighter Weight** - No external dependencies
3. **Customizable** - Easy to modify and extend
4. **Webflow Native** - Works seamlessly with CMS structure

## 📖 Detailed Documentation

See `docs/webflow-implementation.md` for:
- Complete Webflow setup instructions
- CMS structure requirements
- Advanced customization options
- Troubleshooting guide

## 💡 Advanced Features

### Enhanced Version
The enhanced version (`filter-system-enhanced.js`) includes:
- URL state management (shareable filter links)
- Smooth fade animations
- Debounced search input
- Browser back/forward support

### Usage Examples
Check `src/js/example-usage.js` for:
- Reset filters functionality
- Keyboard shortcuts
- Analytics tracking
- User preference saving
- Infinite scroll option

## 🔧 Configuration Options

```javascript
const blogFilter = new BlogFilterSystem({
  itemsPerPage: 9,              // Items shown initially
  activeTabClass: 'w--current', // Webflow's active class
  hiddenClass: 'hide',          // Class for hidden items
  // ... more options
});
```

## 🐛 Troubleshooting

- **Items not filtering**: Check `data-category` attributes match tab values
- **Sort not working**: Ensure date format is YYYY-MM-DD
- **Empty state not showing**: Verify `data-filter="empty-state"` is set

## 📝 License

Free to use in your Webflow projects!

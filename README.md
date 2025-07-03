# Vite + Webflow

A modern development toolkit that bridges professional JavaScript workflows with Webflow projects. Built with Vite, this starter enables developers to use contemporary development practices while leveraging Webflow's visual design capabilities.

## Table of Contents

1. [Features](#features)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Development Guide](#development-guide)
5. [Build System](#build-system)
6. [Deployment Options](#deployment-options)
7. [Customization](#customization)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Features

### Core Features

- **Modern Development Environment**
  - ES6+ JavaScript support
  - npm for dependency management
  - Hot Module Replacement (HMR)
  - Vite's fast build process

### Build Features

- **Optimized Output**
  - Single minified JavaScript file
  - Automated semantic versioning
  - Version history management
  - Easy rollback capabilities

### Architecture

- **Modular Design**
  - Component-based architecture
  - Page-specific routing
  - Global script management
  - Utility functions library

### Development Features

- **Developer Experience**
  - Fast refresh during development
  - Organized project structure
  - Flexible customization options
  - Multiple deployment strategies

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

## Project Structure

```plaintext
project/
├── dist/                    # Build output
│   ├── latest/             # Most recent build
│   │   └── index.js
│   └── versions/           # Historical builds
│       ├── v1.0.0/
│       └── v1.0.1/
├── src/
│   ├── js/
│   │   ├── components/     # Reusable components
│   │   │   ├── exampleComponent.js
│   │   │   └── index.js
│   │   ├── global/        # Global scripts
│   │   │   ├── globalInit.js
│   │   │   └── navigation.js
│   │   ├── pages/         # Page-specific code
│   │   │   ├── home.js
│   │   │   └── index.js
│   │   ├── utils/         # Utility functions
│   │   │   ├── dom.js
│   │   │   └── index.js
│   │   └── index.js       # Main entry point
│   └── styles/            # Optional CSS (dev only)
├── scripts/               # Build scripts
├── .env.template         # Environment variables template
├── .gitignore           # Git ignore configuration
└── vite.config.js       # Vite configuration
```

## Development Guide

### Page Routing

1. Add route attribute to Webflow pages:

```html
<body data-route="home">
  <!-- Webflow content -->
</body>
```

2. Create page-specific JavaScript:

```javascript
// src/js/pages/home.js
export default function homeInit() {
  console.log("Home page initialized");
}
```

3. Register in router:

```javascript
// src/js/pages/index.js
import homeInit from "./home";

export default function PageRouter() {
  const route = document.body.dataset.route;

  switch (route) {
    case "home":
      homeInit();
      break;
    default:
      console.log(`No handler for route: ${route}`);
  }
}
```

### Components

1. Create component:

```javascript
// src/js/components/exampleComponent.js
export const exampleComponent = () => {
  // Component logic
};
```

2. Register component:

```javascript
// src/js/components/index.js
import { exampleComponent } from "./exampleComponent";

export const initializeComponents = () => {
  exampleComponent();
};
```

### Global Scripts

```javascript
// src/js/global/globalInit.js
import navigation from "./navigation";

export default function globalInit() {
  navigation();
  // Other global initializations
}
```

### Utilities

```javascript
// src/js/utils/dom.js
export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);
```

## Build System

### Build Commands

```bash
npm run build           # Patch update (v1.0.0 → v1.0.1)
npm run build:minor    # Minor update (v1.0.0 → v1.1.0)
npm run build:major    # Major update (v1.0.0 → v2.0.0)
```

### Version Management

- Builds are automatically versioned
- Latest build stored in `/dist/latest/`
- Version history in `/dist/versions/`
- Easy rollback capability

## Deployment Options

### 1. GitHub + jsDelivr Method

```html
<!-- After pushing to public GitHub repository -->
<script src="https://cdn.jsdelivr.net/gh/username/repo@version/dist/latest/index.js"></script>
```

### 2. Webflow Asset Hosting

1. Rename `index.js` to `index.js.txt`
2. Upload to Webflow Assets
3. Use provided Webflow URL

### 3. Custom CDN

- Upload to preferred CDN service
- Use provided CDN URL

### Integration

Add to your project:

```html
<script type="text/javascript" src="https://your-hosted-file-url.js"></script>
```

## Customization

### Project Structure

- Modify routing system as needed
- Add/remove utility modules
- Customize component architecture
- Adjust global scripts organization

### CSS Handling

- `styles` directory for development only
- Manage production CSS through Webflow
- Allows CSS changes without JS rebuilds

### Environment Variables

1. Environment Files:

```plaintext
.env              # Default variables
.env.local        # Local overrides (git-ignored)
.env.template     # Template file
```

2. Usage:

```javascript
const apiKey = process.env.API_KEY;
```

## Best Practices

### Code Organization

1. **Components**

   - Keep components focused
   - Use meaningful names
   - Document APIs

2. **Page Management**

   - Use descriptive routes
   - Isolate page-specific logic
   - Share common functionality

3. **Build Process**
   - Use semantic versioning
   - Document version changes
   - Test before deployment

### Security

1. **Environment Variables**

   - Never commit sensitive data
   - Use `.env` for configuration
   - Follow security best practices

2. **Git Security**
   - Maintain comprehensive `.gitignore`
   - Review commits for sensitive data
   - Use security scanning tools

## Components Documentation

### Enhanced Contact Form

The contact form includes live validation, anti-spam protection, and modal support for success messages.

#### HTML Structure

```html
<!-- Webflow Form Structure -->
<div class="w-form">
  <form data-form-validate data-success-modal="#success-modal" action="https://submit-form.com/your-form-id">
    
    <!-- Field wrapper with validation -->
    <div data-validate>
      <label for="name">Name</label>
      <input type="text" id="name" name="name" required min="2">
    </div>
    
    <!-- Email field -->
    <div data-validate>
      <label for="email">Email</label>
      <input type="email" id="email" name="email" required>
    </div>
    
    <!-- Custom submit button -->
    <div data-submit>
      <input type="submit" value="Send Message">
    </div>
  </form>
  
  <!-- Webflow's success/error messages (will be hidden) -->
  <div class="w-form-done">
    <div>Thank you! Your submission has been received!</div>
  </div>
  <div class="w-form-fail">
    <div>Oops! Something went wrong while submitting the form.</div>
  </div>
</div>

<!-- Success Modal (outside form wrapper) -->
<div id="success-modal" data-success-modal>
  <div>
    <button data-modal-close>&times;</button>
    <h3>Thank You!</h3>
    <p>Your message has been sent successfully.</p>
  </div>
</div>
```

#### Features

1. **Live Validation**
   - Real-time field validation after first submit attempt
   - Visual states: `is--filled`, `is--success`, `is--error`
   - Supports `min` and `max` attributes for length validation
   - Email format validation

2. **Anti-Spam Protection**
   - Prevents form submission within 5 seconds of page load
   - No visible captcha required

3. **Modal Support**
   - Add `data-success-modal="#modal-id"` to show custom success modal
   - Supports Motion.dev animations or instant show
   - Falls back to alert if no modal specified

4. **Webflow Integration**
   - Automatically hides Webflow's default success/error messages
   - Properly manages Webflow form states to prevent conflicts
   - Resets both custom and Webflow states after submission
   - Works seamlessly with Webflow's `.w-form` structure

5. **Attributes**
   - `data-form-validate` - Enable validation on form
   - `data-validate` - Mark field wrapper for validation
   - `data-submit` - Custom submit button wrapper
   - `data-success-modal` - Success modal selector
   - `data-modal-close` - Close button inside modal

#### CSS Classes

```css
/* Validation states */
.is--filled { /* Field has content */ }
.is--success { /* Field is valid */ }
.is--error { /* Field is invalid */ }

/* Form states */
.form-submitting { /* Form is being submitted */ }
.form-success { /* Form submitted successfully */ }
```

#### JavaScript API

```javascript
// Manual initialization
window.ContactFormValidator.init();

// Access modal manager
window.ContactFormValidator.modalManager.show('#modal-id');
window.ContactFormValidator.modalManager.hide();
```

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Check syntax errors
   - Verify dependencies
   - Review vite.config.js

2. **Script Loading**

   - Verify script integration
   - Check browser console
   - Confirm route attributes

3. **Development Server**
   - Verify port availability
   - Check file permissions
   - Clear cache if needed

4. **Contact Form Issues**
   - Ensure form has `data-form-validate` attribute
   - Check field wrappers have `data-validate`
   - Verify form action URL is correct
   - Check browser console for errors

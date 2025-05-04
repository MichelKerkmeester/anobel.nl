# Instructions for Updating the Mega Menu on Webflow

The mega menu is not opening due to JavaScript syntax errors in the code. I've fixed these errors and compiled a new version of the JavaScript. Follow these steps to update the site:

## 1. Access your Webflow project

Go to the Webflow Designer for the "A. Nobel & Zn" site.

## 2. Update the Custom Code

1. In the Webflow Designer, click on the settings icon (⚙️) in the left sidebar
2. Navigate to "Custom Code" in the site settings
3. In the "Footer Code" section, find the existing JavaScript code for the mega menu
4. Replace it with the fixed version or add a new script tag if none exists:

```html
<script>
// Paste the contents of the prod/latest/index.js file here
</script>
```

## 3. Publish the site

After updating the custom code, click "Publish" to apply the changes to the live site.

## Explanation of Fixes

The original code had two syntax errors:
1. An unexpected 'n' character after `ease: "power2.out",` in the openMenu function
2. A missing comma after `height: "0svh"` in the closeMenu function

These errors prevented the JavaScript from executing correctly, which is why the menu wasn't opening.

## Future Maintenance

When making changes to the JavaScript components:
1. Edit the files in the `src/components/` directory
2. Run `npm run build` to compile the changes
3. Copy the compiled code from `prod/latest/index.js` to the Webflow custom code section
4. Publish the site to apply the changes

This process ensures that all components work together properly and are bundled into a single JavaScript file. 
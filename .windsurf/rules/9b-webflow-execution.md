---
trigger: always_on
description: 
globs: 
---
## 🛠️ 9B. WEBFLOW EXECUTION
1. **Use vanilla ES6+** exclusively.
2. When animating a Webflow Collection List: target `.w-dyn-item` only, add a **custom class/data-attribute** for hooks, and **re-attach animations** after CMS re-render.

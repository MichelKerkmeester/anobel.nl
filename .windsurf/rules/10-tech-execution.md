---
trigger: always_on
---

## 🛠️ 10. TECHNICAL EXECUTION

### General:
1. **Bind events** with `document.querySelector`.
2. **Start with CSS transitions**; escalate only if needed.
3. **Respect reduced motion** in all animations.
4. **Use will-change sparingly**; remove after animation.
5. **Batch DOM updates** in animation loops.

### Webflow-Specific:
1. **Use vanilla ES6+** exclusively.
2. When animating a Webflow Collection List: target `.w-dyn-item` only, add a **custom class/data-attribute** for hooks, and **re-attach animations** after CMS re-render.
3. **Check Webflow forums through Tavily/Brave** for platform-specific questions and best practices.

### Slater-Specific:
1. **Slater autoloads** — never add `DOMContentLoaded` listeners.
2. Execute code directly or via `Webflow.push()` for Webflow-dependent features.
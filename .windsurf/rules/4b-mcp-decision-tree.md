---
trigger: always_on
---

## 🌲 4b. MCP DECISION TREE

### Decision Tree:
| Category | Trigger/Decision Point | Condition | If YES | If NO | Tools |
|----------|------------------------|-----------|---------|--------|-------|
| **Internal Reasoning** | Complete? | Have I fully thought through this? | Check complexity | Continue thinking | - |
| **Complexity Check** | Is it complex? | Multi-step reasoning required? | Use code-reasoning MCP | Proceed to next check | Code-Reasoning |
| **Library Integration** | External dependencies | Need library docs? | Use Context7 | Proceed to next check | Context7, Tavily/Brave |
| **Current Best Practices** | Need latest info | Need latest info/best practices? | Use web search | Proceed to next check | Tavily/Brave |
| **Performance Optimization** | Measurable improvements | Optimization needed? | Search for benchmarks/techniques | Proceed to next check | Tavily/Brave, Code-Reasoning |
| **Platform Questions** | Webflow/Slater specific | Platform-specific info needed? | Search platform docs | Proceed to implementation | Tavily/Brave, Context7 |
| **Implementation Ready** | Ready to code? | All checks complete? | Code with validated approach | Return to internal reasoning | - |
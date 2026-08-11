## 2024-05-15 - Intl.DateTimeFormat Instantiation Overhead
**Learning:** `Intl.DateTimeFormat` instantiation is notoriously slow in V8/Node.js, especially when called frequently in critical paths like formatting request contexts or timestamps. Constructing them inside functions that execute on every request leads to significant CPU overhead.
**Action:** Always extract and cache `Intl.DateTimeFormat` instances. Use lazy instantiation in maps keyed by language/timezone when dynamic localization is needed, to prevent runaway allocations while maintaining optimal formatting speed.

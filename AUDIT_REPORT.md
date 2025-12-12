# GuildMaster Project Audit Report

**Date:** December 12, 2025
**Branch:** claude/project-audit-011e1muCKQNCQMnAEhqmLrdk

---

## Executive Summary

The GuildMaster project is a well-structured async strategy RPG with solid fundamentals. However, there are several areas that need improvement across security, error handling, code quality, and missing features.

---

## Critical Issues

### 1. XSS Vulnerabilities (HIGH PRIORITY)

Multiple files use `innerHTML` with dynamic data that could be exploited:

| File | Location | Issue |
|------|----------|-------|
| `src/js/systems/inventory.js:327-329` | `gear-name` div | Item displayName inserted without escaping |
| `src/js/ui/questCard.js:95` | Quest description | Template description not sanitized |
| `src/js/ui/modals.js:877,926` | Combat log entries | Event descriptions inserted unsafely |
| `src/js/ui/heroCard.js:55` | Hero card template | Hero data inserted via innerHTML |
| `src/js/ui/devPanel.js:433` | Log entry | Message inserted without escaping |

**Recommendation:** Replace `innerHTML` with `textContent` for user data, or implement a sanitization utility.

### 2. Race Conditions in Quest System

- `src/js/systems/quests.js:148` - `checkQuestBoardExpiration()` called without `await` after `checkQuestCompletions()`
- `src/js/db/gameState.js:656-692` - Quest start has multiple save points; partial failure could cause inconsistent state
- `src/js/main.js:248-259` - Hero healing runs in update loop while DB saves are async; could heal twice

---

## High Priority Issues

### 3. Error Handling Gaps

**Missing try/catch in critical paths:**
- `src/js/db/gameState.js:64-70` - `Promise.all()` for loading player data has no error handling
- `src/js/systems/guildHall.js:64-87` - Errors logged but system continues in broken state
- `src/js/systems/inventory.js:120` - `sellItem()` in loop fails silently

**Inconsistent error patterns:**
- Mix of `try/catch` and `.catch()` chains
- Some use `Utils.error()`, others use `console.error()`
- Fire-and-forget async calls (e.g., `gameState.js:688`)

### 4. Null/Undefined Access Risks

| File | Line | Issue |
|------|------|-------|
| `src/js/systems/quests.js:114` | `GameState.heroes.reduce()` | No null check on heroes array |
| `src/js/systems/quests.js:199` | `document.querySelector()` | No null check before `.textContent` |
| `src/js/systems/inventory.js:262,268,304` | DOM queries | Missing null checks |
| `src/js/db/gameState.js:137` | `this._state.player?.gold` | Could be undefined |

### 5. Memory Leaks

- `src/js/main.js:232` - `setInterval()` stored but never cleared on app restart
- `src/js/main.js:77,89` - Event listeners added without removal
- `src/js/ui/modals.js:77` - Event listeners on backdrop not removed
- `src/js/ui/auth.js:188-192` - Events can be re-added without cleanup

---

## Medium Priority Issues

### 6. Database Schema Issues

**Missing from schema.sql:**
- `last_heal_tick` column in heroes table (used in code but not in schema)
- `skills` JSONB column in heroes table (used but not explicitly defined)
- `is_locked` column in items table (used for inventory locking feature)

**Potential sync issues:**
- Schema shows `BST = Level x 10` in comment but code uses `Level x 20`

### 7. Input Validation Weaknesses

- `src/js/ui/auth.js:386` - Email regex too permissive
- `src/js/ui/auth.js:399` - Username only checks length, not content
- `src/js/db/gameState.js:271` - `skillMod` not validated as positive number
- `src/js/db/gameState.js:288` - `allocateStats()` doesn't validate individual values are non-negative

### 8. Code Consistency Issues

**Naming inconsistencies:**
- Mix of camelCase (`userId`) and snake_case (`user_id`) across DB fields
- `_state` vs `_listeners` follow same pattern but used differently

**Duplicate code:**
- Hero update pattern repeated at lines 320-322 and 821-824 in gameState.js
- Healing calculation duplicated in guildHall.js

### 9. Configuration Issues

- `src/js/config.js:279` - `DEBUG: true` hardcoded (should be environment-based)
- Legacy fallbacks for quest durations suggest incomplete migration

---

## Low Priority / Technical Debt

### 10. Performance Concerns

- `src/js/systems/quests.js:174-186` - Repeated DOM queries per quest each update cycle
- `src/js/main.js:232-237` - Hero cards re-rendered every second even if unchanged
- `src/js/db/gameState.js:183-246` - Hero migration does sequential saves instead of batch

### 11. Missing Features (vs Design Doc)

**Not yet implemented:**
- PvP system and inscriptions
- Worker/farming system (tables exist but no UI)
- Player market (market_listings table exists but unused)
- Soul remnant crafting
- Soul powering (dark inheritance)
- Alignment system visual effects
- Rare seed economy
- Rifts/endgame content
- Cosmetics and monetization

**Partially implemented:**
- Retirement system (framework only)
- Heirloom inheritance (structure exists)
- Peek system (basic functionality)

### 12. Documentation Gaps

- Async functions don't document error conditions
- No JSDoc on many critical functions
- Complex state transitions undocumented
- `hero.js:374` has TODO comment for injury recovery timer

---

## Recommended Action Items

### Immediate (Security/Stability)

1. **Fix XSS vulnerabilities** - Create `Utils.escapeHtml()` and use `textContent` for dynamic data
2. **Add await to async calls** - Fix race conditions in quest system
3. **Add schema migration** for missing columns (`last_heal_tick`, `is_locked`, `skills`)

### Short-term (Code Quality)

4. **Standardize error handling** - Create error recovery strategy for async operations
5. **Add null checks** - Especially for DOM queries and array operations
6. **Clear intervals on cleanup** - Fix memory leaks in main.js
7. **Set DEBUG based on environment** - Use build flag or environment variable

### Medium-term (Technical Debt)

8. **Batch database operations** - Use `Promise.all()` for sequential saves
9. **Add input validation utility** - Centralize validation for stats, costs, etc.
10. **Implement DOM caching** - Store references instead of repeated queries

### Long-term (Features)

11. **Complete retirement system**
12. **Implement PvP framework**
13. **Build out farming/worker system**

---

## Project Health Summary

| Category | Status | Notes |
|----------|--------|-------|
| **Architecture** | Good | Clean separation of concerns |
| **Security** | Needs Work | XSS vulnerabilities present |
| **Error Handling** | Needs Work | Inconsistent patterns |
| **Performance** | Acceptable | Some optimization opportunities |
| **Feature Completeness** | In Progress | Core features work, many planned features pending |
| **Documentation** | Partial | Design doc excellent, code docs sparse |
| **Database** | Schema Drift | Code uses fields not in schema |

---

## Files Analyzed

- `index.html` - Main entry point
- `src/js/config.js` - Configuration
- `src/js/main.js` - Application entry
- `src/js/utils.js` - Utilities
- `src/js/db/supabase.js` - Database layer
- `src/js/db/gameState.js` - State management
- `src/js/models/hero.js` - Hero model
- `src/js/models/skill.js` - Skills system
- `src/js/models/gear.js` - Equipment system
- `src/js/models/quest.js` - Quest model
- `src/js/systems/combat.js` - Combat engine
- `src/js/systems/quests.js` - Quest system
- `src/js/systems/inventory.js` - Inventory management
- `src/js/systems/recruitment.js` - Recruitment
- `src/js/systems/guildHall.js` - Guild hall
- `src/js/ui/*.js` - UI components
- `schema.sql` - Database schema
- `migrations/*.sql` - Database migrations

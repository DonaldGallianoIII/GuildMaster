# GUILD MASTER - Technical Design Document
## For Claude Code Implementation

**Version:** 2.0  
**Stack:** Cloudflare Workers/Pages + Supabase  
**Last Updated:** December 2024

---

## TABLE OF CONTENTS

1. [Core Philosophy](#core-philosophy)
2. [Hero System](#hero-system)
3. [Enemy System](#enemy-system)
4. [Combat Math](#combat-math)
5. [Soul Economy](#soul-economy)
6. [Item System](#item-system)
7. [Affix System](#affix-system)
8. [Soul Hunger System](#soul-hunger-system)
9. [Permadeath Rules](#permadeath-rules)
10. [Zone & Quest System](#zone--quest-system)
11. [Database Schema](#database-schema)
12. [Implementation Phases](#implementation-phases)

---

## CORE PHILOSOPHY

- **Game is HARD** - Deaths should be meaningful and frequent for unprepared players
- **Gear matters** - But doesn't trivialize content
- **Souls are visible** - Players see the economy from the start (guaranteed drops)
- **Tier is zone-based** - Enemies are stat templates; zones determine their power
- **Permadeath is real** - Hero dies = hero gone + all equipped gear gone

---

## HERO SYSTEM

### Base Stats

```javascript
const HERO_SCALING = {
  BST_PER_LEVEL: 100,  // Total stat points per level
  HP_FORMULA: (level, def) => def + (level * 40),
  HEAL_BETWEEN_FIGHTS: 0.10  // 10% of max HP
};
```

### Stat Distribution

Heroes distribute their BST across 4 stats:
- **ATK** - Physical damage
- **DEF** - Damage reduction, adds to HP
- **SPD** - Turn order, action frequency
- **WILL** - Magic damage, magic resist

### Example Heroes

| Level | BST | DEF | HP (DEF + Lv×40) |
|-------|-----|-----|------------------|
| 1 | 100 | 30 | 70 |
| 3 | 300 | 50 | 170 |
| 10 | 1000 | 150 | 550 |
| 50 | 5000 | 800 | 2800 |
| 100 | 10000 | 1500 | 5500 |

---

## ENEMY SYSTEM

### Design Principle

**Enemies have NO inherent tier.** They are stat distribution templates. The zone/quest determines what tier multiplier to apply.

### Enemy Template Structure

```typescript
interface EnemyTemplate {
  id: string;
  name: string;
  family: EnemyFamily;
  hunger: HungerAccess;
  // BST distribution (must sum to 1.0)
  atk: number;   // 0.0 - 1.0
  def: number;   // 0.0 - 1.0
  spd: number;   // 0.0 - 1.0
  will: number;  // 0.0 - 1.0
  archetype: Archetype;
}

type EnemyFamily = 
  | 'Vermin' | 'Beasts' | 'Goblinoid' | 'Undead' | 'Humanoid'
  | 'Orc/Brute' | 'Arcane' | 'Demon' | 'Draconic' | 'Abomination';

type HungerAccess = 'No Replete' | 'Standard' | 'Full Access';

type Archetype = 
  | 'Bruiser' | 'Assassin' | 'Glass Cannon' | 'Mage' 
  | 'Summoner' | 'Paladin' | 'Tank';
```

### Tier BST Multipliers

Applied at spawn time based on zone/quest settings:

```javascript
const TIER_MULTIPLIERS = {
  fodder_trash:     0.60,
  fodder:           0.70,
  fodder_exalted:   0.80,
  standard_weak:    0.85,
  standard:         0.90,
  standard_exalted: 1.00,
  elite:            1.20,
  elite_exalted:    1.50,
  boss:             2.00,
  boss_legendary:   3.00
};
```

### Spawning an Enemy

```javascript
function spawnEnemy(template, tier, heroLevel) {
  const baseBST = heroLevel * 100; // Match hero BST scaling
  const tierMult = TIER_MULTIPLIERS[tier];
  const enemyBST = baseBST * tierMult;
  
  return {
    name: template.name,
    family: template.family,
    atk: Math.floor(enemyBST * template.atk),
    def: Math.floor(enemyBST * template.def),
    spd: Math.floor(enemyBST * template.spd),
    will: Math.floor(enemyBST * template.will),
    hp: calculateEnemyHP(enemyBST, template.def, tier)
  };
}
```

### Example: Sewer Rat at Different Tiers

Template: `{ atk: 0.3, def: 0.1, spd: 0.55, will: 0.05 }`

VS Level 10 Hero (1000 BST):

| Tier | Multiplier | Enemy BST | ATK | DEF | SPD | WILL |
|------|------------|-----------|-----|-----|-----|------|
| fodder_trash | 0.60x | 600 | 180 | 60 | 330 | 30 |
| standard | 0.90x | 900 | 270 | 90 | 495 | 45 |
| elite | 1.20x | 1200 | 360 | 120 | 660 | 60 |
| boss | 2.00x | 2000 | 600 | 200 | 1100 | 100 |

Same rat. Very different threat levels.

---

## COMBAT MATH

### Turn Order

Based on SPD stat. Higher SPD = acts first.

### Damage Formula

```javascript
function calculateDamage(attacker, defender, isPhysical = true) {
  const attackStat = isPhysical ? attacker.atk : attacker.will;
  const defenseStat = isPhysical ? defender.def : defender.will;
  
  const baseDamage = attackStat - (defenseStat * 0.5);
  const minDamage = 3; // Floor to prevent tickle fights
  
  const variance = 0.15; // ±15% randomness
  const roll = 1 + (Math.random() * variance * 2 - variance);
  
  return Math.max(minDamage, Math.floor(baseDamage * roll));
}
```

### Between-Fight Healing

```javascript
function healBetweenFights(hero) {
  const healAmount = Math.floor(hero.maxHp * 0.10); // 10%
  hero.currentHp = Math.min(hero.maxHp, hero.currentHp + healAmount);
}
```

### Attrition Math

With 10% heal, a hero fighting 4 fodder enemies:

| Fight | Damage Taken | Heal | Net HP Change |
|-------|--------------|------|---------------|
| 1 | ~20 | +7 | -13 |
| 2 | ~20 | +7 | -13 |
| 3 | ~20 | +7 | -13 |
| 4 | ~20 | — | -20 |

**Expected:** 4-5 fodder in a row is the danger zone for +20% geared heroes.

---

## SOUL ECONOMY

### Soul Drops (GUARANTEED)

Every kill drops souls. Amount scales with tier.

```javascript
const SOUL_DROPS = {
  fodder_trash:     { min: 1, max: 1 },
  fodder:           { min: 1, max: 2 },
  fodder_exalted:   { min: 2, max: 3 },
  standard_weak:    { min: 3, max: 4 },
  standard:         { min: 4, max: 6 },
  standard_exalted: { min: 6, max: 9 },
  elite:            { min: 10, max: 16 },
  elite_exalted:    { min: 17, max: 28 },
  boss:             { min: 30, max: 50 },
  boss_legendary:   { min: 55, max: 100 }
};
```

### Soul Costs

Base costs (before hunger modifiers):

```javascript
const SOUL_COSTS = {
  BASE_SLAM: 100,           // Add random affix
  MAGIC_REROLL: 25,         // Reroll magic item
  RARE_REROLL: 60,          // Reroll rare item
  LEVEL_UP: 10,             // +1 item level
  LEVEL_DOWN: 10,           // -1 item level (strip)
  CRAFT_ESCALATION: 1.50    // Each craft = 1.5x previous cost
};
```

### Crafting Cost Escalation

Each modification to an item increases its base cost by 50%:

```javascript
function getCraftCost(baseCost, previousCrafts, hungerModifier) {
  const escalatedCost = baseCost * Math.pow(1.5, previousCrafts);
  return Math.floor(escalatedCost * hungerModifier);
}
```

| Craft # | Cost Multiplier | Slam Cost (base 100) |
|---------|-----------------|----------------------|
| 1st | 1.0x | 100 |
| 2nd | 1.5x | 150 |
| 3rd | 2.25x | 225 |
| 4th | 3.375x | 338 |
| 5th | 5.06x | 506 |

---

## ITEM SYSTEM

### Item Level

Items drop at the level of the hero who obtained them.

```javascript
interface Item {
  id: string;
  name: string;
  slot: ItemSlot;
  level: number;           // Drop level (hero level at time of drop)
  hunger: number;          // -0.70 to +0.70
  hungerLabel: HungerLabel;
  prefixes: Affix[];
  suffixes: Affix[];
  maxPrefixes: number;     // 2-5 based on hunger
  maxSuffixes: number;     // 2-5 based on hunger
  craftCount: number;      // For cost escalation
}

type ItemSlot = 
  | 'weapon' | 'helm' | 'chest' | 'gloves' 
  | 'boots' | 'amulet' | 'ring1' | 'ring2';
```

### Item Level Adjustment

Items can be leveled ±3 from their drop level:

```javascript
const ITEM_LEVEL_RULES = {
  MAX_INCREASE: 3,
  MAX_DECREASE: 3,
  LEVEL_COST: 10  // souls per level change
};

function canEquip(hero, item) {
  return hero.level >= item.level;
}

function adjustItemLevel(item, delta, souls) {
  const newLevel = item.level + delta;
  const minLevel = item.dropLevel - 3;
  const maxLevel = item.dropLevel + 3;
  
  if (newLevel < minLevel || newLevel > maxLevel) {
    throw new Error('Level adjustment out of range');
  }
  
  const cost = Math.abs(delta) * ITEM_LEVEL_RULES.LEVEL_COST * item.hungerModifier;
  if (souls < cost) {
    throw new Error('Insufficient souls');
  }
  
  item.level = newLevel;
  return cost;
}
```

### Level Requirement Flow

```
Hero Level 50 drops item → Item Level 50
  ├── Can level UP to 53 (costs souls)
  ├── Can strip DOWN to 47 (costs souls)
  └── Only heroes Level 50+ can equip (or 47+ if stripped)
```

---

## AFFIX SYSTEM

### Affix Scaling Formula

Affixes scale with item level, targeting ~5% of expected hero BST per affix.

```javascript
const AFFIX_SCALING = {
  // At item level N, hero has N * 100 BST
  // Single affix should be ~3-6% of that
  MIN_ROLL_FACTOR: 0.02,   // 2% of hero BST
  MAX_ROLL_FACTOR: 0.08,   // 8% of hero BST
};

function calculateAffixRange(itemLevel) {
  const heroBST = itemLevel * 100;
  return {
    min: Math.floor(heroBST * AFFIX_SCALING.MIN_ROLL_FACTOR),
    max: Math.floor(heroBST * AFFIX_SCALING.MAX_ROLL_FACTOR)
  };
}
```

### Affix Roll Ranges by Item Level

| Item Level | Hero BST | Min Roll | Max Roll |
|------------|----------|----------|----------|
| 1 | 100 | +2 | +8 |
| 10 | 1000 | +20 | +80 |
| 25 | 2500 | +50 | +200 |
| 50 | 5000 | +100 | +400 |
| 100 | 10000 | +200 | +800 |

### Weighted Rolls

Within the roll range, values are weighted by rarity:

```javascript
const ROLL_WEIGHTS = {
  low:    0.50,  // 50% chance - bottom 25% of range
  mid:    0.30,  // 30% chance - middle 50% of range
  high:   0.15,  // 15% chance - top 20% of range
  max:    0.05   // 5% chance - top 5% of range
};

function rollAffixValue(itemLevel) {
  const { min, max } = calculateAffixRange(itemLevel);
  const range = max - min;
  
  const roll = Math.random();
  let value;
  
  if (roll < 0.50) {
    // Low tier: bottom 25%
    value = min + Math.floor(Math.random() * range * 0.25);
  } else if (roll < 0.80) {
    // Mid tier: 25-75%
    value = min + Math.floor(range * 0.25) + Math.floor(Math.random() * range * 0.50);
  } else if (roll < 0.95) {
    // High tier: 75-95%
    value = min + Math.floor(range * 0.75) + Math.floor(Math.random() * range * 0.20);
  } else {
    // Max tier: 95-100%
    value = min + Math.floor(range * 0.95) + Math.floor(Math.random() * range * 0.05);
  }
  
  return Math.min(value, max);
}
```

### Affix Types

```javascript
const AFFIX_POOL = {
  prefixes: [
    { id: 'strong', stat: 'atk', label: 'Strong' },
    { id: 'fortified', stat: 'def', label: 'Fortified' },
    { id: 'swift', stat: 'spd', label: 'Swift' },
    { id: 'wise', stat: 'will', label: 'Wise' },
    { id: 'vital', stat: 'hp', label: 'Vital' },
    // ... more prefixes
  ],
  suffixes: [
    { id: 'of_power', stat: 'atk', label: 'of Power' },
    { id: 'of_iron', stat: 'def', label: 'of Iron' },
    { id: 'of_haste', stat: 'spd', label: 'of Haste' },
    { id: 'of_insight', stat: 'will', label: 'of Insight' },
    { id: 'of_life', stat: 'hp', label: 'of Life' },
    // ... more suffixes
  ]
};
```

---

## SOUL HUNGER SYSTEM

### Hunger Roll

Every item rolls a hunger value at drop time:

```javascript
const HUNGER_SYSTEM = {
  STANDARD_RANGE: { min: -0.30, max: 0.30 },
  LEGENDARY_REPLETE: { min: -0.70, max: -0.50 },
  LEGENDARY_VORACIOUS: { min: 0.50, max: 0.70 },
  LEGENDARY_CHANCE: 0.02  // 2% chance for legendary hunger
};

function rollHunger() {
  if (Math.random() < HUNGER_SYSTEM.LEGENDARY_CHANCE) {
    // Legendary roll - 50/50 Replete or Voracious
    if (Math.random() < 0.5) {
      return randomInRange(HUNGER_SYSTEM.LEGENDARY_REPLETE);
    } else {
      return randomInRange(HUNGER_SYSTEM.LEGENDARY_VORACIOUS);
    }
  }
  return randomInRange(HUNGER_SYSTEM.STANDARD_RANGE);
}
```

### Hunger Labels

```javascript
function getHungerLabel(hunger) {
  if (hunger <= -0.50) return 'Replete';      // Legendary low
  if (hunger <= -0.25) return 'Nourished';
  if (hunger <= -0.10) return 'Sated';
  if (hunger <= 0.10)  return 'Neutral';
  if (hunger <= 0.25)  return 'Hungry';
  if (hunger < 0.50)   return 'Ravenous';
  return 'Voracious';                         // Legendary high
}
```

### Hunger Effects

| Label | Hunger Range | Craft Cost | Affix Value | Max Slots |
|-------|--------------|------------|-------------|-----------|
| Replete | -70% to -50% | -50% to -70% | 1.0x (normal) | 5/5 |
| Nourished | -30% to -25% | -25% to -30% | 1.0x | 3/3 |
| Sated | -24% to -10% | -10% to -24% | 1.0x | 3/3 |
| Neutral | -9% to +9% | ±9% | 1.0x | 3/3 |
| Hungry | +10% to +24% | +10% to +24% | 1.0x | 3/3 |
| Ravenous | +25% to +30% | +25% to +30% | 1.0x | 3/3 |
| Voracious | +50% to +70% | +50% to +70% | 1.5x | 2/2 |

### Special Rules

```javascript
const HUNGER_SPECIAL_RULES = {
  REPLETE: {
    // Drops with NO affixes - blank canvas
    dropsBlank: true,
    maxPrefixes: 5,
    maxSuffixes: 5,
    affixMultiplier: 1.0,
    costMultiplier: (hunger) => 1 + hunger  // -50% to -70% cost
  },
  VORACIOUS: {
    // Drops with affixes at 1.5x value
    dropsBlank: false,
    maxPrefixes: 2,
    maxSuffixes: 2,
    affixMultiplier: 1.5,
    costMultiplier: (hunger) => 1 + hunger  // +50% to +70% cost
  }
};
```

### Hunger + Loot Access

Enemies have hunger gates that determine what they can drop:

```javascript
const HUNGER_ACCESS = {
  'No Replete': {
    // Cannot drop Replete items
    canDrop: (hunger) => hunger > -0.50
  },
  'Standard': {
    // Can drop anything except legendary extremes
    canDrop: (hunger) => hunger >= -0.30 && hunger <= 0.30
  },
  'Full Access': {
    // Can drop anything including legendary
    canDrop: (hunger) => true
  }
};
```

---

## PERMADEATH RULES

### On Hero Death

```javascript
function onHeroDeath(hero) {
  // 1. Hero is permanently removed
  deleteHero(hero.id);
  
  // 2. ALL equipped gear is lost
  for (const item of hero.equipment) {
    deleteItem(item.id);  // Gone forever
  }
  
  // 3. Only stash/vault items survive
  // (Items not on the hero)
  
  // 4. No revives, no take-backs
}
```

### Gear Strategy Implications

```
Risk Assessment Before Quest:
├── Send fully geared → Best success, highest loss on death
├── Send with "okay" gear → Moderate success, acceptable loss
└── Strip before quest → Gear survives in stash, hero more likely to die
```

### Gear Trickle-Down

```javascript
// Level 50 hero has Level 50 gear
// If they die, that gear is GONE

// To preserve gear:
// 1. Strip item level down -3 (costs souls)
// 2. Unequip and stash before dangerous quests
// 3. Pass down to lower-level heroes (with strip penalty)
```

---

## ZONE & QUEST SYSTEM

### Zone Definition

```typescript
interface Zone {
  id: string;
  name: string;
  description: string;
  allowedFamilies: EnemyFamily[];
  tierRange: {
    min: EnemyTier;
    max: EnemyTier;
  };
  hazards?: ZoneHazard[];
  minHeroLevel: number;
}

interface ZoneHazard {
  type: 'fire_damage' | 'reduced_healing' | 'ambush' | 'curse';
  value: number;
}
```

### Example Zones

```javascript
const ZONES = {
  sewers_novice: {
    name: "City Sewers",
    allowedFamilies: ['Vermin', 'Humanoid'],
    tierRange: { min: 'fodder_trash', max: 'fodder_exalted' },
    minHeroLevel: 1
  },
  
  undercity_expert: {
    name: "The Undercity",
    allowedFamilies: ['Vermin', 'Undead', 'Humanoid'],
    tierRange: { min: 'standard', max: 'elite' },
    hazards: [{ type: 'ambush', value: 0.20 }],  // 20% ambush chance
    minHeroLevel: 15
  },
  
  dragon_lair: {
    name: "Dragon's Lair",
    allowedFamilies: ['Draconic'],
    tierRange: { min: 'elite', max: 'boss_legendary' },
    hazards: [{ type: 'fire_damage', value: 0.05 }],  // 5% HP per encounter
    minHeroLevel: 40
  }
};
```

### Quest Generation

```javascript
function generateQuest(zone, difficulty) {
  const encounters = [];
  const encounterCount = getEncounterCount(difficulty);
  
  for (let i = 0; i < encounterCount; i++) {
    const tier = rollTierInRange(zone.tierRange);
    const family = randomChoice(zone.allowedFamilies);
    const enemies = getEnemiesFromFamily(family);
    const template = randomChoice(enemies);
    
    encounters.push({
      enemies: spawnPack(template, tier, difficulty),
      tier: tier
    });
  }
  
  return {
    zone: zone,
    encounters: encounters,
    rewards: calculateRewards(encounters)
  };
}
```

---

## DATABASE SCHEMA

### Supabase Tables

```sql
-- Heroes
CREATE TABLE heroes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  experience INTEGER DEFAULT 0,
  atk INTEGER NOT NULL,
  def INTEGER NOT NULL,
  spd INTEGER NOT NULL,
  will INTEGER NOT NULL,
  current_hp INTEGER NOT NULL,
  max_hp INTEGER NOT NULL,
  is_dead BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  died_at TIMESTAMPTZ
);

-- Items
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  hero_id UUID REFERENCES heroes(id),  -- NULL if in stash
  name TEXT NOT NULL,
  slot TEXT NOT NULL,
  drop_level INTEGER NOT NULL,
  current_level INTEGER NOT NULL,
  hunger DECIMAL(3,2) NOT NULL,
  hunger_label TEXT NOT NULL,
  max_prefixes INTEGER NOT NULL,
  max_suffixes INTEGER NOT NULL,
  craft_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Item Affixes
CREATE TABLE item_affixes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  affix_type TEXT NOT NULL,  -- 'prefix' or 'suffix'
  affix_id TEXT NOT NULL,
  stat TEXT NOT NULL,
  value INTEGER NOT NULL,
  slot_index INTEGER NOT NULL
);

-- Enemy Templates (read-only reference)
CREATE TABLE enemy_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  family TEXT NOT NULL,
  hunger_access TEXT NOT NULL,
  atk DECIMAL(3,2) NOT NULL,
  def DECIMAL(3,2) NOT NULL,
  spd DECIMAL(3,2) NOT NULL,
  will DECIMAL(3,2) NOT NULL,
  archetype TEXT NOT NULL
);

-- User Souls (currency)
CREATE TABLE user_souls (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  amount INTEGER DEFAULT 0
);

-- Quest Log
CREATE TABLE quest_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  hero_id UUID REFERENCES heroes(id),
  zone_id TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  result TEXT,  -- 'success', 'failure', 'death'
  souls_earned INTEGER DEFAULT 0,
  items_dropped JSONB DEFAULT '[]'
);
```

### Row Level Security

```sql
-- Heroes: Users can only see/modify their own
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;
CREATE POLICY heroes_user_policy ON heroes
  FOR ALL USING (auth.uid() = user_id);

-- Items: Users can only see/modify their own
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY items_user_policy ON items
  FOR ALL USING (auth.uid() = user_id);

-- User Souls: Users can only see/modify their own
ALTER TABLE user_souls ENABLE ROW LEVEL SECURITY;
CREATE POLICY souls_user_policy ON user_souls
  FOR ALL USING (auth.uid() = user_id);
```

---

## IMPLEMENTATION PHASES

### Phase 1: Core Foundation
**Priority: CRITICAL**

```
□ Hero CRUD (create, read, update, delete)
  - BST: 100 per level
  - HP: DEF + (Level × 40)
  - Stat distribution UI

□ Basic Combat Loop
  - Turn order by SPD
  - Damage formula with floor of 3
  - 10% heal between fights

□ Enemy Spawning
  - Load templates from bestiary
  - Apply tier multiplier at spawn
  - Zone determines tier range
```

### Phase 2: Soul Economy
**Priority: HIGH**

```
□ Soul Drops
  - Guaranteed drops per kill
  - Scale by enemy tier
  - Store in user_souls table

□ Soul Display
  - Show souls in UI
  - Track per-quest earnings
  - Running total visible
```

### Phase 3: Item Foundation
**Priority: HIGH**

```
□ Item Drops
  - Drop at hero level
  - Roll hunger value
  - Apply hunger label

□ Item Equipping
  - Level requirement check
  - Slot management (8 slots)
  - Stat application to hero

□ Stash System
  - Items not on hero
  - Survives hero death
```

### Phase 4: Affix System
**Priority: MEDIUM**

```
□ Affix Rolling
  - Scale with item level
  - Weighted distribution
  - Respect max prefix/suffix slots

□ Affix Application
  - Add stats to hero
  - Display on item tooltip

□ Voracious Special
  - 1.5x affix values
  - Limited to 2/2 slots
```

### Phase 5: Soul Crafting
**Priority: MEDIUM**

```
□ Slam Mechanic
  - Add random affix
  - Base cost 100 souls
  - Apply hunger modifier

□ Cost Escalation
  - Track craft count
  - 1.5x per previous craft

□ Item Level Adjustment
  - +3 / -3 range
  - 10 souls per level
  - Update equip requirements
```

### Phase 6: Permadeath
**Priority: HIGH**

```
□ Death Handling
  - Mark hero as dead
  - Delete equipped items
  - Preserve stash items

□ Quest Risk UI
  - Show gear value at risk
  - Confirm before dangerous quests
```

### Phase 7: Zone System
**Priority: MEDIUM**

```
□ Zone Definitions
  - Allowed families
  - Tier ranges
  - Level requirements

□ Quest Generation
  - Pull from zone config
  - Scale difficulty
  - Generate rewards

□ Zone Hazards
  - Fire damage
  - Reduced healing
  - Ambush mechanics
```

### Phase 8: Polish
**Priority: LOW**

```
□ Heirloom System (future)
□ Achievement Tracking
□ Leaderboards
□ Social Features
```

---

## SECURITY CONSIDERATIONS

### XSS Prevention

```javascript
// All user input must be sanitized
import DOMPurify from 'dompurify';

function sanitizeInput(input) {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],  // No HTML allowed
    ALLOWED_ATTR: []
  });
}

// Hero names, item names - all sanitized
const heroName = sanitizeInput(rawInput);
```

### SQL Injection Prevention

```javascript
// Always use parameterized queries via Supabase client
const { data, error } = await supabase
  .from('heroes')
  .select('*')
  .eq('user_id', userId);  // Parameterized

// NEVER concatenate user input into queries
```

### Rate Limiting

```javascript
// Cloudflare Worker rate limiting
const RATE_LIMITS = {
  CRAFT_ACTION: { max: 10, window: 60 },      // 10 crafts per minute
  QUEST_START: { max: 5, window: 60 },        // 5 quests per minute
  HERO_CREATE: { max: 3, window: 300 }        // 3 heroes per 5 minutes
};
```

---

## QUICK REFERENCE

### Key Formulas

```javascript
// Hero HP
hp = def + (level * 40)

// Hero BST
bst = level * 100

// Enemy BST
enemyBst = heroBst * tierMultiplier

// Damage
damage = max(3, attackStat - (defenseStat * 0.5)) * variance

// Affix Roll Range
min = itemLevel * 100 * 0.02
max = itemLevel * 100 * 0.08

// Craft Cost
cost = baseCost * (1.5 ^ craftCount) * hungerModifier
```

### Tier Multipliers

```
fodder_trash:     0.60x
fodder:           0.70x
fodder_exalted:   0.80x
standard_weak:    0.85x
standard:         0.90x
standard_exalted: 1.00x
elite:            1.20x
elite_exalted:    1.50x
boss:             2.00x
boss_legendary:   3.00x
```

### Soul Drops (Guaranteed)

```
fodder_trash:     1
fodder:           1-2
fodder_exalted:   2-3
standard_weak:    3-4
standard:         4-6
standard_exalted: 6-9
elite:            10-16
elite_exalted:    17-28
boss:             30-50
boss_legendary:   55-100
```

---

*Document ready for Claude Code implementation. Start with Phase 1.*

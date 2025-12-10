# Guild Master — Game Design Document
## Working Title | Version 1.0 | December 2024

---

# Table of Contents

1. [Vision & Pillars](#vision--pillars)
2. [Core Loop](#core-loop)
3. [Hero System](#hero-system)
4. [Stat System](#stat-system)
5. [Skill System](#skill-system)
6. [Combat Simulation](#combat-simulation)
7. [Gear System](#gear-system)
8. [Quest System](#quest-system)
9. [Peek System & Passive Storytelling](#peek-system--passive-storytelling)
10. [Death & Inheritance](#death--inheritance)
11. [Soul System](#soul-system)
12. [PvP & Inscriptions](#pvp--inscriptions)
13. [Worker & Infrastructure System](#worker--infrastructure-system)
14. [Economy & Market](#economy--market)
15. [Alignment System](#alignment-system)
16. [World & Setting](#world--setting)
17. [Technical Architecture](#technical-architecture)
18. [Monetization](#monetization)
19. [Platform Strategy](#platform-strategy)
20. [MVP Roadmap](#mvp-roadmap)
21. [Open Questions](#open-questions)

---

# Vision & Pillars

## The Elevator Pitch

"Path of Exile builds without the carpal tunnel. Settlers of Kalguur as its own game. The guild management game that Valthirian Arc 2, Ninja Warz, and AC Brotherhood's assassin system always should have become."

## Core Fantasy

You are the Guild Master. You never touch the battlefield. You recruit, train, gear, and deploy heroes. You watch them succeed or die. You build legacy through items that carry the souls of the fallen. You run an operation.

## Design Pillars

### 1. Operations Over Execution
The player makes strategic setup decisions. The game executes. No twitch reflexes. No click-per-second optimization. Smart decisions win.

### 2. Meaningful Time Away
Timers tick while you're offline. Come back to results, not demands. Respects the player's real life while rewarding engagement.

### 3. Real Simulation
Combat isn't fake theater. A full sim runs under the hood. Gear matters. Stats matter. Build decisions are tested and proven (or punished).

### 4. Earned Attachment
Heroes aren't disposable numbers. You watch them grow, succeed, and eventually retire or die. Loss means something. Legacy rewards patience.

### 5. Social Through Consequence
PvP inscribes names on weapons. Kills create history. Rivalries emerge from mechanics, not chat. The game creates stories players share.

## Inspirations

| Game | What It Contributed |
|------|---------------------|
| Valthirian Arc 2 | Academy management, send students on quests |
| Ninja Warz | Squad auto-battle, async PvP snapshots |
| AC Brotherhood | Recruit assassins, send on contracts, watch them level |
| FarmVille | Hire other players, passive production |
| FATE (WildTangent) | Inheritance system, heirloom items, descendants |
| Path of Exile | Build depth, stat complexity, crafting orbs |
| PoE: Settlers of Kalguur | Worker assignment, passive economy, town management |
| Pokemon Mystery Dungeon | Grid tactics, creature recruitment, emotional narrative |
| Fable | Good/Evil alignment visible on character |
| Darkest Dungeon | Roster management, permadeath stakes |

---

# Core Loop

## Primary Loop (Minutes)

```
Recruit Hero → Gear Hero → Send on Quest → Wait/Peek → Results → Loot/XP → Repeat
```

## Secondary Loop (Hours)

```
Level Heroes → Allocate Skill Points → Tackle Harder Content → Better Loot → Stronger Heroes
```

## Tertiary Loop (Days/Weeks)

```
Build Legacy Items → Retire Heroes → Inheritance → New Generation → Compound Power
```

## Meta Loop (Ongoing)

```
PvP Rankings → Inscriptions → Guild Reputation → Market Trading → Community Status
```

## Session Types

| Duration | Activity |
|----------|----------|
| 2 minutes | Peek quests, collect results, send next wave |
| 10 minutes | Gear optimization, skill point allocation, market browsing |
| 30+ minutes | Deep theorycrafting, PvP sessions, infrastructure planning |

---

# Hero System

## Recruitment

Heroes appear at the guild seeking employment. The player evaluates and decides to hire or pass.

### Recruit Generation

- Name: Procedurally generated or from curated list
- Portrait: Selected from pool (later: player customization)
- Skills: 3 randomly rolled from weighted pool
- Cost: Base gold cost (scales with skill rarity?)

### The Recruit Card

```
┌─────────────────────────────┐
│  [Portrait]                 │
│  "Kira"                     │
│  ───────────────────────    │
│  ⚔️ Cleave            1/5   │
│  🛡️ Second Wind      1/5   │
│  💀 Execute           1/5   │
│                             │
│  [Hire - 500g]  [Pass]      │
└─────────────────────────────┘
```

### Recruitment Questions (TBD)

- How do recruits appear? Timed spawns? Gold cost to "scout"?
- Limited recruit slots visible at once?
- Can you pay to refresh the recruit pool?
- Do recruits leave if ignored too long?

## Hero Progression

### What Heroes Gain

| Source | Reward |
|--------|--------|
| Quests | XP, Loot |
| Leveling | Skill Points |
| Gear | All Attributes |
| Food | Temporary/Permanent Buffs |

### What Heroes Don't Have Innately

- No base stats (all from gear)
- No class restrictions (skills define role)
- No level cap (TBD)

## Hero States

| State | Description |
|-------|-------------|
| Available | Ready for assignment |
| On Quest | Currently deployed |
| Injured | Returned hurt, needs recovery time |
| Retired | Living peaceful life, can be recalled (dark) |
| Dead | Permadeath, gone forever |

---

# Stat System

## The Four Attributes

Derived from custom TTRPG system. All stats come from gear and food — heroes have no base stats.

| Stat | Abbreviation | Offensive Role | Defensive Role |
|------|--------------|----------------|----------------|
| Physical Attack | ATK | Physical damage scaling | — |
| Defense | DEF | — | Resists physical (full rate) |
| Speed | SPD | Turn order, some skill scaling | Dodge chance? |
| Willpower | WILL | Magic damage, summon stats | Resists magic (half rate) |

## Stat Details

### Physical Attack (ATK)
- Primary scaling stat for physical skills
- Weapon damage formula uses ATK% of total BST
- Pure offensive stat

### Defense (DEF)
- Reduces incoming physical damage (full effectiveness)
- Some skills scale with DEF (e.g., Holy Smite, Retaliate)
- Tank fantasy enabler

### Speed (SPD)
- Determines turn order in combat
- May affect dodge chance
- Some skills scale with SPD (e.g., fast mage builds)
- Fewer rounds = less damage taken (indirect defense)

### Willpower (WILL)
- Magic damage scaling
- Magic resistance (half effectiveness compared to DEF vs physical)
- Summon count limit
- Summon stat scaling
- Triple-duty stat for mage/summoner builds

## Base Stat Total (BST)

BST = ATK + DEF + SPD + WILL (total from all gear)

BST matters for percentage-based scaling calculations.

## Build Archetypes (Emergent)

| Build | Primary Stats | Identity |
|-------|---------------|----------|
| Bruiser | ATK + DEF | Slow, tanky, consistent damage |
| Assassin | ATK + SPD | Fast, squishy, kills before being killed |
| Glass Cannon | Pure ATK | Maximum damage, paper thin |
| Mage | WILL | Magic nukes, fragile to magic |
| Summoner | Deep WILL | Army builder, stat-hungry |
| Paladin | DEF + WILL | Survives everything, hybrid damage |
| Tank | Pure DEF | Unkillable, hits like wet noodle (unless skills scale DEF) |

---

# Skill System

## Skill Acquisition

Heroes are born with skills. You cannot teach new skills — only improve what they have.

### The Roll

- Each recruit rolls 3 skills from weighted pool
- Skills are drawn independently
- Duplicates combine (see below)

### Skill Rarity Weights

| Tier | Weight | Examples |
|------|--------|----------|
| Common | 60% | Strike, Block, Bash |
| Uncommon | 30% | Cleave, Leech, Second Wind |
| Rare | 9% | Frenzy, Mana Shield, Thorns |
| Legendary | 1% | Undying, Soul Harvest, Ascension |

## Duplicate Merging

When the same skill is rolled multiple times, they merge into an enhanced version.

### Double Roll (A, A, B)

```
⚔️ Cleave      →    ⚔️⚔️ Cleave²
⚔️ Cleave            
🛡️ Second Wind      🛡️ Second Wind
```

- Cleave² has max rank 10 instead of 5
- Double scaling ceiling
- Specialist hero

### Triple Roll (A, A, A)

```
⚔️ Cleave      →    ⚔️⚔️⚔️ Cleave³
⚔️ Cleave            
⚔️ Cleave            
```

- Cleave³ has max rank 15
- Single skill, tripled power
- Unicorn territory

### The Animation

When recruit is viewed:
1. Three skill icons appear
2. Player recognizes duplicates
3. Icons slide toward center (CSS transition)
4. Merge with glow/pulse effect
5. Enhanced skill revealed

Triple merges get bigger animation, screen shake, celebration.

### Duplicate Rarity Math

| Roll | Probability | Rarity |
|------|-------------|--------|
| Common double | ~10.8% | Regular occurrence |
| Common triple | ~0.216% | Exciting |
| Legendary double | 0.0003% | Server event |
| Legendary triple | 0.000001% | Shrine-worthy |

## Skill Points

### Acquisition
- Gained on level up (1 per level?)
- Allocated by player
- Cannot be respec'd (TBD — respec cost?)

### Spending
- Each skill has ranks 1-5 (base), 1-10 (doubled), 1-15 (tripled)
- Higher ranks = stronger effect
- Player chooses where to invest

### Strategic Choices

- Max one skill early for power spike?
- Spread evenly for consistency?
- Ignore weak skill, focus on synergy?
- Save points for later optimization?

## Skill Categories

### By Targeting

| Type | Targets | Value Proposition |
|------|---------|-------------------|
| Single Target | 1 enemy | Default, reliable |
| Cleave | 2-3 enemies | Faster clears, less damage taken |
| AoE | All enemies | Rare, build-defining |
| Self | Caster | Buffs, heals |
| Summon | Creates ally | Action economy |

### By Scaling Type

| Type | Damage Source | Example |
|------|---------------|---------|
| Weapon-based | Weapon Base × ATK% | Cleave, Strike |
| Stat-based | Formula using multiple stats | Holy Smite |
| Flat | Fixed value + scaling | Shield Bash |
| Percent | % of target HP | Execute |

## Skill Examples

### Weapon-Scaling Skills

```
CLEAVE
Type: Physical, AoE (2-3 targets)
Damage: Weapon Base × ATK%
Rank Bonus: +10% damage per rank
Scales: ATK (highest)
```

```
STRIKE
Type: Physical, Single Target
Damage: Weapon Base × ATK%
Rank Bonus: +5% damage, +2% crit per rank
Scales: ATK (highest)
```

### Stat-Scaling Skills

```
HOLY SMITE
Type: Magic, Single Target
Damage: (ATK × 0.30) + (WILL × 0.30) + (DEF × 0.40)
Rank Bonus: +8% damage per rank
Scales: ATK, WILL, DEF (highest)
Notes: Tanks can deal damage. Paladin skill.
```

```
SOUL REND
Type: Magic, Single Target
Damage: WILL × 0.90
Rank Bonus: +12% damage per rank
Scales: WILL only
Notes: Pure mage skill. Ignores weapon entirely.
```

```
RETALIATE
Type: Physical, Counter
Damage: DEF × 0.50 (triggers when hit)
Rank Bonus: +10% damage, +5% proc chance per rank
Scales: DEF (highest)
Notes: Tank damage fantasy. Your armor IS your weapon.
```

```
METEOR
Type: Magic, AoE
Damage: (WILL × 0.70) + (SPD × 0.30)
Rank Bonus: +15% damage per rank
Scales: WILL (highest), SPD
Notes: Fast mages hit harder. Hidden SPD scaling.
```

### Defensive/Utility Skills

```
SECOND WIND
Type: Self, Heal
Effect: Heal 20% max HP when dropping below 30%
Rank Bonus: +5% heal, +5% threshold per rank
Cooldown: Once per combat
```

```
TAUNT
Type: Utility, Single Target
Effect: Force enemy to attack caster for X rounds
Rank Bonus: +1 round duration per rank
Scales: — (utility)
```

```
THORNS
Type: Passive, Counter
Effect: Reflect 10% of damage taken
Rank Bonus: +5% reflect per rank
Scales: — (flat percentage)
```

```
LEECH
Type: Passive, Sustain
Effect: Heal for 5% of damage dealt
Rank Bonus: +2% per rank
Scales: — (percentage of output)
```

```
FRENZY
Type: Passive, Buff
Effect: Attack speed increases as HP drops
Rank Bonus: Steeper scaling curve per rank
Scales: — (conditional)
```

```
MANA SHIELD
Type: Passive, Defense
Effect: Absorb damage using mana pool
Rank Bonus: Better conversion rate per rank
Scales: WILL (mana pool size)
```

### Summon Skills

```
RAISE DEAD
Type: Summon, Magic
Effect: Summon skeleton ally
Summon Stats: Based on caster's WILL
Summon Count: Limited by WILL
Rank Bonus: +10% summon stats per rank
```

## Skill Display (In-Game)

Show scaling stats. Hide exact ratios. Let community discover.

```
┌─────────────────────────────┐
│  HOLY SMITE                 │
│  "Calls divine light upon   │
│   the wicked."              │
│                             │
│  Scales: ATK, WILL,         │
│          DEF (highest)      │
│  Type: Magic                │
│  Target: Single             │
│                             │
│  Rank: 3/5                  │
│  [Upgrade - 1 SP]           │
└─────────────────────────────┘
```

---

# Combat Simulation

## Philosophy

Combat is a real simulation running under the hood — not fake timers with predetermined outcomes. Gear and builds are genuinely tested.

## Combat Flow

### Pre-Combat
1. Quest is accepted
2. Hero stats calculated (gear + food buffs)
3. Quest encounters loaded (rooms, mob packs)
4. Timeline generated (when each encounter occurs)

### Combat Resolution

For each encounter:
1. Determine turn order (SPD)
2. Execute turns:
   - Attacker selects target (AI logic)
   - Skill/attack chosen
   - Damage calculated
   - Defensive mitigation applied
   - HP updated
   - Status effects processed
3. Check win/loss conditions
4. Repeat until encounter resolved
5. Loot generated
6. Move to next encounter or complete quest

### Targeting Default

**Single target is the baseline.** No cleaving through screens like PoE.

| Skill | Targets | Notes |
|-------|---------|-------|
| Strike | 1 | Default attack |
| Cleave | 2-3 | Must have skill |
| Whirlwind | All | Rare, build-defining |

This makes AoE skills genuinely valuable.

### Turn Order

Based on SPD stat. Higher SPD acts first.

- Ties broken by: Hero advantage? Random?
- Multiple enemies: Each has own turn
- Speed buffs/debuffs shift turn order mid-combat?

### Damage Formula

#### Weapon-Based Damage

```
ATK% = Hero ATK / Hero BST

Raw Damage = Weapon Base Damage × ATK%

Example:
- Weapon Base: 100
- Hero BST: 200
- Hero ATK: 80
- ATK% = 80/200 = 40%
- Raw Damage = 100 × 0.40 = 40
```

#### Stat-Based Damage (Skills)

```
Holy Smite Damage = (ATK × 0.30) + (WILL × 0.30) + (DEF × 0.40)

Example:
- ATK: 50, WILL: 40, DEF: 80
- Damage = (50 × 0.30) + (40 × 0.30) + (80 × 0.40)
- Damage = 15 + 12 + 32 = 59
```

#### Defense Mitigation

Option A — Flat Reduction:
```
Final Damage = Raw Damage - (DEF × modifier)
Minimum: 1
```

Option B — Percentage Reduction:
```
Final Damage = Raw Damage × (100 / (100 + Enemy DEF))
```

Option C — Hybrid:
```
Flat reduction up to cap, then percentage for remainder
```

TBD: Choose mitigation formula.

### Magic vs Physical

| Damage Type | Resisted By | Effectiveness |
|-------------|-------------|---------------|
| Physical | DEF | Full (100%) |
| Magic | WILL | Half (50%) |

This makes mages:
- Strong against low-WILL tanks
- Vulnerable to other mages
- Require different gearing strategy

### AoE Value Calculation

```
Room: 3x Goblin (100 HP each, 10 ATK each)

SINGLE TARGET HERO:
- Round 1: Kill Goblin 1, take 3 hits (30 damage)
- Round 2: Kill Goblin 2, take 2 hits (20 damage)
- Round 3: Kill Goblin 3, take 1 hit (10 damage)
- Total: 60 damage taken

CLEAVE HERO:
- Round 1: Hit all 3 for 50 damage each
- Round 2: Kill all 3
- Total: 20 damage taken
```

AoE isn't just speed — it's survival.

### Death

When Hero HP reaches 0:
- **In easy quest**: Retreat? Injury? (TBD)
- **In hard quest**: Permadeath
- All equipped items lost
- Hero removed from roster permanently

---

# Gear System

## Philosophy

All attributes come from gear. Heroes are skill vessels — gear defines stats.

## Gear Slots

| Slot | Primary Stats (typical) |
|------|-------------------------|
| Weapon | ATK, damage base |
| Helmet | DEF, WILL |
| Chest | DEF, HP |
| Gloves | ATK, SPD |
| Boots | SPD, DEF |
| Amulet | Any (flex slot) |
| Ring 1 | Any (flex slot) |
| Ring 2 | Any (flex slot) |

Note: Any slot can roll any stat. Above are just tendencies.

## Weapon Special Rules

Weapons have a Base Damage value used in weapon-scaling formulas.

```
Iron Sword
Base Damage: 50
+5 ATK
+2 SPD
```

The +ATK contributes to ATK%, which then scales the Base Damage.

## Gear Rarity

| Rarity | Affixes | Drop Rate |
|--------|---------|-----------|
| Common (White) | 0 | Frequent |
| Magic (Blue) | 1-2 | Moderate |
| Rare (Yellow) | 3-4 | Uncommon |
| Unique (Orange) | Fixed special | Very rare |
| Heirloom (Gold) | Inherited + history | Player-created |

## Affixes

Gear can have prefixes and suffixes.

### Prefix Examples

| Prefix | Effect |
|--------|--------|
| Heavy | +ATK |
| Fortified | +DEF |
| Swift | +SPD |
| Wise | +WILL |
| Brutal | +Crit Chance |
| Vampiric | +Leech |

### Suffix Examples

| Suffix | Effect |
|--------|--------|
| of Power | +ATK |
| of the Wall | +DEF |
| of Haste | +SPD |
| of the Mind | +WILL |
| of Slaughter | +Damage vs X mob type |
| of Thorns | Reflect damage |

## Crafting (Soul Remnants)

Path of Exile-style orb crafting using monster souls.

### Soul Remnant Types

| Remnant | Source | Effect |
|---------|--------|--------|
| Wolf Soul | Common drop | Reroll one suffix |
| Bear Soul | Uncommon drop | Reroll one prefix |
| Wyvern Soul | Rare drop | Add random mod |
| Dragon Soul | Very rare drop | Reroll ALL mods (chaos) |
| Lich Soul | Boss drop | Lock one mod, reroll rest |
| Titan Soul | Raid/Event | Add mod slot to item |

### The Crafting Gamble

```
Your sword: +10 ATK, +5 Crit
You want: +SPD

Use Wyvern Soul (add random mod)
Result: +3 Fishing Skill
Pain.
```

### Player Soul Harvesting

Souls can drop from PvP kills. Small chance to harvest remnant from slain enemy hero.

"This blade contains the soul of Marcus from [IronWolves]"

---

# Quest System

## Two Content Types

### Overworld Quests

Real places in the game world. Thematically consistent enemies.

| Location | Enemy Types | Difficulty |
|----------|-------------|------------|
| Goblin Warren | Goblins, Goblin Brutes | Easy |
| Wolf Den | Wolves, Alpha Wolf | Easy |
| Bandit Camp | Bandits, Bandit Chief | Medium |
| Abandoned Mine | Undead, Cave Spiders | Medium |
| Cursed Forest | Wraiths, Treants | Hard |
| Dragon's Hollow | Drakes, Dragon | Very Hard |

### Rifts / Portals (Endgame)

Tears in reality. Anything can be inside. High risk, high reward.

- Require special keys or resources to open
- Not thematically bound (dragons next to goblins = fine)
- Best loot, rare seeds, boss remnants
- Where legends are made or die

## Quest Structure

Quests are sequences of encounters with a timer.

### Example: Easy Quest

```
GOBLIN WARREN
Difficulty: Easy
Duration: 4 minutes

Encounters:
├─ Room 1: 3x Goblin (white)
├─ Room 2: 3x Goblin (white)
├─ Room 3: 3x Goblin (white)
└─ Room 4: 1x Goblin Brute (rare)

Rewards: 50-100g, Common gear, Basic materials
```

### Example: Hard Quest

```
DRAGON'S HOLLOW
Difficulty: Hard
Duration: 22 minutes

Encounters:
├─ Rooms 1-3: Magic packs (drakes)
├─ Rooms 4-6: Magic packs (fire elementals)
├─ Room 7: Rare pack (elite drakes)
├─ Room 8: Rare pack (all rares)
├─ Room 9: Mini-boss (Elder Drake)
└─ Room 10: Boss (Ancient Dragon)

Rewards: 500-1000g, Rare+ gear, Dragon Soul, Rare seed chance
```

## Mob Tiers

| Tier | Name | Stats | Notes |
|------|------|-------|-------|
| White | Normal | Base | Fodder |
| Magic | Enhanced | +50% stats | Dangerous in packs |
| Rare | Elite | +100% stats, special ability | Real threat |
| Boss | Boss | +200% stats, multiple abilities | Quest capstone |

## Quest Selection

Players see quest board with available quests. Choose based on:
- Hero strength
- Desired rewards
- Risk tolerance

Quests refresh? Limited daily? Always available? (TBD)

---

# Peek System & Passive Storytelling

## The Vision

The game is alive even when you're not actively playing. Heroes on quests generate visible events.

## Main View (Passive)

Hero cards show:
- Portrait
- Name
- Time remaining
- Quest name
- Flying icons for events

```
┌─────────────────────────┐
│  [Portrait]             │  +🗡️ (flew off - found gear)
│   "Kira"                │      
│   ████████░░ 15:40      │  +💰 (flew off - found gold)
│   Cave of Echoes        │
└─────────────────────────┘
```

You glance, see activity, know she's progressing.

## Peek View (Hover/Click)

Expand card to see current state.

```
┌─────────────────────────────────────┐
│  [Kira fighting a cave troll]       │
│                                     │
│  "Kira encounters a Cave Troll"     │
│  HP: ██████░░░░  Troll: ████░░░░    │
│                                     │
│  Room 4/6                           │
└─────────────────────────────────────┘
```

## State-Based Dioramas

The peek shows a snapshot based on quest progress and current encounter.

### Timeline Example

Quest: 20 minutes total

| Time Remaining | State | Peek Shows |
|----------------|-------|------------|
| 20:00 | Departing | Hero walking away from guild |
| 17:00 | Traveling | Hero in forest, walking |
| 15:00 | Combat | Hero fighting wolves |
| 12:00 | Looting | Hero opening chest |
| 8:00 | Trap | Hero hurt, avoiding spikes |
| 5:00 | Boss | Hero facing dragon |
| 1:00 | Returning | Hero walking back, treasure in hand |

## Event System

Events are predetermined at quest start but revealed over time.

### Event Types

| Event | Icon | Effect |
|-------|------|--------|
| Combat Start | ⚔️ | Encounter began |
| Enemy Defeated | 💀 | Killed a mob |
| Loot Found | 🗡️/🛡️/💍 | Gear dropped |
| Gold Found | 💰 | Currency dropped |
| Damage Taken | ❤️‍🩹 | Hero hurt |
| Critical Hit | ⚡ | Big damage dealt |
| Rare Drop | ✨ | Special item |
| Trap Triggered | ⚠️ | Environmental hazard |
| Boss Engaged | 🐉 | Major fight started |

### Flying Icon Animation

```css
.event-icon {
  animation: flyoff 1s ease-out forwards;
}

@keyframes flyoff {
  0% { transform: translate(0, 0); opacity: 1; }
  100% { transform: translate(50px, -50px); opacity: 0; }
}
```

## Emotional Stakes

The peek system creates tension:
- Hover at 10:00 remaining: Hero at full HP, feeling good
- Hover at 3:00 remaining: Hero at 15% HP fighting dragon
- The gear they're wearing has 4 generations of inheritance
- Your stomach drops

You sent them there. You geared them. You're watching them potentially die.

---

# Death & Inheritance

## Permadeath

**Death is permanent and total.**

When a hero dies:
- Hero removed from roster forever
- ALL equipped gear is lost
- ALL carried loot is lost
- Heirloom items are destroyed
- Inscriptions are destroyed
- Legacy is ended

### The Weight

That 6th generation blade with 47 inscriptions? Dragon crits. All gone.

This makes:
- Retirement meaningful
- Risk assessment real
- Gear decisions consequential
- Every quest past a certain point is gambling with history

## Retirement

**Retirement is the only safe path to legacy.**

### How Retirement Works

1. Hero must meet requirements (level threshold? quest count? TBD)
2. Player chooses to retire
3. Hero leaves the guild
4. Player selects ONE item to inherit
5. Item gains +25% to all magical properties
6. Item becomes Heirloom, named after hero
7. Hero enters "Retired" state

### Retired Life (Peek Panel)

Retired heroes get a side panel. You can peek:
- They got married
- They have a dog
- They're fishing
- They're playing with grandchildren

Wholesome. Peaceful. They made it.

### The Dark Choice

After an aging timer... a notification appears.

"Marcus is ready to return."

You can call them back. They come willingly. They know what it means.

They power the item with their soul. (See Soul System)

## Inheritance Math

| Generation | Bonus | Cumulative |
|------------|-------|------------|
| 1st | +25% | +25% |
| 2nd | +25% | +56% |
| 3rd | +25% | +95% |
| 4th | +25% | +144% |
| 5th | +25% | +205% |

A 5th generation heirloom is TRIPLE the power of the original.

### Heirloom Display

```
┌─────────────────────────────────┐
│  KIRA'S BLADE                   │
│  4th Generation Heirloom        │
│  ───────────────────────────    │
│  Base Damage: 100               │
│  +ATK: 40 (was 10, ×4 gens)     │
│  +Crit: 20% (was 5%)            │
│                                 │
│  Lineage:                       │
│  Marcus → Elena → Theron → Kira │
│                                 │
│  Inscriptions: 12               │
│  "Slew Drakon of [IronWolves]"  │
│  "Slew 11 unnamed"              │
└─────────────────────────────────┘
```

## Strategic Decisions

| Scenario | Choice |
|----------|--------|
| Hero geared, quest easy | Keep pushing, more XP |
| Hero geared, quest risky | Retire? Or risk for better drops? |
| Heirloom equipped | Extra caution, or send B-team |
| No heirloom to lose | Naked rookie dragon fodder scout |

---

# Soul System

## Soul Remnants (Crafting Currency)

Monsters drop soul remnants. Used for gear crafting.

### Acquisition

- Drop from killed monsters
- Rarer monsters = rarer souls
- PvP kills have small chance to drop player's soul
- Boss kills guarantee soul drop

### Types and Uses

| Remnant | Source | Use |
|---------|--------|-----|
| Wolf Soul | Wolves | Reroll suffix |
| Bear Soul | Bears | Reroll prefix |
| Goblin Soul | Goblins | Minor stat tweak |
| Wyvern Soul | Wyverns | Add random mod |
| Dragon Soul | Dragons | Chaos reroll all |
| Lich Soul | Liches | Lock one, reroll rest |
| Titan Soul | Raid bosses | Add mod slot |
| Hero Soul | Retired hero | Power heirloom |
| Player Soul | PvP kill | Unknown dark use? |

## Soul Powering (Dark Inheritance)

The dark path to power.

### The Process

1. Hero retires normally
2. Player watches them live peaceful life (peek panel)
3. Aging timer progresses
4. Notification: "Marcus is ready to return"
5. Player can choose to call them back
6. Hero returns, old and grey
7. They sacrifice themselves to the heirloom item
8. Item gains +25% AND is "Souled"
9. Hero is gone forever (not just retired — consumed)

### Souled Items

```
MARCUS'S BLADE, SOULED
4th Generation Heirloom
Powered by: Marcus
───────────────────────
+ATK: 50 (inheritance + soul bonus)
"He chose to return."
```

### The Weight

You watched Marcus play with his dog. You saw him happy. You could have left him alone.

But you needed the stats.

### Good Path Alternative

Choose NOT to call them back:
- They die peacefully of old age
- No soul bonus
- Item remains "clean"
- Your alignment stays pure

---

# PvP & Inscriptions

## Async PvP

PvP uses squad snapshots. No real-time combat.

### How It Works

1. Player A's squad is "photographed" (stats, gear, skills)
2. Player B challenges the snapshot
3. Combat sim runs
4. Results displayed
5. Player A doesn't need to be online

### Squad Composition

- How many heroes per squad? 3? 5? (TBD)
- Any hero, or dedicated PvP roster?
- Gear swapping before photo?

## Inscriptions

When you critically kill an enemy hero in PvP, their name is inscribed on your weapon.

### The Inscription

```
KIRA'S BLADE
...
Blood Inscriptions:
- "Slew Drakon of [IronWolves]"
- "Slew Marcus of [ShadowGuild]"
- "Slew Nyx of [Bloodmoon]"
- "Slew 12 unnamed"
```

### Inscription Bonuses

Each inscription adds a small stat bonus.

| Inscriptions | Bonus |
|--------------|-------|
| 1-5 | +1 ATK per |
| 6-10 | +0.5 ATK per |
| 11+ | +0.25 ATK per |

Diminishing returns but always valuable.

### Social Layer

- Names visible on weapon page
- Guild names create rivalries
- "That sword has three of our members on it"
- Revenge becomes a goal
- Weapon URLs are shareable (see below)

## Weapon Pages

Every weapon has a public URL.

```
guild-master.gg/weapon/kiras-blade-4th

KIRA'S BLADE, 4th Generation
Forged by: [Deuce222x]
Inheritance: +144%
Inscriptions: 47

Recent Blood:
- Slew Nyx of [Bloodmoon] — 2 hours ago
- Slew Fang of [IronWolves] — 1 day ago

[View Full History]
```

### Marketing Through Salt

Someone loses PvP. Gets notification:
"Your hero was slain by [Deuce222x]. Their weapon now bears your name."

Link included. They click. They see. They sign up for revenge.

The game markets itself through salt.

---

# Worker & Infrastructure System

## Philosophy

Separate from hero system. Workers are anonymous labor. You invest in buildings, not people.

## Worker Basics

| Aspect | Heroes | Workers |
|--------|--------|---------|
| Identity | Named, unique | Anonymous pool |
| Stats | From gear | From building upgrades |
| Progression | Skill points | Building spec tree |
| Loss | Permadeath | Can't die |
| Attachment | Personal | Operational |

## Buildings

### Farm

```
FARM — Level 2
Workers: 3/3
Output: 8 wheat/hr

Spec Tree:
├─ Plots: More simultaneous crops
├─ Genetics: Better crop variants  
├─ Soil: Yield multiplier
└─ Storage: Buffer before spoilage

[Assign Worker - 50g/day]
[Upgrade Plots - 500g]
```

### Fishing Dock

```
FISHING DOCK — Level 3
Workers: 2/4
Output: 12 fish/hr

Spec Tree:
├─ Capacity: More worker slots
├─ Quality: Rare fish chance
├─ Speed: Faster cycles
└─ Automation: Passive offline output?

[Assign Worker - 75g/day]
[Upgrade Quality - 750g]
```

### Other Buildings

| Building | Output | Purpose |
|----------|--------|---------|
| Farm | Wheat, vegetables | Food ingredients |
| Ranch | Meat, leather | Food, crafting |
| Fishing Dock | Fish | Food |
| Mine | Ore | Crafting materials |
| Lumber Mill | Wood | Building materials |
| Blacksmith | Gear | Equipment crafting |
| Alchemy Lab | Potions | Consumables |
| Shipyard | Boats | Unlock sea quests |

## Worker Costs

- Hire cost: One-time gold
- Upkeep: Daily gold drain
- Idle workers: No upkeep but no output

## Building Spec Trees

Each building has a unique tree. Points come from... building levels? Gold? (TBD)

### Farm Spec Tree (Detailed)

```
FARM SPEC TREE

PLOTS (increase crop slots)
├─ Tier 1: +1 plot (100g)
├─ Tier 2: +2 plots (300g)
├─ Tier 3: +3 plots (900g)
└─ Tier 4: +5 plots (2700g)

GENETICS (crop quality)
├─ Tier 1: 5% quality boost (150g)
├─ Tier 2: 10% quality boost (450g)
├─ Tier 3: Rare crop variants unlocked (1350g)
└─ Tier 4: Hybrid crops possible (4050g)

SOIL (yield multiplier)
├─ Tier 1: +10% yield (200g)
├─ Tier 2: +20% yield (600g)
├─ Tier 3: +30% yield (1800g)
└─ Tier 4: +50% yield (5400g)

STORAGE (spoilage prevention)
├─ Tier 1: 24hr buffer (100g)
├─ Tier 2: 48hr buffer (300g)
├─ Tier 3: 72hr buffer (900g)
└─ Tier 4: No spoilage (2700g)
```

## Economy Loop

```
Gold → Hire Workers → Assign to Buildings → Output
                                              ↓
                                    Materials → Food/Gear
                                              ↓
                                    Heroes → Quests → Gold/Loot
```

Everything feeds everything.

---

# Economy & Market

## Currencies

| Currency | Source | Use |
|----------|--------|-----|
| Gold | Quests, sales | Everything |
| Soul Remnants | Monster kills | Crafting |
| Rare Seeds | Ultra-rare drops | Farming special crops |

## Async Market

Player-to-player trading without real-time interaction.

### Listing Items

1. Select item from inventory
2. Set price (gold)
3. List on market
4. Wait for buyer
5. Gold appears when sold

### Buying Items

1. Search/browse market
2. Find item
3. Pay gold
4. Item delivered immediately

### Market Creates

- Price discovery (player-driven values)
- Specialization (quest grinders vs farmers vs flippers)
- Rare item hunting
- Economy gameplay layer

## Rare Seeds Economy

Ultra-rare drops from quests. Deflationary by design.

### The Math

```
Pumpkin Seed Drop Rate: 0.0001%
Seed → Plant → 3 Pumpkins
Each Pumpkin: 5% chance to return seed
Expected return: 0.15 seeds per seed planted
```

Every generation, supply shrinks to ~15%.

### Permanent Buffs

| Crop | Effect |
|------|--------|
| Pumpkin | +1 Max HP (permanent) |
| Moonmelon | +1 Max MP (permanent) |
| Bloodroot | +1 ATK (permanent) |
| Starleaf | +1% to inheritance bonus |

### The Drama

Find a pumpkin seed. Do you:
1. Eat all 3 pumpkins (+3 HP), gamble on seed return
2. Sell 2, eat 1, hedge
3. Sell all 3 at peak hype
4. Hoard and pray market goes up

### Server-Wide Tracking

```
PUMPKIN ECONOMY

Seeds Found (all-time): 142
Pumpkins Grown: 426
Pumpkins Consumed: 419
Seeds Returned: 23
Current Circulation: ~7 seeds

Largest Holder: [Deuce222x] — 2 seeds
Most Consumed: [ShadowLord] — 31 pumpkins (+31 Max HP)
```

Scarcity everyone can see.

---

# Alignment System

## Good vs Evil (Fable-Style)

Your choices shape your guild's nature.

## Alignment Actions

| Action | Alignment Shift |
|--------|-----------------|
| Retire hero peacefully | +Good |
| Call retiree back for soul | +Evil |
| Decline dark quests | +Good |
| Accept dark quests | +Evil |
| Spare defeated PvP enemy | +Good? |
| Execute for inscription | +Evil? |

## Alignment States

| State | Range | Description |
|-------|-------|-------------|
| Pure | +100 to +50 | Beacon of hope |
| Good | +49 to +10 | Honorable guild |
| Neutral | +9 to -9 | Pragmatic |
| Corrupt | -10 to -49 | Dark reputation |
| Damned | -50 to -100 | Evil incarnate |

## Visual Progression

### Guild Hall

| Alignment | Appearance |
|-----------|------------|
| Pure | Glowing, flowers, bright stone |
| Good | Clean, well-maintained |
| Neutral | Standard |
| Corrupt | Darker stone, shadows creep in |
| Damned | Red glow, flies, decay |

### Guild Master Portrait

Your portrait changes. Features darken. Eyes glow. The corruption shows.

### Hero Dialogue

| Alignment | Recruit Dialogue |
|-----------|------------------|
| Pure | "It's an honor to serve!" |
| Good | "I've heard good things." |
| Neutral | "The pay's fair." |
| Corrupt | "I... need the work." |
| Damned | "Use me. I know what you are." |

### Retirement Peek Panels

| Alignment | Retiree Behavior |
|-----------|------------------|
| Pure | Happy, peaceful, no fear |
| Good | Content |
| Neutral | Normal life |
| Corrupt | Looking over shoulder, nervous |
| Damned | They know. They're waiting. |

## Mechanical Effects?

| Alignment | Bonus | Penalty |
|-----------|-------|---------|
| Pure | Better recruit quality | No souled items |
| Good | Recruit stat bonus | Weaker dark drops |
| Neutral | None | None |
| Corrupt | Stronger soul remnants | Recruit wariness |
| Damned | Maximum soul power | Recruit scarcity? |

TBD: How much should alignment affect gameplay vs. just flavor?

---

# World & Setting

## Core Aesthetic

**Medieval. No tech.**

## What Exists

- Swords, axes, bows, shields, staves
- Plate armor, chainmail, leather, robes
- Guilds, taverns, keeps, castles, farms
- Blacksmithing, alchemy, herbalism
- Horses, carts, sailing ships
- Magic (potions, enchantments, rifts, summons)
- Creatures: wolves, bears, goblins, orcs, undead, dragons, demons

## What Doesn't Exist

- Guns, cannons, explosives
- Steampunk, clockwork, gears
- Electricity, machinery
- Modern anything

## Tone

- Fable (whimsy + darkness)
- Dark Souls (weight, consequence)
- Classic D&D (adventure, monsters)
- Valthirian Arc (academy management)

## Lore Hooks (TBD)

### Option A: Rifts

Reality is cracked. Monsters bleed through. Guilds exist to clear rifts and seal them.

### Option B: The Veil

A parallel dimension where the dead go. Guilds raid the afterlife for resources. Soul system ties in directly.

### Option C: Shattered Lands

The world broke. Continents float in void. Portals are the only travel. Each region is isolated.

### Option D: Keep It Simple

The kingdom has monsters. Guilds kill monsters. That's it.

## UI Aesthetic

- Parchment textures
- Hand-drawn map feel
- Wax seals, ink, weathered edges
- Torchlit interfaces
- No glowing sci-fi elements

---

# Technical Architecture

## Stack

| Layer | Technology | Cost |
|-------|------------|------|
| Frontend | HTML/CSS/JS | Free |
| Hosting | Cloudflare Pages | $20/mo |
| Database | Supabase (Postgres) | Free → $25/mo |
| Auth | Supabase Auth | Included |
| Real-time | Supabase Subscriptions | Included |
| Storage | Supabase Storage | Included |

## Why This Stack

- **Cloudflare Pages**: Unlimited deploys, global CDN, fast iteration
- **Supabase**: Postgres + auth + real-time + storage in one. Already familiar from UCN.
- **HTML/CSS/JS**: Fast development, no build complexity, UI-heavy game

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│              (Cloudflare Pages)                  │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │  Auth UI │ │ Game UI  │ │ Market   │        │
│  └──────────┘ └──────────┘ └──────────┘        │
└─────────────────────────────────────────────────┘
                       │
                       │ API Calls
                       ▼
┌─────────────────────────────────────────────────┐
│                   SUPABASE                       │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │   Auth   │ │ Database │ │ Realtime │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                  │
│  ┌──────────┐ ┌──────────┐                      │
│  │ Storage  │ │ Edge Fn  │                      │
│  └──────────┘ └──────────┘                      │
└─────────────────────────────────────────────────┘
```

## Database Schema (Draft)

### Users
```sql
users (
  id UUID PRIMARY KEY,
  email TEXT,
  username TEXT UNIQUE,
  gold INTEGER DEFAULT 0,
  alignment INTEGER DEFAULT 0,
  created_at TIMESTAMP
)
```

### Heroes
```sql
heroes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  name TEXT,
  portrait_id INTEGER,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  skill_points INTEGER DEFAULT 0,
  state TEXT DEFAULT 'available', -- available, quest, injured, retired, dead
  retired_at TIMESTAMP,
  died_at TIMESTAMP,
  created_at TIMESTAMP
)
```

### Hero Skills
```sql
hero_skills (
  id UUID PRIMARY KEY,
  hero_id UUID REFERENCES heroes,
  skill_id TEXT,
  rank INTEGER DEFAULT 1,
  is_doubled BOOLEAN DEFAULT false,
  is_tripled BOOLEAN DEFAULT false
)
```

### Items
```sql
items (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  hero_id UUID REFERENCES heroes, -- null if in inventory
  slot TEXT, -- weapon, helmet, chest, etc.
  base_name TEXT,
  rarity TEXT,
  base_damage INTEGER, -- weapons only
  generation INTEGER DEFAULT 0, -- heirloom generations
  is_heirloom BOOLEAN DEFAULT false,
  heirloom_name TEXT,
  souled_by TEXT, -- hero name if soul-powered
  created_at TIMESTAMP
)
```

### Item Affixes
```sql
item_affixes (
  id UUID PRIMARY KEY,
  item_id UUID REFERENCES items,
  affix_type TEXT, -- prefix or suffix
  affix_name TEXT,
  stat TEXT,
  value INTEGER
)
```

### Inscriptions
```sql
inscriptions (
  id UUID PRIMARY KEY,
  item_id UUID REFERENCES items,
  victim_name TEXT,
  victim_guild TEXT,
  inscribed_at TIMESTAMP
)
```

### Quests
```sql
quests (
  id UUID PRIMARY KEY,
  hero_id UUID REFERENCES heroes,
  quest_template_id TEXT,
  started_at TIMESTAMP,
  ends_at TIMESTAMP,
  events JSONB, -- pre-generated timeline
  current_encounter INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' -- active, complete, failed
)
```

### Market Listings
```sql
market_listings (
  id UUID PRIMARY KEY,
  seller_id UUID REFERENCES users,
  item_id UUID REFERENCES items,
  price INTEGER,
  listed_at TIMESTAMP,
  sold_at TIMESTAMP,
  buyer_id UUID REFERENCES users
)
```

## Real-Time Features

Supabase subscriptions for:
- Quest completion notifications
- PvP results
- Market sales
- Guild activity feed

## Combat Sim Location

Options:
1. **Client-side**: JS calculates combat. Faster, but cheatable.
2. **Server-side**: Supabase Edge Function. Secure, authoritative.
3. **Hybrid**: Client displays, server validates on completion.

Recommendation: Server-side for competitive integrity. Edge functions can run the sim.

---

# Monetization

## Philosophy

**Cosmetics only. No pay-to-win.**

Nothing purchasable affects:
- Stats
- Drop rates
- Combat power
- Progression speed

## Cosmetic Categories

### Guild Hall Skins
- Different architectural styles
- Seasonal themes
- Animated elements

### Portrait Frames
- Borders for hero portraits
- Rarity indicators
- Achievement frames

### Effect Skins
- Custom death animations
- Skill visual effects
- Inscription glow colors

### UI Themes
- Parchment variants
- Color schemes
- Font styles

## Potential Pricing

| Item | Price |
|------|-------|
| Portrait Frame | $2-5 |
| Guild Hall Skin | $5-15 |
| Effect Pack | $5-10 |
| Battle Pass (seasonal) | $10 |

## Battle Pass?

Seasonal cosmetic track. Play to unlock tiers. Pay to unlock premium track.

- Free track: Basic cosmetics
- Premium track: Exclusive cosmetics

No gameplay advantages.

---

# Platform Strategy

## Phase 1: Web (Launch)

```
guild-master.gg (or chosen domain)
├─ HTML/CSS/JS
├─ Cloudflare Pages
├─ Supabase backend
└─ Responsive design (mobile browser works)
```

## Phase 2: PWA (Post-Launch)

Progressive Web App upgrade:
- Add manifest.json
- Add service worker
- "Add to Home Screen" capability
- App-like experience
- No app store needed

## Phase 3: Mobile Apps (When Demanded)

Using Capacitor:
- Wrap existing web app
- Submit to App Store / Play Store
- Push notifications
- Native feel
- Same codebase

## Phase 4: Steam (When Polished)

Using Electron:
- Wrap web app in desktop shell
- Steam achievements
- Steam overlay
- Steam community features
- $100 Steam Direct fee

## Cross-Platform Unity

All platforms share:
- Same servers
- Same accounts
- Same economy
- Same PvP pool

Web player kills Steam player → inscription happens → web player's weapon has Steam player's name.

---

# MVP Roadmap

## MVP Definition

**The minimum to prove the core loop is fun.**

## MVP Scope

### Include (Phase 1)

- [ ] One hero
- [ ] Basic recruitment (3 skills, no doubles yet)
- [ ] 4 stats from gear
- [ ] 5-10 skills implemented
- [ ] Combat sim (basic)
- [ ] 3 quest types (easy, medium, hard)
- [ ] Gear drops (common, magic, rare)
- [ ] Leveling + skill points
- [ ] Peek system (basic)
- [ ] Permadeath
- [ ] Basic UI

### Include (Phase 2)

- [ ] Skill doubling/tripling
- [ ] Full peek system with animations
- [ ] Flying event icons
- [ ] Retirement
- [ ] Inheritance (+25%)
- [ ] Heirloom items
- [ ] More quests
- [ ] More skills

### Include (Phase 3)

- [ ] Async PvP
- [ ] Inscriptions
- [ ] Soul remnants (basic crafting)
- [ ] Weapon pages (shareable URLs)
- [ ] Leaderboards

### Defer (Post-Core)

- [ ] Workers/farming
- [ ] Market
- [ ] Soul powering (dark inheritance)
- [ ] Alignment system
- [ ] Rifts (endgame)
- [ ] Rare seeds economy
- [ ] Building spec trees
- [ ] Cosmetics/monetization
- [ ] PWA/Mobile/Steam

## Success Metrics

MVP is successful when:
1. Combat sim produces believable results
2. Peek system creates emotional response
3. Gear decisions feel meaningful
4. Permadeath creates actual tension
5. Player wants "one more quest"

---

# Open Questions

## Gameplay

1. **Recruit spawning**: Timed? Gold cost to scout? Limited visible at once?
2. **Energy system**: Unlimited quests? Or gated?
3. **Session length target**: 5 min check-in or 30 min session?
4. **Hero level cap**: Exists? If so, what number?
5. **Defense formula**: Flat reduction? Percentage? Hybrid?
6. **Skill respec**: Allowed? Cost?
7. **Quest refresh**: Timed? Always available? Limited daily?
8. **PvP squad size**: 3? 5?
9. **Injury system**: Do heroes get injured on failed quests, or just die?
10. **Alignment mechanical effects**: Strong gameplay impact or mostly flavor?

## Economy

11. **Worker upkeep**: Daily gold drain fair?
12. **Market fees**: Tax on sales?
13. **Gold sinks**: What prevents inflation?
14. **Rare seed drop rates**: Current numbers feel right?

## Technical

15. **Combat sim location**: Client-side, server-side, or hybrid?
16. **Anti-cheat**: How much matters for competitive integrity?
17. **Offline progress**: How much happens when not playing?

## Content

18. **Number of skills at launch**: 20? 50? 100?
19. **Number of quest locations**: Start small, expand?
20. **Lore depth**: Full worldbuilding or minimal?

## Business

21. **Name**: Guild Master? Something else?
22. **Domain**: What's available?
23. **Launch timeline**: When is MVP target?

---

# Appendix A: Skill Ideas

## Offensive

| Skill | Type | Scaling | Effect |
|-------|------|---------|--------|
| Strike | Single | ATK | Basic attack |
| Cleave | 2-3 | ATK | Multi-hit |
| Whirlwind | AoE | ATK | Hit all |
| Execute | Single | ATK | Bonus vs low HP |
| Backstab | Single | ATK + SPD | Crit bonus |
| Power Attack | Single | ATK | Slow, high damage |
| Flurry | Single | SPD | Multiple weak hits |
| Soul Rend | Single | WILL | Magic nuke |
| Meteor | AoE | WILL + SPD | Magic AoE |
| Holy Smite | Single | ATK + WILL + DEF | Hybrid |
| Retaliate | Counter | DEF | Damage on being hit |
| Drain Life | Single | WILL | Damage + heal |

## Defensive

| Skill | Type | Scaling | Effect |
|-------|------|---------|--------|
| Block | Passive | DEF | Reduce damage |
| Taunt | Utility | — | Force aggro |
| Second Wind | Trigger | — | Heal at low HP |
| Mana Shield | Passive | WILL | Absorb with mana |
| Evasion | Passive | SPD | Dodge chance |
| Fortify | Buff | DEF | Temporary DEF boost |
| Regeneration | Passive | — | Heal over time |

## Utility

| Skill | Type | Scaling | Effect |
|-------|------|---------|--------|
| Leech | Passive | — | Heal on damage |
| Thorns | Passive | — | Reflect damage |
| Frenzy | Passive | — | Speed up when hurt |
| Bloodlust | Passive | — | Damage up on kill |
| Treasure Hunter | Passive | — | Better drops? |
| Scout | Passive | — | See quest details? |

## Summon

| Skill | Type | Scaling | Effect |
|-------|------|---------|--------|
| Raise Dead | Summon | WILL | Skeleton ally |
| Call Beast | Summon | WILL | Wolf ally |
| Conjure Elemental | Summon | WILL | Elemental ally |

---

# Appendix B: Quest Templates

## Easy Tier (2-5 minutes)

| Quest | Encounters | Rewards |
|-------|------------|---------|
| Goblin Warren | 3 white packs, 1 rare | Low gold, common gear |
| Wolf Den | 3 white packs, 1 rare | Low gold, common gear |
| Bandit Outpost | 2 white, 2 magic | Low-mid gold, common-magic |

## Medium Tier (8-15 minutes)

| Quest | Encounters | Rewards |
|-------|------------|---------|
| Abandoned Mine | 4 magic packs, 2 rare | Mid gold, magic gear |
| Haunted Crypt | 3 magic, 2 rare, 1 miniboss | Mid gold, magic-rare |
| Orc Stronghold | 5 magic, 2 rare | Mid-high gold, magic |

## Hard Tier (18-30 minutes)

| Quest | Encounters | Rewards |
|-------|------------|---------|
| Dragon's Hollow | 7 magic, 2 rare, 1 boss | High gold, rare+, souls |
| Demon Gate | 6 magic, 3 rare, 1 boss | High gold, rare+, souls |
| Lich Tower | 5 magic, 3 rare, 2 miniboss, 1 boss | Very high, rare+, souls |

## Rift Tier (Endgame)

| Quest | Encounters | Rewards |
|-------|------------|---------|
| Chaos Rift | Random, scaling | Best drops, rare seeds |
| Void Tear | Random, very hard | Unique items, titan souls |

---

# Appendix C: Rare Seed Reference

| Seed | Drop Rate | Yield | Return Rate | Effect |
|------|-----------|-------|-------------|--------|
| Pumpkin | 0.0001% | 3 | 5% | +1 Max HP (permanent) |
| Moonmelon | 0.0002% | 2 | 5% | +5% Crit (24hr) |
| Bloodroot | 0.0001% | 3 | 5% | +1 ATK (permanent) |
| Starleaf | 0.00005% | 1 | 3% | +1% inheritance bonus |
| Voidberry | 0.00001% | 1 | 1% | +1 skill point? |

---

# Appendix D: Alignment Thresholds

| Action | Shift |
|--------|-------|
| Retire hero peacefully | +5 |
| Let retiree die of old age | +2 |
| Complete "good" quest | +1 |
| Call retiree back for soul | -10 |
| Soul-power an item | -15 |
| Complete "dark" quest | -3 |
| Execute PvP enemy for inscription | -1? |

| Range | State |
|-------|-------|
| +100 to +50 | Pure |
| +49 to +10 | Good |
| +9 to -9 | Neutral |
| -10 to -49 | Corrupt |
| -50 to -100 | Damned |

---

# Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2024 | Initial design document |

---

*"The game you've been trying to find for 15 years. Now build it."*

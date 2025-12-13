# GUILD MASTER - SKILL SYSTEM V3
## 15-Point Skill Trees with Stacking

---

## CORE SYSTEMS

### Basic Attack Nerf
| Attack Type | Scaling | Notes |
|-------------|---------|-------|
| Basic Attack | 0.7× ATK | Fallback when skills on cooldown |
| Skills | 0.9× - 1.3× | Worth the cooldown |

### Skill Stacking
| Roll | Display | Max Points | Fantasy |
|------|---------|------------|---------|
| 1× | Fireball | 5 | Dabbler |
| 2× | Fireball² | 10 | Specialist |
| 3× | Fireball³ | 15 | Master |

### Tree Depth Tiers
| Points | Tier | Access | Power Level |
|--------|------|--------|-------------|
| 1-5 | Early | All heroes | +damage, minor effects |
| 6-10 | Mid | ² and ³ only | Transforms, strong effects |
| 11-15 | Deep | ³ only | Build-defining capstones |

### Cooldown Rules
- All active skills: Base CD 2
- Minimum CD: 1 (never 0)
- Passives: No cooldown

---

## ARCHETYPES (10 total)

| Archetype | Fantasy | Primary Stat | Art Direction |
|-----------|---------|--------------|---------------|
| PYROMANCER | Fire mage | WILL | Robes, flame effects, red/orange |
| CRYOMANCER | Ice mage | WILL | Blue robes, frost effects, pale |
| STORMCALLER | Lightning mage | WILL | Purple/yellow, crackling energy |
| NECROMANCER | Death magic | WILL | Dark robes, skulls, pale/green |
| PALADIN | Holy warrior | ATK/WILL | Plate + cloth, gold/white, radiant |
| WARRIOR | Martial melee | ATK | Heavy armor, weapons, battle-worn |
| ROGUE | Stealth/crit | ATK/SPD | Leather, daggers, hoods, shadows |
| BERSERKER | Rage fighter | ATK | Furs, scars, wild hair, blood |
| GUARDIAN | Tank/protect | DEF | Tower shield, heavy plate, stalwart |
| SUMMONER | Minion master | WILL | Robes, totems, creatures nearby |

---

## SKILL TREES (50 Skills)

---

### 🔥 PYROMANCER

---

#### 1. FIREBALL
**Base:** Launch a ball of fire at a single target.
| Stat | Value |
|------|-------|
| Damage | 1.1 × WILL |
| Target | Single |
| Type | Magical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points) — Anyone can reach:**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Ember | Minor | 1 | +10% damage |
| Kindle | Minor | 1 | +10% damage |
| Sparks | Minor | 1 | +5% crit chance |
| Heat | Minor | 1 | +10% damage |
| Ignite | Major | 1 | Targets burn for 15% damage over 2s |

**MID (6-10 points) — ² heroes:**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Scorch | Major | 1 | Burning targets take +20% fire damage |
| Spread | Major | 2 | Ignite spreads to 1 nearby enemy |
| Impact | Major | 1 | +25% damage, removes ignite effect |
| Chain Fire | Major | 2 | Bounces to 1 additional target at 60% |
| Inferno | Major | 1 | +40% damage vs already burning |

**DEEP (11-15 points) — ³ heroes only:**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Pyroclasm | Major | 2 | Becomes AOE, -30% damage |
| Meteor Form | Major | 2 | +50% damage, +1 cooldown |
| Soul Fire | Major | 1 | Burns ignore fire resistance |
| Conflagration | Major | 1 | Burning targets explode on death for 50% AOE |
| Avatar of Flame | Capstone | 1 | All fire skills gain +25% damage, you take 25% less fire |

---

#### 2. FLAME WAVE
**Base:** Unleash a wave of fire hitting all enemies.
| Stat | Value |
|------|-------|
| Damage | 0.9 × WILL |
| Target | AOE |
| Type | Magical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Wider Wave | Minor | 1 | +15% damage |
| Hotter | Minor | 1 | +10% damage |
| Scald | Minor | 1 | +10% damage |
| Burning Ground | Major | 1 | Leaves fire for 1 turn (0.2× WILL) |
| Heat Wave | Minor | 1 | +5% damage per enemy hit (max 25%) |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Melt Armor | Major | 2 | Enemies hit take +15% physical for 2s |
| Concentrated | Major | 2 | Cleave instead of AOE, +40% damage |
| Backdraft | Major | 1 | If enemies burning, +30% damage |
| Push | Major | 1 | Knockback enemies hit |
| Napalm | Major | 1 | Burning ground lasts +2 turns |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Firestorm | Major | 2 | Hits twice |
| Wall of Fire | Major | 2 | Creates barrier, enemies passing take 0.5× WILL |
| Cremation | Major | 1 | +100% damage vs targets below 20% HP |
| Immolation Aura | Major | 1 | Also damages enemies adjacent to you passively |
| Flame Lord | Capstone | 1 | Wave CD reduced to 1, +20% base damage |

---

#### 3. IGNITE
**Base:** Set a single target ablaze. DOT focused.
| Stat | Value |
|------|-------|
| Damage | 0.3 × WILL (initial) + 0.9 × WILL (over 3s) |
| Target | Single |
| Type | Magical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Hotter Burn | Minor | 1 | +15% DOT damage |
| Longer Burn | Minor | 1 | +1s duration, same damage |
| Intense | Minor | 1 | +15% DOT damage |
| Fast Burn | Minor | 1 | -1s duration, same total (faster) |
| Sear | Major | 1 | Initial hit +50% |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Stacking Flames | Major | 2 | Can stack 2 ignites on same target |
| Combustion | Major | 2 | When DOT ends, burst for 40% of total |
| Spreading Fire | Major | 1 | On death, spreads to 2 nearby |
| Agony | Major | 1 | Burning targets deal -15% damage |
| Fan the Flames | Major | 1 | Fire attacks refresh ignite duration |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Triple Stack | Major | 1 | Can stack 3 ignites |
| Incinerate | Major | 2 | 3× ignite stacks = instant 50% max HP |
| Eternal Flame | Major | 2 | Ignite doesn't expire, must be cleansed |
| Phoenix Mark | Major | 1 | Marked targets resurrect as fire allies |
| Burning Soul | Capstone | 1 | Ignite deals true damage |

---

#### 4. FIRE SHIELD
**Base:** Flames surround you, damaging melee attackers.
| Stat | Value |
|------|-------|
| Damage | 0.25 × WILL to attackers |
| Target | Self |
| Type | Passive |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Hotter Shield | Minor | 1 | +15% reflect damage |
| Warming | Minor | 1 | +10% reflect damage |
| Heat Aura | Minor | 1 | +5% fire damage dealt |
| Burning Touch | Major | 1 | Attackers ignited for 2s |
| Efficient | Minor | 1 | +10% reflect damage |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Fire Absorption | Major | 2 | Take 25% less fire damage |
| Blazing Speed | Major | 1 | +15% SPD while active |
| Retribution | Major | 2 | Reflect damage = 0.4 × WILL |
| Nova Burst | Major | 1 | Can detonate for 0.6 × WILL AOE (3 turn CD) |
| Fuel | Minor | 1 | +3% damage per kill (stacks, combat) |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Inferno Shield | Major | 2 | Reflect damages ALL enemies each turn |
| Phoenix Cloak | Major | 2 | On death, 50% chance revive with 20% HP |
| Living Flame | Major | 1 | Shield pulses 0.2 × WILL to all enemies/turn |
| Cauterize | Major | 1 | Immune to bleed, heal 2% when hit |
| Flame Incarnate | Capstone | 1 | All damage you deal becomes fire, +20% fire damage |

---

#### 5. METEOR
**Base:** Call down a meteor on all enemies.
| Stat | Value |
|------|-------|
| Damage | 1.3 × WILL |
| Target | AOE |
| Type | Magical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Mass | Minor | 1 | +10% damage |
| Velocity | Minor | 1 | +10% damage |
| Crater | Major | 1 | Leaves burning ground 2 turns |
| Impact | Minor | 1 | +10% damage |
| Debris | Minor | 1 | +5% damage, +5% crit |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Meteor Shower | Major | 2 | 3 meteors at 0.5× each, random targets |
| Targeted | Major | 2 | Single target, +60% damage, always crits |
| Extinction | Major | 1 | +75% damage vs below 30% HP |
| Skyfall | Major | 1 | -1 CD (min 1) |
| Molten Core | Major | 1 | Kills grant +15% damage next cast |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Cataclysm | Major | 2 | +50% damage, stuns all 1 turn |
| Armageddon | Major | 2 | Once per quest: 3× damage |
| Gravity Well | Major | 1 | Pulls all enemies together before impact |
| Scorched Earth | Major | 1 | Burning ground permanent this combat |
| World Ender | Capstone | 1 | Meteor ignores 50% WILL, +30% damage |

---

### ❄️ CRYOMANCER

---

#### 6. ICE BOLT
**Base:** Hurl a shard of ice at a single target.
| Stat | Value |
|------|-------|
| Damage | 1.0 × WILL |
| Target | Single |
| Type | Magical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Sharp Ice | Minor | 1 | +10% damage |
| Cold | Minor | 1 | +10% damage |
| Chill | Major | 1 | Target slowed 20% for 2s |
| Frost | Minor | 1 | +10% damage |
| Piercing Cold | Minor | 1 | +5% crit chance |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Freeze | Major | 2 | 20% chance to freeze 1s (stun) |
| Shatter | Major | 2 | +60% damage to frozen targets |
| Pierce | Major | 1 | Passes through, hits 2 targets |
| Frostbite | Major | 1 | Chilled take +20% damage from all |
| Icicle Barrage | Major | 1 | 3 bolts at 40% each |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Flash Freeze | Major | 2 | 50% freeze chance |
| Glacial Execution | Major | 2 | Frozen below 25% HP = instant kill |
| Ice Spear | Major | 1 | +40% damage, pierce 3 targets |
| Permafrost | Major | 1 | Freeze duration +2s |
| Absolute Zero | Capstone | 1 | Frozen targets take 2× damage, shatter heals you 10% |

---

#### 7. FROST NOVA
**Base:** Explode with frost, hitting all nearby enemies.
| Stat | Value |
|------|-------|
| Damage | 0.9 × WILL |
| Target | AOE |
| Type | Magical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Colder | Minor | 1 | +10% damage |
| Radius | Minor | 1 | +15% range |
| Freeze Chance | Minor | 1 | 10% freeze chance |
| Sharper | Minor | 1 | +10% damage |
| Chill All | Major | 1 | All hit are chilled 2s |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Flash Freeze | Major | 2 | +25% freeze chance |
| Hypothermia | Major | 1 | Chilled lose 15% ATK |
| Ice Age | Major | 1 | Freeze +1s duration |
| Defensive Burst | Major | 2 | Gain +25% DEF for 2s |
| Blizzard Trail | Major | 1 | Leaves slow field 2s |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Shatter Nova | Major | 2 | Frozen enemies take 2× and unfreeze |
| Ice Tomb | Major | 2 | 25% chance to permanently freeze fodder |
| Frozen Sanctuary | Major | 1 | While enemies frozen, you regen 5% HP/turn |
| Chain Freeze | Major | 1 | Freeze spreads to adjacent |
| Cryomancer's Wrath | Capstone | 1 | Nova -1 CD (min 1), +30% damage, always chills |

---

#### 8. FROZEN ARMOR
**Base:** Coat yourself in ice. DEF bonus.
| Stat | Value |
|------|-------|
| Effect | +20% DEF |
| Target | Self |
| Type | Passive |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Thicker Ice | Minor | 1 | +5% DEF |
| Hardened | Minor | 1 | +5% DEF |
| Chilling Aura | Major | 1 | Attackers become chilled |
| Cold Skin | Minor | 1 | +5% DEF |
| Frost Layer | Minor | 1 | +5% DEF |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Ice Mirror | Major | 2 | Reflect 15% cold damage to attackers |
| Shatter Guard | Major | 1 | On big hit (>20% HP), AOE frost |
| Glacial Fortress | Major | 2 | +20% DEF, -10% SPD |
| Cold Recovery | Major | 1 | Regen 3% HP while above 60% HP |
| Frozen Resolve | Major | 1 | Immune to freeze effects |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Ice Block | Major | 2 | Activate: immune 1 turn, can't act (4 turn CD) |
| Iceborn | Major | 2 | Fire damage -40%, cold damage heals you |
| Living Glacier | Major | 1 | DEF bonus doubled while standing still |
| Frozen Heart | Major | 1 | At <30% HP, freeze attackers automatically |
| Avatar of Ice | Capstone | 1 | +30% DEF, attackers frozen 50% chance |

---

#### 9. BLIZZARD
**Base:** Summon a blizzard damaging all enemies over time.
| Stat | Value |
|------|-------|
| Damage | 0.35 × WILL per turn |
| Duration | 4 turns |
| Target | AOE |
| Type | Magical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Colder Wind | Minor | 1 | +15% DOT damage |
| Longer Storm | Minor | 1 | +1 turn duration |
| Harsher | Minor | 1 | +10% DOT damage |
| Wind Chill | Major | 1 | Enemies chilled while in blizzard |
| Frost Bite | Minor | 1 | +10% DOT damage |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Hailstorm | Major | 2 | Also deals 0.15 × ATK physical |
| Whiteout | Major | 1 | Enemies 25% miss chance |
| Snowdrift | Major | 1 | Allies +20% evasion in blizzard |
| Bitter Cold | Major | 2 | -10% SPD per turn in blizzard (stacks) |
| Avalanche | Major | 1 | Final turn deals 0.6 × WILL burst |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Eternal Winter | Major | 2 | Duration +4 turns (8 total) |
| Freeze Solid | Major | 2 | 15% chance per turn to freeze random enemy |
| Eye of Storm | Major | 1 | Caster immune, heals 3%/turn in blizzard |
| Arctic Apocalypse | Major | 1 | Frozen in blizzard take 3× DOT |
| Winter's Dominion | Capstone | 1 | Blizzard permanent, 50% damage, enemies can't flee |

---

#### 10. GLACIAL SPIKE
**Base:** Impale a target with a massive ice spike.
| Stat | Value |
|------|-------|
| Damage | 1.3 × WILL |
| Target | Single |
| Type | Magical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Sharper | Minor | 1 | +10% damage |
| Larger | Minor | 1 | +10% damage |
| Impale | Major | 1 | Target +15% damage taken for 2s |
| Deeper | Minor | 1 | +10% damage |
| Cold Steel | Minor | 1 | +5% crit chance |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Frozen Solid | Major | 2 | 30% freeze chance |
| Execute | Major | 2 | +50% vs below 25% HP |
| Pierce | Major | 1 | 50% damage to enemy behind |
| Brittle | Major | 1 | Crit damage +40% vs frozen |
| Stacking Cold | Major | 1 | +15% per spike on same target (combat) |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Skewer | Major | 2 | Hits all enemies in a line |
| Ice Execution | Major | 2 | Frozen below 30% = instant kill |
| Glacial Tomb | Major | 1 | Kill = corpse becomes ice block ally |
| Permafrost Spike | Major | 1 | Frozen take 2.5× damage |
| Frozen Annihilation | Capstone | 1 | +50% damage, always freezes, -1 CD (min 1) |

---

### ⚡ STORMCALLER

---

#### 11. SPARK
**Base:** Zap a target with lightning.
| Stat | Value |
|------|-------|
| Damage | 0.95 × WILL |
| Target | Single |
| Type | Magical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Voltage | Minor | 1 | +10% damage |
| Charge | Minor | 1 | +10% damage |
| Arc | Major | 1 | 25% chance arc to second target 50% damage |
| Current | Minor | 1 | +10% damage |
| Static | Minor | 1 | +5% crit chance |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Shock | Major | 2 | 20% stun chance 1s |
| Overcharge | Major | 2 | +35% damage, +1 CD |
| Static Buildup | Major | 1 | +10% per spark on same target (stacks 5) |
| Lightning Speed | Major | 1 | +5% SPD per cast this combat |
| Energize | Major | 1 | Kill = next skill -1 CD (min 1) |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Ball Lightning | Major | 2 | Orbits you, auto-hits nearest each turn 0.3× |
| Thunder God | Major | 2 | +50% damage while above 80% HP |
| Chain Arc | Major | 1 | Arc chains to 3 targets |
| Electrocute | Major | 1 | Adds 0.4 × WILL DOT over 2s |
| Living Lightning | Capstone | 1 | Spark -1 CD (min 1), arcs always, +25% |

---

#### 12. CHAIN LIGHTNING
**Base:** Lightning jumps between enemies.
| Stat | Value |
|------|-------|
| Damage | 0.9 × WILL, -20% per jump |
| Target | Single → 3 chains |
| Type | Magical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Power | Minor | 1 | +10% damage |
| Reach | Minor | 1 | +1 chain |
| Sustained | Minor | 1 | Only -15% per jump |
| Energy | Minor | 1 | +10% damage |
| Conductivity | Major | 1 | Wet/metal enemies +20% damage |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Long Chain | Major | 2 | +2 chains (5 total base) |
| Fork | Major | 1 | Can hit same target twice |
| Grounding | Major | 2 | Final target +50% damage |
| Paralysis | Major | 1 | Each jump 10% stun |
| Storm Surge | Major | 1 | Kill during chain = +2 chains |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Infinite Chain | Major | 2 | No chain limit, -10% per jump |
| Lightning Rod | Major | 2 | Take 10%, chain +40% damage |
| Overload | Major | 1 | 25% chance double damage per jump |
| Thunderstorm | Major | 1 | Chains bounce back through |
| Storm Master | Capstone | 1 | No damage decay, +30% base |

---

#### 13. THUNDER STRIKE
**Base:** Call down thunder on a target. High burst.
| Stat | Value |
|------|-------|
| Damage | 1.2 × WILL |
| Target | Single |
| Type | Magical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Power | Minor | 1 | +12% damage |
| Boom | Minor | 1 | +10% damage |
| Deafen | Major | 1 | Target can't skill 1 turn |
| Crack | Minor | 1 | +10% damage |
| Rumble | Minor | 1 | +5% crit |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Thunder Clap | Major | 2 | Becomes Cleave, -20% damage |
| Divine Wrath | Major | 1 | +50% vs demons/undead |
| Electrocute | Major | 2 | 0.4 × WILL DOT over 2s |
| Instant | Major | 1 | -1 CD (min 1), costs 10% HP |
| Smite | Major | 1 | Auto-crit vs stunned |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Judgment | Major | 2 | +100% vs below 20% HP |
| Overload | Major | 2 | Crits +60% damage, 10% self-damage |
| Thunder God | Major | 1 | Above 80% HP: +40% damage |
| Skybreaker | Major | 1 | AOE instead, -30% damage |
| Wrath of Heaven | Capstone | 1 | +50% damage, stuns, always crits below 50% HP |

---

#### 14. STATIC FIELD
**Base:** Passive aura shocking nearby enemies.
| Stat | Value |
|------|-------|
| Damage | 0.15 × WILL per turn |
| Target | All enemies |
| Type | Passive |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Stronger Field | Minor | 1 | +15% aura damage |
| Wider Field | Minor | 1 | +20% radius |
| Charged Air | Major | 1 | Allies +8% crit in field |
| Intensity | Minor | 1 | +10% aura damage |
| Persistence | Minor | 1 | +10% aura damage |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Energy Leech | Major | 2 | Heal 25% of field damage |
| Grounded | Major | 1 | Enemies -20% SPD in field |
| Arc Flash | Major | 2 | When hit, 30% chance zap attacker 0.3× |
| Unstable | Major | 1 | +40% damage, 5% shock self |
| Magnetic | Major | 1 | Enemies can't flee |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Tesla Coil | Major | 2 | +10% per enemy in field |
| Lightning Prison | Major | 2 | Enemies entering field stunned 1s |
| Storm Heart | Major | 1 | Field pulses for 0.3× burst each turn |
| Ionize | Major | 1 | Enemies in field +30% lightning damage |
| Eye of the Storm | Capstone | 1 | Field damage 0.25×, heals allies 3%/turn |

---

#### 15. STORM CALL
**Base:** Summon a storm. AOE DOT.
| Stat | Value |
|------|-------|
| Damage | 0.4 × WILL per turn |
| Duration | 3 turns |
| Target | AOE |
| Type | Magical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Stronger | Minor | 1 | +12% damage |
| Longer | Minor | 1 | +1 turn duration |
| Winds | Minor | 1 | +10% damage |
| Thunder | Minor | 1 | +10% damage |
| Eye Safety | Major | 1 | Caster immune to storm effects |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Lightning Strikes | Major | 2 | Random enemy takes +0.25× per turn |
| Downpour | Major | 1 | Enemies "wet" = +30% lightning |
| Gale Force | Major | 2 | 25% miss chance for enemies |
| Tempest | Major | 1 | Duration +2 turns |
| Thunder Wrath | Major | 1 | Final turn 2× damage |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Supercell | Major | 2 | 25% stun random enemy each turn |
| Elemental Fury | Major | 2 | Also fire/cold 0.15× each |
| Eternal Storm | Major | 1 | Storm permanent, 60% damage |
| Cataclysm | Major | 1 | Stuns all enemies first turn |
| Storm Lord | Capstone | 1 | +40% damage, -1 CD (min 1), always wets |

---

### 💀 NECROMANCER

---

#### 16. SOUL REND
**Base:** Tear at target's soul. Ignores some defense.
| Stat | Value |
|------|-------|
| Damage | 1.1 × WILL (target WILL counts as 50% for resist) |
| Target | Single |
| Type | Magical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Deeper Cut | Minor | 1 | +10% damage |
| Soul Siphon | Major | 1 | Heal 15% of damage dealt |
| Rending | Minor | 1 | +10% damage |
| Pain | Minor | 1 | +10% damage |
| Torment | Minor | 1 | +5% crit |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Spirit Crush | Major | 2 | Target -20% damage for 2s |
| Rend Asunder | Major | 2 | Becomes Cleave, -15% damage |
| DOT | Major | 1 | +25% DOT over 2s |
| Devour | Major | 1 | Kill = next rend +30% |
| Essence Burn | Major | 1 | Also 8% max HP true damage |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Reaper's Touch | Major | 2 | +60% vs below 30% HP |
| Soul Tear | Major | 2 | Target WILL counts as 25% for resist |
| Oblivion | Major | 1 | Kills prevent resurrection |
| Mass Rend | Major | 1 | AOE at 60% damage |
| Soul Eater | Capstone | 1 | +40% damage, heals 30%, always crits dying |

---

#### 17. LIFE DRAIN
**Base:** Drain life from target.
| Stat | Value |
|------|-------|
| Damage | 0.95 × WILL |
| Heal | 50% of damage |
| Target | Single |
| Type | Magical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Deeper Drain | Minor | 1 | +10% damage |
| More Healing | Minor | 1 | +10% heal |
| Thirst | Minor | 1 | +10% damage |
| Hunger | Minor | 1 | +10% damage |
| Efficient | Major | 1 | Heal = 60% of damage |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Sanguine Feast | Major | 2 | Overheal = temp HP shield |
| Mass Drain | Major | 2 | AOE at 50% damage, heals total |
| Vampiric Aura | Major | 1 | Allies leech 5% during your turn |
| Essence Thief | Major | 1 | Target -15% damage dealt |
| Crimson Pact | Major | 1 | Costs 10% HP, +50% damage |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Exsanguinate | Major | 2 | Kill = cooldown reset to min (1) |
| Blood Magic | Major | 2 | Heal = 80% of damage |
| Life Link | Major | 1 | Can drain ally to heal self or vice versa |
| Drain Soul | Major | 1 | Damage = 1.2×, ignore 30% WILL |
| Vampire Lord | Capstone | 1 | Heal = 100%, +30% damage, overheal permanent |

---

#### 18. RAISE SKELETON
**Base:** Summon a skeleton warrior.
| Stat | Value |
|------|-------|
| Summon | Skeleton (35% caster WILL as ATK/DEF) |
| Count | 1 |
| Type | Summon |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Stronger Bones | Minor | 1 | +10% skeleton stats |
| Hardened | Minor | 1 | +10% skeleton stats |
| Armed | Minor | 1 | +10% skeleton stats |
| Reinforced | Minor | 1 | +10% skeleton stats |
| Skeleton Mage | Major | 1 | Casts Spark instead of melee |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Skeleton Archer | Major | 1 | Ranged attacks |
| Army | Major | 2 | Raise 2 at 75% stats each |
| Bone Armor | Major | 1 | Skeletons +30% DEF |
| Unholy Frenzy | Major | 2 | +25% SPD, -15% DEF |
| Reassemble | Major | 1 | Revives after 2 turns |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Bone Giant | Major | 2 | Single skeleton, 2.5× stats, slow |
| Legion | Major | 2 | Raise 4 at 60% stats |
| Exploding Bones | Major | 1 | Death = 0.5× WILL AOE |
| Command Dead | Major | 1 | Can raise slain enemies |
| Lord of Bones | Capstone | 1 | Skeletons +50% stats, unlimited count |

---

#### 19. CORPSE EXPLOSION
**Base:** Detonate a corpse.
| Stat | Value |
|------|-------|
| Damage | 0.9 × WILL + 20% corpse max HP |
| Target | Cleave |
| Type | Magical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Bigger Boom | Minor | 1 | +12% damage |
| Splatter | Minor | 1 | +10% damage |
| Gore | Minor | 1 | +10% damage |
| Visceral | Minor | 1 | +10% damage |
| Wider Blast | Major | 1 | AOE instead of Cleave |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Chain Reaction | Major | 2 | Can trigger other corpses |
| Poison Cloud | Major | 1 | Leaves poison 2s |
| Bone Shrapnel | Major | 2 | Physical damage instead |
| Volatile Bodies | Major | 1 | +35% damage |
| Quick Decay | Major | 1 | -1 CD (min 1) |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Plague Bearer | Major | 2 | Kills become plague corpses (auto-explode) |
| Deathbomb | Major | 2 | Corpse damage = 50% corpse max HP |
| Corpse Lance | Major | 1 | Single target, 2× damage |
| Necrotic Burst | Major | 1 | Explosion heals undead allies |
| Master of Death | Capstone | 1 | Enemies killed always leave corpse, +50% damage |

---

#### 20. DEATH MARK
**Base:** Mark target for death. Bonus damage from all.
| Stat | Value |
|------|-------|
| Effect | +25% damage taken for 4s |
| Target | Single |
| Type | Utility |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Stronger Mark | Minor | 1 | +5% damage taken |
| Longer Mark | Minor | 1 | +1s duration |
| Deeper Mark | Minor | 1 | +5% damage taken |
| Lasting | Minor | 1 | +1s duration |
| Spreading | Major | 1 | On death, mark jumps to nearest |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Mass Mark | Major | 2 | All enemies, but +15% only |
| Execution Mark | Major | 1 | +40% vs below 30% HP |
| Hunter's Mark | Major | 2 | Your attacks can't miss marked |
| Doomed | Major | 1 | Marked can't heal |
| Mark of Pain | Major | 1 | Marked take 0.15× WILL DOT/turn |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Reaper's Due | Major | 2 | If survives, take 40% current HP |
| Eternal Mark | Major | 2 | Mark never expires |
| Death Sentence | Major | 1 | Marked below 15% = instant death |
| Mark of the Legion | Major | 1 | Marked takes +10% per ally attacking |
| Herald of Death | Capstone | 1 | Mark +40% damage, spreads on death always |

---

### ⚔️ PALADIN

---

#### 21. HOLY SMITE
**Base:** Strike with divine power.
| Stat | Value |
|------|-------|
| Damage | 1.0 × (0.35 ATK + 0.35 WILL + 0.3 DEF) |
| Target | Single |
| Type | Hybrid |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Divine Power | Minor | 1 | +10% damage |
| Righteous | Minor | 1 | +10% damage |
| Holy | Minor | 1 | +10% damage |
| Blessed | Minor | 1 | +5% crit |
| Radiant | Major | 1 | +40% vs undead/demons |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Blinding Light | Major | 2 | Target -25% accuracy 2s |
| Consecrate | Major | 1 | Leaves holy ground (heals allies 3%/turn) |
| Judgment | Major | 2 | +30% vs enemies that hit allies |
| Zealot | Major | 1 | +25% damage, -10% DEF |
| Purify | Major | 1 | Removes 1 buff from target |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Martyr's Blow | Major | 2 | Costs 15% HP, +60% damage |
| Divine Fury | Major | 2 | At full HP, always crits |
| Exorcism | Major | 1 | Instant kill undead/demon below 25% |
| Holy Explosion | Major | 1 | Cleave, -20% damage |
| Avatar of Light | Capstone | 1 | +40% damage, heals you 20% on kill |

---

#### 22. DIVINE SHIELD
**Base:** Block damage with holy power.
| Stat | Value |
|------|-------|
| Effect | Absorb up to 0.5 × WILL damage |
| Target | Self |
| Type | Active |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Stronger Shield | Minor | 1 | +12% absorb |
| Blessed Barrier | Minor | 1 | +10% absorb |
| Holy Ward | Minor | 1 | +10% absorb |
| Reinforced | Minor | 1 | +10% absorb |
| Sanctuary | Major | 1 | Can cast on ally |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Reflective | Major | 2 | 35% blocked reflects back |
| Debuff Block | Major | 1 | Also blocks debuffs |
| Renewal | Major | 2 | Shield break = heal 20% |
| Aura Shield | Major | 1 | Allies get 30% of your shield |
| Steadfast | Major | 1 | Unbroken shield = +25% next |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Holy Fortress | Major | 2 | Shield = 0.8 × WILL |
| Martyrdom | Major | 2 | Absorb ally damage too |
| Divine Aegis | Major | 1 | Shield persists until broken |
| Radiant Barrier | Major | 1 | Damages attackers 0.2× WILL |
| Invincible | Capstone | 1 | Shield 1.0 × WILL, immune to all while active |

---

#### 23. HEAL
**Base:** Restore HP.
| Stat | Value |
|------|-------|
| Heal | 0.7 × WILL |
| Target | Self or Ally |
| Type | Active |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Greater Heal | Minor | 1 | +12% healing |
| Blessed Touch | Minor | 1 | +10% healing |
| Soothing | Minor | 1 | +10% healing |
| Mending | Minor | 1 | +10% healing |
| Self Heal | Major | 1 | Also heals self 25% when healing ally |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Mass Heal | Major | 2 | All allies 50% amount |
| Overheal | Major | 1 | Excess = HP shield |
| Cleanse | Major | 2 | Also removes 1 debuff |
| Renewal | Major | 1 | +25% HOT over 2 turns |
| Emergency | Major | 1 | +50% to targets below 30% HP |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Resurrection | Major | 2 | Revive ally at 25% HP (once/quest) |
| Divine Light | Major | 2 | Heal = 1.0 × WILL |
| Sacrifice | Major | 1 | Costs 20% HP, heal +80% |
| Beacon | Major | 1 | Healed ally +20% damage 2 turns |
| Miracle | Capstone | 1 | -1 CD (min 1), heal +50%, can res once more |

---

#### 24. CONSECRATION
**Base:** Create holy ground.
| Stat | Value |
|------|-------|
| Damage | 0.25 × WILL/turn to enemies |
| Heal | 0.2 × WILL/turn to allies |
| Duration | 3 turns |
| Type | Active |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Stronger Ground | Minor | 1 | +12% effects |
| Wider | Minor | 1 | +15% radius |
| Holier | Minor | 1 | +10% effects |
| Blessed | Minor | 1 | +10% effects |
| Extended | Major | 1 | +1 turn duration |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Holy Fire | Major | 2 | Enemies burn +20% |
| Sanctuary | Major | 1 | Allies +20% DEF in zone |
| Purifying | Major | 2 | Cleanses 1 debuff/turn |
| Smite Ground | Major | 1 | Undead/demons 2× damage |
| Longer | Major | 1 | +2 turn duration |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Moving Blessing | Major | 2 | Zone follows caster |
| Divine Judgment | Major | 2 | Enemies can't heal in zone |
| Eternal Light | Major | 1 | Zone permanent, 60% effect |
| Hallowed Ground | Major | 1 | Allies resurrect in zone (once each) |
| Sacred Domain | Capstone | 1 | +50% all effects, zone is entire battlefield |

---

#### 25. JUDGMENT
**Base:** Condemn an enemy.
| Stat | Value |
|------|-------|
| Damage | 1.1 × WILL |
| Effect | +20% per ally target damaged |
| Target | Single |
| Type | Magical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Righteous | Minor | 1 | +10% damage |
| Wrathful | Minor | 1 | +10% damage |
| Vengeful | Minor | 1 | +10% damage |
| Swift | Minor | 1 | +5% crit |
| Quick Justice | Major | 1 | -1 CD (min 1) |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Execution | Major | 2 | Kill below 20% HP |
| Mass Judgment | Major | 2 | All enemies, -35% damage |
| Retribution | Major | 1 | +8% per ally HP lost |
| Inquisitor | Major | 1 | Ignores 30% DEF |
| Final Verdict | Major | 1 | Kill = +35% next Judgment |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Divine Wrath | Major | 2 | Always crits vs killer of ally |
| Absolution | Major | 2 | Kills can't resurrect |
| Eye for Eye | Major | 1 | Reflects all damage target did to allies |
| Heaven's Fury | Major | 1 | +100% vs undead/demons |
| Hand of God | Capstone | 1 | +50%, execute at 25% HP, AOE |

---

### ⚔️ WARRIOR

---

#### 26. STRIKE
**Base:** Basic melee attack.
| Stat | Value |
|------|-------|
| Damage | 0.95 × ATK |
| Target | Single |
| Type | Physical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Heavier | Minor | 1 | +10% damage |
| Sharper | Minor | 1 | +10% damage |
| Stronger | Minor | 1 | +10% damage |
| Precision | Minor | 1 | +8% crit |
| Brutal | Major | 1 | Crit damage +30% |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Heavy Strike | Major | 2 | +35% damage, +1 CD |
| Combo | Major | 1 | Consecutive strikes +15% each (max 3) |
| Armor Break | Major | 2 | Target -20% DEF 2s |
| Stunning Blow | Major | 1 | 15% stun |
| Momentum | Major | 1 | +6% per strike this combat (max 30%) |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Quick Strike | Major | 2 | -1 CD (min 1), +10% damage |
| Execute | Major | 2 | +60% vs below 25% HP |
| Double Strike | Major | 1 | Hits twice at 60% each |
| Devastate | Major | 1 | Crits stagger target |
| Weapon Master | Capstone | 1 | +40% damage, always crits below 30% HP |

---

#### 27. CLEAVE
**Base:** Wide swing hitting multiple targets.
| Stat | Value |
|------|-------|
| Damage | 0.9 × ATK |
| Target | Cleave (2-3) |
| Type | Physical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Wider Arc | Minor | 1 | +1 target |
| Heavier | Minor | 1 | +10% damage |
| Sharper | Minor | 1 | +10% damage |
| Sweeping | Minor | 1 | +10% damage |
| Rending | Major | 1 | Bleed 15% over 2s |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Wide Arc | Major | 2 | Hits all enemies (AOE) |
| Decapitate | Major | 1 | +50% vs below 25% HP |
| Cleave Through | Major | 2 | Overkill hits next target |
| Intimidate | Major | 1 | Targets -15% damage 2s |
| Bloodbath | Major | 1 | Heal 4% per hit |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Massacre | Major | 2 | +25% per target hit |
| Whirlwind | Major | 2 | Hits twice |
| Execution Cleave | Major | 1 | Kills reset CD to min (1) |
| Terror | Major | 1 | 20% chance target flees 1 turn |
| Reaper | Capstone | 1 | AOE, +40%, heals 10% per kill |

---

#### 28. BASH
**Base:** Shield bash with stagger.
| Stat | Value |
|------|-------|
| Damage | 0.7 × ATK + 0.35 × DEF |
| Effect | 30% stagger (skip turn) |
| Target | Single |
| Type | Physical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Harder | Minor | 1 | +10% damage |
| Shield Weight | Minor | 1 | +0.1× DEF scaling |
| Heavier | Minor | 1 | +10% damage |
| Forceful | Minor | 1 | +10% stagger chance |
| Concussive | Major | 1 | +15% stagger chance |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Skull Crack | Major | 2 | Staggered +30% damage |
| Stunning | Major | 1 | Stagger = 1s stun instead |
| Bash Again | Major | 2 | If staggered, -1 CD (min 1) |
| Disorienting | Major | 1 | Staggered -25% accuracy |
| Interrupt | Major | 1 | Cancels charging skills |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Shield Charge | Major | 2 | Dash to target, +40% damage |
| Concussion | Major | 2 | Staggered can't skill 2 turns |
| Ground Pound | Major | 1 | Cleave stagger |
| Shattering Blow | Major | 1 | Staggered lose 25% DEF |
| Unstoppable Force | Capstone | 1 | 60% stagger, stun, +50% damage |

---

#### 29. WHIRLWIND
**Base:** Spin hitting all enemies.
| Stat | Value |
|------|-------|
| Damage | 0.85 × ATK |
| Target | AOE |
| Type | Physical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Faster Spin | Minor | 1 | +10% damage |
| Sharper | Minor | 1 | +10% damage |
| Momentum | Minor | 1 | +10% damage |
| Dervish | Minor | 1 | +5% per enemy (max 25%) |
| Razor Wind | Major | 1 | Bleed 12% over 2s |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Cyclone | Major | 2 | Hits twice at 55% each |
| Unstoppable | Major | 1 | Immune stun/stagger while spinning |
| Blood Cyclone | Major | 2 | Heal 4% per hit |
| Tornado | Major | 1 | Pulls enemies to you |
| Bladestorm | Major | 1 | +1 hit per 3 enemies |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Death Spin | Major | 2 | +35% damage |
| Endless Spin | Major | 2 | Can sustain 8% HP/turn, no CD |
| Execution Spin | Major | 1 | +60% vs below 30% HP |
| Steel Tornado | Major | 1 | 3 hits at 40% each |
| Avatar of War | Capstone | 1 | +50% damage, heals 10% per kill, immune CC |

---

#### 30. SHIELD SLAM
**Base:** DEF-based slam.
| Stat | Value |
|------|-------|
| Damage | 1.0 × DEF |
| Target | Single |
| Type | Physical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Heavier | Minor | 1 | +10% damage |
| Crushing | Minor | 1 | +10% damage |
| Weight | Minor | 1 | +10% damage |
| Forceful | Minor | 1 | +10% damage |
| Flatten | Major | 1 | 25% knockdown (skip turn) |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Crushing Weight | Major | 2 | Damage = 1.3 × DEF |
| Reverberating | Major | 1 | 30% to adjacent |
| Block and Slam | Major | 2 | If blocked last turn, +50% |
| Dazing | Major | 1 | Target -30% accuracy 2s |
| Shield Charge | Major | 1 | Dash to target |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Fortified Slam | Major | 2 | Gain +15% DEF 2 turns after |
| Mountain's Might | Major | 2 | +3% per 10 DEF |
| Earthquake | Major | 1 | AOE at 60% |
| Shatter | Major | 1 | Target -30% DEF 3s |
| Immovable Object | Capstone | 1 | Damage = 1.5 × DEF, stun, +30% DEF 3s |

---

### 🗡️ ROGUE

---

#### 31. BACKSTAB
**Base:** Attack from shadows. High crit.
| Stat | Value |
|------|-------|
| Damage | 1.0 × ATK + 0.3 × SPD |
| Effect | +20% crit chance |
| Target | Single |
| Type | Physical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Sharper | Minor | 1 | +10% damage |
| Precision | Minor | 1 | +10% damage |
| Deadly | Minor | 1 | +10% damage |
| Lethal | Minor | 1 | +8% crit |
| Twist Knife | Major | 1 | Crit damage +35% |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Assassinate | Major | 2 | +50% vs full HP |
| Shadow Strike | Major | 1 | Can't miss |
| Ambush | Major | 2 | First combat attack +40% |
| Exploit | Major | 1 | Ignore 25% DEF |
| Dirty Fighting | Major | 1 | Poison 15% over 2s |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Lacerate | Major | 2 | Crits bleed 30% over 3s |
| Kill Confirm | Major | 2 | Kill = -1 CD (min 1) |
| Death Mark | Major | 1 | Crits mark +20% damage 2s |
| Throat Slit | Major | 1 | +80% vs stunned/staggered |
| Master Assassin | Capstone | 1 | Always crits, +50% damage, ignore 40% DEF |

---

#### 32. POISON STRIKE
**Base:** Poisoned attack with DOT.
| Stat | Value |
|------|-------|
| Damage | 0.9 × ATK + 0.6 × ATK poison over 3s |
| Target | Single |
| Type | Physical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Potent | Minor | 1 | +12% poison damage |
| Toxic | Minor | 1 | +10% poison damage |
| Virulent | Minor | 1 | +10% poison damage |
| Concentrated | Minor | 1 | +10% poison damage |
| Fast Acting | Major | 1 | -1s duration, same total |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Stacking | Major | 2 | Up to 3 stacks |
| Crippling | Major | 1 | Poisoned -20% SPD |
| Weakening | Major | 2 | Poisoned -20% damage |
| Lethal Dose | Major | 1 | +35% vs already poisoned |
| Plague | Major | 1 | Spreads on death |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Envenom | Major | 2 | All attacks refresh poison |
| Neurotoxin | Major | 2 | Poisoned can't skill |
| Pandemic | Major | 1 | Spreads to adjacent constantly |
| Death's Touch | Major | 1 | 5 stacks = instant kill |
| Poison Master | Capstone | 1 | Poison = true damage, +50% |

---

#### 33. SHADOW STEP
**Base:** Teleport, enhance next attack.
| Stat | Value |
|------|-------|
| Effect | Next attack +30% damage, guaranteed crit |
| Target | Self |
| Type | Utility |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Momentum | Minor | 1 | +8% next attack |
| Shadow | Minor | 1 | +8% next attack |
| Darkness | Minor | 1 | +8% next attack |
| Stealth | Minor | 1 | +8% next attack |
| Vanish | Major | 1 | Untargetable until attack |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Shadow Dance | Major | 2 | Kill = free step (once/turn) |
| Phase | Major | 1 | Dodge next attack |
| Surprise | Major | 2 | Next attack stuns 1s |
| Shadow Assault | Major | 1 | Step includes 0.7× ATK hit |
| Escape | Major | 1 | +35% evasion 2s option |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Ambush Predator | Major | 2 | Kill = +30% damage 2s |
| Through Shadows | Major | 2 | Can step multiple times/turn |
| Phantom | Major | 1 | 2 turns untargetable |
| Death from Above | Major | 1 | Next attack AOE at 50% |
| Shadow Lord | Capstone | 1 | +50% next attack, always vanish, -1 CD (min 1) |

---

#### 34. FAN OF KNIVES
**Base:** Throw knives at all enemies.
| Stat | Value |
|------|-------|
| Damage | 0.7 × ATK + 0.2 × SPD |
| Target | AOE |
| Type | Physical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| More Knives | Minor | 1 | +12% damage |
| Sharper | Minor | 1 | +10% damage |
| Balanced | Minor | 1 | +10% damage |
| Quick Throw | Minor | 1 | +10% damage |
| Serrated | Major | 1 | Bleed 12% over 2s |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Poisoned | Major | 2 | Poison 15% over 2s |
| Ricochet | Major | 1 | Hit twice at 55% |
| Targeted | Major | 2 | Single, 2.5× damage |
| Flurry | Major | 1 | -1 CD (min 1) |
| Deadly Aim | Major | 1 | +15% crit |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Blade Barrier | Major | 2 | Block projectiles this turn |
| Execution | Major | 2 | +60% vs below 25% HP |
| Shuriken Storm | Major | 1 | Hits 3 times at 40% |
| Knife Mastery | Major | 1 | +8% per enemy hit |
| Death Blossom | Capstone | 1 | 4 hits, +30% damage, bleed + poison |

---

#### 35. EVISCERATE
**Base:** Brutal finisher.
| Stat | Value |
|------|-------|
| Damage | 1.2 × ATK |
| Effect | +50% vs below 30% HP |
| Target | Single |
| Type | Physical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Brutal | Minor | 1 | +10% damage |
| Vicious | Minor | 1 | +10% damage |
| Savage | Minor | 1 | +10% damage |
| Lethal | Minor | 1 | +5% execute threshold |
| Mercy Kill | Major | 1 | Execute at 35% HP |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Overkill | Major | 2 | Excess splashes nearest |
| Blood Scent | Major | 1 | +12% per bleeding enemy |
| Savage Strike | Major | 2 | Always crits below 20% HP |
| Relentless | Major | 1 | Kill = CD min (1) |
| Taste of Blood | Major | 1 | Kill heals 15% |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Disembowel | Major | 2 | Kills can't resurrect |
| Reaper | Major | 2 | +5% execute threshold per kill |
| Gore | Major | 1 | Crits deal 2× |
| Annihilate | Major | 1 | Execute at 40% HP |
| Death Incarnate | Capstone | 1 | Execute at 50%, +60% damage, always crits |

---

### 🔥💀 BERSERKER

---

#### 36. FRENZY
**Base:** Passive power from missing HP.
| Stat | Value |
|------|-------|
| Effect | +1% damage per 2% missing HP |
| Target | Self |
| Type | Passive |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Rage | Minor | 1 | +0.2% per 2% missing |
| Fury | Minor | 1 | +0.2% per 2% missing |
| Anger | Minor | 1 | +0.2% per 2% missing |
| Wrath | Minor | 1 | +0.2% per 2% missing |
| Battle Rage | Major | 1 | Also +0.3% SPD per 2% missing |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Bloodlust | Major | 2 | Also +0.5% leech per 5% missing |
| Undying Rage | Major | 1 | At <10% HP, immune death 1 turn |
| Pain is Power | Major | 2 | +15% when damaged |
| Berserker Call | Major | 1 | Activate: take 25% HP, +40% 3s |
| See Red | Major | 1 | At <20% HP, +25% crit |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Rampage Mode | Major | 2 | At <30% HP, attacks AOE |
| Deathwish | Major | 2 | At <10% HP, 2× damage |
| No Retreat | Major | 1 | Can't die first fatal hit |
| Immortal Rage | Major | 1 | At 1 HP, immune 2 turns |
| Avatar of Carnage | Capstone | 1 | +2% per 2% missing, immune below 20% |

---

#### 37. RECKLESS STRIKE
**Base:** Powerful blow, damages self.
| Stat | Value |
|------|-------|
| Damage | 1.3 × ATK |
| Self-damage | 12% max HP |
| Target | Single |
| Type | Physical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Heavier | Minor | 1 | +12% damage |
| Harder | Minor | 1 | +10% damage |
| Brutal | Minor | 1 | +10% damage |
| Pain Tolerance | Minor | 1 | -2% self-damage |
| All In | Major | 1 | +25% damage, +5% self |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Blood Price | Major | 2 | Kill = heal self-damage |
| Mutual Destruction | Major | 1 | Self-damage also hits target |
| Fury Fueled | Major | 2 | Self-damage triggers Frenzy |
| Desperate | Major | 1 | At <25% HP, no self-damage |
| Scar Tissue | Major | 1 | -1% self per use (combat) |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Death Wish | Major | 2 | Self-damage can't kill |
| Ultimate Recklessness | Major | 2 | +80% damage, +15% self |
| Blood Explosion | Major | 1 | Self-damage = AOE to enemies |
| Masochism | Major | 1 | Self-damage heals instead |
| Undying Berserker | Capstone | 1 | +60% damage, no self-damage, +1 CD |

---

#### 38. BLOOD RAGE
**Base:** Trade HP for power.
| Stat | Value |
|------|-------|
| Effect | -6% HP/turn, +35% damage, +25% SPD |
| Duration | 4 turns |
| Cooldown | Once per combat |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Stronger Rage | Minor | 1 | +5% damage bonus |
| Faster Rage | Minor | 1 | +5% SPD bonus |
| Harder Rage | Minor | 1 | +5% damage bonus |
| Controlled | Minor | 1 | -1% HP drain |
| Extended | Major | 1 | +1 turn duration |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Blood Frenzy | Major | 2 | Also +15% crit |
| Taste of Blood | Major | 1 | Kills heal 6% |
| Uncontrollable | Major | 2 | +25% damage, can't stop |
| Crimson Haze | Major | 1 | Immune CC |
| Final Stand | Major | 1 | If ends below 10%, +100% last turn |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Hemorrhage | Major | 2 | Hits bleed while raging |
| Eternal Rage | Major | 2 | Can extend with kills |
| Blood God | Major | 1 | No HP drain, -10% damage bonus |
| Crimson Avatar | Major | 1 | Heal = damage dealt while raging |
| Aspect of Carnage | Capstone | 1 | +60% damage, +40% SPD, heals on kill |

---

#### 39. EXECUTE
**Base:** Scales with target missing HP.
| Stat | Value |
|------|-------|
| Damage | 1.0 × ATK + target missing HP% |
| Target | Single |
| Type | Physical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Heavier | Minor | 1 | +10% damage |
| Harder | Minor | 1 | +10% damage |
| Brutal | Minor | 1 | +10% damage |
| Vicious | Minor | 1 | +10% damage |
| Mercy | Major | 1 | Instant kill below 15% HP |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Coup de Grace | Major | 2 | +40% vs stunned |
| Bloodsoaked | Major | 1 | +6% per bleeding enemy |
| Double Tap | Major | 2 | Survives below 20% = strike again |
| Victory Rush | Major | 1 | Kill heals 20% |
| Executioner | Major | 1 | +12% per Execute (combat) |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Decapitate | Major | 2 | Kills can't resurrect |
| Overwhelming | Major | 2 | Also 25% to adjacent |
| Mercy Kill | Major | 1 | Instant kill below 20% |
| Endless Execution | Major | 1 | Kill = CD to min (1) |
| Angel of Death | Capstone | 1 | +50%, instant kill 25%, heals 30% on kill |

---

#### 40. RAMPAGE
**Base:** Multi-hit, more when hurt.
| Stat | Value |
|------|-------|
| Damage | 0.45 × ATK per hit |
| Hits | 2 + 1 per 20% missing HP (max 6) |
| Target | Random |
| Type | Physical |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Harder Hits | Minor | 1 | +8% per hit |
| More Fury | Minor | 1 | +8% per hit |
| Rage | Minor | 1 | +8% per hit |
| Frenzy | Minor | 1 | +8% per hit |
| Focused | Major | 1 | All hits single target, +10% each |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Wild Swings | Major | 2 | +2 max hits, -8% |
| Unrelenting | Major | 1 | Kill = +2 hits |
| Blood Mist | Major | 2 | Each hit heals 2.5% |
| Concussive | Major | 1 | 10% stagger per hit |
| Relentless | Major | 1 | -1 CD (min 1) |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Primal Fury | Major | 2 | At <20% HP, all crit |
| Annihilation | Major | 2 | Single target = +60% total |
| Endless Rampage | Major | 1 | No hit cap while below 30% |
| Bloodstorm | Major | 1 | All hits also bleed |
| Unstoppable Fury | Capstone | 1 | 8 base hits, +50% damage, heal 5%/hit |

---

### 🛡️ GUARDIAN

---

#### 41. BLOCK
**Base:** Passive damage reduction.
| Stat | Value |
|------|-------|
| Effect | -8% damage + 0.1 × DEF% |
| Target | Self |
| Type | Passive |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Harder Shield | Minor | 1 | +2% reduction |
| Thicker | Minor | 1 | +2% reduction |
| Reinforced | Minor | 1 | +2% reduction |
| Sturdy | Minor | 1 | +2% reduction |
| Reactive | Major | 1 | Big hit (>15% HP) = counter 0.3× DEF |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Shield Wall | Major | 2 | +12% block, -10% SPD |
| Bulwark | Major | 1 | Can't take >25% HP per hit |
| Deflect | Major | 2 | 15% negate attack |
| Brace | Major | 1 | Activate: +25% block, skip attack |
| Cover | Major | 1 | Block for lowest HP ally |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Unbreakable | Major | 2 | 0.15× DEF scaling |
| Fortress | Major | 2 | +5% per ally behind |
| Perfect Guard | Major | 1 | 25% negate, counter on negate |
| Immovable | Major | 1 | Immune knockback/pull |
| Living Fortress | Capstone | 1 | +20% block, can't take >20% HP, counters all |

---

#### 42. TAUNT
**Base:** Force enemy to attack you.
| Stat | Value |
|------|-------|
| Effect | Target attacks you 2 turns |
| Target | Single |
| Type | Utility |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Longer | Minor | 1 | +1 turn duration |
| Stronger | Minor | 1 | +1 turn duration |
| Infuriating | Minor | 1 | Taunted -10% damage |
| Mocking | Minor | 1 | Taunted -10% damage |
| Mass Taunt | Major | 1 | All enemies, 1 turn each |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Mocking Blow | Major | 2 | Also 0.4× ATK damage |
| Iron Will | Major | 1 | +20% DEF vs taunted |
| Revenge | Major | 2 | +15% damage vs taunted |
| Defender's Oath | Major | 1 | Taunted can't target allies (even AOE) |
| Provoke | Major | 1 | -1 CD (min 1), 1 turn duration |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Martyr | Major | 2 | Take 35% ally damage while taunting |
| Untouchable | Major | 2 | +30% evasion vs taunted |
| Overwhelming Presence | Major | 1 | Taunted can't skill |
| Guardian Angel | Major | 1 | Allies immune while you have taunt up |
| Immortal Guardian | Capstone | 1 | Permanent taunt, +30% DEF, regen 3%/turn |

---

#### 43. FORTIFY
**Base:** Boost defenses.
| Stat | Value |
|------|-------|
| Effect | +30% DEF, +30% WILL for 3 turns |
| Target | Self |
| Type | Active |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Stronger | Minor | 1 | +6% to bonuses |
| Harder | Minor | 1 | +5% to bonuses |
| Tougher | Minor | 1 | +5% to bonuses |
| Longer | Minor | 1 | +1 turn duration |
| Iron Skin | Major | 1 | Immune bleed/poison |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Aura | Major | 2 | Allies get 40% of bonus |
| Reactive | Major | 1 | Auto-triggers below 35% (once) |
| Absorb | Major | 2 | +HP shield = 25% DEF |
| Unshakeable | Major | 1 | Immune stun/knockback |
| Counter Stance | Major | 1 | Counter all attacks 0.25× DEF |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Last Bastion | Major | 2 | Can't die while fortified |
| Mountain | Major | 2 | +50% to bonuses |
| Regenerating | Major | 1 | Regen 5%/turn fortified |
| Immunity | Major | 1 | Immune all debuffs |
| Eternal Bulwark | Capstone | 1 | Permanent fortify at 80% effect |

---

#### 44. RETALIATE
**Base:** Counter when hit.
| Stat | Value |
|------|-------|
| Effect | 35% counter for 0.5 × DEF |
| Target | Attacker |
| Type | Trigger |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| More Likely | Minor | 1 | +5% proc |
| Reflexive | Minor | 1 | +5% proc |
| Quick | Minor | 1 | +5% proc |
| Ready | Minor | 1 | +5% proc |
| Improved | Major | 1 | Counter = 0.65× DEF |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Thorns | Major | 2 | Also reflect 12% taken |
| Certain | Major | 1 | 100% if crit you |
| Staggering | Major | 2 | 25% stagger on counter |
| Riposte | Major | 1 | Counter = 0.8× ATK instead |
| Punishing | Major | 1 | Counter crits below 50% |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Endless | Major | 2 | No limit per turn |
| Vengeance | Major | 2 | +12% per hit this combat |
| Devastate | Major | 1 | Counter = 1.0× DEF |
| Reflect All | Major | 1 | Reflect 25% all damage |
| Retribution Incarnate | Capstone | 1 | 100% counter, 1.2× DEF, stagger always |

---

#### 45. LAST STAND
**Base:** Near-death defense surge.
| Stat | Value |
|------|-------|
| Effect | At <20% HP: +60% DEF, immune death 2 turns |
| Cooldown | Once per quest |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Stronger | Minor | 1 | +10% DEF |
| Tougher | Minor | 1 | +10% DEF |
| Harder | Minor | 1 | +10% DEF |
| Longer | Minor | 1 | +1 turn |
| Rally | Major | 1 | Also heal 20% |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Defiant | Major | 2 | +35% damage during |
| Indomitable | Major | 1 | Trigger at <30% HP |
| Blaze of Glory | Major | 2 | When ends, AOE 0.8× DEF |
| Undying | Major | 1 | If survive, heal to 30% |
| Heroic Sacrifice | Major | 1 | Allies immune during your stand |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Phoenix | Major | 2 | Can use twice per quest |
| Legendary | Major | 2 | Immune all debuffs during |
| Eternal | Major | 1 | Duration +2 turns |
| Glory | Major | 1 | +80% DEF during |
| Immortal Legend | Capstone | 1 | Trigger at 40%, heal full after, +100% DEF |

---

### 🐺 SUMMONER

---

#### 46. SUMMON WOLF
**Base:** Call wolf companion.
| Stat | Value |
|------|-------|
| Summon | Wolf (45% WILL as ATK, high SPD) |
| Count | 1 |
| Type | Summon |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Stronger | Minor | 1 | +10% stats |
| Faster | Minor | 1 | +10% stats |
| Tougher | Minor | 1 | +10% stats |
| Fiercer | Minor | 1 | +10% stats |
| Pack | Major | 1 | 2 wolves at 75% each |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Alpha | Major | 2 | Single, +60% stats |
| Dire Wolf | Major | 1 | +40% HP, cleave attacks |
| Rabid | Major | 2 | Attacks bleed |
| Swift | Major | 1 | +35% SPD |
| Bond | Major | 1 | Death heals you 25% |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Spirit Wolf | Major | 2 | Incorporeal, 25% avoid |
| Pack Leader | Major | 2 | 3 wolves at 65% each |
| Primal | Major | 1 | Wolf skills: Frenzy, Rampage |
| Howl | Major | 1 | Taunt on summon |
| Alpha Predator | Capstone | 1 | Wolf = 100% your stats, shares your skills |

---

#### 47. SUMMON SKELETON
**Base:** Raise skeleton warrior.
| Stat | Value |
|------|-------|
| Summon | Skeleton (35% WILL as ATK/DEF) |
| Count | 1 |
| Type | Summon |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Stronger | Minor | 1 | +10% stats |
| Armored | Minor | 1 | +10% stats |
| Armed | Minor | 1 | +10% stats |
| Reinforced | Minor | 1 | +10% stats |
| Skeleton Mage | Major | 1 | Casts Spark |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Archer | Major | 1 | Ranged attacks |
| Army | Major | 2 | 3 at 55% each |
| Bone Armor | Major | 1 | +35% DEF |
| Reassemble | Major | 2 | Revive after 2 turns |
| Exploding | Major | 1 | Death = 0.4× WILL AOE |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Bone Giant | Major | 2 | Single, 2.5× stats |
| Legion | Major | 2 | 5 at 45% each |
| Champion | Major | 1 | Has random skill from you |
| Command Dead | Major | 1 | Raise slain enemies |
| Army of Darkness | Capstone | 1 | Unlimited skeletons, +50% stats |

---

#### 48. SUMMON GOLEM
**Base:** Create stone golem.
| Stat | Value |
|------|-------|
| Summon | Golem (65% WILL as DEF, low SPD) |
| Count | 1 |
| Type | Summon |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Stronger | Minor | 1 | +10% stats |
| Tougher | Minor | 1 | +10% stats |
| Heavier | Minor | 1 | +10% stats |
| Harder | Minor | 1 | +10% stats |
| Clay | Major | 1 | Regen 4%/turn |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Iron | Major | 2 | +35% DEF, reflects |
| Explosive | Major | 1 | Detonate for AOE |
| Frost | Major | 2 | Attacks slow |
| Guardian | Major | 1 | Taunts, protects you |
| Blood | Major | 1 | Heals you 4% when hits |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Colossus | Major | 2 | 2.5× stats, -40% SPD |
| Twin | Major | 2 | 2 golems at 70% each |
| Molten | Major | 1 | Fire damage, burns |
| Immortal | Major | 1 | Revives once per combat |
| Titan | Capstone | 1 | 3× stats, has your DEF skills |

---

#### 49. COMMAND
**Base:** Buff all summons.
| Stat | Value |
|------|-------|
| Effect | +25% damage 3 turns |
| Target | All summons |
| Type | Active |
| Cooldown | 2 |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Stronger | Minor | 1 | +6% bonus |
| Louder | Minor | 1 | +5% bonus |
| Fiercer | Minor | 1 | +5% bonus |
| Longer | Minor | 1 | +1 turn |
| Battle Orders | Major | 1 | Also +15% DEF |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Frenzy | Major | 2 | Attack twice, +15% taken |
| Heal Pack | Major | 1 | Also heal 25% |
| Coordinated | Major | 2 | All attack same target |
| Enrage | Major | 1 | +30% SPD |
| Sacrifice | Major | 1 | Kill one, others +its stats |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Link | Major | 2 | Share HP pool |
| Unleash | Major | 2 | Double attack this turn |
| Empower | Major | 1 | +50% all stats 1 turn |
| Eternal Command | Major | 1 | Buffs permanent |
| Overlord | Capstone | 1 | +60% damage/DEF, attack twice, permanent |

---

#### 50. SPIRIT LINK
**Base:** Share damage with summons.
| Stat | Value |
|------|-------|
| Effect | 30% damage to you → summons |
| Target | Self + Summons |
| Type | Passive |

**SKILL TREE (15 nodes):**

**EARLY (1-5 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Stronger Link | Minor | 1 | +5% transfer |
| Deeper | Minor | 1 | +5% transfer |
| Wider | Minor | 1 | +5% transfer |
| Bonded | Minor | 1 | +5% transfer |
| Life Link | Major | 1 | Summon death = heal 12% |

**MID (6-10 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Empathic | Major | 2 | Your buffs 40% to summons |
| Sacrifice Shield | Major | 1 | Summon dies for you (once) |
| Mend | Major | 2 | Your healing 50% to summons |
| Death Pact | Major | 1 | Take damage to save summon |
| Shared Power | Major | 1 | +10% your damage per summon |

**DEEP (11-15 points):**
| Node | Type | Cost | Effect |
|------|------|------|--------|
| Soul Bond | Major | 2 | Summons revive after 3 turns |
| Eternal | Major | 2 | Linked summons +25% stats |
| Hivemind | Major | 1 | You feel no pain (summons take all) |
| One Mind | Major | 1 | Your skills usable by summons |
| Legion Commander | Capstone | 1 | 70% to summons, they +50% stats, revive 2 turns |

---

## IMPLEMENTATION SUMMARY

### Damage Scaling Reference
| Attack Type | Scaling |
|-------------|---------|
| Basic Attack | 0.7× ATK |
| Skill (low) | 0.9× |
| Skill (mid) | 1.0-1.1× |
| Skill (high) | 1.2-1.3× |

### Tree Investment
| Stack Level | Max Points | Reachable Tier |
|-------------|------------|----------------|
| Skill | 5 | Early only |
| Skill² | 10 | Early + Mid |
| Skill³ | 15 | Early + Mid + Deep + Capstone |

### Capstone Power
Every skill has exactly 1 capstone at the deepest level (costs 1 point, requires 14 points in tree). Only Skill³ heroes can reach capstones.

---

## WHAT'S NEXT

1. Review balance and fantasy
2. Confirm archetype → art mapping
3. Build skill tree UI
4. Implement point spending
5. Test with real combat

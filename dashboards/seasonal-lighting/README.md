<div align="center">

# 🎃 Seasonal Lighting

### Holiday light scenes that only show up when the holiday is near.

![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2026.5%2B-41BDF5?logo=homeassistant&logoColor=white) ![HACS](https://img.shields.io/badge/HACS-none%20needed-27AE60) ![Status](https://img.shields.io/badge/status-beta-yellow)

</div>

---

## ✨ What you get

| 🎉 Holiday | 🗓️ Shows up | 🎨 Scene |
|---|---|---|
| 🎃 Halloween | 14 days before Oct 31 | Orange and purple |
| 🎄 Christmas | 24 days before Dec 25 | Red and green |
| 💘 Valentine's | 14 days before Feb 14 | Pinks |
| 🍀 St. Patrick's | 14 days before Mar 17 | Greens |
| 🐣 Easter | 14 days before Easter Sunday (calculated each year) | Pastels |
| 🍁 Canada Day | 14 days before Jul 1 | Red and white |
| 🦃 Thanksgiving | 14 days before the second Monday of October (Canada) | Harvest oranges |

**The trick:** each holiday gets a `binary_sensor` that is `on` only during its window. The dashboard button for that holiday has a `visibility` rule on the sensor, so the button appears when the season starts and disappears when it ends. No automation, no manual toggling.

**Two looks, pick one:**

| Version | What it is | File |
|---|---|---|
| **v1: badges** | Small buttons in the heading card. Quiet and tidy | `badges-v1.example.yaml` |
| **v2: tiles** | Full-width coloured tiles with a cheerful call to action. Hard to miss, which is the point | `tiles-v2.example.yaml` |

---

## 📦 Requirements

- Home Assistant **2026.5 or newer** (button badges and tile cards with `visibility`)
- At least one **colour-capable light** (the scenes set RGB colours)
- No HACS cards

---

## 🚀 Setup in 4 steps

1. **Add the package.** Copy `packages/seasonal_lighting.yaml` into your config's packages folder (see [getting started](../../docs/getting-started.md)).
2. **Swap the lights.** Replace `light.example_room_1` to `light.example_room_4` with your own lights, and change the colours if you like. Delete lines for lights you don't have.
3. **Reload.** Check the configuration, then reload templates and scenes in Developer tools → YAML (restart if a reload isn't listed).
4. **Add the buttons.** Paste v1 under a heading card's `badges:`, or v2 as cards in a section, then save the dashboard.

> 💡 Prefer the UI? Each `state:` template in the package works pasted into a **Template helper** (binary sensor). Name the helpers `Halloween Season`, `Christmas Season` and so on, so the entity IDs match the dashboard files.

---

## 🔁 Placeholders to replace

| Placeholder | Replace with |
|---|---|
| `light.example_room_1` … `light.example_room_4` | Your colour lights |
| `scene.halloween`, `scene.christmas`, … | Stay as they are if you keep the scene names in the package |
| `binary_sensor.halloween_season`, … | Stay as they are if you keep the sensor names in the package |

---

## 📋 Status

- **Date maths checked** on the first and last day of each window, plus the day before and after, using Home Assistant's template engine: Halloween 2026, Christmas 2026, Easter 2027 (calculated as March 28) and Thanksgiving 2026 and 2027. Valentine's, St. Patrick's and Canada Day use the same fixed-date pattern as Halloween.
- **Not checked:** the full package has not been loaded into a clean instance, and the dashboard files have not been rendered in a browser. The v2 tile options come from the card's documented fields. Look at the first render before trusting it.
- **Light state is not restored** when a season ends. Pair this with [daily adaptive lighting reset](../../docs/daily-adaptive-lighting-reset.md) if you use Adaptive Lighting.
- Thanksgiving is the Canadian date. For the US, change the template to the fourth Thursday of November.

<div align="center">

[🏠 Overview](../../README.md) · [🤖 Automations](../../automations/README.md) · [📜 Scripts](../../scripts/README.md) · [🧩 Blueprints](../../blueprints/README.md) · [📦 Packages](../../packages/README.md) · [📊 Dashboards](../README.md) · [📚 Docs](../../docs/getting-started.md)

</div>

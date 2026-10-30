<div align="center">

# 🌙 Daily Adaptive Lighting Reset

### Every night, your lights go back to their normal colours. Nothing turns on.

![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2026.5%2B-41BDF5?logo=homeassistant&logoColor=white) ![HACS](https://img.shields.io/badge/HACS-Adaptive%20Lighting-FF9800) ![Status](https://img.shields.io/badge/status-beta-yellow)

</div>

---

## ✨ What it does

| 🕒 When | 🔧 What happens |
|---|---|
| Once a day, 3:00 AM by default | **1.** Turns off the sleep mode switches you chose (optional) |
| | **2.** Clears the "manually controlled" flag on each Adaptive Lighting group |
| | **3.** Re-applies the adaptive colour and brightness to lights that are **already on** |

**Why you want it:** a holiday scene, a party mode or any manual colour change makes Adaptive Lighting back off. Without a reset, the lights stay on those colours until someone fixes them by hand. This hands them back every night.

**It never turns a light on.** The apply step is set to leave off lights alone. They pick up the standard colour the next time they come on.

---

## 📦 Requirements

- Home Assistant **2026.5 or newer**
- The [Adaptive Lighting](https://github.com/basnijholt/adaptive-lighting) custom integration, installed through HACS, with at least one group set up

---

## 🚀 Setup in 3 steps

1. **Import the blueprint.** Settings → Automations & scenes → Blueprints → Import Blueprint, then paste the raw URL of `blueprints/automation/daily_adaptive_lighting_reset.yaml`.
2. **Create an automation from it.** Pick your Adaptive Lighting switches, optionally the sleep mode switches, and a time.
3. **Check it once.** Run the automation by hand while a light is on in a scene colour and watch it return to the adaptive colour.

---

## 🔁 Inputs

| Input | What to put | Default |
|---|---|---|
| Adaptive Lighting switches | The main switch of each group, e.g. `switch.adaptive_lighting_<group>` | none, required |
| Sleep mode switches | The matching sleep mode switches, or leave empty | empty |
| Reset time | When to run | `03:00:00` |

---

## 📋 Status

- Taken from an automation running on Home Assistant 2026.10 with two groups. The blueprint wrapper (inputs and the empty-sleep-list check) has **not been imported into a clean instance yet**, so import it and run it once before relying on it.
- The first scheduled run of the original at 3 AM had not happened when this was written.
- If you use sleep mode on purpose at night, leave the sleep switches input empty, or the reset will turn sleep mode off.

<div align="center">

[🏠 Overview](../README.md) · [🤖 Automations](../automations/README.md) · [📜 Scripts](../scripts/README.md) · [🧩 Blueprints](../blueprints/README.md) · [📦 Packages](../packages/README.md) · [📊 Dashboards](../dashboards/README.md) · [📚 Docs](getting-started.md)

</div>

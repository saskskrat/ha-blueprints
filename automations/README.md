<div align="center">

# 🤖 Automations

### Copy-and-adapt automation YAML, sorted by what it does.

![Home Assistant](https://img.shields.io/badge/Home%20Assistant-any%20recent-41BDF5?logo=homeassistant&logoColor=white) ![Style](https://img.shields.io/badge/Style-copy%20and%20adapt-8E44AD) ![Entities](https://img.shields.io/badge/Entities-placeholders-27AE60)

</div>

---

## ✨ What's here

| 📁 Folder | 🔧 File | What it does |
|---|---|---|
| 🚪 `presence/` | `someone_arrives_home.yaml` | After dark, a tracked person arriving turns on an entry light and sends a notification |
| 🚪 `presence/` | `everyone_leaves_setback.yaml` | When everybody has left, turns lights off and sets the thermostat back |
| 💡 `lighting/` | `motion_light_on_off.yaml` | Motion turns a light on, and it goes off 10 minutes after motion clears |
| 🔔 `notifications/` | `device_unavailable_alert.yaml` | Tells you when a device has been `unavailable` for 15 minutes |
| 🔒 `security/` | `door_left_open_alert.yaml` | Tells you when a door has been open for 5 minutes |
| 🌡️ `climate/` | `away_setback.yaml` | Drops the thermostat when a person leaves |
| ⚡ `energy/` | `standby_power_alert.yaml` | Tells you when a device draws over 5 W for 30 minutes |

> 🧩 Several of these have a reusable **blueprint** twin in [`blueprints/`](../blueprints/README.md). If you want the same behaviour in more than one room, import the blueprint instead of copying this file.

---

## 🚀 Use one in 4 steps

1. **Pick a file** and open it.
2. **Swap the placeholders** for your own entity IDs (table below).
3. **Add it to your config.** Either paste it into the automation editor (⋮ → *Edit in YAML*), or put the file in a folder you include with `!include_dir_merge_list` (see [getting started](../docs/getting-started.md)).
4. **Reload automations** in Developer tools → YAML, then trigger it once to test.

## 🔁 Placeholders to replace

| Placeholder | Replace with |
|---|---|
| `person.example_person`, `person.example_person_2` | Your `person` entities |
| `light.example_room`, `light.example_entry` | The lights to control |
| `binary_sensor.example_motion`, `binary_sensor.example_door` | Your motion and door sensors |
| `climate.example_thermostat` | Your thermostat |
| `sensor.example_power` | A power sensor in watts |
| `notify.example_mobile_app` | Your notify service, for example `notify.mobile_app_<your_phone>` |

## 📋 Status

- These are generic starting points. None of them have been loaded into a clean instance as part of publishing this repo.
- They use the classic `platform:` / `service:` keys, which Home Assistant still accepts. Newer releases prefer `trigger:` / `action:` and purpose-specific triggers, so expect to modernise them if you want the latest style.
- Temperatures such as `62` are in °F. Change them if your thermostat uses °C.

<div align="center">

[🏠 Overview](../README.md) · [🤖 Automations](../automations/README.md) · [📜 Scripts](../scripts/README.md) · [🧩 Blueprints](../blueprints/README.md) · [📦 Packages](../packages/README.md) · [📊 Dashboards](../dashboards/README.md) · [📚 Docs](../docs/getting-started.md)

</div>

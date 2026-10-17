<div align="center">

# 📦 Packages

### One file per subsystem: helpers, automations and scripts bundled together.

![Home Assistant](https://img.shields.io/badge/Home%20Assistant-any%20recent-41BDF5?logo=homeassistant&logoColor=white) ![Needs](https://img.shields.io/badge/Needs-packages%20enabled-F39C12)

</div>

---

## ✨ What's here

| 📦 Package | Contains |
|---|---|
| `presence.yaml` | A `guest_mode` toggle plus every automation in [`automations/presence`](../automations/README.md) |
| `lighting.yaml` | Every automation in `automations/lighting` and every script in `scripts/lighting` |
| `maintenance.yaml` | Every script in `scripts/maintenance` and a `last_manual_backup_check` date and time helper |

**Also available on their own branches** (not merged yet): `home_hub.yaml` for the [Home Hub dashboard](../dashboards/README.md) and `room_control_panel.yaml` for the Room Control Panel.

---

## 🚀 Turn packages on, then add one

1. In `configuration.yaml`, enable packages once:

   ```yaml
   homeassistant:
     packages: !include_dir_named packages
   ```

2. Copy the package you want into your `packages/` folder. Because these files use `!include_dir_merge_*` to pull in the matching `automations/` and `scripts/` folders, keep the repo's folder layout next to `packages/`, or edit the paths.
3. Run **Developer tools → YAML → Check configuration**, then restart Home Assistant.

## 🧠 Why packages

| Benefit | How |
|---|---|
| Keeps `configuration.yaml` short | Each subsystem lives in one file |
| Easy to switch a feature off | Remove one file |
| Easy to share | Everything a feature needs travels together |

## 📋 Status

- The packages are generic and untested on a clean instance.
- `last_manual_backup_check` has no consumer yet. It is a helper for you to wire into your own backup reminders.
- Paths such as `../automations/lighting` are relative to the package file, so moving the file changes what it includes.

<div align="center">

[🏠 Overview](../README.md) · [🤖 Automations](../automations/README.md) · [📜 Scripts](../scripts/README.md) · [🧩 Blueprints](../blueprints/README.md) · [📦 Packages](../packages/README.md) · [📊 Dashboards](../dashboards/README.md) · [📚 Docs](../docs/getting-started.md)

</div>

<div align="center">

# 📜 Scripts

### Small reusable actions you can call from automations, dashboards and voice.

![Home Assistant](https://img.shields.io/badge/Home%20Assistant-any%20recent-41BDF5?logo=homeassistant&logoColor=white) ![Style](https://img.shields.io/badge/Style-copy%20and%20adapt-8E44AD)

</div>

---

## ✨ What's here

| 📁 Folder | 📜 Script | What it does |
|---|---|---|
| 🔔 `notifications/` | `notify_all_devices` | Sends one title and message to two phones in parallel. Takes `title` and `message` fields |
| 🛠️ `maintenance/` | `check_pending_updates` | Collects every `update.*` entity that is waiting and sends one notification listing them. Stays quiet when nothing is pending |
| 💡 `lighting/` | `toggle_color_mode` | Toggles a set of bulbs |

---

## 🚀 Use one in 4 steps

1. Open the file and copy its contents.
2. In **Settings → Automations & scenes → Scripts**, create a script, switch to *YAML mode* and paste. Or include the folder with `!include_dir_merge_named` (see [getting started](../docs/getting-started.md)).
3. Replace the placeholders: `notify.example_mobile_app`, `notify.example_mobile_app_2`, `light.example_bulbs`.
4. Run it once from the script's page to test.

Call a script from an automation with `action: script.notify_all_devices` and pass the fields as `data:`.

## 🔗 Used by

- [`packages/lighting.yaml`](../packages/README.md) and [`packages/maintenance.yaml`](../packages/README.md) include these folders for you.
- `check_pending_updates` pairs well with a daily time-based automation.

## 📋 Status

- `toggle_color_mode` is named "remember previous" in its alias, but the sequence is currently a plain `light.toggle`. Treat it as a starting point and add your own remembering step.
- The scripts are generic and untested on a clean instance. Each ends with `mode: single` except `notify_all_devices`, which is `parallel`.

<div align="center">

[🏠 Overview](../README.md) · [🤖 Automations](../automations/README.md) · [📜 Scripts](../scripts/README.md) · [🧩 Blueprints](../blueprints/README.md) · [📦 Packages](../packages/README.md) · [📊 Dashboards](../dashboards/README.md) · [📚 Docs](../docs/getting-started.md)

</div>

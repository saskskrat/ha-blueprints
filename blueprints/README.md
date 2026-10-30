<div align="center">

# 🧩 Blueprints

### Import once, reuse everywhere. No copy-pasting YAML.

![Home Assistant](https://img.shields.io/badge/Home%20Assistant-any%20recent-41BDF5?logo=homeassistant&logoColor=white) ![Import](https://img.shields.io/badge/Import-one%20click-F39C12) ![Domain](https://img.shields.io/badge/Domain-automation-8E44AD)

</div>

---

## ✨ What's here

| 🧩 Blueprint | Inputs | What it does |
|---|---|---|
| **Climate setback when a person leaves** (`away_climate_setback.yaml`) | person, thermostat, away temperature | Sets the thermostat to your away temperature when that person leaves |
| **Turn off light N minutes after motion clears** (`motion_light_off.yaml`) | motion sensor, light target, delay | Turns lights off a chosen number of minutes after motion stops |
| **Notify when an entity reaches a state** (`notify_on_state.yaml`) | any entity, state, optional wait, notify service, message | One blueprint for door-left-open, device-offline, arrival alerts and similar |

---

## 🚀 Import in 3 steps

1. In Home Assistant open **Settings → Automations & scenes → Blueprints → Import blueprint**.
2. Paste the raw GitHub URL of the file, for example:

   ```
   https://raw.githubusercontent.com/saskskrat/ha-blueprints/main/blueprints/automation/notify_on_state.yaml
   ```

3. Click **Preview**, then **Import**. Now create an automation from it and fill in the inputs.

You can import a blueprint more than once and make several automations from it, one per room or device.

## 🧠 Why blueprints beat copy-paste

| Copy and paste | Blueprint |
|---|---|
| Edit entity IDs in YAML for every room | Pick entities from a dropdown |
| Fix a bug in every copy | Re-import once |
| Easy to make a typo | Selectors only offer valid entities |

## 🔗 Plain-YAML twins

The same ideas as readable, adaptable YAML live in [`automations/`](../automations/README.md): `away_setback`, `motion_light_on_off`, `door_left_open_alert` and `device_unavailable_alert`.

## 📋 Status

- These blueprints use the classic `platform:` / `service:` keys, which Home Assistant still accepts. They have not been re-tested on every release.
- `notify_on_state` takes the notify service as text, for example `notify.notify` or `notify.mobile_app_<your_phone>`.

<div align="center">

[🏠 Overview](../README.md) · [🤖 Automations](../automations/README.md) · [📜 Scripts](../scripts/README.md) · [🧩 Blueprints](../blueprints/README.md) · [📦 Packages](../packages/README.md) · [📊 Dashboards](../dashboards/README.md) · [📚 Docs](../docs/getting-started.md)

</div>

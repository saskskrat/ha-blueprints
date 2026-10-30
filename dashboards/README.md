<div align="center">

# 📊 Dashboards

### Starter layouts and full generators for Lovelace.

![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2026.5%2B%20for%20the%20big%20ones-41BDF5?logo=homeassistant&logoColor=white) ![Generator](https://img.shields.io/badge/Generator-bun%20%2B%20TypeScript-F9F1E1?logo=bun&logoColor=white)

</div>

---

## ✨ What's here

| 📊 Dashboard | Where | What it is |
|---|---|---|
| 💡 **Example lighting dashboard** | `dashboards/example_lighting_dashboard.yaml` (on `main`) | A tiny two-card starter you can paste into the raw editor |
| 🛋️ **Room Control Panel** | branch [`dashboard/room-control-panel`](https://github.com/saskskrat/ha-blueprints/tree/dashboard/room-control-panel/dashboards/room-control-panel) | One expandable card per room: scenes, whole-room light control, lights and media. Built by a generator |
| 🏠 **Home Hub** | branch [`dashboard/home-hub`](https://github.com/saskskrat/ha-blueprints/tree/dashboard/home-hub/dashboards/home-hub) | The full multi-view dashboard: Home with room cards, Media, People, Automations, System, plus an optional flight tracker |

Home Hub reuses the Room Control Panel's room cards, so the two look and behave the same.

---

## 🚀 Use any of them

**The starter (no tools needed)**

1. Create a dashboard: **Settings → Dashboards → Add dashboard**.
2. Open it, ⋮ → **Raw configuration editor**, paste the file, save.
3. Swap the `example_*` entities for yours.

**The generators**

1. Install [bun](https://bun.sh).
2. Open the dashboard's folder, copy the `*.example.json` config to your own, edit areas and entities.
3. Run `bun build.ts <your-config>.json out/`.
4. Paste the generated JSON into a dashboard's raw configuration editor. Each folder's README has the full steps and its HACS card list.

## 🔗 Related

- Scenes, lights and media on these dashboards are found **by area**, so a good area setup in Home Assistant is the main prerequisite.
- The hide/unhide feature relies on a package: see [`packages/`](../packages/README.md).

## 📋 Status

- The two generated dashboards come from a dashboard running on Home Assistant 2026.10. Their example outputs use placeholder areas and are not meant to be loaded as is.
- Until their branches are merged, the links above point at the branches.

<div align="center">

[🏠 Overview](../README.md) · [🤖 Automations](../automations/README.md) · [📜 Scripts](../scripts/README.md) · [🧩 Blueprints](../blueprints/README.md) · [📦 Packages](../packages/README.md) · [📊 Dashboards](../dashboards/README.md) · [📚 Docs](../docs/getting-started.md)

</div>

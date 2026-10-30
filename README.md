<div align="center">

# 🏡 Home Assistant Blueprints & Templates

### Generic, ready-to-share automations, scripts, blueprints, packages and dashboards.

![Home Assistant](https://img.shields.io/badge/Home%20Assistant-templates-41BDF5?logo=homeassistant&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-27AE60) ![Personal data](https://img.shields.io/badge/Personal%20data-none-E74C3C) ![Entities](https://img.shields.io/badge/Entities-placeholders-8E44AD)

</div>

---

## 🗺️ Pick your path

| I want to… | Go to |
|---|---|
| ⚡ Reuse logic across rooms without copy-paste | [🧩 Blueprints](blueprints/README.md) |
| 🤖 Read and adapt a ready-made automation | [🤖 Automations](automations/README.md) |
| 📜 Grab a small reusable action | [📜 Scripts](scripts/README.md) |
| 📦 Split my config into tidy per-feature files | [📦 Packages](packages/README.md) |
| 📊 Build a dashboard | [📊 Dashboards](dashboards/README.md) |
| 📚 Wire this repo into my config | [Getting started](docs/getting-started.md) |

---

## 🧭 How the pieces fit together

```
blueprints/   reusable, parameterised automations (import from the UI)
automations/  plain-YAML versions you can read and adapt
scripts/      small actions the automations and dashboards call
packages/     bundles of the above plus helpers, one file per feature
dashboards/   starter layouts and generators that sit on top of all of it
docs/         naming conventions, getting started, contributing
```

Every folder has a README written the same way: what is here, how to use it in a few steps, what to replace, and an honest status.

## 🚀 Quick start

1. **Clone or download** this repo.
2. **Blueprints:** Settings → Automations & scenes → Blueprints → Import, paste the raw URL of a file under `blueprints/automation/`.
3. **Everything else:** copy the file, replace the `example_*` entity IDs with yours, then merge it in (see [getting started](docs/getting-started.md)).
4. Keep secrets, coordinates and webhook IDs in `!secret`, never in a shared file.

## 🔒 Privacy promise

All entity names here are placeholders (`light.example_room`, `person.example_person`). No names, addresses, coordinates, device IDs or tokens belong in this repo.

## 🌿 How changes land

Every new template arrives on **its own branch** and is merged into `main` only after the maintainer has reviewed it. If you contribute, open a pull request from your own branch and leave the merge to the maintainer. More in [contributing](docs/contributing.md).

## 📄 License

MIT. See [`LICENSE`](LICENSE). Use, adapt and share freely; attribution is appreciated but not required.

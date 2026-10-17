<div align="center">

# 🏠 Home Hub

### One dashboard to run the whole house: rooms, media, people, automations, system, and a live flight tracker.

![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2026.5%2B-41BDF5?logo=homeassistant&logoColor=white)
![HACS](https://img.shields.io/badge/HACS-3%20cards%20required-FF9800)
![Generator](https://img.shields.io/badge/generator-bun%20%2B%20TypeScript-F9F1E1?logo=bun&logoColor=black)
![Status](https://img.shields.io/badge/status-beta-yellow)

</div>

---

## ✨ What you get

| 🧭 View | What it does |
|---|---|
| 🏡 **Home** | People at a glance, everything that is on right now, and one expandable card per room |
| 🛋️ **Room cards** | Scenes, whole-room light control (White presets or Colour wheel), then every light and media player in the room |
| 🎬 **Media** | Music Assistant player, every speaker with volume, optional TV remote |
| 👥 **People** | People and their phones/trackers, with hide and unhide |
| 🤖 **Automations** | Automations, scripts and scenes in one place, with hide and unhide |
| 🛠️ **System** | Backups, available updates, unavailable entities |
| ✈️ **Flight tracker** *(optional)* | A hidden dashboard with a radar view and a map view, linked from a live plane-count badge on Home |

**The trick:** rooms, scenes, lights and media are found *by area*, so a new bulb or speaker shows up without you touching the dashboard. Scenes and entities can be hidden with a tiny eye icon, and the hidden list lives in Home Assistant, not the browser.

---

## 📦 Requirements

### Home Assistant

- Home Assistant **2026.5 or newer** (uses the `shortcut` card and current tile features)
- The **bun** runtime on the machine where you generate the dashboard: https://bun.sh

### HACS frontend cards

| Card | Needed for | Required? |
|---|---|---|
| [auto-entities](https://github.com/thomasloven/lovelace-auto-entities) | Everything that discovers entities by area | ✅ Yes |
| [button-card](https://github.com/custom-cards/button-card) | Eye buttons and light % readouts | ✅ Yes |
| [expander-card](https://github.com/Alia5/lovelace-expander-card) | Collapsible room cards | ✅ Yes |
| [mass-player-card](https://github.com/Sven2410/mass-player-card) + the [Music Assistant](https://www.home-assistant.io/integrations/music_assistant/) integration | Media view player | Optional |
| [firemote-card](https://github.com/PRProd/HA-Firemote) | TV remote | Optional |
| [FlightRadar24 integration](https://github.com/AlexandrErohin/home-assistant-flightradar24) + its radar card | Flight tracker | Optional |

### Things your Home Assistant needs

- **Areas** assigned to your rooms (the dashboard reads area membership)
- A **light group** per room you want white/colour presets for (Settings → Devices & services → Helpers → Group)
- Optional: an `input_button` that turns all lights off, for the "All off" chip on Home

---

## 🚀 Setup in 6 steps

**1. Get the files**

```bash
git clone https://github.com/<you>/ha-blueprints.git
cd ha-blueprints
git checkout dashboard/home-hub      # or main, once this is merged
cd dashboards/home-hub
```

**2. Describe your house.** Copy `hub.example.json` to `hub.json` and edit it:

| Key | What to put |
|---|---|
| `title` | Dashboard title |
| `dashboardPath` | URL slug, **must contain a hyphen**, e.g. `home-hub` |
| `prefix` | Prefix for helper names. Default `hub_` matches `packages/home_hub.yaml` |
| `ignoreLabel` | A label; anything carrying it is never shown |
| `mediaExclude` | Media players to hide everywhere, by entity ID |
| `kelvin` | Warm / daylight / cool preset temperatures |
| `allOffButton` | An `input_button` entity, or `null` to drop the chip |
| `remote` | Your TV remote details, or `null` |
| `flightTracker` | The flight sensor, radar range in km and optional `location`, or `null` |
| `rooms` | One entry per room (below) |

Each room:

```json
{ "area": "living_room", "kind": "color",
  "lightGroup": "light.living_room_lights",
  "modeHelper": "input_select.living_room_light_mode", "expanded": true }
```

`kind` is `color` (mode button, presets, brightness, all-off), `onoff` (all-off only) or `none` (no room-level controls).

**3. Generate**

```bash
bun build.ts hub.json out/
```

This writes `out/dashboard.json`, `out/helpers.yaml` and, if you enabled it, `out/flight-tracker.json`.

**4. Add the helpers.** Copy `out/helpers.yaml` into your configuration (or create the same two-option `White` / `Colour` selects in the UI), and copy `../../packages/home_hub.yaml` into your `packages/` folder. Check configuration, then restart Home Assistant.

**5. Create the dashboard.** Settings → Dashboards → Add dashboard (use your `dashboardPath` as the URL). Open it, ⋮ → **Raw configuration editor**, paste the contents of `out/dashboard.json`, save. JSON is valid YAML there.

**6. (Optional) Flight tracker.** Add a second dashboard with the URL you set in `flightDashboardPath` (default `flight-tracker`), switch off *Show in sidebar*, and paste `out/flight-tracker.json` the same way.

Then make it your default in your profile settings, or as admin under Settings → Dashboards.

---

## 🔌 Data it depends on

- **Scenes need an area** to appear in a room.
- **Cast speakers and similar** take their room from the *device*, not the entity. Set the area on the device.
- **Light groups** can be left out of an area: the room card names them directly. They are filtered out of the per-light list so members don't appear twice.
- Add your `ignoreLabel` to anything you never want to see.

---

## ✈️ Flight tracker notes

- The integration's **radius is in metres**. A value of `5` watches a 10 metre patch of sky and the radar stays empty. Use `5000` for a 5 km circle.
- Set `flightTracker.rangeKm` to match, so the radar and the data agree.
- Set `location` if the radar centres on the wrong spot, for example `{ "lat": 0.0, "lon": 0.0 }` with your real coordinates. Without it the radar card uses your Home Assistant home zone.
- 🔒 Your coordinates then live in the dashboard. Keep that file private, and note that some config-backup tools flag the word `latitude:`, which is why the key is written `lat` / `lon`.
- Optional extra: an automation that notifies your phone when a plane enters the area, with the compass direction and height above the horizon to look. See `docs/` if it has been added, or ask for the example.

---

## 🧠 How hiding works

Tap the eye on a scene, person, player or automation. The `hub_toggle_hidden` script fires an event, a trigger-based template sensor stores the list in its `hidden` attribute, and the dashboard filters on it. "Show hidden" switches (`hub_show_hidden_*`) reveal everything again so you can unhide.

---

## 🩺 Troubleshooting

| Symptom | Cause and fix |
|---|---|
| One red "Configuration error" per character in a list | `auto-entities` got JSON instead of a Python list. Don't add `\| to_json` to the templates; the generator already emits the right form |
| Room shows nothing | The area ID in `hub.json` doesn't match the real area ID (check Settings → Areas, the slug in the URL) |
| Media speaker missing from its room | The area is set on the entity but Cast wants it on the *device* |
| Hidden items return after a restart | See *Status* below, then check the sensor's `hidden` attribute in Developer tools → States |
| `dashboardPath` rejected | New dashboards need a hyphen in the URL |

---

## 📋 Status (honest version)

- The card structure and templates come from a dashboard running on Home Assistant 2026.10. The generator's output for the example config has been checked against the structure of that dashboard.
- `example_*` areas and entities are placeholders; the example dashboard is not meant to be loaded as is.
- `packages/home_hub.yaml` uses the same hide logic as the original, renamed to the `hub_` prefix. The renamed package has **not been installed on a clean instance yet**, so run it once and check that hidden items survive a restart before relying on it.
- No screenshots are included. If you add some, drop them in `docs/`.

---

<div align="center">

Built with ❤️ and a lot of `auto-entities` templates.

</div>

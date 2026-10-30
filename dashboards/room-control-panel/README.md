# Room Control Panel

One expandable card per room. Open a room and you get, in order:

1. **Scenes** for that room, one tap to run. An eye icon on each scene hides it;
   "Show hidden" brings hidden scenes back so you can unhide them.
2. **Room lights**, acting on every light in the room at once. A mode button flips
   between **White** (warm / daylight / cool presets + brightness) and **Colour**
   (colour favourites + brightness; tap the tile for the full colour wheel).
3. **Lights**, **Media**: every light and media player in the room, discovered
   from the area. Tap an icon to toggle; tap the tile for that device's full controls.

Rooms are found by area, so a new light or speaker assigned to a room shows up
without touching the dashboard.

## What's here

| File | What it is |
|------|------------|
| `build.ts` | Generator. Reads a rooms file, writes the dashboard config and the helpers it needs |
| `rooms.example.json` | Example input with placeholder areas/entities |
| `dashboard.example.json` | Generated from the example (what `build.ts` produces) |
| `helpers.example.yaml` | Generated `input_select` helpers for the example |
| `../../packages/room_control_panel.yaml` | The hide/unhide machinery: toggle script, show-hidden switch, sensor |

## Requirements

- Home Assistant 2026.5 or newer (uses the `shortcut` card). Generated structure checked on 2026.10.
- HACS frontend cards: **auto-entities**, **button-card**, **expander-card**.
- Each room you want colour control for needs a **light group** and a two-option
  `input_select` (`White`, `Colour`). `build.ts` writes the helper YAML for you.

## Setup

1. Copy `rooms.example.json` to `rooms.json` and edit it: your area IDs, light
   groups, and mode helpers. Room `kind`:
   - `color`: mode button, presets, brightness, all-off
   - `onoff`: all-off only (plugs, non-dimmable lights)
   - `none`: no room-level controls
2. `bun build.ts rooms.json out/` writes `out/dashboard.json` and `out/helpers.yaml`.
3. Add `out/helpers.yaml` to your configuration (or create the same helpers in the UI)
   and add `packages/room_control_panel.yaml`. Restart or reload.
4. Create a dashboard, open it, **Raw configuration editor**, paste `dashboard.json`
   (JSON is valid YAML there).

## Data this depends on

The cards read Home Assistant's area assignments, so a few things need to be right:

- **Light groups need an area** only if you want them found by area; the card
  references them by entity ID, so they work either way. Groups are left out of the
  Lights list so members don't show twice.
- **Scenes need an area** to appear in a room.
- **Cast speakers and similar** take their room from the *device*, not the entity.
  Set the area on the device.
- Add the `dashboard_ignore` label (or whatever `ignoreLabel` is) to anything you
  never want shown. `mediaExclude` drops specific media players everywhere.

## Notes worth knowing

- Light % readouts sit over the right end of each slider and ignore taps, so the
  slider stays usable. Offsets are tuned for the default tile height.
- `auto-entities` template output must be a plain Python list as printed by
  `{{ list }}`. Don't add `| to_json`: Home Assistant fails to parse the `true`/`false`
  and the card renders one "Configuration error" per character.
- Rooms are dealt into two columns, each one section, so expanding a room only
  moves the rooms below it in its own column.

## Status

The card structure and Jinja filters are taken from a dashboard running on Home
Assistant 2026.10. `packages/room_control_panel.yaml` was written for this repo from
the behaviour of that setup and has not been run on a live instance yet. Check that
hidden items survive a restart before relying on it.

# Home Assistant Blueprints & Templates

A general-purpose, ready-to-share library of Home Assistant automations, scripts,
blueprints, packages, and dashboards. Everything here uses generic entity names
(`light.example_room`, `person.example_person`, etc.) so you can drop a file in,
swap the entity IDs for your own, and go — no personal data, area names, or
device-specific quirks baked in.

## Why blueprints first

Where an automation is reusable across rooms/devices, it's written as a
**blueprint** (`blueprints/automation/`) with `input:` fields, so you import it
once via Settings → Automations → Blueprints → Import and reuse it everywhere
instead of copy-pasting YAML. Plain automation/script YAML is for patterns that
are useful to read/adapt but aren't generic enough to fully parameterize.

## Structure

```
automations/       Copy-and-adapt automation YAML, grouped by purpose
  presence/         Arrivals, departures, "someone's home" logic
  lighting/         Motion lighting, scenes, adaptive/circadian lighting
  notifications/    Mobile/notify.* alerts
  security/         Locks, alarms, cameras, unexpected-state alerts
  climate/          HVAC setbacks, fan control
  energy/           Standby power, high-usage alerts
scripts/            Reusable scripts, same grouping as automations
  lighting/
  notifications/
  maintenance/       Backup checks, update checks, housekeeping
blueprints/
  automation/         Reusable, parameterized automation blueprints (import via UI)
packages/             Domain-scoped packages bundling helpers + automations + scripts
                       — one file per subsystem, for splitting configuration.yaml
dashboards/            Lovelace dashboard YAML (raw config, not UI-editor mode)
docs/
  getting-started.md      How to wire this repo into an existing HA config
  naming-conventions.md   Suggested naming rules
  contributing.md         How to add/improve a template
```

## Quick start

1. Clone or download this repo.
2. Import a blueprint directly: Settings → Automations & Scenes → Blueprints →
   Import Blueprint → paste the raw GitHub URL of a file under `blueprints/automation/`.
3. For plain automations/scripts/packages, copy the file into your own config,
   replace the placeholder entity IDs (`light.example_*`, `person.example_person`,
   `binary_sensor.example_motion`, etc.) with your real ones, and merge it in via
   `!include_dir_merge_list` / `!include_dir_merge_named` (see `docs/getting-started.md`).
4. Replace any hardcoded values that should be secret (tokens, lat/long, webhook
   IDs) with `!secret <name>`.

## License

MIT — see `LICENSE`. Use, adapt, and share freely; attribution appreciated but
not required.

## Contributing

PRs welcome — see `docs/contributing.md` for the shape a new template should take
(placeholder entities, no personal data, a comment explaining the pattern).

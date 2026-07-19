# Naming conventions used in this repo

- **Entity IDs:** `domain.example_<role>`, e.g. `light.example_kitchen`,
  `binary_sensor.example_motion`, `person.example_person`.
- **Automation alias:** `Verb Object [Context]`, e.g. "Turn off lights after
  motion clears", "Notify on device offline".
- **Script alias:** `Verb noun (clarifier)`.
- **File names:** snake_case of the alias, one automation/script per file.
- **Blueprint `input:` names:** `snake_case`, always with a `name:` and, where
  helpful, a `description:` so the UI import form is self-explanatory.

If you're adapting a template for your own instance, keep these conventions
for anything you plan to contribute back — see `docs/contributing.md`.

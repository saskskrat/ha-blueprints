# Getting started

## Option A: import a single blueprint
Settings → Automations & Scenes → Blueprints → Import Blueprint → paste the raw
GitHub URL of any file under `blueprints/automation/`. Fill in the `input:`
fields for your entities and you're done.

## Option B: drop in plain automations/scripts/packages
1. Copy the file(s) you want into your own `config/` tree, preserving the
   subfolder structure if you like, or flattening it — your choice.
2. In `configuration.yaml`, wire up whichever directories you're using:

   ```yaml
   homeassistant:
     packages: !include_dir_named packages

   automation: !include_dir_merge_list automations
   script: !include_dir_merge_named scripts
   ```

   (`include_dir_merge_list`/`_named` recurse into subfolders automatically.)
3. Replace every placeholder entity ID (`light.example_room`,
   `binary_sensor.example_motion`, `person.example_person`,
   `climate.example_thermostat`, `notify.example_mobile_app`, etc.) with your
   real entities.
4. Replace anything that should stay secret (API tokens, lat/long, webhook
   IDs) with `!secret <name>` and add the value to your local `secrets.yaml`
   (never commit that file — see `.gitignore`).
5. Check Developer Tools → YAML → Check Configuration before reloading.

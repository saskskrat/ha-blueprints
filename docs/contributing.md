# Contributing a template

1. **Genericize it.** Replace every real entity ID, area name, person, and
   device-specific detail with a placeholder (`light.example_*`,
   `person.example_person`, `sensor.example_*`). No real tokens, coordinates,
   webhook IDs, or usernames — ever.
2. **Prefer a blueprint** if the logic parameterizes cleanly (pick an entity,
   pick a delay, pick a target) — put it in `blueprints/automation/` with
   clear `input:` names and descriptions.
3. **Otherwise, plain YAML** goes in `automations/<category>/` or
   `scripts/<category>/`, grouped by the categories already in this repo
   (presence, lighting, notifications, security, climate, energy,
   maintenance) — add a new category folder only if nothing fits.
4. **Comment the "why," not just the "what."** A one-line comment at the top
   explaining the use case (e.g. "alert when a normally-on device goes
   unavailable for 15+ minutes — usually means a dropped Wi-Fi/cloud
   connection") is more useful than restating the YAML in prose.
5. **Test it** against a real instance before submitting, then swap the real
   entity IDs back out for placeholders.
6. Open a PR; keep one template per PR so review stays easy.

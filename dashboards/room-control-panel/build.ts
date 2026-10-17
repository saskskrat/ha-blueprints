// Room Control Panel generator.
// Turns a small rooms.json into (1) a Lovelace "sections" dashboard config and
// (2) the helpers (input_select per colour room) the dashboard needs.
//
//   bun build.ts rooms.example.json            # writes dashboard.json + helpers.yaml next to the input
//   bun build.ts rooms.example.json out-dir    # writes into out-dir
//
// Why a generator: each room card is ~7 KB of JSON that differs only by area,
// light group and mode helper. Generating it keeps the rooms identical and makes
// "add a room" a one-line change.
//
// Gotcha baked in below: auto-entities `filter.template` output must be a Python
// literal (what `{{ list }}` prints), NOT `| to_json`. Home Assistant parses the
// rendered text with literal_eval, which rejects JSON's true/false, and
// auto-entities then iterates the string character by character and draws one
// "Configuration error" card per character.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

type Kind = "color" | "onoff" | "none";

interface Room {
  area: string; // HA area_id
  kind: Kind; // color = White/Colour mode + presets; onoff = "All lights off" only; none = no room controls
  lightGroup?: string; // light group entity for kind=color (presets/brightness act on it)
  modeHelper?: string; // input_select entity for kind=color (options: White, Colour)
  expanded?: boolean; // start expanded
}

interface Config {
  ignoreLabel: string; // entities with this label are never shown
  hiddenSensor: string; // sensor whose `hidden` attribute holds the per-list hidden entity IDs
  toggleScript: string; // script that toggles an entity in a hidden list
  hiddenListKey: string; // key of the hidden list used for scenes
  showHiddenBoolean: string; // input_boolean that reveals hidden scenes
  mediaExclude: string[]; // media_player entity IDs to leave out everywhere
  kelvin: { warm: number; daylight: number; cool: number };
  rooms: Room[];
}

const [, , inPath, outDirArg] = process.argv;
if (!inPath) {
  console.error("usage: bun build.ts <rooms.json> [out-dir]");
  process.exit(1);
}
const cfg: Config = JSON.parse(readFileSync(inPath, "utf8"));
const outDir = outDirArg ?? dirname(inPath);

const pyList = (xs: string[]) => `[${xs.map((x) => `'${x}'`).join(", ")}]`;

// ---------- Jinja templates (rendered by Home Assistant) ----------

const sceneTemplate = (area: string) =>
  `{% set a='${area}' %}` +
  `{% set H = (state_attr('${cfg.hiddenSensor}','hidden') or {}).get('${cfg.hiddenListKey}', []) %}` +
  `{% set show = is_state('${cfg.showHiddenBoolean}','on') %}` +
  `{% set ign = label_entities('${cfg.ignoreLabel}') %}` +
  `{% set ns = namespace(o=[]) %}` +
  `{% for e in area_entities(a) | select('match','scene\\.') | reject('in', ign) | sort %}` +
  `{% set hd = e in H %}{% if show or not hd %}` +
  `{% set ns.o = ns.o + [{` +
  `'type':'custom:button-card','entity':e,'show_name':false,'show_icon':false,'show_state':false,'show_label':false,` +
  `'tap_action':{'action':'none'},'hold_action':{'action':'none'},` +
  `'custom_fields':{` +
  `'tile':{'card':{'type':'tile','entity':e,` +
  `'tap_action':{'action':'perform-action','perform_action':'scene.turn_on','target':{'entity_id':e}},` +
  `'icon_tap_action':{'action':'perform-action','perform_action':'scene.turn_on','target':{'entity_id':e}}}},` +
  `'eye':{'card':{'type':'custom:button-card','show_name':false,` +
  `'icon':('mdi:eye-off' if hd else 'mdi:eye-outline'),` +
  `'tap_action':{'action':'perform-action','perform_action':'${cfg.toggleScript}','data':{'list':'${cfg.hiddenListKey}','entity_id':e}},` +
  `'hold_action':{'action':'none'},` +
  `'styles':{'card':[{'background':'none'},{'box-shadow':'none'},{'border':'none'},{'padding':'4px'},{'width':'32px'},{'height':'32px'},{'border-radius':'16px'},{'display':('block' if show else 'none')}],` +
  `'icon':[{'width':'18px'},{'color':'var(--secondary-text-color)'}]}}}},` +
  `'styles':{'grid':[{'grid-template-areas':'"tile"'},{'grid-template-columns':'1fr'},{'align-items':'center'}],` +
  `'card':[{'position':'relative'},{'padding':'0'},{'background':'none'},{'box-shadow':'none'},{'border':'none'},{'overflow':'visible'},{'opacity':('0.38' if hd else '1')}],` +
  `'custom_fields':{'tile':[{'width':'100%'}],'eye':[{'position':'absolute'},{'top':'50%'},{'right':'8px'},{'transform':'translateY(-50%)'},{'z-index':'2'}]}}` +
  `}] %}{% endif %}{% endfor %}{{ ns.o }}`;

// % readout for a light, inside the slider row. Shown only for lights that can dim.
const pctJs =
  "[[[ const s = states[entity.entity_id]; if (!s) return ''; " +
  "const m = s.attributes.supported_color_modes || []; " +
  "if (m.length === 0 || (m.length === 1 && m[0] === 'onoff')) return ''; " +
  "if (s.state !== 'on') return 'Off'; " +
  "return Math.round((s.attributes.brightness || 0) / 2.55) + '%'; ]]]";

const lightsTemplate = (area: string) =>
  `{% set a='${area}' %}` +
  // light groups carry an entity_id attribute listing their members; drop them so members don't appear twice
  `{% set groups = states.light | selectattr('attributes.entity_id','defined') | map(attribute='entity_id') | list %}` +
  `{% set hid = label_entities('${cfg.ignoreLabel}') %}` +
  `{% set ns = namespace(o=[]) %}` +
  `{% for e in area_entities(a) | select('match','light\\.') | reject('in', groups) | reject('in', hid) | reject('is_state','unavailable') | sort %}` +
  `{% set ns.o = ns.o + [{` +
  `'type':'custom:button-card','entity':e,'show_name':false,'show_icon':false,'show_state':false,'show_label':false,` +
  `'tap_action':{'action':'none'},'hold_action':{'action':'none'},` +
  `'custom_fields':{'tile':{'card':{'type':'tile','entity':e,'features':[{'type':'light-brightness'}],'features_position':'bottom','hide_state':true,` +
  `'tap_action':{'action':'more-info'},'icon_tap_action':{'action':'toggle'}}},` +
  `'pct':"${pctJs}"},` +
  `'styles':{'grid':[{'grid-template-areas':'"tile"'},{'grid-template-columns':'1fr'}],` +
  `'card':[{'position':'relative'},{'padding':'0'},{'background':'none'},{'box-shadow':'none'},{'border':'none'},{'overflow':'visible'}],` +
  `'custom_fields':{'tile':[{'width':'100%'}],` +
  `'pct':[{'position':'absolute'},{'right':'24px'},{'bottom':'32px'},{'transform':'translateY(50%)'},{'font-size':'11px'},{'font-weight':'500'},{'color':'var(--primary-text-color)'},{'opacity':'0.7'},{'pointer-events':'none'},{'z-index':'2'}]}}` +
  `}] %}{% endfor %}{{ ns.o }}`;

const mediaTemplate = (area: string) =>
  `{% set a='${area}' %}` +
  `{% set hid = label_entities('${cfg.ignoreLabel}') + ${pyList(cfg.mediaExclude)} %}` +
  `{% set ns = namespace(o=[]) %}` +
  `{% for e in area_entities(a) | select('match','media_player\\.') | reject('in', hid) | reject('is_state','unavailable') | sort %}` +
  `{% set ns.o = ns.o + [{'type':'tile','entity':e,'features':[{'type':'media-player-volume-slider'}],` +
  `'tap_action':{'action':'more-info'},'icon_tap_action':{'action':'toggle'}}] %}{% endfor %}{{ ns.o }}`;

// ---------- cards ----------

const heading = (text: string, icon: string, badges?: unknown[]) => ({
  type: "heading",
  heading: text,
  heading_style: "subtitle",
  icon,
  ...(badges ? { badges } : {}),
});

const autoEntities = (template: string, empty: string) => ({
  type: "custom:auto-entities",
  card: { type: "grid", columns: 2, square: false },
  card_param: "cards",
  filter: { template },
  else: { type: "markdown", content: empty },
});

const allOff = (area: string) => ({
  type: "shortcut",
  label: "All lights off",
  icon: "mdi:lightbulb-off-outline",
  tap_action: {
    action: "perform-action",
    perform_action: "light.turn_off",
    target: { area_id: area },
  },
});

const setMode = (helper: string, option: string) => ({
  action: "perform-action",
  perform_action: "input_select.select_option",
  target: { entity_id: helper },
  data: { option },
});

const modeTile = (helper: string, icon: string, nextOption: string) => ({
  type: "tile",
  entity: helper,
  name: "Light mode",
  icon,
  tap_action: setMode(helper, nextOption),
  icon_tap_action: setMode(helper, nextOption),
});

const preset = (label: string, icon: string, group: string, kelvin: number) => ({
  type: "shortcut",
  label,
  icon,
  tap_action: {
    action: "perform-action",
    perform_action: "light.turn_on",
    target: { entity_id: group },
    data: { color_temp_kelvin: kelvin },
  },
});

// A tile with a "NN%" readout at the top right of its label row. The tile's own
// state line is hidden so the percentage shows once.
const tileWithPct = (group: string, tile: Record<string, unknown>) => ({
  type: "custom:button-card",
  entity: group,
  show_name: false,
  show_icon: false,
  show_state: false,
  show_label: false,
  tap_action: { action: "none" },
  hold_action: { action: "none" },
  custom_fields: {
    tile: { card: { ...tile, entity: group, hide_state: true } },
    pct:
      "[[[ const s = states[entity.entity_id]; if (!s || s.state === 'unavailable') return ''; " +
      "if (s.state !== 'on') return 'Off'; return Math.round((s.attributes.brightness || 0) / 2.55) + '%'; ]]]",
  },
  styles: {
    grid: [{ "grid-template-areas": '"tile"' }, { "grid-template-columns": "1fr" }],
    card: [
      { position: "relative" },
      { padding: "0" },
      { background: "none" },
      { "box-shadow": "none" },
      { border: "none" },
      { overflow: "visible" },
    ],
    custom_fields: {
      tile: [{ width: "100%" }],
      pct: [
        { position: "absolute" },
        { top: "28px" },
        { transform: "translateY(-50%)" },
        { right: "16px" },
        { "font-size": "11px" },
        { color: "var(--secondary-text-color)" },
        { opacity: "0.7" },
        { "pointer-events": "none" },
        { "z-index": "2" },
      ],
    },
  },
});

const showHiddenBadge = (icon: string, text: string, whenState: "on" | "off") => ({
  type: "button",
  icon,
  text,
  visibility: [{ condition: "state", entity: cfg.showHiddenBoolean, state: whenState }],
  tap_action: {
    action: "perform-action",
    perform_action: "input_boolean.toggle",
    target: { entity_id: cfg.showHiddenBoolean },
  },
});

const roomControls = (r: Room) => {
  if (r.kind === "none") return [];
  const head = heading("Room lights", "mdi:lightbulb-group-outline");
  if (r.kind === "onoff") return [head, allOff(r.area)];
  const helper = r.modeHelper!;
  const group = r.lightGroup!;
  return [
    head,
    {
      type: "conditional",
      conditions: [{ condition: "state", entity: helper, state: "White" }],
      card: {
        type: "vertical-stack",
        cards: [
          modeTile(helper, "mdi:white-balance-sunny", "Colour"),
          {
            type: "grid",
            columns: 3,
            square: false,
            cards: [
              preset("Warm", "mdi:weather-sunset", group, cfg.kelvin.warm),
              preset("Daylight", "mdi:white-balance-sunny", group, cfg.kelvin.daylight),
              preset("Cool", "mdi:snowflake", group, cfg.kelvin.cool),
            ],
          },
          tileWithPct(group, {
            type: "tile",
            name: "Brightness",
            features: [{ type: "light-brightness" }],
            tap_action: { action: "more-info" },
          }),
          allOff(r.area),
        ],
      },
    },
    {
      type: "conditional",
      conditions: [{ condition: "state", entity: helper, state: "Colour" }],
      card: {
        type: "vertical-stack",
        cards: [
          modeTile(helper, "mdi:palette", "White"),
          tileWithPct(group, {
            type: "tile",
            name: "Colour (tap for wheel)",
            icon: "mdi:palette",
            features: [{ type: "light-color-favorites" }, { type: "light-brightness" }],
            tap_action: { action: "more-info" },
          }),
          allOff(r.area),
        ],
      },
    },
  ];
};

const roomCard = (r: Room) => ({
  type: "custom:expander-card",
  "title-card": {
    type: "area",
    area: r.area,
    display_type: "compact",
    features: [{ type: "area-controls" }],
    tap_action: { action: "none" },
  },
  "title-card-clickable": false,
  // keeps the chevron inside the header so opened content is the same width
  "title-card-button-overlay": true,
  "overlay-margin": "8px",
  icon: "mdi:chevron-down",
  expanded: r.expanded ?? false,
  "storage-id": `room_panel_${r.area}`,
  padding: "12px",
  "child-padding": "0",
  "expanded-gap": "12px",
  clear: false,
  "expander-card-background": "color-mix(in srgb, var(--primary-text-color) 5%, transparent)",
  grid_options: { columns: "full" },
  cards: [
    heading("Scenes", "mdi:palette-outline", [
      showHiddenBadge("mdi:eye-off-outline", "Show hidden", "off"),
      showHiddenBadge("mdi:eye", "Hide hidden", "on"),
    ]),
    autoEntities(sceneTemplate(r.area), "No scenes in this room."),
    ...roomControls(r),
    heading("Lights", "mdi:lightbulb-outline"),
    autoEntities(lightsTemplate(r.area), "No lights in this room."),
    heading("Media", "mdi:play-circle-outline"),
    autoEntities(mediaTemplate(r.area), "No media players in this room."),
  ],
});

// ---------- dashboard ----------

// Rooms are dealt into two stacked columns (each column is one section) so that
// expanding a room only pushes down the rooms below it in the same column.
const columns: Room[][] = [[], []];
cfg.rooms.forEach((r, i) => columns[i % 2].push(r));

const dashboard = {
  title: "Room Control Panel",
  views: [
    {
      title: "Rooms",
      path: "rooms",
      icon: "mdi:home-outline",
      type: "sections",
      max_columns: 2,
      sections: columns.filter((c) => c.length).map((c) => ({ type: "grid", cards: c.map(roomCard) })),
    },
  ],
};

// ---------- helpers ----------

const helperLines = cfg.rooms
  .filter((r) => r.kind === "color")
  .map((r) => {
    const id = r.modeHelper!.replace(/^input_select\./, "");
    return [
      `${id}:`,
      `  name: ${id.replace(/_/g, " ")}`,
      `  icon: mdi:palette`,
      `  options:`,
      `    - White`,
      `    - Colour`,
    ].join("\n");
  });

const helpersYaml =
  `# Generated by build.ts. Add under your configuration (or a package), or create\n` +
  `# the same helpers in Settings > Devices & services > Helpers.\n` +
  `input_select:\n` +
  helperLines.map((l) => l.replace(/^/gm, "  ")).join("\n\n") +
  `\n`;

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "dashboard.json"), JSON.stringify(dashboard, null, 2) + "\n");
writeFileSync(join(outDir, "helpers.yaml"), helpersYaml);
console.log(`wrote ${join(outDir, "dashboard.json")} and ${join(outDir, "helpers.yaml")}`);

// Home Hub generator.
// Turns a small hub.json into a full multi-view Lovelace dashboard (Home with room
// cards, Media, People, Automations, System), the helpers it needs, and an optional
// Flight Tracker dashboard.
//
//   bun build.ts hub.example.json            # writes next to the input
//   bun build.ts hub.example.json out-dir    # writes into out-dir
//
// Writes: dashboard.json, helpers.yaml and (when flightTracker is set) flight-tracker.json.
// Room cards come from ../room-control-panel/rooms.ts; the other views are the
// placeholder templates in ./views, with __P__ (entity prefix), __IGNORE__ (ignore
// label) and __DASH__ (dashboard path) filled in here.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { makeRooms, type Room } from "../room-control-panel/rooms.ts";

interface Hub {
  title: string;
  dashboardPath: string; // url_path of the dashboard, e.g. home-hub (needs a hyphen)
  flightDashboardPath?: string; // url_path of the flight dashboard
  prefix: string; // prefix for the helper/script/sensor names, e.g. hub_
  ignoreLabel: string;
  mediaExclude: string[];
  kelvin: { warm: number; daylight: number; cool: number };
  allOffButton?: string | null; // input_button that turns everything off; omitted = no "All off" chip
  remote?: { mediaPlayer: string; remoteEntity: string; deviceFamily: string; deviceType: string; apps?: string[] } | null;
  flightTracker?: { sensor: string; rangeKm: number; location?: { lat: number; lon: number } | null } | null;
  rooms: Room[];
}

const [, , inPath, outDirArg] = process.argv;
if (!inPath) {
  console.error("usage: bun build.ts <hub.json> [out-dir]");
  process.exit(1);
}
const hub: Hub = JSON.parse(readFileSync(inPath, "utf8"));
const outDir = outDirArg ?? dirname(inPath);
const here = dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));

const P = hub.prefix;
const hiddenSensor = `sensor.${P}hidden_items`;
const toggleScript = `script.${P}toggle_hidden`;

const { roomCard, helperLines } = makeRooms({
  ignoreLabel: hub.ignoreLabel,
  hiddenSensor,
  toggleScript,
  hiddenListKey: "room_scenes",
  showHiddenBoolean: `input_boolean.${P}show_hidden_room_scenes`,
  mediaExclude: hub.mediaExclude,
  kelvin: hub.kelvin,
  rooms: hub.rooms,
});

// ---------- other views, from the placeholder templates ----------

const fill = (s: string) =>
  s.replaceAll("__P__", P).replaceAll("__IGNORE__", hub.ignoreLabel).replaceAll("__DASH__", hub.dashboardPath);
const loadView = (name: string) => JSON.parse(fill(readFileSync(join(here, "views", `${name}.json`), "utf8")));

const remoteCard = (storageId: string) =>
  hub.remote && {
    type: "custom:firemote-card",
    entity: hub.remote.mediaPlayer,
    device_family: hub.remote.deviceFamily,
    device_type: hub.remote.deviceType,
    compatibility_mode: "default",
    android_tv_remote_entity: hub.remote.remoteEntity,
    scale: "100",
    ...Object.fromEntries((hub.remote.apps ?? []).slice(0, 4).map((a, i) => [`app_launch_${i + 1}`, a])),
  };

const remoteExpander = (storageId: string, withVisibility: boolean) => ({
  type: "custom:expander-card",
  "title-card": { type: "heading", heading: "TV remote", icon: "mdi:remote-tv" },
  "title-card-clickable": true,
  icon: "mdi:chevron-down",
  expanded: true,
  "storage-id": `${P}${storageId}`,
  padding: "0",
  clear: true,
  grid_options: { columns: "full" },
  cards: [remoteCard(storageId)],
  ...(withVisibility
    ? { visibility: [{ condition: "state", entity: hub.remote!.remoteEntity, state: "on" }] }
    : {}),
});

const media = loadView("media");
if (hub.remote) media.sections.unshift({ type: "grid", cards: [remoteExpander("media_remote", false)] });

// ---------- home view ----------

const navBadge = (icon: string, text: string, path: string, visibility?: unknown[]) => ({
  type: "button",
  icon,
  text,
  ...(visibility ? { visibility } : {}),
  tap_action: { action: "navigate", navigation_path: path },
});

const headBadges: unknown[] = [];
if (hub.remote)
  headBadges.push(
    navBadge("mdi:remote-tv", "TV remote", `/${hub.dashboardPath}/media`, [
      { condition: "state", entity: hub.remote.remoteEntity, state: "off" },
    ]),
  );
if (hub.allOffButton)
  headBadges.push({
    type: "button",
    icon: "mdi:lightbulb-group-off",
    text: "All off",
    tap_action: {
      action: "perform-action",
      perform_action: "input_button.press",
      target: { entity_id: hub.allOffButton },
      confirmation: { text: "Turn off all lights?" },
    },
  });
if (hub.flightTracker)
  headBadges.push({
    type: "entity",
    entity: hub.flightTracker.sensor,
    icon: "mdi:airplane",
    show_state: true,
    show_name: false,
    tap_action: { action: "navigate", navigation_path: `/${hub.flightDashboardPath ?? "flight-tracker"}/radar` },
  });

const peopleTemplate =
  `{% set h = (state_attr('${hiddenSensor}','hidden') or {}).get('people', []) %}{% set ns = namespace(o=[]) %}` +
  `{% for p in states.person | sort(attribute='name') %}{% if p.entity_id not in h %}` +
  `{% set ns.o = ns.o + [{'type': 'tile', 'entity': p.entity_id, 'state_content': ['state', 'last_changed']}] %}` +
  `{% endif %}{% endfor %}{{ ns.o }}`;

const headerCards = [
  {
    type: "heading",
    heading: "Home",
    heading_style: "title",
    icon: "mdi:home-outline",
    ...(headBadges.length ? { badges: headBadges } : {}),
  },
  {
    type: "custom:auto-entities",
    card: { type: "grid", columns: 2, square: false },
    card_param: "cards",
    filter: { template: peopleTemplate },
  },
  {
    type: "custom:expander-card",
    "title-card": { type: "heading", heading: "On right now", icon: "mdi:power" },
    "title-card-clickable": true,
    icon: "mdi:chevron-down",
    expanded: true,
    "storage-id": `${P}home_on_now`,
    padding: "0",
    clear: true,
    grid_options: { columns: "full" },
    cards: [
      {
        type: "custom:auto-entities",
        card: { type: "grid", columns: 2, square: false },
        card_param: "cards",
        filter: {
          include: [
            {
              domain: "light",
              state: "on",
              options: { type: "tile", features: [{ type: "light-brightness" }], features_position: "bottom" },
            },
            {
              domain: "media_player",
              state: "playing",
              options: { type: "tile", features: [{ type: "media-player-playback" }] },
            },
          ],
          exclude: [{ label: hub.ignoreLabel }],
        },
        sort: { method: "name" },
        else: { type: "markdown", content: "Everything is off." },
      },
    ],
  },
];

// Rooms are dealt into two columns (one section each) so expanding a room only
// moves the rooms below it in the same column.
const columns: Room[][] = [[], []];
hub.rooms.forEach((r, i) => columns[i % 2].push(r));
const leftSection = { type: "grid", cards: [...headerCards, ...columns[0].map(roomCard)] };
const rightCards = [...(hub.remote ? [remoteExpander("home_remote", true)] : []), ...columns[1].map(roomCard)];
const homeSections = [leftSection, ...(rightCards.length ? [{ type: "grid", cards: rightCards }] : [])];

const dashboard = {
  title: hub.title,
  views: [
    { title: "Home", path: "home", icon: "mdi:home-outline", type: "sections", max_columns: 2, sections: homeSections },
    media,
    loadView("people"),
    loadView("automations"),
    loadView("system"),
  ],
};

// ---------- flight tracker dashboard (optional) ----------

const flightView = (path: "radar" | "map") => {
  const other = path === "radar" ? "map" : "radar";
  const ft = hub.flightTracker!;
  return {
    title: path === "radar" ? "Radar" : "Map",
    path,
    icon: path === "radar" ? "mdi:radar" : "mdi:map",
    type: "sections",
    subview: true,
    back_path: `/${hub.dashboardPath}/home`,
    max_columns: 1,
    sections: [
      {
        type: "grid",
        cards: [
          {
            type: "heading",
            heading: "Overhead right now",
            heading_style: "title",
            icon: "mdi:airplane",
            badges: [
              { type: "entity", entity: ft.sensor, show_state: true, show_name: false, icon: "mdi:airplane-marker" },
              navBadge(
                other === "map" ? "mdi:map" : "mdi:radar",
                other === "map" ? "Map view" : "Radar view",
                `/${hub.flightDashboardPath ?? "flight-tracker"}/${other}`,
              ),
            ],
          },
          {
            type: "custom:flightradar24-radar-card",
            flights_entity: ft.sensor,
            ...(ft.location ? { location: ft.location } : {}),
            radar: { range: ft.rangeKm, ...(path === "map" ? { background_map: "color", background_map_opacity: 0.9 } : {}) },
          },
        ],
      },
    ],
  };
};

// ---------- helpers ----------

const helpersYaml =
  `# Generated by build.ts. Add under your configuration (or a package), or create\n` +
  `# the same helpers in Settings > Devices & services > Helpers.\n` +
  `input_select:\n` +
  helperLines.map((l) => l.replace(/^/gm, "  ")).join("\n\n") +
  `\n`;

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const wrote = ["dashboard.json", "helpers.yaml"];
writeFileSync(join(outDir, "dashboard.json"), JSON.stringify(dashboard, null, 2) + "\n");
writeFileSync(join(outDir, "helpers.yaml"), helpersYaml);
if (hub.flightTracker) {
  writeFileSync(
    join(outDir, "flight-tracker.json"),
    JSON.stringify({ views: [flightView("radar"), flightView("map")] }, null, 2) + "\n",
  );
  wrote.push("flight-tracker.json");
}
console.log(`wrote ${wrote.join(", ")} to ${outDir}`);

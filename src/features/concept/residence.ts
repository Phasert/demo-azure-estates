/*
 * "Residence Concept A" — a conceptual, illustrative home used by the
 * walkthrough and floor-plan experiences. It is NOT one of the listings and
 * not a real building. Each room is illustrated with stock photography from
 * a different, unrelated home; the plan is schematic and not to scale.
 */

export type Hotspot = { x: number; y: number; label: string; detail: string };

export type ConceptRoom = {
  id: string;
  name: string;
  kicker: string;
  description: string;
  details: string[];
  image: { src: string; alt: string };
  /** Conceptual area — descriptive only, not a measured dimension. */
  areaNote: string;
  hotspots: Hotspot[];
  /** Plan geometry in the 1000 × 700 SVG viewBox. */
  plan: { x: number; y: number; w: number; h: number };
  inTour: boolean;
};

export const residenceName = "Residence Concept A";

export const conceptRooms: ConceptRoom[] = [
  {
    id: "entrance",
    name: "Entrance",
    kicker: "Arrival",
    description: "A timber-screened courtyard compresses the approach before the house opens to the sea — a deliberate pause between street and home.",
    details: ["Timber screening", "Shaded arrival court", "Pivot entry door"],
    image: { src: "/images/timber-courtyard.webp", alt: "Timber-clad entrance courtyard of a contemporary home" },
    areaNote: "Compact foyer",
    hotspots: [
      { x: 30, y: 45, label: "Vertical timber screen", detail: "Filters light and views while letting breezes pass." },
      { x: 68, y: 62, label: "Arrival court", detail: "A threshold space that frames the first glimpse of the interior." },
    ],
    plan: { x: 400, y: 460, w: 160, h: 160 },
    inTour: true,
  },
  {
    id: "living",
    name: "Living Room",
    kicker: "Gathering",
    description: "The great room sits at the centre of the plan, its glazed wall sliding fully open to the terrace for indoor–outdoor living.",
    details: ["Full-height glazing", "Timber feature wall", "Cross-ventilation"],
    image: { src: "/images/living-timber-wall.webp", alt: "Open living room with a timber feature wall and soft seating" },
    areaNote: "Largest room in the plan",
    hotspots: [
      { x: 72, y: 38, label: "Timber feature wall", detail: "Warm, acoustic panelling that anchors the seating area." },
      { x: 18, y: 50, label: "Sliding glass wall", detail: "Opens the room completely to the terrace." },
    ],
    plan: { x: 400, y: 200, w: 320, h: 260 },
    inTour: true,
  },
  {
    id: "kitchen",
    name: "Kitchen",
    kicker: "Gathering",
    description: "A marble island and generous prep space make the kitchen a social room, open to the pool deck for long lunches.",
    details: ["Marble waterfall island", "Professional range", "Walk-in pantry"],
    image: { src: "/images/kitchen-marble.webp", alt: "Bright kitchen with a marble waterfall island and range" },
    areaNote: "Open to pool deck",
    hotspots: [
      { x: 40, y: 72, label: "Waterfall island", detail: "Marble wraps down to the floor on both ends." },
      { x: 80, y: 30, label: "Range & extraction", detail: "Concealed extraction keeps sightlines clean." },
    ],
    plan: { x: 120, y: 200, w: 280, h: 200 },
    inTour: true,
  },
  {
    id: "primary",
    name: "Primary Bedroom",
    kicker: "Retreat",
    description: "Occupying its own wing, the primary suite looks directly onto the terrace and sea, with an ensuite bath beyond.",
    details: ["Terrace access", "Dressing area", "Ensuite bath"],
    image: { src: "/images/bedroom-dark.webp", alt: "Bedroom with upholstered bed, dark walls and sculptural lighting" },
    areaNote: "Private east wing",
    hotspots: [
      { x: 50, y: 62, label: "Upholstered bed wall", detail: "Soft finishes for a quiet, hotel-like calm." },
      { x: 58, y: 18, label: "Sculptural pendant", detail: "Layered lighting for evening ambience." },
    ],
    plan: { x: 720, y: 200, w: 160, h: 240 },
    inTour: true,
  },
  {
    id: "bath",
    name: "Primary Bath",
    kicker: "Retreat",
    description: "A freestanding tub sits beneath clerestory light, with a walk-in shower and planting bringing the garden inside.",
    details: ["Freestanding tub", "Walk-in shower", "Clerestory light"],
    image: { src: "/images/bath-freestanding.webp", alt: "Bright bathroom with a freestanding tub and potted plant" },
    areaNote: "Ensuite to primary",
    hotspots: [{ x: 35, y: 68, label: "Freestanding tub", detail: "Positioned to catch daylight from above." }],
    plan: { x: 720, y: 440, w: 160, h: 180 },
    inTour: true,
  },
  {
    id: "terrace",
    name: "Outdoor Terrace",
    kicker: "Outdoors",
    description: "A deep hardwood terrace runs the full width of the living wing — the home's true living room from late afternoon onwards.",
    details: ["Hardwood decking", "Sunset orientation", "Outdoor dining"],
    image: { src: "/images/sunset-deck.webp", alt: "Hardwood deck and small pool at sunset" },
    areaNote: "Full-width terrace",
    hotspots: [{ x: 45, y: 75, label: "Hardwood deck", detail: "Naturally weathers to a soft silver." }],
    plan: { x: 400, y: 110, w: 480, h: 90 },
    inTour: true,
  },
  {
    id: "pool",
    name: "Pool Area",
    kicker: "Outdoors",
    description: "An infinity-edge pool appears to spill into the sea beyond, with loungers set on a shaded deck to one side.",
    details: ["Infinity edge", "Sun shelf", "Shaded loungers"],
    image: { src: "/images/clifftop-pool.webp", alt: "Infinity pool on a clifftop overlooking a deep blue sea" },
    areaNote: "Seaward edge",
    hotspots: [
      { x: 60, y: 70, label: "Infinity edge", detail: "The water line visually merges with the horizon." },
      { x: 25, y: 55, label: "Lounging deck", detail: "Shade from palms and umbrellas through the day." },
    ],
    plan: { x: 440, y: 40, w: 420, h: 70 },
    inTour: true,
  },
  {
    id: "guest",
    name: "Guest Suites",
    kicker: "Hosting",
    description: "Two guest bedrooms share a quiet wing behind the kitchen, each with garden-facing doors.",
    details: ["Two bedrooms", "Garden doors", "Shared bath"],
    image: { src: "/images/bedroom-white.webp", alt: "Bright bedroom with glazed doors to a terrace" },
    areaNote: "West wing",
    hotspots: [],
    plan: { x: 120, y: 400, w: 280, h: 220 },
    inTour: false,
  },
];

export const tourRooms = conceptRooms.filter((r) => r.inTour);

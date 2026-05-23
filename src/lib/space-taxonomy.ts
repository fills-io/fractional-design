/**
 * Space taxonomy — the master list of industries and the specific spaces
 * within each one. Used by the wizard's Space step (and later, by the AI
 * prompts to scope what "good design" means for each context).
 *
 * Curated for the launch market (residential + hospitality-heavy). New
 * categories can be added without touching any other code — UI reads
 * from this file.
 */

export type IndustryId =
  | "residential"
  | "hospitality"
  | "retail"
  | "workplace"
  | "wellness"
  | "restaurant-bar";

export type Industry = {
  id: IndustryId;
  label: string;
  /** One-line description shown when the industry is selected. */
  blurb: string;
  spaces: SpaceOption[];
};

export type SpaceOption = {
  id: string;
  label: string;
  /** Short tagline shown under the label. */
  hint: string;
};

export const INDUSTRIES: Industry[] = [
  {
    id: "residential",
    label: "Residential",
    blurb: "Homes and personal spaces.",
    spaces: [
      { id: "living-room", label: "Living room", hint: "Lounging, hosting, daily life" },
      { id: "bedroom", label: "Bedroom", hint: "Rest, retreat, intimacy" },
      { id: "kitchen", label: "Kitchen", hint: "Cooking, gathering, the social anchor" },
      { id: "bathroom", label: "Bathroom", hint: "Ritual, restoration, privacy" },
      { id: "dining-room", label: "Dining room", hint: "Meals, conversation, ceremony" },
      { id: "home-office", label: "Home office", hint: "Focus, calls, end-of-day reset" },
      { id: "outdoor", label: "Outdoor", hint: "Terrace, balcony, garden room" },
    ],
  },
  {
    id: "hospitality",
    label: "Hospitality",
    blurb: "Hotels, resorts, and short-stay spaces.",
    spaces: [
      { id: "hotel-lobby", label: "Hotel lobby", hint: "First impression, social hub" },
      { id: "hotel-room", label: "Hotel room", hint: "Standard guest accommodation" },
      { id: "suite", label: "Suite", hint: "Premium / signature room" },
      { id: "boutique-hotel", label: "Boutique hotel", hint: "Small, character-driven, themed" },
      { id: "resort", label: "Resort", hint: "Destination feel, leisure-led" },
    ],
  },
  {
    id: "retail",
    label: "Retail",
    blurb: "Stores, showrooms, and brand spaces.",
    spaces: [
      { id: "showroom", label: "Showroom", hint: "Curated product display" },
      { id: "fashion-store", label: "Fashion store", hint: "Clothing, accessories, beauty" },
      { id: "concept-store", label: "Concept store", hint: "Multi-brand, lifestyle-led" },
      { id: "pop-up", label: "Pop-up", hint: "Short-term, brand-activation" },
    ],
  },
  {
    id: "workplace",
    label: "Workplace",
    blurb: "Offices and shared work environments.",
    spaces: [
      { id: "open-office", label: "Open office", hint: "Shared, collaborative floor" },
      { id: "private-office", label: "Private office", hint: "Single occupant or small team" },
      { id: "coworking", label: "Coworking", hint: "Flexible memberships, hot desks" },
      { id: "meeting-room", label: "Meeting room", hint: "Boardroom, huddle, focus" },
      { id: "reception", label: "Reception", hint: "Entrance, lobby, hosting" },
    ],
  },
  {
    id: "wellness",
    label: "Wellness",
    blurb: "Spaces designed for the body and the mind.",
    spaces: [
      { id: "spa", label: "Spa", hint: "Treatments, rituals, calm" },
      { id: "yoga-studio", label: "Yoga / pilates studio", hint: "Movement, breath, focus" },
      { id: "clinic", label: "Wellness clinic", hint: "Aesthetics, longevity, IV / IM" },
      { id: "gym", label: "Gym", hint: "Strength, training, performance" },
    ],
  },
  {
    id: "restaurant-bar",
    label: "Restaurant & Bar",
    blurb: "Food, drink, and the rooms they happen in.",
    spaces: [
      { id: "fine-dining", label: "Fine dining", hint: "Tasting menus, chef-led, theatrical" },
      { id: "casual-restaurant", label: "Casual restaurant", hint: "Everyday, neighborhood, all-day" },
      { id: "cafe", label: "Café", hint: "Coffee-led, daytime, light food" },
      { id: "cocktail-bar", label: "Cocktail bar", hint: "Mixology, evening, low light" },
      { id: "wine-bar", label: "Wine bar", hint: "Bottles, plates, conversation" },
    ],
  },
];

/** Match a free-text industry label (from URL params) to an IndustryId, or null. */
export function findIndustryByLabel(label: string | null): Industry | null {
  if (!label) return null;
  const needle = label.trim().toLowerCase();
  return (
    INDUSTRIES.find(
      (i) =>
        i.label.toLowerCase() === needle ||
        i.id === needle ||
        i.id.replace("-", " ") === needle,
    ) ?? null
  );
}

/** Get an industry by its ID. */
export function getIndustry(id: IndustryId): Industry | undefined {
  return INDUSTRIES.find((i) => i.id === id);
}

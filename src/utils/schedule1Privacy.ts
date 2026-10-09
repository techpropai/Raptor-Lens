/**
 * UK Schedule 1 Wildlife & Countryside Act 1981 Protection & Coordinate Privacy Service
 * 
 * In the United Kingdom, wild birds are protected under the Wildlife and Countryside Act 1981.
 * Species listed on Schedule 1 receive enhanced legal protection: it is an offence to intentionally
 * or recklessly disturb them while building a nest, at or near an active nest, or disturb dependent young.
 * 
 * UK birding bodies (BTO, RSPB, Rare Bird Alert, BirdGuides, and county bird recorders) enforce
 * strict breeding-season protocol:
 * 1. During the UK breeding window (typically 1 March to 31 August), exact GPS coordinates of
 *    Schedule 1 breeding raptors MUST be fuzzed/coarsened to protect nest sites from egg collectors,
 *    disturbance, and wildlife crimes.
 * 2. Locations are coarsened to a safe 5km - 10km regional quadrant or 100km² hectad level,
 *    and exact pins are masked with a Schedule 1 Conservation Shield badge.
 * 3. Outside of the breeding season (winter passage/roosts), sightings are still tagged with sensitive
 *    roost advisories (e.g. 150m stand-off rule for Hen Harrier and Short-eared Owl roosts).
 */

export interface Schedule1Rule {
  speciesId: string;
  commonName: string;
  scientificName: string;
  isSchedule1: boolean;
  breedingSeasonStartMonth: number; // 1-indexed (e.g. 3 = March)
  breedingSeasonEndMonth: number;   // 1-indexed (e.g. 8 = August)
  fuzzRadiusKm: number;            // 5km or 10km grid
  conservationNotice: string;
  legalAdvisory: string;
}

export const SCHEDULE_1_RAPTORS: Record<string, Schedule1Rule> = {
  'hen-harrier': {
    speciesId: 'hen-harrier',
    commonName: 'Hen Harrier',
    scientificName: 'Circus cyaneus',
    isSchedule1: true,
    breedingSeasonStartMonth: 3, // March
    breedingSeasonEndMonth: 8,   // August
    fuzzRadiusKm: 10,
    conservationNotice: 'UK Schedule 1 Protected — Red-listed raptor. Coordinates obfuscated to a 10km regional square during breeding season.',
    legalAdvisory: 'Offence under Wildlife & Countryside Act 1981 to intentionally or recklessly disturb at or near nest. 150m stand-off strictly enforced at winter roosts.',
  },
  'peregrine-falcon': {
    speciesId: 'peregrine-falcon',
    commonName: 'Peregrine Falcon',
    scientificName: 'Falco peregrinus',
    isSchedule1: true,
    breedingSeasonStartMonth: 3, // March
    breedingSeasonEndMonth: 7,   // July
    fuzzRadiusKm: 5,
    conservationNotice: 'UK Schedule 1 Protected — Quarry, cliff & church tower nesting sites fuzzed to 5km grid.',
    legalAdvisory: 'Disturbance at or near eyrie is a criminal offence under UK law. Exact nesting ledges are masked.',
  },
  'merlin': {
    speciesId: 'merlin',
    commonName: 'Merlin',
    scientificName: 'Falco columbarius',
    isSchedule1: true,
    breedingSeasonStartMonth: 4, // April
    breedingSeasonEndMonth: 8,   // August
    fuzzRadiusKm: 10,
    conservationNotice: 'UK Schedule 1 Protected — Rare ground & heath nester. Fuzzed to 10km hectad.',
    legalAdvisory: 'Britain\'s smallest falcon; vulnerable to upland turf disturbance. Locations masked during breeding season.',
  },
  'osprey': {
    speciesId: 'osprey',
    commonName: 'Osprey',
    scientificName: 'Pandion haliaetus',
    isSchedule1: true,
    breedingSeasonStartMonth: 4, // April
    breedingSeasonEndMonth: 8,   // August
    fuzzRadiusKm: 5,
    conservationNotice: 'UK Schedule 1 Protected — Tree & artificial platform nest sites fuzzed to 5km sector.',
    legalAdvisory: 'Strict exclusion zones apply to all active UK Osprey nests under Natural England / NatureScot licences.',
  },
  'eurasian-hobby': {
    speciesId: 'eurasian-hobby',
    commonName: 'Eurasian Hobby',
    scientificName: 'Falco subbuteo',
    isSchedule1: true,
    breedingSeasonStartMonth: 5, // May
    breedingSeasonEndMonth: 8,   // August
    fuzzRadiusKm: 5,
    conservationNotice: 'UK Schedule 1 Protected — Ancient woodland & crow-nest breeders fuzzed to 5km sector.',
    legalAdvisory: 'Summer migrant falcon protected under Schedule 1 while utilising old corvid nests.',
  },
  'goshawk': {
    speciesId: 'goshawk',
    commonName: 'Northern Goshawk',
    scientificName: 'Accipiter gentilis',
    isSchedule1: true,
    breedingSeasonStartMonth: 2, // February
    breedingSeasonEndMonth: 7,   // July
    fuzzRadiusKm: 10,
    conservationNotice: 'UK Schedule 1 Protected — Highly sensitive forest raptor; exact coordinates strictly masked.',
    legalAdvisory: 'High risk of persecution. Exact coordinates strictly coarsened to 10km regional woodland block.',
  },
};

/**
 * Checks if a species is Schedule 1 in the UK
 */
export function isSchedule1Species(speciesId: string): boolean {
  return !!SCHEDULE_1_RAPTORS[speciesId]?.isSchedule1;
}

/**
 * Checks if current date falls within the breeding season for a given species
 */
export function isInBreedingSeason(speciesId: string, checkDate: Date = new Date()): boolean {
  const rule = SCHEDULE_1_RAPTORS[speciesId];
  if (!rule) return false;

  const currentMonth = checkDate.getMonth() + 1; // 1-12
  return currentMonth >= rule.breedingSeasonStartMonth && currentMonth <= rule.breedingSeasonEndMonth;
}

/**
 * Calculates deterministic pseudo-fuzzed coordinates based on a 5-10km grid snapping
 * and stable seed offset so the pin does not jitter randomly on re-render.
 */
export function fuzzCoordinates(
  lat: number,
  lng: number,
  speciesId?: string,
  fuzzKm: number = 5
): [number, number] {
  const safeLat = Number(lat);
  const safeLng = Number(lng);
  if (!Number.isFinite(safeLat) || !Number.isFinite(safeLng)) {
    return [51.4835, -1.7895]; // Default fallback to Barbury Castle
  }

  const safeFuzzKm = (Number.isFinite(fuzzKm) && fuzzKm > 0) ? fuzzKm : 5;

  // Approximate conversion: 1 degree latitude ~= 111 km
  // 1 degree longitude at 51.5°N ~= 69 km
  const latGridStep = safeFuzzKm / 111;
  const lngGridStep = safeFuzzKm / 69;

  // Stable seed offset based on speciesId hash to offset slightly into grid center
  const idStr = String(speciesId || 'raptor');
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = (hash << 5) - hash + idStr.charCodeAt(i);
    hash |= 0;
  }
  const offsetNormLat = ((Math.abs(hash) % 100) / 100 - 0.5) * 0.4;
  const offsetNormLng = (((Math.abs(hash >> 3)) % 100) / 100 - 0.5) * 0.4;

  // Snap to grid
  const snappedLat = Math.round(safeLat / latGridStep) * latGridStep + (latGridStep * offsetNormLat);
  const snappedLng = Math.round(safeLng / lngGridStep) * lngGridStep + (lngGridStep * offsetNormLng);

  const resLat = parseFloat(snappedLat.toFixed(4));
  const resLng = parseFloat(snappedLng.toFixed(4));

  if (!Number.isFinite(resLat) || !Number.isFinite(resLng)) {
    return [51.4835, -1.7895];
  }

  return [resLat, resLng];
}

export interface CoordinatePrivacyResult {
  isSensitive: boolean;
  isBreedingSeason: boolean;
  displayCoordinates: [number, number];
  fuzzed: boolean;
  fuzzRadiusKm: number;
  badgeLabel: string;
  rule?: Schedule1Rule;
  privacyNotice: string;
  generalizedLocation: string;
}

/**
 * Evaluates a sighting record and applies UK Schedule 1 sensitivity and coordinate privacy protection
 */
export function evaluateCoordinatePrivacy(
  speciesId: string,
  rawCoordinates: [number, number] | any,
  locationName: string,
  timestamp?: string | Date
): CoordinatePrivacyResult {
  // Defensive validation of incoming coordinates: guarantee valid finite numbers
  const safeCoords: [number, number] = (
    Array.isArray(rawCoordinates) &&
    rawCoordinates.length >= 2 &&
    Number.isFinite(Number(rawCoordinates[0])) &&
    Number.isFinite(Number(rawCoordinates[1]))
  )
    ? [Number(rawCoordinates[0]), Number(rawCoordinates[1])]
    : [51.4835, -1.7895];

  const date = timestamp ? new Date(timestamp) : new Date();
  const rule = SCHEDULE_1_RAPTORS[speciesId];

  if (!rule) {
    return {
      isSensitive: false,
      isBreedingSeason: false,
      displayCoordinates: safeCoords,
      fuzzed: false,
      fuzzRadiusKm: 0,
      badgeLabel: 'Public Coordinate',
      privacyNotice: 'Standard open coordinate for public downland viewing.',
      generalizedLocation: locationName || 'Downland Sector',
    };
  }

  const breeding = isInBreedingSeason(speciesId, date);

  // If in breeding season OR if explicitly requested for high-sensitivity raptors like Hen Harrier:
  const shouldFuzz = breeding || speciesId === 'hen-harrier';
  const fuzzedCoords = shouldFuzz ? fuzzCoordinates(safeCoords[0], safeCoords[1], speciesId, rule.fuzzRadiusKm) : safeCoords;

  // Generalize specific location name (e.g. "Hackpen Hill Eyrie Ledge" -> "Hackpen & Marlborough Downs (5km Sector)")
  const safeLocation = locationName || 'Downland Sector';
  const generalized = shouldFuzz
    ? `${safeLocation.split('&')[0].trim()} (~${rule.fuzzRadiusKm}km Protected Sector)`
    : safeLocation;

  return {
    isSensitive: true,
    isBreedingSeason: breeding,
    displayCoordinates: fuzzedCoords,
    fuzzed: shouldFuzz,
    fuzzRadiusKm: rule.fuzzRadiusKm,
    badgeLabel: breeding ? 'Schedule 1 Fuzzed (Breeding Season)' : 'Schedule 1 Protected Taxon',
    rule,
    privacyNotice: breeding
      ? `🔒 UK Wildlife & Countryside Act 1981 Schedule 1: Exact coordinates coarsened to a ${rule.fuzzRadiusKm}km grid to safeguard active breeding/nesting territory.`
      : `🛡️ Schedule 1 Protected Species: Observer alert active. Observers must maintain 150m stand-off from winter roosts.`,
    generalizedLocation: generalized,
  };
}

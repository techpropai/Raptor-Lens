export interface PtzPreset {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  target: string;
  distanceKm: string;
  azimuth: string;
  zoom: string;
  focusSubject: string;
  weatherAspect: string;
  typicalSpecies: string[];
  description: string;
  dwellSeconds: number;
}

export interface BarburySummitWeather {
  temperatureC: number;
  windChillC: number;
  windSpeedKt: number;
  windGustKt: number;
  windDirection: string;
  windBearingDeg: number;
  cloudBaseM: number;
  cloudCover: string;
  visibilityKm: number;
  pressureHpa: number;
  pressureTendency: 'Rising' | 'Steady' | 'Falling';
  soaringLiftRating: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'LOW';
  walkerAdvisory: string;
  lastUpdated: string;
}

export interface EducationalChallenge {
  id: string;
  title: string;
  scenario: string;
  clues: string[];
  options: {
    speciesName: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export const BARBURY_PTZ_PRESETS: PtzPreset[] = [
  {
    id: 'ramparts',
    name: 'Preset 1: Barbury Castle Hillfort & Rampart Crest',
    shortName: '1. Hillfort Ramparts',
    icon: '🏰',
    target: 'Iron Age Hillfort Earthworks & Trig Point (268m ASL)',
    distanceKm: '3.0 km',
    azimuth: '195° SSW',
    zoom: '30x Telephoto',
    focusSubject: 'Summit Ramparts & Ridgeline Horizon',
    weatherAspect: 'Direct view of scarp cloud deck & incoming Marlborough weather fronts',
    typicalSpecies: ['Red Kite', 'Common Buzzard', 'Raven'],
    description: 'Ultra-telephoto view trained directly onto the ancient outer chalk ramparts of Barbury Castle. Prime sector for watching Red Kites kettle in thermal lift over the hillfort crest and checking summit cloud ceiling.',
    dwellSeconds: 60,
  },
  {
    id: 'field-perch',
    name: 'Preset 2: High Raptor Perch & Field Boundary Sarsen',
    shortName: '2. Field Raptor Perch',
    icon: '🦅',
    target: 'Weathered Ash Branch & Ancient Sarsen Stone Marker',
    distanceKm: '420 m',
    azimuth: '210° SW',
    zoom: '18x Optical',
    focusSubject: 'Elevated Hunting Perch & Fence Line',
    weatherAspect: 'Sheltered lee-side perch favoured in high winds',
    typicalSpecies: ['Common Kestrel', 'Common Buzzard', 'Little Owl'],
    description: 'Focused on a designated dead ash branch and sarsen stone post on our downland field boundary. Buzzards and Kestrels frequently use this station as a resting perch to survey ground voles.',
    dwellSeconds: 45,
  },
  {
    id: 'downland-meadow',
    name: 'Preset 3: Downland Pasture & Rough Grass Margin',
    shortName: '3. Downland Meadow',
    icon: '🌾',
    target: 'Chalk Meadow & Oilseed Rape / Grass Tussocks',
    distanceKm: '650 m',
    azimuth: '180° S',
    zoom: '10x Wide-Mid',
    focusSubject: 'Ground Pasture & Field Margin Scrape',
    weatherAspect: 'Surface wind gusts visible in waving grass tussocks',
    typicalSpecies: ['Barn Owl', 'Hen Harrier', 'Short-eared Owl', 'Kestrel'],
    description: 'Mid-range wide view surveying the pasture floor. In early morning and dusk, Barn Owls and winter Harriers quarter low (1-2 metres) over these chalk grass margins hunting field voles.',
    dwellSeconds: 45,
  },
  {
    id: 'thermal-sky',
    name: 'Preset 4: Escarpment Sky & Thermal Chimney Corridor',
    shortName: '4. Sky & Thermals',
    icon: '☁️',
    target: 'High Airspace Over Hackpen & Barbury North Scarp',
    distanceKm: 'Skyward',
    azimuth: '190° S (Elevated)',
    zoom: '12x Skyward',
    focusSubject: 'Escarpment Slope Lift & Thermal Columns',
    weatherAspect: 'Cumulus cloud development showing rising convective thermals',
    typicalSpecies: ['Red Kite', 'Peregrine Falcon', 'Eurasian Hobby'],
    description: 'Elevated sky view focused above the northern scarp edge. When solar radiation warms the chalk valley, rising warm air columns form thermal chimneys where Red Kites spiral effortlessly.',
    dwellSeconds: 45,
  }
];

export const BARBURY_SUMMIT_WEATHER: BarburySummitWeather = {
  temperatureC: 14.2,
  windChillC: 11.5,
  windSpeedKt: 19,
  windGustKt: 28,
  windDirection: 'SSW',
  windBearingDeg: 205,
  cloudBaseM: 420,
  cloudCover: 'Scattered Cumulus (4/8)',
  visibilityKm: 18,
  pressureHpa: 1015,
  pressureTendency: 'Rising',
  soaringLiftRating: 'EXCELLENT',
  walkerAdvisory: 'Brisk, invigorating south-westerly wind on the exposed ramparts. Chalk tracks dry underfoot. Superb raptor soaring conditions along the scarp.',
  lastUpdated: 'Live telemetry synced',
};

export const EDUCATIONAL_ID_CHALLENGES: EducationalChallenge[] = [
  {
    id: 'challenge-01',
    title: 'Mystery Downland Raptor: The Wind-Hover Specialist',
    scenario: 'Scanning the camera over the Barbury Castle northern ramparts in a 20-knot headwind, you spot a medium-sized bird suspended in mid-air. Its head stays completely stationary while its long, narrow wings flutter with rapid beats, pointing downward into the rough chalk pasture.',
    clues: [
      'Tail: Long and slender with a dark terminal sub-band',
      'Flight Style: Stationary hovering into the headwind with minimal drift',
      'Habitat: Exposed downland ramparts and road verge margins',
      'Diet: Primarily field voles (Microtus agrestis) detected by UV urine trails'
    ],
    options: [
      {
        speciesName: 'Common Kestrel (Falco tinnunculus)',
        isCorrect: true,
        explanation: 'Correct! The Kestrel is Britain’s premier "wind-hover" specialist. It possesses specialized head-stabilization optics and scans for vole scent marks from a fixed hover.'
      },
      {
        speciesName: 'Red Kite (Milvus milvus)',
        isCorrect: false,
        explanation: 'Incorrect. Red Kites have huge 180cm wingspans and a deeply forked tail, soaring and wheeling on thermals rather than performing stationary headwind hovers.'
      },
      {
        speciesName: 'Common Buzzard (Buteo buteo)',
        isCorrect: false,
        explanation: 'Incorrect. While Buzzards occasionally hang clumsily on slope lift or hover briefly, they lack the slender sickle wings and rapid beating hover of a Kestrel.'
      },
      {
        speciesName: 'Peregrine Falcon (Falco peregrinus)',
        isCorrect: false,
        explanation: 'Incorrect. Peregrines hunt in high-speed level pursuit or vertical stoops at 200+ mph, not stationary vole-hunting hovers over pasture.'
      }
    ]
  },
  {
    id: 'challenge-02',
    title: 'Mystery Downland Raptor: The Angled Wing Soarer',
    scenario: 'High overhead above the hillfort, a large reddish-brown raptor wheels lazily in a thermal. When it banks, you clearly see pale whitish patches under the wingtips and a distinctive, deeply cleft V-notch in its long rufous tail acting as a steering rudder.',
    clues: [
      'Tail: Deeply notched V-fork tail, constantly twisting in flight',
      'Wingspan: Very large (~175-195 cm) with long fingered primary feathers',
      'Plumage: Rich chestnut-red body with pale greyish-white head',
      'Action: Gliding effortlessly with dihedral angled wings'
    ],
    options: [
      {
        speciesName: 'Red Kite (Milvus milvus)',
        isCorrect: true,
        explanation: 'Correct! The deeply forked tail and white underwing "carpal patches" are unmistakable diagnostics for the Red Kite, an iconic Wiltshire success story.'
      },
      {
        speciesName: 'Common Buzzard (Buteo buteo)',
        isCorrect: false,
        explanation: 'Incorrect. The Common Buzzard has a broad, rounded fan tail without any notch or fork, and broader, rounded wingtips.'
      },
      {
        speciesName: 'Marsh Harrier (Circus aeruginosus)',
        isCorrect: false,
        explanation: 'Incorrect. Harriers fly with wings in a shallow V low over reedbeds and crops, but have a square or rounded tail, never a deeply cleft fork.'
      },
      {
        speciesName: 'Golden Eagle (Aquila chrysaetos)',
        isCorrect: false,
        explanation: 'Incorrect. Golden Eagles do not have a forked tail and are not resident on the chalk downlands of southern England.'
      }
    ]
  }
];

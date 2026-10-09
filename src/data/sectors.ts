import { UkSector } from '../types/sector';

export const UK_SECTORS: UkSector[] = [
  {
    id: 'ridgeway-wessex',
    name: 'The Ridgeway & Marlborough Downs',
    shortName: 'The Ridgeway',
    tagline: 'Ancient chalk scarp, Iron Age ramparts & stone circles',
    county: 'Wiltshire & Oxfordshire',
    center: [51.465, -1.815],
    zoom: 12,
    thermalCorridorName: 'Ridgeway Escarpment Thermal Highway (Barbury–Hackpen Scarp)',
    corridorTrack: [
      [51.528, -1.700], // Liddington Castle
      [51.4835, -1.7895], // Barbury Castle
      [51.4720, -1.7960], // Hackpen Hill
      [51.4580, -1.8200], // Overton Down
      [51.4285, -1.8540], // Avebury corridor
    ],
    thermalZone: [
      [51.490, -1.770],
      [51.488, -1.810],
      [51.468, -1.825],
      [51.465, -1.780],
    ],
    radarRingCenters: [
      [51.4835, -1.7895], // Barbury Castle
      [51.4720, -1.7960], // Hackpen Hill
    ],
    primaryHabitat: 'Chalk downland turf, scarp gallops & prehistoric sarsens',
    keyTargetRaptors: ['Red Kite', 'Common Buzzard', 'Peregrine Falcon', 'Hen Harrier', 'Eurasian Hobby'],
    gridRefPrefix: 'SU',
    statusBadge: 'CORE SECTOR // ACTIVE RADAR',
    elevationRange: '152m – 271m ASL',
    summary: 'The foundational observation zone along the oldest trackway in Britain, featuring strong northerly slope lift and dense kettles of Red Kites.',
  },
  {
    id: 'salisbury-plain',
    name: 'Salisbury Plain & Chalk Grasslands',
    shortName: 'Salisbury Plain',
    tagline: 'Vast military training area, undisturbed chalk steppe & winter harrier roosts',
    county: 'South Wiltshire & Hampshire',
    center: [51.240, -1.980],
    zoom: 11,
    thermalCorridorName: 'Bratton Scarp & Plain Escarpment Thermal Flow',
    corridorTrack: [
      [51.2626, -2.1462], // Westbury White Horse
      [51.2450, -2.0500], // Imber Range edge
      [51.2200, -1.9000], // Tilshead Down
      [51.1788, -1.8262], // Stonehenge Down
      [51.1500, -1.7200], // Amesbury Basin
    ],
    thermalZone: [
      [51.275, -2.155],
      [51.250, -2.000],
      [51.200, -1.880],
      [51.220, -2.160],
    ],
    radarRingCenters: [
      [51.2626, -2.1462], // Westbury
      [51.1788, -1.8262], // Stonehenge Down
    ],
    primaryHabitat: 'Unimproved calcareous grassland, scrub ravines & artillery drop zones',
    keyTargetRaptors: ['Hen Harrier', 'Short-eared Owl', 'Merlin', 'Red Kite', 'Peregrine Falcon'],
    gridRefPrefix: 'ST / SU',
    statusBadge: 'EXPANSION SECTOR // DOWNLAND STEPPE',
    elevationRange: '105m – 225m ASL',
    summary: 'The largest area of unimproved chalk downland in Northwest Europe. Renowned for wintering Hen Harrier and Short-eared Owl roosts.',
  },
  {
    id: 'chilterns',
    name: 'The Chilterns Scarp & Thames Valley',
    shortName: 'The Chilterns',
    tagline: 'Steep chalk escarpment, ancient beechwoods & Red Kite heartland',
    county: 'Buckinghamshire, Oxfordshire & Herts',
    center: [51.720, -0.850],
    zoom: 11,
    thermalCorridorName: 'Chilterns North-West Facing Chalk Ridge Lift',
    corridorTrack: [
      [51.8450, -0.6050], // Ivinghoe Beacon
      [51.7700, -0.7600], // Coombe Hill / Wendover
      [51.6800, -0.8800], // Princes Risborough
      [51.6450, -1.0000], // Watlington Hill
      [51.5400, -1.1100], // Goring Gap
    ],
    thermalZone: [
      [51.850, -0.590],
      [51.780, -0.750],
      [51.640, -1.020],
      [51.680, -0.880],
    ],
    radarRingCenters: [
      [51.8450, -0.6050], // Ivinghoe Beacon
      [51.6450, -1.0000], // Watlington Hill
    ],
    primaryHabitat: 'High chalk ridges, sunken lanes, hanging beech woodlands & chalk springline reedbeds',
    keyTargetRaptors: ['Red Kite', 'Common Buzzard', 'Eurasian Sparrowhawk', 'Eurasian Hobby', 'Barn Owl', 'Peregrine Falcon'],
    gridRefPrefix: 'SP / SU / TL',
    statusBadge: 'EXPANSION SECTOR // KITE HEARTLAND',
    elevationRange: '26m – 259m ASL',
    summary: 'Epicentre of the legendary UK Red Kite reintroduction programme. Steep chalk scarps at Ivinghoe Beacon and Watlington produce continuous soaring lift, with the ancient Icknield chalk corridor extending into the springline wetlands of South Cambridgeshire (RSPB Fowlmere).',
  },
  {
    id: 'cotswolds',
    name: 'Cotswold Edge & Severn Vale',
    shortName: 'Cotswold Edge',
    tagline: 'Limestone scarp overlooking the Severn Estuary migration flyway',
    county: 'Gloucestershire & Somerset',
    center: [51.880, -2.100],
    zoom: 11,
    thermalCorridorName: 'Severn Vale Scarp Updraft Ridge (Cleeve to Coaley)',
    corridorTrack: [
      [51.9800, -2.0200], // Cleeve Hill
      [51.9250, -2.0100], // Cleeve Cloud
      [51.8600, -2.0800], // Leckhampton Hill
      [51.7900, -2.2000], // Painswick Beacon
      [51.7200, -2.2900], // Coaley Peak
    ],
    thermalZone: [
      [51.990, -2.000],
      [51.920, -2.000],
      [51.850, -2.060],
      [51.890, -2.140],
    ],
    radarRingCenters: [
      [51.9250, -2.0100], // Cleeve Hill
      [51.8600, -2.0800], // Leckhampton Hill
    ],
    primaryHabitat: 'Oolitic limestone scarp, upland commons & scarp coombes',
    keyTargetRaptors: ['Common Buzzard', 'Peregrine Falcon', 'Common Kestrel', 'Eurasian Hobby', 'Osprey (Passage)'],
    gridRefPrefix: 'SO / ST',
    statusBadge: 'EXPANSION SECTOR // SEVERN HORIZON',
    elevationRange: '140m – 330m ASL',
    summary: 'Towering 300-metre limestone scarp above the Severn Estuary providing thermal lift for migratory raptors heading down the river corridor.',
  },
  {
    id: 'south-downs',
    name: 'South Downs Way & Sussex Scarp',
    shortName: 'South Downs',
    tagline: 'Coastal chalk ridge, dry valleys & sea-breeze convergence fronts',
    county: 'East & West Sussex, Hampshire',
    center: [50.880, -0.150],
    zoom: 11,
    thermalCorridorName: 'South Downs Northern Scarp & Channel Sea-Breeze Front',
    corridorTrack: [
      [50.9300, -0.4200], // Amberley Mount
      [50.9100, -0.1800], // Ditchling Beacon
      [50.8500, 0.0500],  // Firle Beacon
      [50.7350, 0.2400],  // Beachy Head
    ],
    thermalZone: [
      [50.940, -0.400],
      [50.920, -0.160],
      [50.860, 0.060],
      [50.880, -0.250],
    ],
    radarRingCenters: [
      [50.9100, -0.1800], // Ditchling Beacon
      [50.7350, 0.2400],  // Beachy Head
    ],
    primaryHabitat: 'Rolling maritime chalk downland, steep dry coombes & coastal chalk cliffs',
    keyTargetRaptors: ['Peregrine Falcon', 'Common Kestrel', 'Red Kite', 'Common Buzzard', 'Short-eared Owl'],
    gridRefPrefix: 'TQ / TV',
    statusBadge: 'EXPANSION SECTOR // MARITIME SCARP',
    elevationRange: '0m – 248m ASL',
    summary: 'The classic southern chalk ridge extending from Winchester to Beachy Head, with spectacular sea cliff Peregrines and sea-breeze thermal soaring.',
  },
  {
    id: 'all',
    name: 'All Southern Downland Sectors',
    shortName: 'All UK Sectors',
    tagline: 'Unified airspace radar across all southern England chalk & limestone scarps',
    county: 'Wiltshire, Oxon, Berks, Bucks, Glos, Sussex, Hants, Cambs',
    center: [51.400, -1.250],
    zoom: 8,
    thermalCorridorName: 'All Regional Escarpment Corridors Combined',
    corridorTrack: [],
    thermalZone: [],
    radarRingCenters: [
      [51.4835, -1.7895], // Barbury Castle
      [51.2626, -2.1462], // Westbury
      [51.8450, -0.6050], // Ivinghoe Beacon
      [51.9250, -2.0100], // Cleeve Hill
      [50.9100, -0.1800], // Ditchling Beacon
    ],
    primaryHabitat: 'Comprehensive network of ancient trackways, scarps, and downland plateaus',
    keyTargetRaptors: ['All UK Raptor & Owl Species'],
    gridRefPrefix: 'SU / ST / SP / SO / TQ / TL',
    statusBadge: 'NATIONAL OVERVIEW // ALL SECTORS',
    elevationRange: '0m – 330m ASL',
    summary: 'Wide-angle multi-sector airspace tracking all five key raptor migration and resident corridors across Southern Britain.',
  },
];

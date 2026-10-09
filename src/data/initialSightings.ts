import { SightingLog } from '../types/raptor';

// Helper to provide realistic relative timestamps dynamically based on current runtime
const relativeTime = (hoursAgo: number) => {
  const d = new Date(Date.now() - hoursAgo * 3600 * 1000);
  return {
    timestamp: d.toISOString(),
    date: d.toISOString().split('T')[0],
    time: d.toTimeString().slice(0, 5)
  };
};

export const INITIAL_SIGHTINGS: SightingLog[] = [
  // ==========================================
  // RIDGEWAY & MARLBOROUGH DOWNS (BARBURY SECTOR)
  // ==========================================
  {
    id: 'sgt-101',
    ...relativeTime(0.4), // ~24 mins ago -> 🟢 LIVE (< 3h)
    speciesId: 'red-kite',
    speciesName: 'Red Kite',
    sectorId: 'ridgeway-wessex',
    locationName: 'Barbury Castle Country Park',
    coordinates: [51.4835, -1.7895],
    count: 5,
    behavior: 'Thermal Soaring',
    altitudeM: 280,
    opticalGear: 'Swarovski EL 10x42 Swarovision',
    observerCallsign: 'DOWNS-ALPHA',
    observerRank: 'Seasoned Chalkland Scout',
    observerAffiliation: 'Wiltshire Ornithological Society (WOS)',
    notes: 'Magnificent kettle of 5 Red Kites utilising strong north escarpment updraft. Forked tails twisting in synchrony. One bird swooped low over the northern Iron Age earthwork ditch before regaining the thermal.',
    confidence: 'Confirmed (100%)',
    windDirection: 'NW',
    windSpeedMph: 12,
    thermalStrength: 'Strong',
    verificationStatus: 'Specialist Confirmed',
    corroborations: [
      {
        observerCallsign: 'RIDGEWAY-EAGLE',
        observerRank: 'Raptor Specialist / BTO Ringer',
        timestamp: new Date(Date.now() - 0.3 * 3600 * 1000).toISOString(),
        notes: 'Observed kettle from car park ridge at 13:40; confirmed 5 distinct individuals before two drifted toward Hackpen.'
      },
      {
        observerCallsign: 'CHALK-THERMAL-99',
        observerRank: 'Seasoned Chalkland Scout',
        timestamp: new Date(Date.now() - 0.2 * 3600 * 1000).toISOString(),
        notes: 'Visual contact corroborated through Zeiss Victory 8x42.'
      }
    ],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 0.4 * 3600 * 1000).toISOString(),
        action: 'INITIAL_LOG',
        actorCallsign: 'DOWNS-ALPHA',
        actorRank: 'Seasoned Chalkland Scout',
        details: 'Initial field observation logged with high-resolution coordinates.'
      },
      {
        timestamp: new Date(Date.now() - 0.3 * 3600 * 1000).toISOString(),
        action: 'PEER_CORROBORATION',
        actorCallsign: 'RIDGEWAY-EAGLE',
        actorRank: 'Raptor Specialist / BTO Ringer',
        details: 'Confirmed group size and flight vector.'
      },
      {
        timestamp: new Date(Date.now() - 0.2 * 3600 * 1000).toISOString(),
        action: 'SPECIALIST_VERIFIED',
        actorCallsign: 'RIDGEWAY-EAGLE',
        actorRank: 'Raptor Specialist / BTO Ringer',
        details: 'Upgraded to Specialist Confirmed based on dual observer consensus.'
      }
    ]
  },
  {
    id: 'sgt-102',
    ...relativeTime(1.1), // ~1.1h ago -> 🟢 LIVE (< 3h)
    speciesId: 'common-buzzard',
    speciesName: 'Common Buzzard',
    sectorId: 'ridgeway-wessex',
    locationName: 'Barbury Boundary Perch Fence',
    coordinates: [51.4855, -1.7915],
    count: 1,
    behavior: 'Perched on Post/Sarsen',
    altitudeM: 2,
    opticalGear: 'Barbury Live Cam / Leica Noctivid 10x42',
    observerCallsign: 'BARBURY-WATCH',
    observerRank: 'Station Observer',
    observerAffiliation: 'RaptorLens Network',
    notes: 'Large adult Buzzard perched motionless on north fence boundary post. Distinctive brown plumage with barred chest band. Observed scanning stubble field for small mammals before launching into glide toward valley copse.',
    confidence: 'Confirmed (100%)',
    windDirection: 'NW',
    windSpeedMph: 11,
    thermalStrength: 'Moderate',
    verificationStatus: 'Specialist Confirmed',
    corroborations: [
      {
        observerCallsign: 'DOWNS-ALPHA',
        observerRank: 'Seasoned Chalkland Scout',
        timestamp: new Date(Date.now() - 0.9 * 3600 * 1000).toISOString(),
        notes: 'Corroborated visual on fence line from top rampart.'
      }
    ],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 1.1 * 3600 * 1000).toISOString(),
        action: 'INITIAL_LOG',
        actorCallsign: 'BARBURY-WATCH',
        actorRank: 'Station Observer',
        details: 'Perch fence observation logged.'
      }
    ]
  },
  {
    id: 'sgt-103',
    ...relativeTime(2.3), // ~2.3h ago -> 🟢 LIVE (< 3h)
    speciesId: 'red-kite',
    speciesName: 'Red Kite',
    sectorId: 'ridgeway-wessex',
    locationName: 'Hackpen Hill & White Horse',
    coordinates: [51.4720, -1.7960],
    count: 2,
    behavior: 'Escarpment Lift',
    altitudeM: 65,
    opticalGear: 'Zeiss Victory SF 8x42',
    observerCallsign: 'RIDGEWAY-EAGLE',
    observerRank: 'Raptor Specialist / BTO Ringer',
    observerAffiliation: 'British Trust for Ornithology (BTO)',
    notes: 'Pair of Red Kites working the steep scarp slope directly above the chalk horse cutting. Incredible agility into 16mph westerly breeze, tipping wings with effortless precision.',
    confidence: 'Confirmed (100%)',
    windDirection: 'W',
    windSpeedMph: 16,
    thermalStrength: 'Moderate',
    verificationStatus: 'Specialist Confirmed',
    corroborations: [
      {
        observerCallsign: 'DOWNS-ALPHA',
        observerRank: 'Seasoned Chalkland Scout',
        timestamp: new Date(Date.now() - 2.1 * 3600 * 1000).toISOString(),
        notes: 'Confirmed pair passing south along the Ridgeway track.'
      }
    ],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 2.3 * 3600 * 1000).toISOString(),
        action: 'INITIAL_LOG',
        actorCallsign: 'RIDGEWAY-EAGLE',
        actorRank: 'Raptor Specialist / BTO Ringer',
        details: 'Logged contour glide over Hackpen scarp.'
      }
    ]
  },
  {
    id: 'sgt-104',
    ...relativeTime(5.5), // ~5.5h ago -> 🟡 TODAY (3-24h)
    speciesId: 'common-buzzard',
    speciesName: 'Common Buzzard',
    sectorId: 'ridgeway-wessex',
    locationName: 'Fyfield Down National Nature Reserve',
    coordinates: [51.4480, -1.7850],
    count: 3,
    behavior: 'Escarpment Lift',
    altitudeM: 180,
    opticalGear: 'Hawke Frontier ED X 8x42',
    observerCallsign: 'WESSEX-SCOUT-07',
    observerRank: 'Downland Sentinel Scout',
    observerAffiliation: 'Hawk and Owl Trust',
    notes: 'Three Buzzards spiralling over the ancient sarsen boulder valley. Distinctive variable pale morph on one individual, showing creamy breast band. Mewing calls echoing across the valley.',
    confidence: 'Confirmed (100%)',
    windDirection: 'W',
    windSpeedMph: 14,
    thermalStrength: 'Strong',
    verificationStatus: 'Corroborated by Peers',
    corroborations: [
      {
        observerCallsign: 'CHALK-THERMAL-99',
        observerRank: 'Seasoned Chalkland Scout',
        timestamp: new Date(Date.now() - 5.1 * 3600 * 1000).toISOString(),
        notes: 'Heard calls first from Ridgeway crossing, then picked up the trio climbing high.'
      }
    ],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 5.5 * 3600 * 1000).toISOString(),
        action: 'INITIAL_LOG',
        actorCallsign: 'WESSEX-SCOUT-07',
        actorRank: 'Downland Sentinel Scout',
        details: 'Visual contact registered over sarsen stones.'
      }
    ]
  },
  {
    id: 'sgt-105',
    ...relativeTime(7.2), // ~7.2h ago -> 🟡 TODAY (3-24h)
    speciesId: 'red-kite',
    speciesName: 'Red Kite',
    sectorId: 'ridgeway-wessex',
    locationName: 'Avebury Stone Circle & West Kennet',
    coordinates: [51.4285, -1.8540],
    count: 4,
    behavior: 'Thermal Soaring',
    altitudeM: 220,
    opticalGear: 'Nikon Monarch HG 10x42',
    observerCallsign: 'CHALK-THERMAL-99',
    observerRank: 'Seasoned Chalkland Scout',
    observerAffiliation: 'Wiltshire Ornithological Society (WOS)',
    notes: 'Loose group of 4 Red Kites riding a wide thermal column between the prehistoric Avebury henge and Silbury Hill. Deep red-brown upperparts and pale wing windows illuminated in sunlight.',
    confidence: 'Confirmed (100%)',
    windDirection: 'SW',
    windSpeedMph: 10,
    thermalStrength: 'Moderate',
    verificationStatus: 'Corroborated by Peers',
    corroborations: [],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 7.2 * 3600 * 1000).toISOString(),
        action: 'INITIAL_LOG',
        actorCallsign: 'CHALK-THERMAL-99',
        actorRank: 'Seasoned Chalkland Scout',
        details: 'Thermal group logged above Avebury henge.'
      }
    ]
  },
  {
    id: 'sgt-106',
    ...relativeTime(9.8), // ~9.8h ago -> 🟡 TODAY (3-24h)
    speciesId: 'common-buzzard',
    speciesName: 'Common Buzzard',
    sectorId: 'ridgeway-wessex',
    locationName: 'Morgan\'s Hill & Furze Knoll',
    coordinates: [51.4190, -1.9560],
    count: 2,
    behavior: 'Perched on Post/Sarsen',
    altitudeM: 8,
    opticalGear: 'Swarovski SLC 8x42',
    observerCallsign: 'WESSEX-SCOUT-07',
    observerRank: 'Downland Sentinel Scout',
    observerAffiliation: 'Hawk and Owl Trust',
    notes: 'Pair of Common Buzzards perched along the ancient Wansdyke earthwork hawthorn scrub. One bird dropped to the downland turf catching a beetle or mouse, before returning to low bough.',
    confidence: 'Confirmed (100%)',
    windDirection: 'SW',
    windSpeedMph: 12,
    thermalStrength: 'Weak',
    verificationStatus: 'Corroborated by Peers',
    corroborations: [],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 9.8 * 3600 * 1000).toISOString(),
        action: 'INITIAL_LOG',
        actorCallsign: 'WESSEX-SCOUT-07',
        actorRank: 'Downland Sentinel Scout',
        details: 'Logged Wansdyke hunting behaviour.'
      }
    ]
  },
  {
    id: 'sgt-107',
    ...relativeTime(13.4), // ~13.4h ago -> 🟡 TODAY (3-24h)
    speciesId: 'red-kite',
    speciesName: 'Red Kite',
    sectorId: 'ridgeway-wessex',
    locationName: 'Cherhill Monument & White Horse',
    coordinates: [51.4320, -1.9420],
    count: 3,
    behavior: 'Escarpment Lift',
    altitudeM: 90,
    opticalGear: 'Zeiss Conquest HD 10x42',
    observerCallsign: 'DOWNS-ALPHA',
    observerRank: 'Seasoned Chalkland Scout',
    observerAffiliation: 'Wessex Field Observers',
    notes: 'Three Red Kites drifting westward across the chalk combes towards the Lansdowne obelisk. Extremely graceful banking against morning sunlight.',
    confidence: 'Confirmed (100%)',
    windDirection: 'W',
    windSpeedMph: 15,
    thermalStrength: 'Moderate',
    verificationStatus: 'Corroborated by Peers',
    corroborations: [],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 13.4 * 3600 * 1000).toISOString(),
        action: 'INITIAL_LOG',
        actorCallsign: 'DOWNS-ALPHA',
        actorRank: 'Seasoned Chalkland Scout',
        details: 'Morning passage logged.'
      }
    ]
  },
  {
    id: 'sgt-108',
    ...relativeTime(17.5), // ~17.5h ago -> 🟡 TODAY (3-24h)
    speciesId: 'common-buzzard',
    speciesName: 'Common Buzzard',
    sectorId: 'ridgeway-wessex',
    locationName: 'Roundway Down & Oliver\'s Castle',
    coordinates: [51.3780, -1.9980],
    count: 1,
    behavior: 'Hover Hunting',
    altitudeM: 45,
    opticalGear: 'Vortex Viper HD 8x42',
    observerCallsign: 'CHALK-THERMAL-99',
    observerRank: 'Seasoned Chalkland Scout',
    observerAffiliation: 'Wiltshire Ornithological Society (WOS)',
    notes: 'Striking pale morph buzzard hanging motionless in the strong updraft right at the escarpment rim above Devizes. Broad rounded wings held in slight V.',
    confidence: 'Confirmed (100%)',
    windDirection: 'SW',
    windSpeedMph: 18,
    thermalStrength: 'Strong',
    verificationStatus: 'Corroborated by Peers',
    corroborations: [],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 17.5 * 3600 * 1000).toISOString(),
        action: 'INITIAL_LOG',
        actorCallsign: 'CHALK-THERMAL-99',
        actorRank: 'Seasoned Chalkland Scout',
        details: 'Escarpment hover logged.'
      }
    ]
  },
  {
    id: 'sgt-109',
    ...relativeTime(26.2), // ~26.2h ago -> 🟠 PAST 48H (24-48h)
    speciesId: 'red-kite',
    speciesName: 'Red Kite',
    sectorId: 'ridgeway-wessex',
    locationName: 'Liddington Castle Iron Age Hillfort',
    coordinates: [51.5170, -1.7130],
    count: 2,
    behavior: 'Thermal Soaring',
    altitudeM: 160,
    opticalGear: 'Leica Ultravid 8x42',
    observerCallsign: 'RIDGEWAY-EAGLE',
    observerRank: 'Raptor Specialist / BTO Ringer',
    observerAffiliation: 'British Trust for Ornithology (BTO)',
    notes: 'Two Red Kites inspecting the high ditch ramparts of Liddington Castle before setting off south-west along the Ridgeway ridge towards Barbury.',
    confidence: 'Confirmed (100%)',
    windDirection: 'NE',
    windSpeedMph: 8,
    thermalStrength: 'Moderate',
    verificationStatus: 'Corroborated by Peers',
    corroborations: [],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 26.2 * 3600 * 1000).toISOString(),
        action: 'INITIAL_LOG',
        actorCallsign: 'RIDGEWAY-EAGLE',
        actorRank: 'Raptor Specialist / BTO Ringer',
        details: 'Ridge transit logged.'
      }
    ]
  },
  {
    id: 'sgt-110',
    ...relativeTime(31.8), // ~31.8h ago -> 🟠 PAST 48H (24-48h)
    speciesId: 'common-buzzard',
    speciesName: 'Common Buzzard',
    sectorId: 'ridgeway-wessex',
    locationName: 'Milk Hill & Alton Barnes White Horse',
    coordinates: [51.3650, -1.8520],
    count: 2,
    behavior: 'Thermal Soaring',
    altitudeM: 310,
    opticalGear: 'Swarovski EL 8.5x42',
    observerCallsign: 'DOWNS-ALPHA',
    observerRank: 'Seasoned Chalkland Scout',
    observerAffiliation: 'Wessex Field Observers',
    notes: 'Pair climbing into high cloud base directly over Milk Hill summit (highest chalk hill in Wiltshire). Both birds calling repeatedly with characteristic high-pitched mew.',
    confidence: 'Confirmed (100%)',
    windDirection: 'S',
    windSpeedMph: 12,
    thermalStrength: 'Strong',
    verificationStatus: 'Specialist Confirmed',
    corroborations: [],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 31.8 * 3600 * 1000).toISOString(),
        action: 'INITIAL_LOG',
        actorCallsign: 'DOWNS-ALPHA',
        actorRank: 'Seasoned Chalkland Scout',
        details: 'High thermal climb logged.'
      }
    ]
  },
  {
    id: 'sgt-111',
    ...relativeTime(36.5), // ~36.5h ago -> 🟠 PAST 48H (24-48h)
    speciesId: 'red-kite',
    speciesName: 'Red Kite',
    sectorId: 'chilterns',
    locationName: 'Aston Rowant NNR (Chilterns Escarpment)',
    coordinates: [51.6780, -0.9250],
    count: 6,
    behavior: 'Thermal Soaring',
    altitudeM: 240,
    opticalGear: 'Zeiss Victory SF 10x42',
    observerCallsign: 'CHILTERN-KESTREL',
    observerRank: 'Chilterns Corridor Lead',
    observerAffiliation: 'Chilterns Conservation Board',
    notes: 'Incredible kettle of 6 Red Kites circling over the chalk cutting and beech woodland. Prime stronghold habitat showing typical feeding aggregation.',
    confidence: 'Confirmed (100%)',
    windDirection: 'W',
    windSpeedMph: 14,
    thermalStrength: 'Strong',
    verificationStatus: 'Specialist Confirmed',
    corroborations: [],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 36.5 * 3600 * 1000).toISOString(),
        action: 'INITIAL_LOG',
        actorCallsign: 'CHILTERN-KESTREL',
        actorRank: 'Chilterns Corridor Lead',
        details: 'Kettle observation logged.'
      }
    ]
  },
  {
    id: 'sgt-112',
    ...relativeTime(43.0), // ~43.0h ago -> 🟠 PAST 48H (24-48h)
    speciesId: 'common-buzzard',
    speciesName: 'Common Buzzard',
    sectorId: 'salisbury-plain',
    locationName: 'Parsonage Down NNR (Salisbury Plain)',
    coordinates: [51.1780, -1.9320],
    count: 2,
    behavior: 'Low Quartering',
    altitudeM: 25,
    opticalGear: 'Kowa BDII 8x42',
    observerCallsign: 'PLAIN-WATCHER',
    observerRank: 'Plain Survey Volunteer',
    observerAffiliation: 'Wessex Raptor Study Group',
    notes: 'Two Buzzards hunting grasshopper swarms and small rodents in ancient floristically-rich chalk downland turf. Active fluttering descent onto prey.',
    confidence: 'Confirmed (100%)',
    windDirection: 'SW',
    windSpeedMph: 10,
    thermalStrength: 'Weak',
    verificationStatus: 'Corroborated by Peers',
    corroborations: [],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 43.0 * 3600 * 1000).toISOString(),
        action: 'INITIAL_LOG',
        actorCallsign: 'PLAIN-WATCHER',
        actorRank: 'Plain Survey Volunteer',
        details: 'Chalk grassland foraging logged.'
      }
    ]
  }
];

import { RssDispatch } from '../types/raptor';

// Helper to provide realistic relative timestamps dynamically based on current runtime
const relativeDispatchTime = (hoursAgo: number) => {
  const d = new Date(Date.now() - hoursAgo * 3600 * 1000);
  const minutesAgo = Math.round(hoursAgo * 60);
  let timeAgo = `${minutesAgo}m ago`;
  if (hoursAgo >= 1 && hoursAgo < 24) {
    const hrs = Math.floor(hoursAgo);
    const remMins = Math.round((hoursAgo - hrs) * 60);
    timeAgo = remMins > 0 ? `${hrs}h ${remMins}m ago` : `${hrs}h ago`;
  } else if (hoursAgo >= 24) {
    const days = Math.floor(hoursAgo / 24);
    timeAgo = days === 1 ? 'Yesterday' : `${days}d ago`;
  }

  return {
    timestamp: d.toISOString(),
    timeAgo
  };
};

export const INITIAL_DISPATCHES: RssDispatch[] = [
  {
    id: 'disp-001',
    title: 'RED KITE KETTLE (8 BIRDS) OVER BARBURY CASTLE RAMPARTS',
    ...relativeDispatchTime(0.3), // ~18 mins ago
    source: 'Wessex Downs Raptor Study Group (RSS Wire)',
    category: 'SIGHTING ALERT',
    priority: 'HIGH',
    summary: 'Exceptional solar thermal column developed along northern chalk escarpment. 8 Red Kites and 3 Common Buzzards currently spiralling at ~350m altitude above northern ramparts. Heading south-west towards Hackpen.',
    hotspotRef: 'barbury-castle',
    coordinates: [51.4835, -1.7895],
    gridRef: 'SU 149 763',
    author: 'Callsign: KITE-SCOUT-7 (BTO Surveyor #4182)',
    verified: true,
    speciesMentioned: ['Red Kite', 'Common Buzzard']
  },
  {
    id: 'disp-002',
    title: 'PEREGRINE FALCON FAST PASSAGE & ATTACK RUN AT HACKPEN HILL',
    ...relativeDispatchTime(1.1), // ~1h 05m ago
    source: 'Wiltshire Ornithological Society Field RSS',
    category: 'SIGHTING ALERT',
    priority: 'HIGH',
    summary: 'Adult tiercel Peregrine clocked stooping from 400m onto feral flock over the Hackpen White Horse. Re-ascended onto high radio mast south of the Ridgeway car park. Superb optics opportunity with 40x scope.',
    hotspotRef: 'hackpen-hill',
    coordinates: [51.4720, -1.7960],
    gridRef: 'SU 130 750',
    author: 'Callsign: RIDGEWAY-VANGUARD (HawkWatch UK)',
    verified: true,
    speciesMentioned: ['Peregrine Falcon']
  },
  {
    id: 'disp-003',
    title: 'AUTUMN HARRIER MIGRATION SURGE: RINGTAIL HEN HARRIER LOGGED',
    ...relativeDispatchTime(2.75), // ~2h 45m ago
    source: 'BTO BirdTrack Wessex Feeder Net',
    category: 'MIGRATION SURGE',
    priority: 'CRITICAL',
    summary: 'First confirmed seasonal arrival of female/immature ringtail Hen Harrier quartering the sarsen stone corridors at Fyfield Down. Typical low 1.5m glide above chalk grass, white rump flash clearly recorded on camera trap.',
    hotspotRef: 'fyfield-down',
    coordinates: [51.4480, -1.7850],
    gridRef: 'SU 140 710',
    author: 'Callsign: FYFIELD-OBS-1 (Natural England Warden)',
    verified: true,
    speciesMentioned: ['Hen Harrier']
  },
  {
    id: 'disp-004',
    title: 'SOLAR LIFT & THERMAL CEILING FORECAST: MARLBOROUGH DOWNS',
    ...relativeDispatchTime(4.5), // ~4h 30m ago
    source: 'SkyScout Met & Thermal Index',
    category: 'THERMAL WATCH',
    priority: 'NORMAL',
    summary: 'Surface heating index reaching 22°C with light WNW breeze (8-11 mph). Boundary layer thermals rising up to 1,200m AGL between 12:30 and 16:00 BST. Ideal conditions for raptor kettle soaring between Barbury Castle and Avebury.',
    hotspotRef: 'barbury-castle',
    coordinates: [51.4835, -1.7895],
    gridRef: 'SU 149 763',
    author: 'Met Office Aviation / SkyScout UK',
    verified: true
  },
  {
    id: 'disp-005',
    title: 'HOBBY FAMILY HUNTING DRAGONFLIES OVER SILBURY CORRIDOR',
    ...relativeDispatchTime(5.75), // ~5h 45m ago
    source: 'Kennet Valley Raptor Dispatch',
    category: 'SIGHTING ALERT',
    priority: 'NORMAL',
    summary: 'Pair of adult Eurasian Hobbies actively hunting southern hawker dragonflies along the River Kennet reedbeds near Silbury Hill. Displaying high-speed scythe-winged stoops and food-passing in mid-air.',
    hotspotRef: 'silbury-hill',
    coordinates: [51.4158, -1.8575],
    gridRef: 'SU 100 685',
    author: 'Callsign: KENNET-RIDER',
    verified: true,
    speciesMentioned: ['Eurasian Hobby']
  },
  {
    id: 'disp-006',
    title: 'AVEBURY HENGE RAPTOR CORRIDOR SAFETY & ETHICAL VIEWING PROTOCOL',
    ...relativeDispatchTime(21.0), // ~21h ago
    source: 'National Trust Wessex Downs Ranger Bulletin',
    category: 'FIELD BULLETIN',
    priority: 'NORMAL',
    summary: 'Reminder to all observers: keep distance of at least 150m from active raptor roosts in ancient beech clumps along the Ridgeway. Use public rights of way and avoid using recreational drones over ancient monument earthworks.',
    hotspotRef: 'avebury-henge',
    coordinates: [51.4285, -1.8540],
    gridRef: 'SU 102 699',
    author: 'National Trust Estate Warden',
    verified: true
  },
  {
    id: 'disp-007',
    title: 'ACROBATIC HOBBY PAIR HAWKING DRAGONFLIES AT RSPB FOWLMERE',
    ...relativeDispatchTime(1.4), // ~1h 24m ago
    source: 'Cambridgeshire Bird Club & RSPB Reserve Wire',
    category: 'SIGHTING ALERT',
    priority: 'HIGH',
    summary: 'Two Eurasian Hobbies recorded performing acrobatic low-altitude stoops over the chalk spring pool and reedbeds at RSPB Fowlmere. Superb views from Reedbed Hide catching dragonflies with talons in flight. Barn Owl also active at dusk along the springline meadow margin.',
    hotspotRef: 'fowlmere-reserve',
    coordinates: [52.0834, 0.0712],
    gridRef: 'TL 406 458',
    author: 'Callsign: FOWLMERE-SCOUT (RSPB Volunteer)',
    verified: true,
    speciesMentioned: ['Eurasian Hobby', 'Barn Owl']
  }
];

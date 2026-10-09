import { ObserverProfile } from '../types/community';
import { SightingLog } from '../types/raptor';
import { BetaFeedbackEntry } from '../components/BetaFeedbackModal';

export type AnalyticsEventType =
  | 'observer_registered'
  | 'observer_login'
  | 'sighting_logged'
  | 'map_view_mode_toggled'
  | 'sector_switched'
  | 'beta_feedback_submitted'
  | 'confusion_solver_opened'
  | 'life_list_viewed'
  | 'field_lite_mode_toggled'
  | 'page_view';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: string; // ISO string
  date: string;      // YYYY-MM-DD
  label: string;
  metadata?: Record<string, any>;
}

const STORAGE_KEY = 'raptorlens_analytics_events';
const MAX_EVENTS = 500;

// Helper to get stored events
export function getStoredAnalyticsEvents(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = generateSeedEvents();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read analytics events', err);
    return [];
  }
}

// Track an event
export function trackEvent(
  type: AnalyticsEventType,
  label: string,
  metadata?: Record<string, any>
): AnalyticsEvent {
  const now = new Date();
  const newEvent: AnalyticsEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type,
    timestamp: now.toISOString(),
    date: now.toISOString().split('T')[0],
    label,
    metadata,
  };

  try {
    const events = getStoredAnalyticsEvents();
    const updated = [newEvent, ...events].slice(0, MAX_EVENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save analytics event', err);
  }

  return newEvent;
}

// Generate realistic seeded telemetry events so admin metrics are rich immediately
function generateSeedEvents(): AnalyticsEvent[] {
  const seed: AnalyticsEvent[] = [];
  const baseTime = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // Past 7 days of realistic usage
  const sampleRegistrations = [
    { callsign: 'RIDGEWAY-EAGLE', daysAgo: 6, level: 'Raptor Specialist / BTO Ringer' },
    { callsign: 'CHALK-THERMAL-99', daysAgo: 5, level: 'Seasoned Chalkland Scout' },
    { callsign: 'AVEBURY-KESTREL', daysAgo: 4, level: 'Raptor Specialist / BTO Ringer' },
    { callsign: 'FYFIELD-HARRIER', daysAgo: 3, level: 'Intermediate Field Spotter' },
    { callsign: 'OGBOURNE-BUZZARD', daysAgo: 2, level: 'Downland Walker & Nature Photographer' },
    { callsign: 'WESSEX-SCOUT-07', daysAgo: 1, level: 'Intermediate Field Spotter' },
    { callsign: 'CHILTERN-KITE-01', daysAgo: 0, level: 'Seasoned Chalkland Scout' },
  ];

  sampleRegistrations.forEach((reg, i) => {
    const time = new Date(baseTime - reg.daysAgo * dayMs - i * 3600000);
    seed.push({
      id: `seed-reg-${i}`,
      type: 'observer_registered',
      timestamp: time.toISOString(),
      date: time.toISOString().split('T')[0],
      label: `New Observer Registered: ${reg.callsign}`,
      metadata: { callsign: reg.callsign, experienceLevel: reg.level },
    });
  });

  // Sample view mode toggles
  for (let d = 5; d >= 0; d--) {
    const time = new Date(baseTime - d * dayMs + 10000);
    seed.push({
      id: `seed-view-${d}`,
      type: 'map_view_mode_toggled',
      timestamp: time.toISOString(),
      date: time.toISOString().split('T')[0],
      label: d % 2 === 0 ? 'Mode switched to Clean Sightings Focus' : 'Mode switched to Aero & Weather Intel',
      metadata: { mode: d % 2 === 0 ? 'clean' : 'telemetry' },
    });
  }

  // Sample sighting events
  const sampleSightings = [
    { species: 'Red Kite', loc: 'Barbury Castle', daysAgo: 1 },
    { species: 'Common Buzzard', loc: 'Hackpen Hill', daysAgo: 2 },
    { species: 'Kestrel', loc: 'Avebury Henge', daysAgo: 2 },
    { species: 'Hen Harrier', loc: 'Fyfield Down', daysAgo: 3 },
    { species: 'Peregrine Falcon', loc: 'Liddington Hill', daysAgo: 4 },
  ];

  sampleSightings.forEach((s, idx) => {
    const time = new Date(baseTime - s.daysAgo * dayMs + idx * 7200000);
    seed.push({
      id: `seed-sight-${idx}`,
      type: 'sighting_logged',
      timestamp: time.toISOString(),
      date: time.toISOString().split('T')[0],
      label: `Sighting Logged: ${s.species} at ${s.loc}`,
      metadata: { species: s.species, location: s.loc },
    });
  });

  return seed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Download helpers
export function downloadCsvFile(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadJsonFile(filename: string, data: any) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

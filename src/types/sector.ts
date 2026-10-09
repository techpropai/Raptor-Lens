export type SectorId = 
  | 'all' 
  | 'ridgeway-wessex' 
  | 'salisbury-plain' 
  | 'chilterns' 
  | 'cotswolds' 
  | 'south-downs';

export interface UkSector {
  id: SectorId;
  name: string;
  shortName: string;
  tagline: string;
  county: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  thermalCorridorName: string;
  corridorTrack: [number, number][]; // polyline
  thermalZone: [number, number][]; // polygon
  radarRingCenters: [number, number][]; // radar pulse circles
  primaryHabitat: string;
  keyTargetRaptors: string[];
  gridRefPrefix: string;
  statusBadge: string;
  summary: string;
  elevationRange: string;
}

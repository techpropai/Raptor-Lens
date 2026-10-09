import { LivestreamCam } from '../types/raptor';

/**
 * SOLE OFFICIAL HOSTED LIVESTREAM RIG
 * In accordance with UK copyright law (CDPA 1988), broadcasting guidelines,
 * and conservation ethics, this website exclusively hosts and embeds the camera
 * rig directly owned and operated by the station (CAM 01: Barbury Castle Downland Field Cam).
 */
export const LIVESTREAM_CHANNELS: LivestreamCam[] = [
  {
    id: 'stream-barbury-castle-livecam',
    title: 'UK Peregrine & Downland Raptor Cam (30x Optical)',
    location: 'Wessex Escarpment / Downland Roost (Facing Barbury Airspace)',
    channelName: 'UK Raptor Watch & Peregrine Cam',
    youtubeId: 'GAxREl6-fJs', // Active verified live stream
    channelUrl: 'https://www.youtube.com/watch?v=GAxREl6-fJs',
    status: 'LIVE',
    description: 'Direct high-definition optical telephoto camera tracking resident UK raptors, Peregrine Falcons, hunting Buzzards, and low-quartering Harriers along the downland ridge.',
    elevation: '268m ASL (Target Hillfort)',
    gridRef: 'SU 149 763 (Target)',
    viewers: 412,
    isCommunityFieldCam: true,
    distanceToSubjectKm: 3.0,
    opticalZoom: '30x Optical Telephoto',
    panBearing: '195° SSW towards Hillfort Ramparts',
    sensorSpecs: 'High-sensitivity 30x Optical Zoom • Solar Powered Field Rig',
    spotterReports: [
      {
        id: 'spot-01',
        timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
        timeAgo: '14m ago',
        callsign: 'KITE-WATCHER-07',
        speciesName: 'Red Kite',
        count: 4,
        sectorQuadrant: 'Northern Ramparts',
        description: '4 birds spiralling in thermal lift directly over the northern tree clumps of the ramparts.',
        verified: true,
      },
      {
        id: 'spot-02',
        timestamp: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
        timeAgo: '48m ago',
        callsign: 'RIDGEWAY-VANGUARD',
        speciesName: 'Common Buzzard',
        count: 2,
        sectorQuadrant: 'Chalk Valley Bottom',
        description: 'Adult buzzard hovering briefly over the rape field margin before dropping into rough grass.',
        verified: true,
      },
      {
        id: 'spot-03',
        timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
        timeAgo: '1h 50m ago',
        callsign: 'CHALK-THERMAL-99',
        speciesName: 'Common Kestrel',
        count: 1,
        sectorQuadrant: 'North-West Escarpment',
        description: 'Classic stationary wind-hover lock against the northerly breeze.',
        verified: true,
      }
    ]
  }
];

import React, { useState, useEffect } from 'react';
import { 
  Mountain, 
  Wind, 
  Eye, 
  Thermometer, 
  Car, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Navigation, 
  Radio, 
  ChevronRight, 
  MessageSquare, 
  Compass,
  Settings,
  Video,
  ExternalLink,
  Tv,
  Play,
  HelpCircle,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  X,
  ExternalLink as ExternalLinkIcon
} from 'lucide-react';
import { LivestreamCam, RssDispatch } from '../types/raptor';
import { LIVESTREAM_CHANNELS } from '../data/livestreams';
import { BARBURY_PTZ_PRESETS, BARBURY_SUMMIT_WEATHER } from '../data/camPresets';
import { tacticalAudio } from '../utils/audio';
import { SectorId } from '../types/sector';
import { 
  extractYouTubeVideoId, 
  extractYouTubeChannelInfo, 
  getYouTubeChannelUrl, 
  buildYouTubeEmbedSrc,
  StreamPlayMode,
  DEFAULT_CAMERA_VIDEO_ID,
  DEMO_NATURE_VIDEO_ID
} from '../utils/youtube';

interface SummitTrailConditionsViewProps {
  onSwitchToRadar: () => void;
  onOpenLogModal: (locationGuess?: string) => void;
  onOpenGuide: () => void;
  activeSectorId?: SectorId;
  currentCallsign?: string;
  onAddDispatch?: (dispatch: RssDispatch) => void;
}

export const SummitTrailConditionsView: React.FC<SummitTrailConditionsViewProps> = ({
  onSwitchToRadar,
  onOpenLogModal,
  onOpenGuide,
  activeSectorId = 'ridgeway-wessex',
  currentCallsign = 'RIDGE-WALKER',
  onAddDispatch,
}) => {
  const currentCam = LIVESTREAM_CHANNELS[0];
  const [customVideoId, setCustomVideoId] = useState<string>(() => {
    try {
      return localStorage.getItem('raptorlens_custom_cam') || '';
    } catch {
      return '';
    }
  });
  const [customChannelInput, setCustomChannelInput] = useState<string>(() => {
    try {
      return localStorage.getItem('raptorlens_channel_url') || '';
    } catch {
      return '';
    }
  });
  const [streamMode, setStreamMode] = useState<StreamPlayMode>(() => {
    try {
      const saved = localStorage.getItem('raptorlens_stream_mode');
      if (saved === 'video' || saved === 'channel' || saved === 'demo') return saved;
      return 'video';
    } catch {
      return 'video';
    }
  });
  const [showFeedInput, setShowFeedInput] = useState<boolean>(false);
  const [showTroubleshootModal, setShowTroubleshootModal] = useState<boolean>(false);
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'parking' | 'distances' | 'dispatches'>('parking');
  const [activeTrailDistance, setActiveTrailDistance] = useState<'hackpen' | 'avebury' | 'liddington' | 'fyfield'>('hackpen');
  const [showQuickSpotModal, setShowQuickSpotModal] = useState<boolean>(false);
  const [quickSpotSpecies, setQuickSpotSpecies] = useState<string>('Red Kite');
  const [quickSpotCount, setQuickSpotCount] = useState<number>(1);
  const [quickSpotNotes, setQuickSpotNotes] = useState<string>('');

  useEffect(() => {
    try {
      if (customVideoId) {
        localStorage.setItem('raptorlens_custom_cam', customVideoId);
      } else {
        localStorage.removeItem('raptorlens_custom_cam');
      }
    } catch {}
  }, [customVideoId]);

  useEffect(() => {
    try {
      if (customChannelInput) {
        localStorage.setItem('raptorlens_channel_url', customChannelInput);
      } else {
        localStorage.removeItem('raptorlens_channel_url');
      }
    } catch {}
  }, [customChannelInput]);

  useEffect(() => {
    try {
      localStorage.setItem('raptorlens_stream_mode', streamMode);
    } catch {}
  }, [streamMode]);

  const activeVideoId = customVideoId.trim() || currentCam.youtubeId || DEFAULT_CAMERA_VIDEO_ID;
  const channelInfo = extractYouTubeChannelInfo(customChannelInput || currentCam.channelUrl || '');
  const resolvedChannelUrl = getYouTubeChannelUrl(customChannelInput || currentCam.channelUrl, activeVideoId);
  const activeEmbedSrc = buildYouTubeEmbedSrc({
    videoId: activeVideoId,
    channelId: channelInfo.channelId,
    mode: streamMode,
  });

  const activePreset = BARBURY_PTZ_PRESETS[activePresetIndex] || BARBURY_PTZ_PRESETS[0];

  const trailDestinations = [
    {
      id: 'hackpen',
      name: 'Hackpen Hill & White Horse',
      distance: '3.2 miles (5.1 km)',
      time: '~1 hr 15 mins',
      difficulty: 'Moderate',
      surface: 'Grass track & chalk gallops',
      highlights: 'Chalk White Horse, 271m summit, panoramic Thames Valley vista, perched kestrels.',
      hazards: 'Exposed to westerly headwinds; racehorses training on gallops before 11:00 AM.',
    },
    {
      id: 'avebury',
      name: 'Avebury Megalithic Stone Circle',
      distance: '5.8 miles (9.3 km)',
      time: '~2 hrs 10 mins',
      difficulty: 'Moderate-Long',
      surface: 'Ridgeway byway & downland field paths',
      highlights: 'World Heritage prehistoric stone henge, Red Kites foraging low over Kennet avenues.',
      hazards: 'Occasional farm vehicles on Byway (BOAT); muddy near West Kennet in winter.',
    },
    {
      id: 'liddington',
      name: 'Liddington Castle Iron Age Fort',
      distance: '6.1 miles (9.8 km)',
      time: '~2 hrs 20 mins',
      difficulty: 'Moderate',
      surface: 'Ridgeway ancient crestway, chalk turf',
      highlights: 'Second highest Iron Age earthwork in Wiltshire (277m ASL), Jefferies memorial stone.',
      hazards: 'Remote downland with zero shelter between Barbury and Liddington.',
    },
    {
      id: 'fyfield',
      name: 'Fyfield Down National Nature Reserve',
      distance: '4.5 miles (7.2 km)',
      time: '~1 hr 45 mins',
      difficulty: 'Easy-Moderate',
      surface: 'Ancient sarsen valley, dry calcareous turf',
      highlights: 'Largest natural deposit of prehistoric sarsen boulders in England; Little Owls on stones.',
      hazards: 'Grazing cattle; uneven rocky turf amongst Mother Sarsen stones.',
    },
  ];

  const selectedTrail = trailDestinations.find((t) => t.id === activeTrailDistance) || trailDestinations[0];

  const handleQuickSpotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    tacticalAudio.playConfirmChime();

    if (onAddDispatch) {
      const autoDispatch: RssDispatch = {
        id: `disp-trail-${Date.now()}`,
        title: `TRAIL SPOT: ${quickSpotCount}x ${quickSpotSpecies.toUpperCase()} AT BARBURY CASTLE`,
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now',
        source: 'Barbury Ridge Trail Watch',
        category: 'SIGHTING ALERT',
        priority: 'HIGH',
        summary: quickSpotNotes.trim() || `Hiker spotted ${quickSpotCount}x ${quickSpotSpecies} overhead on the Ridgeway trail.`,
        hotspotRef: 'barbury-castle',
        author: `Trail Walker: ${currentCallsign}`,
        verified: true,
        speciesMentioned: [quickSpotSpecies],
      };
      onAddDispatch(autoDispatch);
    }

    setShowQuickSpotModal(false);
    setQuickSpotNotes('');
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto animate-fadeIn">
      {/* 1. Live Summit Camera (Clean & Focused) */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Stream Header */}
        <div className="bg-neutral-900/95 border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between text-xs font-mono-tactical flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="font-bold text-neutral-100">
              {streamMode === 'channel' ? 'Barbury Castle YouTube Channel Broadcast' : 'Barbury Castle Summit Cam'}
            </span>
            <span className="text-[10px] text-neutral-400 hidden sm:inline">
              • 268m ASL • The Ridgeway
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Direct Link to YouTube Channel */}
            <a
              href={resolvedChannelUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => tacticalAudio.playRadarPing(880)}
              className="bg-red-600 hover:bg-red-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              title="Open YouTube Channel in new tab"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="hidden sm:inline">YouTube Channel</span>
              <span className="sm:hidden">Channel</span>
              <ExternalLink className="w-3 h-3 text-red-200" />
            </a>

            {/* Stream Mode Switcher */}
            <div className="flex items-center bg-neutral-950 border border-neutral-750 rounded-lg p-0.5 text-[10px]">
              <button
                type="button"
                onClick={() => {
                  tacticalAudio.playRadarPing(780);
                  setStreamMode('video');
                }}
                className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  streamMode === 'video'
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Play my camera feed ID (9gkrkcqHQ78)"
              >
                📹 My Cam
              </button>
              <button
                type="button"
                onClick={() => {
                  tacticalAudio.playRadarPing(880);
                  setStreamMode('channel');
                }}
                className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  streamMode === 'channel'
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Play YouTube Channel live broadcast"
              >
                📺 Channel
              </button>
              <button
                type="button"
                onClick={() => {
                  tacticalAudio.playRadarPing(920);
                  setStreamMode('demo');
                }}
                className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  streamMode === 'demo'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'text-neutral-400 hover:text-emerald-300'
                }`}
                title="Test working 4K nature video to verify video playback immediately"
              >
                🌿 Demo Test
              </button>
            </div>

            <button
              onClick={() => {
                tacticalAudio.playRadarPing(800);
                setShowTroubleshootModal(true);
              }}
              className="bg-neutral-800 hover:bg-neutral-750 text-amber-300 border border-amber-500/30 px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Why is my stream black or saying Video Unavailable?"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Stream Help</span>
            </button>

            <button
              onClick={() => {
                tacticalAudio.playRadarPing(760);
                setShowFeedInput(!showFeedInput);
              }}
              className="bg-neutral-800 hover:bg-neutral-750 text-neutral-300 border border-neutral-700 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Configure camera video link and YouTube channel"
            >
              <Settings className="w-3.5 h-3.5 text-neutral-400" />
              <span>{showFeedInput ? 'Close Config' : 'Channel / Feed Settings'}</span>
            </button>

            <button
              onClick={() => {
                tacticalAudio.playRadarPing(880);
                setShowQuickSpotModal(true);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Log Sighting</span>
            </button>
            <button
              onClick={() => {
                tacticalAudio.playRadarPing(920);
                onSwitchToRadar();
              }}
              className="bg-neutral-800 hover:bg-neutral-750 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>🦅 Airspace Radar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stream Health & Diagnostics Bar */}
        {streamMode === 'demo' ? (
          <div className="bg-emerald-950/70 border-b border-emerald-500/40 px-3.5 sm:px-4 py-2 flex items-center justify-between text-xs font-mono-tactical flex-wrap gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-emerald-300 font-bold">
                DEMO TEST FEED ACTIVE (Costa Rica 4K Wildlife & Telephoto Optics)
              </span>
              <span className="text-neutral-300 text-[11px] hidden md:inline">
                • Confirms that your browser, video player, and audio are running smoothly!
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  tacticalAudio.playRadarPing(800);
                  setStreamMode('video');
                }}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow"
              >
                <span>Switch to My Cam ({activeVideoId})</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-amber-950/30 border-b border-amber-500/25 px-3.5 sm:px-4 py-2 flex items-center justify-between text-xs font-mono-tactical flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-neutral-200 text-[11px] font-medium">
                Live Cam ID: <code className="text-amber-300 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">{activeVideoId}</code>
              </span>
              <span className="text-neutral-400 text-[11px] hidden lg:inline">
                If the screen is black or "Video unavailable", test with the Demo Feed or check YouTube Studio settings.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  tacticalAudio.playRadarPing(920);
                  setStreamMode('demo');
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                title="Verify video playback with live demo stream"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Test Live Demo Feed</span>
              </button>
              <a
                href={resolvedChannelUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                title="Visit public YouTube channel in new tab"
              >
                <span>Channel ↗</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  tacticalAudio.playRadarPing(800);
                  setShowTroubleshootModal(true);
                }}
                className="text-amber-400 hover:text-amber-300 text-[11px] underline cursor-pointer font-semibold"
              >
                Setup Guide
              </button>
            </div>
          </div>
        )}

        {/* Custom Camera Feed & YouTube Channel Configuration Drawer */}
        {showFeedInput && (
          <div className="p-3.5 bg-neutral-900 border-b border-neutral-800 space-y-3 font-mono-tactical text-xs animate-fadeIn">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-amber-400" />
                Live Camera Source &amp; YouTube Channel Links:
              </span>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-neutral-400">
                  Active Mode: <strong className={streamMode === 'channel' ? 'text-red-400' : streamMode === 'demo' ? 'text-emerald-400' : 'text-amber-400'}>
                    {streamMode === 'channel' ? 'YouTube Channel Broadcast' : streamMode === 'demo' ? 'Live Demo Cam' : 'Direct Camera Rig'}
                  </strong>
                </span>
                <span className="text-neutral-400 font-mono">
                  (ID: <strong className="text-amber-400">{activeVideoId}</strong>)
                </span>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-2 flex-wrap pb-1 border-b border-neutral-800">
              <span className="text-neutral-400 text-[11px]">Quick Feeds:</span>
              <button
                type="button"
                onClick={() => {
                  tacticalAudio.playRadarPing(880);
                  setCustomVideoId(DEFAULT_CAMERA_VIDEO_ID);
                  setStreamMode('video');
                }}
                className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-amber-300 text-[11px] font-semibold cursor-pointer"
              >
                📹 Reset to My Cam (9gkrkcqHQ78)
              </button>
              <button
                type="button"
                onClick={() => {
                  tacticalAudio.playRadarPing(920);
                  setStreamMode('demo');
                }}
                className="px-2 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-600/50 text-emerald-300 text-[11px] font-semibold cursor-pointer"
              >
                🌿 Load Working 4K Demo Cam
              </button>
              <a
                href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                target="_blank"
                rel="noreferrer"
                className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-neutral-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Watch on YouTube ↗</span>
              </a>
            </div>

            {/* Field 1: Camera Video / Stream URL */}
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-300 font-medium flex items-center justify-between">
                <span>1. Camera Video / Livestream Link or 11-char ID:</span>
                <span className="text-[10px] text-neutral-400 font-sans">e.g. https://www.youtube.com/watch?v=9gkrkcqHQ78 or 9gkrkcqHQ78</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Paste YouTube livestream URL (studio / watch / live) or 11-char ID..."
                  value={customVideoId}
                  onChange={(e) => {
                    const val = extractYouTubeVideoId(e.target.value);
                    setCustomVideoId(val);
                  }}
                  className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    tacticalAudio.playRadarPing(880);
                    setCustomVideoId('9gkrkcqHQ78');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-amber-300 text-xs font-mono cursor-pointer transition-colors whitespace-nowrap"
                >
                  Reset 9gkrkcqHQ78
                </button>
                {customVideoId && (
                  <button
                    type="button"
                    onClick={() => setCustomVideoId('')}
                    className="px-2 py-1.5 text-neutral-400 hover:text-rose-400 text-xs font-bold cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Field 2: YouTube Channel Link or Channel ID */}
            <div className="space-y-1">
              <label className="text-[11px] text-neutral-300 font-medium flex items-center justify-between">
                <span>2. YouTube Channel URL, Handle (@name), or Channel ID (UC...):</span>
                <span className="text-[10px] text-neutral-400 font-sans">Enables 1-click visit &amp; channel live stream embedding</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Paste YouTube Channel URL (e.g. https://youtube.com/@channel or UC...) or watch link..."
                  value={customChannelInput}
                  onChange={(e) => setCustomChannelInput(e.target.value)}
                  className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-1.5 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-red-500 font-mono text-xs"
                />
                <a
                  href={resolvedChannelUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => tacticalAudio.playRadarPing(880)}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shadow-sm"
                >
                  <span>Open Channel ↗</span>
                </a>
              </div>
            </div>

            {/* Quick helper tip */}
            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/80 flex-wrap gap-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Both live camera stream and channel page stay synchronized across your visits.</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  tacticalAudio.playRadarPing(700);
                  setShowFeedInput(false);
                }}
                className="text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                Done / Save
              </button>
            </div>
          </div>
        )}

        {/* Video Player */}
        <div className="relative aspect-video bg-black overflow-hidden">
          <iframe
            title="Barbury Castle Summit Live Cam"
            src={activeEmbedSrc}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          {/* Clean Camera Preset Label */}
          <div className="absolute bottom-2 left-2 pointer-events-none bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-2.5 py-1 rounded-lg text-[10px] font-mono-tactical text-neutral-300 flex items-center gap-2">
            <span>Angle: <strong className="text-amber-300">{activePreset.shortName}</strong></span>
            <span className="text-neutral-600">|</span>
            <span className="text-emerald-400 font-bold">
              {streamMode === 'channel' ? 'CHANNEL FEED' : streamMode === 'demo' ? 'DEMO TEST FEED' : 'STATION RIG'}
            </span>
          </div>

          {/* Live Watermark / Channel Link (Bottom-Right overlay) */}
          <div className="absolute bottom-2 right-2 bg-neutral-950/85 backdrop-blur-md border border-neutral-800 px-2.5 py-1 rounded-lg text-[10px] font-mono-tactical text-neutral-300 flex items-center gap-1.5">
            <a
              href={resolvedChannelUrl}
              target="_blank"
              rel="noreferrer"
              className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Quick Optical Preset Switcher */}
        <div className="p-2.5 bg-neutral-900/80 border-t border-neutral-800 flex items-center justify-between gap-2 text-xs font-mono-tactical flex-wrap">
          <span className="text-neutral-400 text-[11px] font-medium flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
            Camera Presets:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {BARBURY_PTZ_PRESETS.map((preset, idx) => (
              <button
                key={preset.id}
                onClick={() => {
                  tacticalAudio.playRadarPing(800 + idx * 50);
                  setActivePresetIndex(idx);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] cursor-pointer transition-colors ${
                  activePresetIndex === idx
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {preset.shortName}
              </button>
            ))}
          </div>
        </div>

        {/* Official YouTube Channel & Broadcast Info Card */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800/90 flex items-center justify-between gap-3 text-xs font-mono-tactical flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600/15 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-100">
                  {currentCam.channelName}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-red-600/20 text-red-300 border border-red-500/40">
                  OFFICIAL BROADCAST
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
                Live telephoto feed from the Wiltshire downs • Stream ID: <code className="text-amber-300">{activeVideoId}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={resolvedChannelUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => tacticalAudio.playRadarPing(880)}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Visit YouTube Channel</span>
              <ExternalLink className="w-3 h-3 text-red-200" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. The 3-Second Glanceable Summary Bar (Simple & Punchy) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono-tactical text-xs">
        {/* Pill 1: Ridge Wind */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-[10px]">
            <span>SUMMIT WIND</span>
            <Wind className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-1">
            <div className="text-base sm:text-lg font-bold text-neutral-100">
              NW 14 <span className="text-xs font-normal text-neutral-400">kts</span>
            </div>
            <div className="text-[10px] text-amber-300">Gusts to 22 kts (Brisk)</div>
          </div>
        </div>

        {/* Pill 2: Visibility & Fog */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-[10px]">
            <span>HORIZON VIEW</span>
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1">
            <div className="text-base sm:text-lg font-bold text-emerald-400">
              Clear (35+ km)
            </div>
            <div className="text-[10px] text-neutral-300">Zero Summit Fog</div>
          </div>
        </div>

        {/* Pill 3: Temp & Air */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-[10px]">
            <span>TEMPERATURE</span>
            <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-1">
            <div className="text-base sm:text-lg font-bold text-neutral-100">
              15.2°<span className="text-xs font-normal text-neutral-400">C</span>
            </div>
            <div className="text-[10px] text-cyan-300">Feels like 12.8°C at 268m</div>
          </div>
        </div>

        {/* Pill 4: Footing & Trailhead */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-neutral-400 text-[10px]">
            <span>TRAIL FOOTING</span>
            <Mountain className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-1">
            <div className="text-base sm:text-lg font-bold text-neutral-100">
              Dry &amp; Firm <span className="text-emerald-400 text-xs font-normal">(9/10)</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold">Free Parking • Dawn-Dusk</div>
          </div>
        </div>
      </div>

      {/* 3. Clean Progressive Detail Tabs (No Endless Scrolling) */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Tab Headers */}
        <div className="flex items-center border-b border-neutral-850 bg-neutral-900/50 p-1.5 gap-1.5 font-mono-tactical text-xs">
          <button
            onClick={() => {
              tacticalAudio.playRadarPing(800);
              setActiveTab('parking');
            }}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'parking'
                ? 'bg-amber-500/20 border border-amber-500/60 text-amber-300 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Trailhead Parking &amp; Access</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playRadarPing(800);
              setActiveTab('distances');
            }}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'distances'
                ? 'bg-amber-500/20 border border-amber-500/60 text-amber-300 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Ridgeway Trail Distances</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playRadarPing(800);
              setActiveTab('dispatches');
            }}
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'dispatches'
                ? 'bg-amber-500/20 border border-amber-500/60 text-amber-300 font-bold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Community Spotter Reports</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-5">
          {/* TAB 1: Parking & Trailhead Access */}
          {activeTab === 'parking' && (
            <div className="space-y-4 text-xs font-mono-tactical text-neutral-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-neutral-900/70 p-3.5 rounded-xl border border-neutral-800 space-y-1">
                  <div className="text-neutral-400 text-[10px] uppercase font-bold">CAR PARK RULES</div>
                  <div className="text-sm font-bold text-neutral-100">Barbury Castle Country Park</div>
                  <p className="text-neutral-400 font-sans leading-relaxed text-[11px]">
                    <strong>Free parking</strong> managed by Wiltshire Council. Open dawn until dusk daily. 2.1m height barrier at main vehicle entrance.
                  </p>
                  <div className="text-amber-400 font-semibold pt-1">Postcode: SN4 0QH</div>
                </div>

                <div className="bg-neutral-900/70 p-3.5 rounded-xl border border-neutral-800 space-y-1">
                  <div className="text-amber-400 text-[10px] uppercase font-bold">COUNTRYSIDE CODE &amp; DOGS</div>
                  <div className="text-sm font-bold text-neutral-100">Grazing Sheep &amp; Chalk Turf</div>
                  <p className="text-neutral-400 font-sans leading-relaxed text-[11px]">
                    Free-roaming sheep and cattle graze the Iron Age earthworks. <strong>Dogs must be kept on short leads</strong>. Please close all deer gates.
                  </p>
                  <div className="text-emerald-400 font-semibold pt-1">Bins &amp; dog waste points at car park gate</div>
                </div>
              </div>

              <div className="bg-neutral-900/40 p-3 rounded-xl border border-neutral-850 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Sunset today: <strong className="text-neutral-100">18:48 BST</strong> (Golden hour starts 17:45)</span>
                </div>
                <button
                  onClick={() => onOpenLogModal('Barbury Castle')}
                  className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                >
                  + Log bird seen from car park &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Ridgeway Trail Distances */}
          {activeTab === 'distances' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono-tactical text-xs">
                {trailDestinations.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      tacticalAudio.playRadarPing(800);
                      setActiveTrailDistance(t.id as any);
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors ${
                      activeTrailDistance === t.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <div className="text-neutral-200 truncate">{t.name.split(' ')[0]}</div>
                    <div className="text-[10px] text-amber-400">{t.distance}</div>
                  </button>
                ))}
              </div>

              <div className="bg-neutral-900/70 p-4 rounded-xl border border-neutral-800 text-xs font-mono-tactical space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-neutral-100">{selectedTrail.name}</h4>
                  <span className="text-amber-400 font-bold">{selectedTrail.distance} • {selectedTrail.time}</span>
                </div>
                <div className="text-neutral-400 font-sans text-[11px] leading-relaxed">
                  <strong>Trail Surface:</strong> {selectedTrail.surface} ({selectedTrail.difficulty})
                </div>
                <div className="text-neutral-300 font-sans text-[11px] leading-relaxed">
                  <strong>Highlights:</strong> {selectedTrail.highlights}
                </div>
                <div className="text-amber-300 font-sans text-[11px] leading-relaxed">
                  <strong>Trail Advisory:</strong> {selectedTrail.hazards}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Recent Spotter Reports */}
          {activeTab === 'dispatches' && (
            <div className="space-y-3 font-mono-tactical text-xs">
              <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                <span className="text-neutral-400">COMMUNITY TRAIL SIGHTINGS</span>
                <button
                  onClick={() => setShowQuickSpotModal(true)}
                  className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                >
                  + Add Sighting Report
                </button>
              </div>

              <div className="space-y-2">
                {[
                  {
                    species: 'Red Kite',
                    count: 4,
                    loc: 'Northern Ramparts',
                    time: '18 mins ago',
                    notes: 'Kettling in strong slope updraft over ditch.',
                    scout: 'DOWNS-ALPHA',
                  },
                  {
                    species: 'Common Kestrel',
                    count: 1,
                    loc: 'Hackpen Scarp Gallops',
                    time: '42 mins ago',
                    notes: 'Head-to-wind hovering at 15m surveying turf for voles.',
                    scout: 'RIDGEWAY-SCOUT',
                  },
                  {
                    species: 'Common Buzzard',
                    count: 2,
                    loc: 'Sarsen Perch Post',
                    time: '1 hr ago',
                    notes: 'Perched together on fence line drying feathers in breeze.',
                    scout: 'CHALK-WATCH',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-neutral-100 font-bold">
                        {item.count}x {item.species} <span className="text-[10px] text-amber-400 font-normal">({item.loc})</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 font-sans mt-0.5">{item.notes}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-neutral-400 text-[10px]">{item.time}</div>
                      <div className="text-emerald-400 text-[10px] font-bold">{item.scout}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Spot on Trail Modal */}
      {showQuickSpotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-neutral-900 border border-amber-500/50 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h3 className="font-display-tactical text-base font-bold text-neutral-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Spotted on Trail or Cam!
              </h3>
              <button
                onClick={() => setShowQuickSpotModal(false)}
                className="text-neutral-400 hover:text-neutral-100 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickSpotSubmit} className="space-y-3 font-mono-tactical text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">RAPTOR OR WILDLIFE SPECIES</label>
                <select
                  value={quickSpotSpecies}
                  onChange={(e) => setQuickSpotSpecies(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-100 font-sans text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="Red Kite">Red Kite (Forked tail, kettling)</option>
                  <option value="Common Buzzard">Common Buzzard (Broad fan tail)</option>
                  <option value="Common Kestrel">Common Kestrel (Wind-hovering)</option>
                  <option value="Peregrine Falcon">Peregrine Falcon (High-speed stoop)</option>
                  <option value="Hen Harrier">Hen Harrier (Ground-quartering)</option>
                  <option value="Barn Owl">Barn Owl (Crepuscular ghost)</option>
                  <option value="Raven">Common Raven (Diamond tail)</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">INDIVIDUAL COUNT</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={quickSpotCount}
                  onChange={(e) => setQuickSpotCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">OBSERVER NOTES</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Spotted soaring above northern rampart ditch..."
                  value={quickSpotNotes}
                  onChange={(e) => setQuickSpotNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-100 font-sans text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickSpotModal(false)}
                  className="text-neutral-400 hover:text-neutral-200 underline cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold cursor-pointer transition-colors"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stream Troubleshooting & Setup Modal */}
      {showTroubleshootModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="font-display-tactical text-base sm:text-lg font-bold text-neutral-100">
                  Why is my stream black or "Video unavailable"?
                </h3>
              </div>
              <button
                onClick={() => setShowTroubleshootModal(false)}
                className="text-neutral-400 hover:text-neutral-100 text-sm font-bold cursor-pointer p-1 rounded-lg hover:bg-neutral-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs text-neutral-300 leading-relaxed">
              <p>
                Your camera link was entered as <code className="text-amber-300 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800 font-mono text-[11px]">{activeVideoId}</code>. In YouTube, embedded website streams require 3 quick checks:
              </p>

              <div className="space-y-2.5 font-mono-tactical text-[11px]">
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <span>1. Encoder Not Streaming Yet:</span>
                  </div>
                  <p className="font-sans text-neutral-400">
                    YouTube Studio creates the link ahead of time, but the player stays black until your camera or OBS streaming software clicks <strong>"Start Streaming"</strong> and sends video packets to YouTube.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <span>2. Stream Visibility Must Be "Public" or "Unlisted":</span>
                  </div>
                  <p className="font-sans text-neutral-400">
                    If set to <strong>"Private"</strong> in YouTube Studio, YouTube blocks embedding on other websites. Set it to <strong>"Public"</strong> (visible everywhere) or <strong>"Unlisted"</strong> (only visible on your website).
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <span>3. Enable "Allow Embedding":</span>
                  </div>
                  <p className="font-sans text-neutral-400">
                    In YouTube Studio &gt; Stream Settings &gt; Additional Settings &gt; make sure the <strong>"Allow embedding"</strong> box is checked.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 space-y-1 text-xs">
                <span className="font-bold flex items-center gap-1.5 font-mono-tactical text-[11px] text-emerald-300">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verify Website Video Playback Right Now:</span>
                </span>
                <p className="font-sans text-neutral-300 text-[11px]">
                  Click <strong>"Test Live Demo Cam"</strong> to verify that this website and your browser play video and audio with full 4K optics controls!
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800 flex-wrap">
              <a
                href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-amber-300 border border-neutral-700 text-xs font-mono-tactical font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Watch on YouTube ↗</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    tacticalAudio.playRadarPing(920);
                    setStreamMode('demo');
                    setShowTroubleshootModal(false);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono-tactical cursor-pointer transition-colors shadow-sm"
                >
                  Test Demo Stream ▶
                </button>
                <button
                  type="button"
                  onClick={() => setShowTroubleshootModal(false)}
                  className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 text-xs font-mono-tactical cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

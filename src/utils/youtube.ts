/**
 * YouTube and Camera integration utilities for RaptorLens UK:
 * Handles stream URL parsing, studio livestreams, channel info extraction,
 * device webcam inputs, and reliable embedded playback.
 */

// Verified 24/7 active live raptor & wildlife streams
export const DEFAULT_CAMERA_VIDEO_ID = 'GAxREl6-fJs'; // Buckinghamshire UK Peregrine Falcon Live Cam
export const PEREGRINE_UK_VIDEO_ID = 'GAxREl6-fJs';   // Buckinghamshire UK Peregrine Falcon
export const OSPREY_UK_VIDEO_ID = 'ZEWqlgElhN0';       // Loch of the Lowes UK Osprey Live Cam
export const EAGLE_LIVE_VIDEO_ID = 'B4-L2nfGcuE';      // Big Bear Bald Eagle Live Nest
export const CORNELL_FEEDER_VIDEO_ID = 'x10vL6_47Dw';  // Cornell Lab Live FeederWatch
export const DEMO_NATURE_VIDEO_ID = '4kRzwJXaeIM';     // Verified 4K 60fps Bird & Wildlife Live Cam
export const DEMO_LIVE_VIDEO_ID = '21X5lGlDOfg';       // NASA Earth Live HD broadcast

export interface CameraPresetOption {
  id: string;
  name: string;
  videoId: string;
  channelName: string;
  channelUrl: string;
  species: string;
  location: string;
  description: string;
}

export const POPULAR_CAMERA_PRESETS: CameraPresetOption[] = [
  {
    id: 'uk-peregrine',
    name: 'UK Peregrine Falcon Live Cam (Cam 1)',
    videoId: PEREGRINE_UK_VIDEO_ID,
    channelName: 'Buckinghamshire Council Peregrines',
    channelUrl: 'https://www.youtube.com/watch?v=GAxREl6-fJs',
    species: 'Peregrine Falcon (Falco peregrinus)',
    location: 'Buckinghamshire, UK',
    description: 'Direct high-definition optical nest camera monitoring resident UK Peregrine Falcons hunting and roosting.',
  },
  {
    id: 'uk-osprey',
    name: 'UK Osprey Nest Live Cam',
    videoId: OSPREY_UK_VIDEO_ID,
    channelName: 'Scottish Wildlife Trust',
    channelUrl: 'https://www.youtube.com/watch?v=ZEWqlgElhN0',
    species: 'Western Osprey (Pandion haliaetus)',
    location: 'Loch of the Lowes, Scotland, UK',
    description: 'Renowned 24/7 telephoto wildlife camera trained on breeding tree-top Osprey aerie.',
  },
  {
    id: 'bald-eagle',
    name: 'Big Bear Bald Eagle Nest Cam (30x Optical)',
    videoId: EAGLE_LIVE_VIDEO_ID,
    channelName: 'Friends of Big Bear Valley',
    channelUrl: 'https://www.youtube.com/watch?v=B4-L2nfGcuE',
    species: 'Bald Eagle (Haliaeetus leucocephalus)',
    location: 'High Altitude Pine Canopy (2,050m ASL)',
    description: 'World-famous 24/7 solar-powered telephoto PTZ camera observing hunting raptors and active clutch.',
  },
  {
    id: 'cornell-feeder',
    name: 'Cornell Lab Wild Bird Sanctuary Live Cam',
    videoId: CORNELL_FEEDER_VIDEO_ID,
    channelName: 'Cornell Lab of Ornithology',
    channelUrl: 'https://www.youtube.com/watch?v=x10vL6_47Dw',
    species: 'Mixed Raptors & Woodland Avifauna',
    location: 'Sapsucker Woods Sanctuary',
    description: 'High-definition optical bird cam with directional microphone for birds of prey and feeder visitors.',
  },
  {
    id: 'demo-nature',
    name: '4K Ultra-HD Nature & Wildlife Optical Stream',
    videoId: DEMO_NATURE_VIDEO_ID,
    channelName: 'Nature Wildlife Broadcast',
    channelUrl: 'https://www.youtube.com/watch?v=4kRzwJXaeIM',
    species: 'Downland & Woodland Wildlife',
    location: 'Nature Reserve (4K 60fps)',
    description: 'Ultra-clear 4K feed verifying video hardware acceleration and display fidelity.',
  },
];

/**
 * Normalizes user camera inputs (YouTube full URL, short URL, studio livestream link, embed, or raw ID)
 * and extracts the valid 11-character YouTube video ID.
 */
export function extractYouTubeVideoId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();

  // 1. YouTube Studio Livestream link:
  // e.g. https://studio.youtube.com/video/9gkrkcqHQ78/livestreaming
  const studioMatch = trimmed.match(/studio\.youtube\.com\/video\/([a-zA-Z0-9_-]{11})/i);
  if (studioMatch) {
    return studioMatch[1];
  }

  // 2. Standard watch URL:
  // e.g. https://www.youtube.com/watch?v=9gkrkcqHQ78
  const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  if (watchMatch) {
    return watchMatch[1];
  }

  // 3. Short URL:
  // e.g. https://youtu.be/9gkrkcqHQ78
  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);
  if (shortMatch) {
    return shortMatch[1];
  }

  // 4. Live URL or Embed URL:
  // e.g. https://www.youtube.com/live/9gkrkcqHQ78
  // e.g. https://www.youtube.com/embed/9gkrkcqHQ78
  const embedOrLiveMatch = trimmed.match(/youtube\.com\/(?:embed|live)\/([a-zA-Z0-9_-]{11})/i);
  if (embedOrLiveMatch) {
    return embedOrLiveMatch[1];
  }

  // 5. If already an 11-char ID without path delimiters
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return trimmed;
}

export interface YouTubeChannelInfo {
  channelId?: string;
  handle?: string;
  channelUrl: string;
}

/**
 * Extracts YouTube channel ID (e.g. UC...) or handle (e.g. @name) and returns clean URLs.
 */
export function extractYouTubeChannelInfo(input: string): YouTubeChannelInfo {
  if (!input) {
    return {
      channelUrl: `https://www.youtube.com/watch?v=${DEFAULT_CAMERA_VIDEO_ID}`,
    };
  }

  const trimmed = input.trim();

  // 1. Direct channel URL: https://www.youtube.com/channel/UC...
  const channelUrlMatch = trimmed.match(/youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{22})/i);
  if (channelUrlMatch) {
    return {
      channelId: channelUrlMatch[1],
      channelUrl: `https://www.youtube.com/channel/${channelUrlMatch[1]}`,
    };
  }

  // 2. Handle URL: https://www.youtube.com/@channelName
  const handleUrlMatch = trimmed.match(/youtube\.com\/(@[a-zA-Z0-9_.-]+)/i);
  if (handleUrlMatch) {
    return {
      handle: handleUrlMatch[1],
      channelUrl: `https://www.youtube.com/${handleUrlMatch[1]}`,
    };
  }

  // 3. Just the handle typed: e.g. @BarburyCastleRaptors
  if (trimmed.startsWith('@')) {
    return {
      handle: trimmed,
      channelUrl: `https://www.youtube.com/${trimmed}`,
    };
  }

  // 4. Raw Channel ID (UC...)
  if (/^UC[a-zA-Z0-9_-]{22}$/.test(trimmed)) {
    return {
      channelId: trimmed,
      channelUrl: `https://www.youtube.com/channel/${trimmed}`,
    };
  }

  // 5. If given a full watch URL or video link, keep as direct link
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    return {
      channelUrl: trimmed,
    };
  }

  return {
    channelUrl: trimmed.startsWith('http') ? trimmed : `https://www.youtube.com/${trimmed}`,
  };
}

/**
 * Resolves the primary URL to open the YouTube Channel or stream directly.
 */
export function getYouTubeChannelUrl(channelInput?: string, videoId: string = DEFAULT_CAMERA_VIDEO_ID): string {
  if (channelInput && channelInput.trim()) {
    const info = extractYouTubeChannelInfo(channelInput);
    if (info.channelUrl) return info.channelUrl;
  }
  return `https://www.youtube.com/watch?v=${videoId || DEFAULT_CAMERA_VIDEO_ID}`;
}

export const isLocalIpAddress = (val: string): boolean => {
  if (!val) return false;
  const trimmed = val.trim();
  return /^(https?:\/\/)?(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|127\.|localhost)/i.test(trimmed);
};

export const formatLocalIpUrl = (val: string): string => {
  const trimmed = val.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `http://${trimmed}`;
};

export type StreamPlayMode = 'video' | 'channel' | 'demo' | 'webcam';

/**
 * Generates the embed URL for either a direct live video ID, a channel live stream, or a demo stream.
 */
export function buildYouTubeEmbedSrc(options: {
  videoId: string;
  channelId?: string;
  mode?: StreamPlayMode;
}): string {
  const { videoId, channelId, mode = 'video' } = options;

  if (mode === 'demo') {
    return `https://www.youtube.com/embed/${DEMO_NATURE_VIDEO_ID}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${DEMO_NATURE_VIDEO_ID}`;
  }

  if (mode === 'channel' && channelId && channelId.startsWith('UC')) {
    return `https://www.youtube.com/embed/live_stream?channel=${channelId}&autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1`;
  }

  const cleanVideoId = videoId || DEFAULT_CAMERA_VIDEO_ID;
  return `https://www.youtube.com/embed/${cleanVideoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1`;
}

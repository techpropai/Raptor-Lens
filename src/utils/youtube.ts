/**
 * YouTube integration utilities for RaptorLens UK:
 * Handles stream URL parsing, studio livestreams, channel info extraction,
 * and reliable embedded playback.
 */

export const DEFAULT_CAMERA_VIDEO_ID = '9gkrkcqHQ78';
export const DEMO_NATURE_VIDEO_ID = 'LXb3EKWsInQ'; // Verified embeddable 4K nature & wildlife footage
export const DEMO_LIVE_VIDEO_ID = '21X5lGlDOfg';   // NASA Earth Live HD broadcast

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

export type StreamPlayMode = 'video' | 'channel' | 'demo';

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

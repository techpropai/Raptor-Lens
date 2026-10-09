import React from 'react';
import { WifiOff, Download, X } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { tacticalAudio } from '../utils/audio';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();
  const [isDismissed, setIsDismissed] = React.useState(false);

  const handleInstallClick = async () => {
    tacticalAudio.playConfirmChime();
    await install();
  };

  if (!isOnline) {
    return (
      <div className="bg-amber-500/20 border-b border-amber-500/50 text-amber-200 px-4 py-2 text-xs font-mono-tactical flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>
            <strong>OFFLINE FIELD SCOUT MODE ACTIVE:</strong> No cellular data detected. Observations will be saved locally to your device and cached safely.
          </span>
        </div>
        <span className="text-[10px] text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-500/30">
          LOCAL CACHE OK
        </span>
      </div>
    );
  }

  if (isInstallable && !isDismissed && !isInstalled) {
    return (
      <div className="bg-neutral-900/95 border-b border-neutral-800 text-neutral-200 px-4 py-2 text-xs font-mono-tactical flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="text-base">📱</span>
          <span>
            <strong className="text-amber-400">Install RaptorLens to your Phone:</strong> Instant home-screen access, full offline caching & fast field logging on ridges.
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-[11px] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-neutral-400 hover:text-neutral-200 cursor-pointer"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

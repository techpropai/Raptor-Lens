import React, { useState } from 'react';
import { 
  X, 
  Coffee, 
  Heart, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Zap, 
  Compass, 
  MessageSquare,
  Gift,
  HeartHandshake
} from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCallsign?: string;
  onOpenSponsors?: () => void;
}

interface SupporterNote {
  id: string;
  name: string;
  amount: string;
  note: string;
  timeAgo: string;
}

const DEFAULT_SUPPORTERS: SupporterNote[] = [
  {
    id: 's1',
    name: 'Wessex_KiteWatch',
    amount: '£5.00',
    note: 'Used RaptorLens at Hackpen Hill yesterday and got onto 6 Kites and a Hobby! Incredible tool.',
    timeAgo: '2 hours ago',
  },
  {
    id: 's2',
    name: 'Chiltern_Spotter',
    amount: '£3.00',
    note: 'Love the thermal lift index and silence from ads. Happy to fund the coffee!',
    timeAgo: 'Yesterday',
  },
  {
    id: 's3',
    name: 'Plain_Harrier_Patrol',
    amount: '£10.00',
    note: 'Thanks for supporting Schedule 1 conservation ethics and clean offline PWA.',
    timeAgo: '3 days ago',
  },
];

export const DonateModal: React.FC<DonateModalProps> = ({
  isOpen,
  onClose,
  currentCallsign = 'RaptorScout_HQ',
  onOpenSponsors,
}) => {
  const [selectedTier, setSelectedTier] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [supporterName, setSupporterName] = useState<string>(currentCallsign);
  const [supporterMessage, setSupporterMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [supporters, setSupporters] = useState<SupporterNote[]>(DEFAULT_SUPPORTERS);
  const [kofiUrl, setKofiUrl] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('raptorlens_kofi_url');
      if (saved && saved !== 'https://ko-fi.com' && saved !== 'https://ko-fi.com/') {
        return saved;
      }
      return 'https://ko-fi.com/raptorlens';
    } catch {
      return 'https://ko-fi.com/raptorlens';
    }
  });
  const [isEditingKofi, setIsEditingKofi] = useState<boolean>(false);
  const [kofiInput, setKofiInput] = useState<string>(kofiUrl);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleSaveKofi = () => {
    let clean = kofiInput.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = clean.startsWith('ko-fi.com') ? `https://${clean}` : `https://ko-fi.com/${clean}`;
    }
    setKofiUrl(clean);
    setIsEditingKofi(false);
    try {
      localStorage.setItem('raptorlens_kofi_url', clean);
    } catch {
      // ignore
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen, isSuccess]);

  if (!isOpen) return null;

  const handleSelectTier = (amount: number) => {
    tacticalAudio.playRadarPing(880);
    setSelectedTier(amount);
    setCustomAmount('');
  };

  const handleCustomChange = (val: string) => {
    setCustomAmount(val);
    setSelectedTier(0);
  };

  const getEffectiveAmount = () => {
    if (selectedTier > 0) return `£${selectedTier}`;
    if (customAmount && !isNaN(Number(customAmount))) return `£${Number(customAmount).toFixed(2)}`;
    return '£5';
  };

  const handleProceedToKofi = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    tacticalAudio.playConfirmChime();

    if (supporterName.trim()) {
      const newSupporter: SupporterNote = {
        id: `supporter-${Date.now()}`,
        name: supporterName.trim(),
        amount: getEffectiveAmount(),
        note: supporterMessage.trim() || 'Supporter on Ko-fi',
        timeAgo: 'Just now',
      };
      setSupporters([newSupporter, ...supporters]);
    }

    window.open(kofiUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-4 flex justify-center items-start overscroll-contain"
    >
      <div 
        id="donate-modal-container"
        className="relative w-full max-w-xl my-4 sm:my-8 mb-16 sm:mb-24 bg-neutral-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden font-mono-tactical text-neutral-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-amber-950/80 via-neutral-900 to-amber-950/80 border-b border-amber-500/30 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-inner">
              <Coffee className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-amber-300 font-sans tracking-tight">
                  Fuel the Downland Radar
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                  Community Fund
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-sans">
                Help keep RaptorLens 100% free, ad-free, and independent for UK birders
              </p>
            </div>
          </div>

          <button
            id="close-donate-modal-btn"
            onClick={() => {
              tacticalAudio.playRadarPing(600);
              onClose();
            }}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Transparency Card */}
          <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Ads • Zero Paywalls • Volunteer Powered</span>
            </div>
            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              RaptorLens was built out of passion for UK birds of prey across The Ridgeway, Salisbury Plain, the Chilterns, Cotswolds, and South Downs. Your support directly funds:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-neutral-300 pt-1 font-sans">
              <li className="flex items-center gap-1.5 bg-neutral-900/80 px-2.5 py-1.5 rounded-lg border border-neutral-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>UK high-res radar map tiles & CDN</span>
              </li>
              <li className="flex items-center gap-1.5 bg-neutral-900/80 px-2.5 py-1.5 rounded-lg border border-neutral-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>raptorlens.org domain, SSL & PWA hosting</span>
              </li>
              <li className="flex items-center gap-1.5 bg-neutral-900/80 px-2.5 py-1.5 rounded-lg border border-neutral-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Live thermal weather telemetry API</span>
              </li>
              <li className="flex items-center gap-1.5 bg-neutral-900/80 px-2.5 py-1.5 rounded-lg border border-neutral-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Local UK raptor conservation support</span>
              </li>
            </ul>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleProceedToKofi} className="space-y-5">
              {/* Preset Coffee Tiers */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Select a Scout Tip Level:</span>
                  <span className="text-amber-400 font-normal lowercase">every coffee keeps servers live</span>
                </label>

                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSelectTier(3)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      selectedTier === 3
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <span className="text-lg">☕</span>
                    <span className="text-sm font-bold text-amber-300">£3</span>
                    <span className="text-[10px] text-neutral-400 font-sans">Flat White</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectTier(5)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 relative ${
                      selectedTier === 5
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <div className="absolute -top-2 px-1.5 py-0.2 rounded-full bg-amber-500 text-[9px] font-bold text-black uppercase tracking-wider">
                      Popular
                    </div>
                    <span className="text-lg">🦅</span>
                    <span className="text-sm font-bold text-amber-300">£5</span>
                    <span className="text-[10px] text-neutral-400 font-sans">Ridge Patrol</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectTier(10)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      selectedTier === 10
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <span className="text-lg">🔭</span>
                    <span className="text-sm font-bold text-amber-300">£10</span>
                    <span className="text-[10px] text-neutral-400 font-sans">Thermal Patron</span>
                  </button>
                </div>

                {/* Custom Amount Input */}
                <div className="pt-1">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-neutral-500 text-xs">£</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Or enter custom amount (e.g. £15)"
                      value={customAmount}
                      onChange={(e) => handleCustomChange(e.target.value)}
                      className="w-full pl-7 pr-4 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Supporter Details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Your Callsign or Name:
                  </label>
                  <input
                    type="text"
                    value={supporterName}
                    onChange={(e) => setSupporterName(e.target.value)}
                    placeholder="e.g. Ridgeway_Scout_99"
                    className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Message / Field Note (optional):
                  </label>
                  <textarea
                    rows={2}
                    value={supporterMessage}
                    onChange={(e) => setSupporterMessage(e.target.value)}
                    placeholder="e.g. Thanks for the Barbury Castle hotspot data! Spotted 3 Kites today."
                    className="w-full px-3 py-2 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-sans resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                {/* External Ko-fi / Coffee Link */}
                <a
                  href={kofiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    tacticalAudio.playConfirmChime();
                    if (supporterName.trim()) {
                      const newSupporter: SupporterNote = {
                        id: `supporter-${Date.now()}`,
                        name: supporterName.trim(),
                        amount: getEffectiveAmount(),
                        note: supporterMessage.trim() || 'Supporter on Ko-fi',
                        timeAgo: 'Just now',
                      };
                      setSupporters([newSupporter, ...supporters]);
                    }
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer transition-all active:scale-[0.99]"
                >
                  <Coffee className="w-4 h-4 fill-black text-black" />
                  <span>Support on Ko-fi ({getEffectiveAmount()})</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>

                {/* Ko-fi Page Address & Quick Editor */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-neutral-800/80">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1.5 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Ko-fi Destination:</span>
                      <span className="font-mono text-neutral-200 truncate">{kofiUrl}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingKofi(!isEditingKofi);
                        setKofiInput(kofiUrl);
                      }}
                      className="text-amber-400 hover:text-amber-300 underline cursor-pointer shrink-0 ml-2 text-[10px] uppercase font-bold"
                    >
                      {isEditingKofi ? 'Cancel' : 'Change Handle'}
                    </button>
                  </div>

                  {isEditingKofi && (
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={kofiInput}
                        onChange={(e) => setKofiInput(e.target.value)}
                        placeholder="e.g. raptorlens or https://ko-fi.com/yourhandle"
                        className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-neutral-200 focus:outline-none focus:border-amber-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleSaveKofi}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg cursor-pointer transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  )}
                  <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
                    100% of Ko-fi contributions directly maintain Downland telemetry, hardware, and server hosting. Opens in a secure new tab.
                  </p>
                </div>
              </div>
            </form>
          ) : (
            /* Success Confirmation Screen */
            <div className="text-center py-6 px-4 space-y-4 bg-amber-500/10 border border-amber-500/30 rounded-xl animate-in fade-in">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-300 shadow-md">
                <Heart className="w-6 h-6 fill-amber-400 text-amber-400 animate-pulse" />
              </div>

              <div>
                <h3 className="text-base font-bold text-amber-300 font-sans">
                  Thank You for Backing RaptorLens!
                </h3>
                <p className="text-xs text-neutral-300 font-sans mt-1 max-w-md mx-auto">
                  Your <strong className="text-amber-300">{getEffectiveAmount()}</strong> pledge has been logged. Independent contributions like yours keep the Downland ridge telemetry completely free for everyone.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs cursor-pointer transition-colors"
                >
                  Make Another Pledge
                </button>
                <button
                  type="button"
                  onClick={() => onClose()}
                  className="px-5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs cursor-pointer transition-colors"
                >
                  Return to Field Scout
                </button>
              </div>
            </div>
          )}

          {/* Recent Supporters Wall */}
          <div className="space-y-2.5 pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Recent Radar Backers</span>
              </span>
              <span className="text-[11px] text-amber-400/90 font-mono">
                {supporters.length} Supporters
              </span>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {supporters.map((sup) => (
                <div
                  key={sup.id}
                  className="bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-2.5 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-200">{sup.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                        {sup.amount}
                      </span>
                      <span className="text-[10px] text-neutral-500">{sup.timeAgo}</span>
                    </div>
                    {sup.note && (
                      <p className="text-[11px] text-neutral-400 font-sans italic">
                        "{sup.note}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discreet link to Dedicated Sponsors & Partners Directory */}
          {onOpenSponsors && (
            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                <span>Equipment &amp; Conservation Benefactors</span>
              </div>
              <button
                type="button"
                id="donate-view-sponsors-link"
                onClick={() => {
                  tacticalAudio.playRadarPing(880);
                  onOpenSponsors();
                }}
                className="text-[11px] font-mono-tactical text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 cursor-pointer transition-colors"
              >
                View Sponsors Page &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-neutral-950 px-6 py-3 border-t border-neutral-850 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-neutral-500 font-sans">
          <span>RaptorLens UK is an independent, non-commercial downland observation initiative.</span>
          {onOpenSponsors ? (
            <button
              type="button"
              onClick={() => {
                tacticalAudio.playRadarPing(880);
                onOpenSponsors();
              }}
              className="text-amber-500/90 hover:text-amber-400 underline underline-offset-2 cursor-pointer transition-colors"
            >
              Dedicated Sponsors Page &rarr;
            </button>
          ) : (
            <span className="text-amber-500/80">Wessex Downland SkyScout</span>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Send, Bug, MapPin, Eye, Smartphone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface BetaFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCallsign: string;
  activeSectorName: string;
  onSubmitFeedback: (feedback: BetaFeedbackEntry) => void;
}

export interface BetaFeedbackEntry {
  id: string;
  timestamp: string;
  observerCallsign: string;
  category: 'bug' | 'hotspot' | 'silhouette' | 'mobile' | 'general';
  sectorName: string;
  title: string;
  details: string;
  deviceInfo: string;
}

export const BetaFeedbackModal: React.FC<BetaFeedbackModalProps> = ({
  isOpen,
  onClose,
  currentCallsign,
  activeSectorName,
  onSubmitFeedback,
}) => {
  const [category, setCategory] = useState<'bug' | 'hotspot' | 'silhouette' | 'mobile' | 'general'>('mobile');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

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
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !details.trim()) return;

    tacticalAudio.playConfirmChime();

    const entry: BetaFeedbackEntry = {
      id: `fb-${Date.now()}`,
      timestamp: new Date().toISOString(),
      observerCallsign: currentCallsign,
      category,
      sectorName: activeSectorName,
      title: title.trim(),
      details: details.trim(),
      deviceInfo: `${navigator.platform} - ${navigator.userAgent.slice(0, 80)}...`,
    };

    onSubmitFeedback(entry);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setTitle('');
      setDetails('');
      onClose();
    }, 1800);
  };

  const categories = [
    { id: 'mobile', label: 'Mobile / Touch Usability', icon: <Smartphone className="w-4 h-4 text-cyan-400" /> },
    { id: 'bug', label: 'Glitch / Map Issue', icon: <Bug className="w-4 h-4 text-rose-400" /> },
    { id: 'hotspot', label: 'Missing Hotspot or Roost', icon: <MapPin className="w-4 h-4 text-amber-400" /> },
    { id: 'silhouette', label: 'Silhouette / Species Accuracy', icon: <Eye className="w-4 h-4 text-emerald-400" /> },
    { id: 'general', label: 'Feature Suggestion', icon: <MessageSquare className="w-4 h-4 text-purple-400" /> },
  ] as const;

  return (
    <div 
      ref={scrollContainerRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-md p-3 sm:p-4 flex justify-center items-start overscroll-contain font-mono-tactical"
    >
      <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 mb-16 sm:mb-24">
        {/* Header */}
        <div className="bg-neutral-900/90 border-b border-neutral-800 p-4 sm:p-5 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 tracking-wider">
                FIELD BETA v0.9.4
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                COMMUNITY TELEMETRY
              </span>
            </div>
            <h3 className="font-display-tactical text-xl font-bold text-neutral-100">
              Field Beta Feedback &amp; Bug Report
            </h3>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Help us iron out teething issues before official national rollout.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-display-tactical text-lg font-bold text-neutral-100">
              Telemetry Dispatch Logged
            </h4>
            <p className="text-xs text-neutral-300 font-sans max-w-xs mx-auto">
              Thank you for contributing field telemetry! Your feedback has been recorded into the local developer audit ledger.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {/* Category Selector */}
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1.5">
                Feedback Category:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      tacticalAudio.playRadarPing(800);
                      setCategory(cat.id);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs text-left flex items-center gap-2 border transition-all cursor-pointer ${
                      category === cat.id
                        ? 'bg-amber-500/20 border-amber-500/70 text-amber-300 font-bold'
                        : 'bg-neutral-900/70 border-neutral-800 text-neutral-300 hover:bg-neutral-850'
                    }`}
                  >
                    {cat.icon}
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Context meta */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-400">
              <span>Observer: <strong className="text-amber-400">{currentCallsign}</strong></span>
              <span>Active Sector: <strong className="text-neutral-200">{activeSectorName}</strong></span>
            </div>

            {/* Title */}
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                Summary / Topic:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Map zoom buttons are tight on iPhone screen, or Barbury Castle roost note..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 text-xs focus:outline-none focus:border-amber-500 font-sans"
              />
            </div>

            {/* Details */}
            <div>
              <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                Field Observations / Issue Description:
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe what happened or what could make field observation easier while on the downs..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-neutral-100 text-xs focus:outline-none focus:border-amber-500 font-sans resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <span className="text-[10px] text-neutral-500 font-sans">
                Logged anonymously to community registry.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-display-tactical text-xs font-bold tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Dispatch
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

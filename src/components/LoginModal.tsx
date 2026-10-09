import React, { useState } from 'react';
import { ObserverProfile } from '../types/community';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  LogIn, 
  LogOut, 
  Award, 
  Lock, 
  KeyRound, 
  Compass, 
  CheckCircle2, 
  Camera, 
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  observers: ObserverProfile[];
  currentCallsign: string;
  onSelectObserver: (profile: ObserverProfile) => void;
  onLoginCustomCallsign: (callsign: string, homeHotspot?: string) => void;
  onLogoutToGuest: () => void;
  onOpenRegistration: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  observers,
  currentCallsign,
  onSelectObserver,
  onLoginCustomCallsign,
  onLogoutToGuest,
  onOpenRegistration,
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'custom'>('roster');
  const [callsignInput, setCallsignInput] = useState('');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const currentProfile = observers.find((o) => o.callsign === currentCallsign) || null;

  const handleCustomLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCallsign = callsignInput.trim().toUpperCase();
    if (!cleanCallsign) {
      setErrorMsg('Please enter a valid observer callsign or ID.');
      return;
    }

    // Check if observer exists in roster
    const existing = observers.find((o) => o.callsign.toUpperCase() === cleanCallsign);
    if (existing) {
      tacticalAudio.playConfirmChime();
      onSelectObserver(existing);
      onClose();
      return;
    }

    // If new callsign entered with passcode
    tacticalAudio.playConfirmChime();
    onLoginCustomCallsign(cleanCallsign, 'Barbury Castle Country Park');
    onClose();
  };

  const handleSelectPredefined = (obs: ObserverProfile) => {
    tacticalAudio.playConfirmChime();
    onSelectObserver(obs);
    onClose();
  };

  const handleLogout = () => {
    tacticalAudio.playRadarPing(600);
    onLogoutToGuest();
    onClose();
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-md p-3 sm:p-4 flex justify-center items-start overscroll-contain"
    >
      <div className="relative w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 font-mono-tactical">
        {/* Header */}
        <div className="bg-neutral-900/90 border-b border-neutral-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                  OBSERVER AUTHENTICATION
                </span>
              </div>
              <h3 className="font-display-tactical text-lg sm:text-xl font-bold text-neutral-100">
                Wessex Observer Portal
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Observer Banner */}
        <div className="bg-neutral-900/60 border-b border-neutral-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono">
              {currentCallsign.slice(0, 2)}
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase block">CURRENT LOGGED IN IDENTITY:</span>
              <div className="flex items-center gap-1.5 font-bold text-neutral-200">
                <span className="text-amber-400">{currentCallsign}</span>
                {currentProfile ? (
                  <span className="text-[10px] text-emerald-400 font-normal flex items-center gap-0.5">
                    • {currentProfile.fullName} ({currentProfile.experienceLevel || 'Verified Scout'})
                  </span>
                ) : (
                  <span className="text-[10px] text-neutral-400 font-normal">• Field Scout</span>
                )}
              </div>
            </div>
          </div>

          {currentCallsign !== 'GUEST-SCOUT' && (
            <button
              onClick={handleLogout}
              className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-rose-400 text-[11px] flex items-center gap-1 cursor-pointer transition-colors self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out to Guest
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-900/40 text-xs">
          <button
            onClick={() => {
              tacticalAudio.playRadarPing(880);
              setActiveTab('roster');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 px-4 text-center font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'roster'
                ? 'text-amber-400 border-b-2 border-amber-500 bg-neutral-900/70'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Select Certified Observer</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playRadarPing(880);
              setActiveTab('custom');
              setErrorMsg(null);
            }}
            className={`flex-1 py-3 px-4 text-center font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'custom'
                ? 'text-amber-400 border-b-2 border-amber-500 bg-neutral-900/70'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Callsign & Passcode</span>
          </button>
        </div>

        {/* Tab 1: Pre-registered Scouts Roster */}
        {activeTab === 'roster' && (
          <div className="p-4 sm:p-5 space-y-3">
            <p className="text-[11px] text-neutral-400 mb-2">
              Select your registered observer profile to sign in and immediately stamp all field sightings with your verified credentials:
            </p>

            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {observers.map((obs) => {
                const isActive = obs.callsign === currentCallsign;
                return (
                  <div
                    key={obs.id}
                    onClick={() => handleSelectPredefined(obs)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-amber-500/15 border-amber-500/70 ring-1 ring-amber-500/50'
                        : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${obs.avatarColor} flex items-center justify-center text-neutral-100 font-bold font-display-tactical text-sm shadow shrink-0`}>
                        {obs.callsign.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-neutral-100">{obs.callsign}</span>
                          {obs.isHumanVerified && (
                            <span className="flex items-center gap-0.5 text-[9px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/40">
                              <ShieldCheck className="w-2.5 h-2.5" /> Verified
                            </span>
                          )}
                          {isActive && (
                            <span className="text-[9px] text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/40">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate">
                          {obs.fullName} • <span className="text-neutral-300">{obs.experienceLevel || obs.badge}</span>
                        </div>
                        <div className="text-[10px] text-neutral-400 flex items-center gap-2 mt-0.5">
                          <span className="text-amber-400">{obs.sightingsCount} logged</span>
                          <span>•</span>
                          <span className="truncate">{obs.homeHotspot}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                        isActive
                          ? 'bg-amber-500 text-neutral-950'
                          : 'bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200'
                      }`}
                    >
                      {isActive ? 'Current' : 'Sign In'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Custom Callsign & Passcode */}
        {activeTab === 'custom' && (
          <form onSubmit={handleCustomLoginSubmit} className="p-4 sm:p-5 space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-neutral-300 font-bold block">OBSERVER CALLSIGN OR REGISTRATION ID</label>
              <input
                type="text"
                placeholder="e.g. BARBURY-HAWK-7 or DOWNS-SCOUT"
                value={callsignInput}
                onChange={(e) => setCallsignInput(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-100 font-mono uppercase focus:outline-none focus:border-amber-500"
                required
              />
              <span className="text-[10px] text-neutral-400">
                Enter your assigned Wessex tactical callsign.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-300 font-bold block">FIELD SECURITY PIN / PASSCODE</label>
              <input
                type="password"
                placeholder="••••••"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-neutral-100 font-mono focus:outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-neutral-400">
                Field PIN protects your logbook and observer credentials.
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-0"
                />
                <span>Remember session on this device</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold font-display-tactical text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all"
            >
              <LogIn className="w-4 h-4" /> Sign In to Field Net
            </button>
          </form>
        )}

        {/* Footer actions: Register new scout */}
        <div className="bg-neutral-900/80 border-t border-neutral-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-neutral-400 text-center sm:text-left">
            Don't have a verified Wessex Scout ID?
          </div>

          <button
            onClick={() => {
              tacticalAudio.playRadarPing(880);
              onClose();
              onOpenRegistration();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register New Observer</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

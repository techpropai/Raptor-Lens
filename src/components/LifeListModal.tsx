import React, { useState, useMemo } from 'react';
import { X, Award, CheckCircle2, Circle, Sparkles, Volume2, Plus, Download, ExternalLink } from 'lucide-react';
import { RaptorSpecies, SightingLog } from '../types/raptor';
import { tacticalAudio } from '../utils/audio';

interface LifeListModalProps {
  isOpen: boolean;
  onClose: () => void;
  speciesList: RaptorSpecies[];
  sightings: SightingLog[];
  currentCallsign: string;
  onLogSpecies: (species: RaptorSpecies) => void;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedDate?: string;
}

export const LifeListModal: React.FC<LifeListModalProps> = ({
  isOpen,
  onClose,
  speciesList,
  sightings,
  currentCallsign,
  onLogSpecies,
}) => {
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

  // Group sightings by speciesId
  const speciesSightingsMap = useMemo(() => {
    const map = new Map<string, { count: number; firstDate: string; firstLocation: string; sightings: SightingLog[] }>();
    
    // Sort sightings oldest first to get first record date
    const sorted = [...sightings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (const s of sorted) {
      const existing = map.get(s.speciesId);
      if (!existing) {
        map.set(s.speciesId, {
          count: s.count,
          firstDate: s.date,
          firstLocation: s.locationName,
          sightings: [s],
        });
      } else {
        existing.count += s.count;
        existing.sightings.push(s);
      }
    }
    return map;
  }, [sightings]);

  const uniqueCount = speciesSightingsMap.size;
  const totalCount = speciesList.length;
  const completionPercentage = Math.round((uniqueCount / totalCount) * 100);

  // Calculate Badges
  const badges: Badge[] = useMemo(() => {
    const hasAnySighting = sightings.length > 0;
    const hasRedKite = speciesSightingsMap.has('red-kite');
    const hasPeregrine = speciesSightingsMap.has('peregrine-falcon') || speciesSightingsMap.has('peregrine');
    const hasGhost = speciesSightingsMap.has('hen-harrier') || speciesSightingsMap.has('short-eared-owl');
    const hasThermal = sightings.some((s) => s.behavior === 'Thermal Soaring' || s.behavior === 'Escarpment Lift');
    const hasFivePlus = sightings.length >= 5;

    // Distinct locations
    const uniqueLocations = new Set(sightings.map((s) => s.locationName.trim().toLowerCase())).size;
    const hasExplorer = uniqueLocations >= 3;

    return [
      {
        id: 'first-contact',
        name: 'First Ridge Contact',
        description: 'Log your first confirmed bird of prey in the Wessex corridors.',
        icon: '🦅',
        isUnlocked: hasAnySighting,
        unlockedDate: hasAnySighting ? sightings[0]?.date : undefined,
      },
      {
        id: 'downland-monarch',
        name: 'Downland Monarch',
        description: 'Observe the majestic Red Kite soaring overhead.',
        icon: '🪁',
        isUnlocked: hasRedKite,
        unlockedDate: speciesSightingsMap.get('red-kite')?.firstDate,
      },
      {
        id: 'lightning-stoop',
        name: 'Escarpment Hunter',
        description: 'Record a Peregrine Falcon in high-speed flight.',
        icon: '⚡',
        isUnlocked: hasPeregrine,
        unlockedDate: speciesSightingsMap.get('peregrine-falcon')?.firstDate || speciesSightingsMap.get('peregrine')?.firstDate,
      },
      {
        id: 'ghost-of-plain',
        name: 'Ghost of the Plain',
        description: 'Encounter a winter Hen Harrier or Short-eared Owl quartering the downs.',
        icon: '🌾',
        isUnlocked: hasGhost,
        unlockedDate: speciesSightingsMap.get('hen-harrier')?.firstDate || speciesSightingsMap.get('short-eared-owl')?.firstDate,
      },
      {
        id: 'thermal-master',
        name: 'Thermal Master',
        description: 'Record a bird utilising thermal chimneys or escarpment slope lift.',
        icon: '🌪️',
        isUnlocked: hasThermal,
      },
      {
        id: 'dedicated-scout',
        name: 'Dedicated Field Scout',
        description: 'Record 5 or more telemetry sightings in the system.',
        icon: '🔭',
        isUnlocked: hasFivePlus,
      },
      {
        id: 'corridor-explorer',
        name: 'Escarpment Explorer',
        description: 'Record observations across 3 or more distinct downland vantage points.',
        icon: '🗺️',
        isUnlocked: hasExplorer,
      },
    ];
  }, [sightings, speciesSightingsMap]);

  if (!isOpen) return null;

  const handleExportSummary = () => {
    const lines = [
      `RAPTORLENS UK — PERSONAL FIELD LIFE LIST`,
      `Observer Callsign: ${currentCallsign}`,
      `Date Generated: ${new Date().toLocaleDateString('en-GB')}`,
      `Total Species Spotted: ${uniqueCount} of ${totalCount} (${completionPercentage}%)`,
      `Total Individual Birds Recorded: ${sightings.reduce((acc, s) => acc + s.count, 0)}`,
      ``,
      `--- SPECIES RECORD ---`,
      ...speciesList.map((sp) => {
        const info = speciesSightingsMap.get(sp.id);
        if (info) {
          return `[✓] ${sp.commonName} (${sp.scientificName}) - ${info.count} birds seen (First: ${info.firstDate} @ ${info.firstLocation})`;
        } else {
          return `[ ] ${sp.commonName} (${sp.scientificName}) - Not yet recorded`;
        }
      }),
      ``,
      `--- SCOUT BADGES UNLOCKED ---`,
      ...badges.filter((b) => b.isUnlocked).map((b) => `★ ${b.name}: ${b.description}`),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `raptorlens-lifelist-${currentCallsign.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    tacticalAudio.playConfirmChime();
  };

  return (
    <div 
      ref={scrollContainerRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md p-3 sm:p-4 flex justify-center items-start overscroll-contain"
    >
      <div className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 mb-16 sm:mb-24">
        {/* Modal Header */}
        <div className="bg-neutral-900/90 border-b border-neutral-800 p-4 sm:p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-mono-tactical uppercase tracking-wider text-amber-400 font-bold">
                PERSONAL FIELD NOTEBOOK
              </span>
              <span className="text-neutral-600 text-xs">|</span>
              <span className="text-[10px] font-mono-tactical text-neutral-300 font-bold">
                {currentCallsign}
              </span>
            </div>
            <h3 className="font-display-tactical text-xl sm:text-2xl font-bold text-neutral-100">
              Downland Raptor Life List
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 text-neutral-200 font-mono-tactical text-xs">
          {/* Progress Overview Card */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold block">
                  UK DOWNLAND SPECIES OBSERVED
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-display-tactical font-bold text-amber-400">
                    {uniqueCount}
                  </span>
                  <span className="text-sm text-neutral-400">of {totalCount} Species</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">COMPLETION</span>
                <span className="text-xl font-bold text-emerald-400">{completionPercentage}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-950 h-3 rounded-full overflow-hidden border border-neutral-800 p-0.5">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
              <span>Total Sighting Entries: <strong className="text-neutral-200">{sightings.length}</strong></span>
              <button
                onClick={handleExportSummary}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" /> Export Field Summary (.txt)
              </button>
            </div>
          </div>

          {/* Scout Badges Showcase */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Escarpment Scout Badges ({badges.filter((b) => b.isUnlocked).length} / {badges.length})</span>
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border transition-all ${
                    badge.isUnlocked
                      ? 'bg-neutral-900 border-amber-500/50 shadow-md shadow-amber-500/10'
                      : 'bg-neutral-950/60 border-neutral-850 opacity-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="font-display-tactical font-bold text-xs text-neutral-100 truncate">
                    {badge.name}
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug line-clamp-2">
                    {badge.description}
                  </p>
                  {badge.isUnlocked ? (
                    <div className="mt-2 text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> UNLOCKED
                    </div>
                  ) : (
                    <div className="mt-2 text-[9px] text-neutral-500 flex items-center gap-1">
                      <Circle className="w-2.5 h-2.5" /> LOCKED
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Checklist of all 11 UK Downland Raptors */}
          <div className="space-y-2.5 pt-2 border-t border-neutral-800">
            <h4 className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
              OFFICIAL UK DOWNLAND RAPTOR CHECKLIST
            </h4>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {speciesList.map((sp) => {
                const info = speciesSightingsMap.get(sp.id);
                const isSeen = Boolean(info);

                return (
                  <div
                    key={sp.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                      isSeen
                        ? 'bg-neutral-900/80 border-emerald-500/40'
                        : 'bg-neutral-950 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        {isSeen ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-neutral-500">
                            <Circle className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display-tactical font-bold text-sm text-neutral-100">
                            {sp.commonName}
                          </span>
                          <span className="text-[10px] text-neutral-400 italic">
                            ({sp.scientificName})
                          </span>
                        </div>
                        {isSeen && info ? (
                          <div className="text-[10px] text-emerald-400 flex items-center gap-2 mt-0.5">
                            <span>Recorded {info.count}x birds</span>
                            <span>•</span>
                            <span>First: {info.firstDate} @ {info.firstLocation}</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-neutral-500 mt-0.5">
                            Not yet logged in field • Typical: {sp.habitat}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Merlin Sound ID */}
                      <a
                        href="https://merlin.allaboutbirds.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-cyan-300 text-[10px] font-mono-tactical cursor-pointer transition-colors flex items-center gap-1 border border-neutral-700"
                        title={`Sound ID for ${sp.commonName} via Merlin Bird ID (Cornell Lab)`}
                      >
                        <span className="text-cyan-400 font-bold">Merlin</span>
                        <ExternalLink className="w-2.5 h-2.5 text-neutral-400" />
                      </a>

                      {!isSeen && (
                        <button
                          onClick={() => {
                            tacticalAudio.playRadarPing(920);
                            onLogSpecies(sp);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-[11px] font-semibold cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Log
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-2 border-t border-neutral-800">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 cursor-pointer font-mono-tactical text-xs"
            >
              Close Notebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

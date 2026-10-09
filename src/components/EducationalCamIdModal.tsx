import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  Target, 
  ExternalLink, 
  Award, 
  ArrowRight, 
  RotateCcw,
  Check,
  AlertTriangle
} from 'lucide-react';
import { tacticalAudio } from '../utils/audio';
import { EDUCATIONAL_ID_CHALLENGES } from '../data/camPresets';

interface EducationalCamIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogIdentifiedSpecies: (data: {
    speciesName: string;
    count: number;
    quadrant: string;
    description: string;
  }) => void;
  currentCallsign: string;
}

type BehaviourType = 'thermal-soar' | 'wind-hover' | 'perched' | 'low-quarter' | 'rapid-stoop';
type SilhouetteKey = 'forked-tail' | 'fan-tail' | 'pointed-sickle' | 'scythe-dark-hood' | 'white-rump' | 'blunt-short';

interface SpeciesMatchResult {
  speciesName: string;
  scientificName: string;
  ukStatus: 'Green' | 'Amber' | 'Red';
  confidence: string;
  primaryKeyMark: string;
  wingspan: string;
  typicalBehaviour: string;
  confusionWarning: string;
  merlinUrl: string;
}

export const EducationalCamIdModal: React.FC<EducationalCamIdModalProps> = ({
  isOpen,
  onClose,
  onLogIdentifiedSpecies,
  currentCallsign,
}) => {
  const [activeTab, setActiveTab] = useState<'id-wizard' | 'daily-challenge'>('id-wizard');

  // Wizard state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBehaviour, setSelectedBehaviour] = useState<BehaviourType | null>(null);
  const [selectedSilhouette, setSelectedSilhouette] = useState<SilhouetteKey | null>(null);
  const [count, setCount] = useState<number>(1);
  const [sectorQuadrant, setSectorQuadrant] = useState<string>('Northern Ramparts');
  const [customObservationNotes, setCustomObservationNotes] = useState<string>('');
  const [hasLoggedSuccess, setHasLoggedSuccess] = useState<boolean>(false);

  // Daily Challenge state
  const [challengeIndex, setChallengeIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  if (!isOpen) return null;

  // Determine diagnosis result based on behavior and silhouette
  const getDiagnosticResult = (): SpeciesMatchResult => {
    if (selectedSilhouette === 'forked-tail' || (selectedBehaviour === 'thermal-soar' && selectedSilhouette !== 'fan-tail')) {
      return {
        speciesName: 'Red Kite',
        scientificName: 'Milvus milvus',
        ukStatus: 'Green',
        confidence: '95% Match (Diagnostic: Forked Tail)',
        primaryKeyMark: 'Deeply cleft V-fork rufous tail acting as a twisting aerial rudder, pale whitish underwing carpal patches, and arched dihedral glide.',
        wingspan: '175 - 195 cm',
        typicalBehaviour: 'Buoyant effortless soaring on thermal lift, circling in family kettles over Barbury Castle ramparts.',
        confusionWarning: 'Common Buzzards have broad rounded tails without any fork. If the tail has a notched fork, it is ALWAYS a Red Kite!',
        merlinUrl: 'https://merlin.allaboutbirds.org/',
      };
    }

    if (selectedSilhouette === 'fan-tail' || selectedBehaviour === 'perched' && selectedSilhouette !== 'pointed-sickle') {
      return {
        speciesName: 'Common Buzzard',
        scientificName: 'Buteo buteo',
        ukStatus: 'Green',
        confidence: '92% Match (Diagnostic: Broad Rounded Fan Tail)',
        primaryKeyMark: 'Broad, rounded fingered wings, short neck, and broad fan-shaped tail with fine barring. Variable plumage from dark chocolate brown to pale cream.',
        wingspan: '115 - 130 cm',
        typicalBehaviour: 'Soaring in wide lazy circles or perched prominently on fence posts, telegraph poles, and sarsen stones surveying turf for voles and worms.',
        confusionWarning: 'Beware pale-phase buzzards which can appear strikingly whitish from below, but always retain the short, broad fan tail.',
        merlinUrl: 'https://merlin.allaboutbirds.org/',
      };
    }

    if (selectedSilhouette === 'pointed-sickle' || selectedBehaviour === 'wind-hover') {
      return {
        speciesName: 'Common Kestrel',
        scientificName: 'Falco tinnunculus',
        ukStatus: 'Amber',
        confidence: '96% Match (Diagnostic: Stationary Wind-Hover)',
        primaryKeyMark: 'Long slender tail with prominent dark sub-terminal band, narrow pointed sickle wings, and reddish-brown chequered mantle.',
        wingspan: '65 - 82 cm',
        typicalBehaviour: 'Famous "wind-hover": head remains completely locked in space against headwind while wings flutter rapidly, scanning grass for rodent movement.',
        confusionWarning: 'Sparrowhawks do not perform stationary hovers; Sparrowhawks dash through woodland edges with short rounded wings.',
        merlinUrl: 'https://merlin.allaboutbirds.org/',
      };
    }

    if (selectedSilhouette === 'white-rump' || selectedBehaviour === 'low-quarter') {
      return {
        speciesName: 'Hen Harrier',
        scientificName: 'Circus cyaneus',
        ukStatus: 'Red',
        confidence: '88% Match (Diagnostic: White Rump & Low Quartering)',
        primaryKeyMark: 'Bright white rectangular rump patch, long narrow wings held in a shallow V (dihedral), and low buoyant, owl-like flight 1-2m above grass.',
        wingspan: '100 - 120 cm',
        typicalBehaviour: 'Slow, buoyant quartering back and forth over rough downland pasture and chalk crop stubble during autumn/winter passage.',
        confusionWarning: 'Short-eared Owls also quarter low at dusk, but have huge rounded owl wings, a blunter head, and lack the stark white rump patch.',
        merlinUrl: 'https://merlin.allaboutbirds.org/',
      };
    }

    if (selectedSilhouette === 'scythe-dark-hood') {
      return {
        speciesName: 'Eurasian Hobby',
        scientificName: 'Falco subbuteo',
        ukStatus: 'Green',
        confidence: '90% Match (Diagnostic: Swift-like Long Sickle Wings)',
        primaryKeyMark: 'Long scythe-shaped wings resembling a giant Swift, white cheeks with dark moustache, and rufous-red "trousers" on adult birds.',
        wingspan: '70 - 84 cm',
        typicalBehaviour: 'Acrobatic high-speed hawking catching dragonflies and hirundines (swallows/martins) with its talons in mid-air.',
        confusionWarning: 'Peregrine Falcons are much bulkier and heavier with broad chest and heavier wing beats.',
        merlinUrl: 'https://merlin.allaboutbirds.org/',
      };
    }

    return {
      speciesName: 'Eurasian Sparrowhawk',
      scientificName: 'Accipiter nisus',
      ukStatus: 'Amber',
      confidence: '85% Match (Diagnostic: Flap-Flap-Glide Burst)',
      primaryKeyMark: 'Short, broad, rounded wings with long barred tail. Small, compact build adapted for rapid low sprints between hedgerows.',
      wingspan: '60 - 80 cm',
      typicalBehaviour: 'Surprise ambush hunting: low rapid dash along hedge line with rapid flap-flap-glide bursts.',
      confusionWarning: 'Kestrels have pointed wings and hover; Sparrowhawks have blunt rounded wings and dash.',
      merlinUrl: 'https://merlin.allaboutbirds.org/',
    };
  };

  const result = getDiagnosticResult();

  const handleLogFromWizard = () => {
    tacticalAudio.playConfirmChime();
    onLogIdentifiedSpecies({
      speciesName: result.speciesName,
      count,
      quadrant: sectorQuadrant,
      description: customObservationNotes || `Identified via Educational Cam Wizard: ${count}x ${result.speciesName} in ${sectorQuadrant}. Behaviour: ${selectedBehaviour || 'Observed on cam'}. Key mark verified.`,
    });
    setHasLoggedSuccess(true);
    setTimeout(() => {
      onClose();
      setHasLoggedSuccess(false);
      setStep(1);
    }, 1500);
  };

  const handleResetWizard = () => {
    tacticalAudio.playRadarPing(700);
    setStep(1);
    setSelectedBehaviour(null);
    setSelectedSilhouette(null);
    setHasLoggedSuccess(false);
  };

  const currentChallenge = EDUCATIONAL_ID_CHALLENGES[challengeIndex] || EDUCATIONAL_ID_CHALLENGES[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerRevealed) return;
    tacticalAudio.playRadarPing(850);
    setSelectedOptionIndex(idx);
    setIsAnswerRevealed(true);
    if (currentChallenge.options[idx].isCorrect) {
      tacticalAudio.playConfirmChime();
      setScore((s) => s + 1);
    }
  };

  const handleNextChallenge = () => {
    tacticalAudio.playRadarPing(800);
    setIsAnswerRevealed(false);
    setSelectedOptionIndex(null);
    setChallengeIndex((prev) => (prev + 1) % EDUCATIONAL_ID_CHALLENGES.length);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md p-3 sm:p-5 flex justify-center items-start overscroll-contain animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-neutral-950 border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 mb-16 sm:mb-24">
        {/* Header */}
        <div className="bg-neutral-900/95 border-b border-neutral-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-tactical uppercase tracking-wider text-amber-400 font-bold">
                  EDUCATIONAL IDENTIFICATION ENGINE
                </span>
                <span className="text-neutral-600">|</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-tactical font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  BARBURY FIELD CAM
                </span>
              </div>
              <h3 className="font-display-tactical text-lg sm:text-xl font-bold text-neutral-100">
                Identify What's on Cam &amp; Learn Field Marks
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              tacticalAudio.playRadarPing(800);
              onClose();
            }}
            className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-850 rounded-xl transition-colors cursor-pointer"
            title="Close Wizard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Wizard vs Daily Challenge */}
        <div className="flex items-center border-b border-neutral-800 bg-neutral-900/50 px-4 pt-2 gap-2 text-xs font-mono-tactical">
          <button
            onClick={() => {
              tacticalAudio.playRadarPing(800);
              setActiveTab('id-wizard');
            }}
            className={`px-4 py-2 border-b-2 font-bold cursor-pointer transition-colors flex items-center gap-2 ${
              activeTab === 'id-wizard'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Interactive Cam ID Wizard (3-Steps)</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playRadarPing(850);
              setActiveTab('daily-challenge');
            }}
            className={`px-4 py-2 border-b-2 font-bold cursor-pointer transition-colors flex items-center gap-2 ${
              activeTab === 'daily-challenge'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Daily Downland ID Challenge (Quiz)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-5 text-xs text-neutral-300 font-sans leading-relaxed max-h-[75vh] overflow-y-auto">
          
          {/* TAB 1: 3-STEP IDENTIFICATION WIZARD */}
          {activeTab === 'id-wizard' && (
            <div className="space-y-5">
              {/* Stepper progress bar */}
              <div className="flex items-center justify-between gap-2 border-b border-neutral-800/80 pb-3 font-mono-tactical text-[11px]">
                <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-amber-400 font-bold' : 'text-neutral-500'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-400'}`}>1</span>
                  <span>Flight Behaviour</span>
                </div>
                <div className="w-8 h-[1px] bg-neutral-800"></div>
                <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-amber-400 font-bold' : 'text-neutral-500'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-400'}`}>2</span>
                  <span>Silhouette &amp; Tail</span>
                </div>
                <div className="w-8 h-[1px] bg-neutral-800"></div>
                <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-emerald-400 font-bold' : 'text-neutral-500'}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-emerald-500 text-neutral-950 font-bold' : 'bg-neutral-800 text-neutral-400'}`}>3</span>
                  <span>Diagnosis &amp; Spotter Reel</span>
                </div>
              </div>

              {/* STEP 1: BEHAVIOUR */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-display-tactical text-sm font-bold text-neutral-100 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-amber-400" />
                      Step 1 of 3: What is the bird doing on camera?
                    </h4>
                    <p className="text-neutral-400 text-xs mt-0.5 font-sans">
                      Behaviour is often the fastest way to eliminate species before examining feather details.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono-tactical text-xs">
                    {[
                      {
                        id: 'thermal-soar',
                        title: '🌪️ Circling & Soaring High',
                        desc: 'Gliding effortlessly without flapping on warm thermal air or scarp slope lift over the ramparts.',
                      },
                      {
                        id: 'wind-hover',
                        title: '🎯 Stationary Wind-Hover',
                        desc: 'Head locked completely fixed in mid-air facing into the wind with rapid wing beats.',
                      },
                      {
                        id: 'perched',
                        title: '🪵 Perched on Post / Stone',
                        desc: 'Resting upright on a field boundary fence post, dead branch, or sarsen stone surveying the grass.',
                      },
                      {
                        id: 'low-quarter',
                        title: '🌾 Skimming Low Over Grass (1-2m)',
                        desc: 'Buoyant slow flight weaving back and forth just above the pasture floor.',
                      },
                      {
                        id: 'rapid-stoop',
                        title: '⚡ High-Speed Stoop / Dash',
                        desc: 'Rapid low sprint between trees or vertical high-velocity dive.',
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          tacticalAudio.playRadarPing(850);
                          setSelectedBehaviour(item.id as BehaviourType);
                          setStep(2);
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          selectedBehaviour === item.id
                            ? 'bg-amber-500/20 border-amber-500 text-neutral-100 ring-2 ring-amber-500/30'
                            : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:bg-neutral-850 hover:border-neutral-700'
                        }`}
                      >
                        <span className="font-bold block text-neutral-100 text-xs">{item.title}</span>
                        <span className="text-[11px] text-neutral-400 font-sans block mt-1 leading-snug">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: SILHOUETTE & KEY MARKS */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-display-tactical text-sm font-bold text-neutral-100 flex items-center gap-2">
                      <Target className="w-4 h-4 text-amber-400" />
                      Step 2 of 3: Look at the Tail &amp; Wing Silhouette
                    </h4>
                    <p className="text-neutral-400 text-xs mt-0.5 font-sans">
                      Downland raptors against bright sky are best identified by silhouette shape. What does the tail and wing profile look like?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono-tactical text-xs">
                    {[
                      {
                        id: 'forked-tail',
                        title: '✂️ Deeply Forked V-Tail',
                        desc: 'Deep cleft V-notch in the tail, constantly twisting as a rudder. Angled wings with white underwing carpal patches.',
                        hint: 'Classic Red Kite signature',
                      },
                      {
                        id: 'fan-tail',
                        title: '🪶 Broad Rounded Fan Tail',
                        desc: 'Broad, rounded tail spread wide like a fan. Fingered broad wings with blunt tips.',
                        hint: 'Classic Common Buzzard signature',
                      },
                      {
                        id: 'pointed-sickle',
                        title: '🗡️ Long Slender Tail + Pointed Wings',
                        desc: 'Narrow pointed wings, slim body, long straight tail with black sub-terminal band.',
                        hint: 'Classic Common Kestrel / Falcon signature',
                      },
                      {
                        id: 'white-rump',
                        title: '⚪ Bright White Rump Patch',
                        desc: 'Flash of clean white on the lower back above the tail. Long narrow wings held in a shallow V.',
                        hint: 'Classic Hen Harrier signature',
                      },
                      {
                        id: 'scythe-dark-hood',
                        title: '🌙 Long Scythe Wings + Dark Helmet',
                        desc: 'Swift-like long curved wings, dark hooded helmet with white cheeks.',
                        hint: 'Classic Eurasian Hobby signature',
                      },
                      {
                        id: 'blunt-short',
                        title: '🪵 Short Blunt Wings + Long Barred Tail',
                        desc: 'Rounded compact wings designed for obstacle maneuvering between hedgerows.',
                        hint: 'Classic Sparrowhawk signature',
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          tacticalAudio.playRadarPing(900);
                          setSelectedSilhouette(item.id as SilhouetteKey);
                          setStep(3);
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          selectedSilhouette === item.id
                            ? 'bg-amber-500/20 border-amber-500 text-neutral-100 ring-2 ring-amber-500/30'
                            : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:bg-neutral-850 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-neutral-100 text-xs">{item.title}</span>
                          <span className="text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded font-mono">
                            {item.hint}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-400 font-sans block mt-1 leading-snug">{item.desc}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-neutral-400 hover:text-neutral-200 text-xs font-mono-tactical underline cursor-pointer"
                    >
                      &larr; Back to Step 1 (Behaviour)
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: RESULT & LOG TO LIVE SPOTTER REEL */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 rounded-xl bg-neutral-900 border-2 border-emerald-500/50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono-tactical font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            {result.confidence}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono-tactical font-bold ${
                            result.ukStatus === 'Red'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : result.ukStatus === 'Amber'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            UK {result.ukStatus.toUpperCase()} LIST
                          </span>
                        </div>
                        <h3 className="font-display-tactical text-xl font-bold text-neutral-100 mt-1">
                          {result.speciesName} <span className="text-xs text-neutral-400 font-sans italic">({result.scientificName})</span>
                        </h3>
                      </div>

                      <a
                        href={result.merlinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-neutral-950 hover:bg-neutral-850 text-cyan-300 font-mono-tactical text-[11px] flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                        title="Open Merlin Bird ID by Cornell Lab for verified sound and acoustic recordings"
                      >
                        <span>Sound ID on Merlin</span>
                        <ExternalLink className="w-3 h-3 text-cyan-400" />
                      </a>
                    </div>

                    <div className="space-y-2 text-xs font-sans text-neutral-300">
                      <div>
                        <strong className="text-amber-400 font-mono-tactical text-[11px] block uppercase">
                          Diagnostic Field Identification Marks:
                        </strong>
                        <p className="text-neutral-200 mt-0.5">{result.primaryKeyMark}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono-tactical pt-1">
                        <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                          <span className="text-neutral-500 block uppercase">TYPICAL WINGSPAN</span>
                          <span className="text-neutral-100 font-bold">{result.wingspan}</span>
                        </div>
                        <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                          <span className="text-neutral-500 block uppercase">TYPICAL HABITAT / ACTION</span>
                          <span className="text-neutral-100 font-bold">{result.typicalBehaviour}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-neutral-950/80 border border-neutral-800 text-[11px] space-y-1">
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> DO NOT CONFUSE WITH:
                        </span>
                        <p className="text-neutral-400 leading-snug">{result.confusionWarning}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick-Log this detection into the Live Cam Community Reel */}
                  <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-3 font-mono-tactical text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Log Your Identification into the Live Cam Reel
                      </span>
                      <span className="text-[10px] text-neutral-400 font-sans">
                        Credits your callsign: <strong className="text-neutral-200 font-mono">{currentCallsign}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-neutral-400 block mb-1">INDIVIDUAL COUNT</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={count}
                          onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1">FIELD SECTOR / PRESET</label>
                        <select
                          value={sectorQuadrant}
                          onChange={(e) => setSectorQuadrant(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-100 focus:outline-none focus:border-amber-500 font-sans text-xs"
                        >
                          <option value="Northern Ramparts">Preset 1: Northern Ramparts</option>
                          <option value="Raptor Perch / Sarsen Post">Preset 2: High Raptor Perch / Sarsen</option>
                          <option value="Chalk Meadow Margin">Preset 3: Downland Pasture Margin</option>
                          <option value="Thermal Chimney Corridor">Preset 4: High Thermal Sky</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-neutral-400 block mb-1">OPTIONAL OBSERVER NOTES</label>
                      <input
                        type="text"
                        placeholder="e.g. Spotted hovering above northern rampart ditch..."
                        value={customObservationNotes}
                        onChange={(e) => setCustomObservationNotes(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-neutral-100 focus:outline-none focus:border-amber-500 font-sans text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleResetWizard}
                        className="text-neutral-400 hover:text-neutral-200 text-xs font-mono-tactical underline cursor-pointer"
                      >
                        &larr; Start New Identification
                      </button>

                      <button
                        type="button"
                        onClick={handleLogFromWizard}
                        disabled={hasLoggedSuccess}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-display-tactical text-xs font-bold tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                      >
                        {hasLoggedSuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-neutral-950" />
                            <span>Logged to Cam Reel!</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Publish Spotting to Cam Reel</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DAILY DOWNLAND ID CHALLENGE */}
          {activeTab === 'daily-challenge' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono-tactical font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      DAILY DOWNLAND RAPTOR QUIZ
                    </span>
                    <span className="text-neutral-400 font-mono-tactical text-[11px]">
                      Challenge {challengeIndex + 1} of {EDUCATIONAL_ID_CHALLENGES.length}
                    </span>
                  </div>
                  <h4 className="font-display-tactical text-base font-bold text-neutral-100 mt-1">
                    {currentChallenge.title}
                  </h4>
                </div>

                <div className="px-3 py-1 rounded-xl bg-neutral-900 border border-neutral-800 font-mono-tactical text-xs text-amber-300">
                  Score: <strong className="text-neutral-100">{score}</strong> Correct
                </div>
              </div>

              {/* Scenario */}
              <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
                <span className="text-[10px] font-mono-tactical text-amber-400 uppercase font-bold tracking-wide block">
                  FIELD SCENARIO:
                </span>
                <p className="text-neutral-200 text-xs leading-relaxed font-sans">
                  {currentChallenge.scenario}
                </p>

                <div className="pt-2 border-t border-neutral-800">
                  <span className="text-[10px] font-mono-tactical text-neutral-400 uppercase block mb-1">
                    DIAGNOSTIC CLUES:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-neutral-300 text-[11px] font-sans">
                    {currentChallenge.clues.map((clue, idx) => (
                      <li key={idx}>{clue}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2 pt-1 font-mono-tactical text-xs">
                <span className="text-neutral-400 block text-[11px] font-bold">
                  CHOOSE THE CORRECT SPECIES:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentChallenge.options.map((opt, idx) => {
                    const isSelected = selectedOptionIndex === idx;
                    let style = 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:bg-neutral-850 hover:border-neutral-700';

                    if (isAnswerRevealed) {
                      if (opt.isCorrect) {
                        style = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold';
                      } else if (isSelected && !opt.isCorrect) {
                        style = 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerRevealed}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${style}`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span>{opt.speciesName}</span>
                          {isAnswerRevealed && opt.isCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {isAnswerRevealed && isSelected && !opt.isCorrect && (
                            <X className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Revealed Feedback */}
              {isAnswerRevealed && selectedOptionIndex !== null && (
                <div className={`p-3.5 rounded-xl border space-y-2 animate-fadeIn ${
                  currentChallenge.options[selectedOptionIndex].isCorrect
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                }`}>
                  <span className="font-mono-tactical font-bold text-xs flex items-center gap-1.5">
                    {currentChallenge.options[selectedOptionIndex].isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300">Spot on! Excellent field recognition.</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-300">Field Check &amp; Explanation:</span>
                      </>
                    )}
                  </span>
                  <p className="text-xs font-sans text-neutral-300 leading-relaxed">
                    {currentChallenge.options[selectedOptionIndex].explanation}
                  </p>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleNextChallenge}
                      className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-mono-tactical font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>Next Challenge</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-900/90 border-t border-neutral-800 p-4 flex items-center justify-between font-mono-tactical text-xs">
          <span className="text-neutral-500">
            Wessex Downland Educational Identification Standard
          </span>
          <button
            onClick={() => {
              tacticalAudio.playRadarPing(880);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

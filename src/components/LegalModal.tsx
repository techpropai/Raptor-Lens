import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Camera, 
  Scale, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  const [activeSubTab, setActiveSubTab] = useState<'copyright' | 'privacy' | 'ethics'>('copyright');
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
  }, [isOpen, activeSubTab]);

  if (!isOpen) return null;

  return (
    <div 
      ref={scrollContainerRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md p-3 sm:p-5 flex justify-center items-start overscroll-contain"
    >
      <div className="w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-7 md:p-8 shadow-2xl space-y-6 font-sans my-4 sm:my-8 mb-16 sm:mb-24 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800/90 pb-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-tactical font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest flex items-center gap-1.5">
                <Scale className="w-3 h-3 text-amber-400" />
                GOVERNANCE &amp; LEGAL ARCHITECTURE
              </span>
              <span className="text-xs font-mono-tactical text-neutral-400">
                CHALK // Legal Notice
              </span>
            </div>
            <h2 className="font-display-tactical text-2xl sm:text-3xl font-bold text-neutral-100 tracking-tight">
              Copyright, Privacy &amp; Wildlife Compliance
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans max-w-2xl">
              How RaptorLens and CHALK engineer strict UK copyright ownership, automated GDPR landscape privacy protection, and Schedule 1 wildlife compliance.
            </p>
          </div>

          <button
            onClick={() => {
              tacticalAudio.playRadarPing(700);
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-100 flex items-center justify-center cursor-pointer transition-colors shrink-0"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto relative z-10 font-mono-tactical text-xs">
          <button
            onClick={() => {
              tacticalAudio.playRadarPing(750);
              setActiveSubTab('copyright');
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'copyright'
                ? 'bg-amber-500/20 border border-amber-500/60 text-amber-300 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 bg-neutral-900/50 border border-transparent'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>1. Copyright &amp; Feed Ownership</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playRadarPing(800);
              setActiveSubTab('privacy');
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'privacy'
                ? 'bg-cyan-500/20 border border-cyan-500/60 text-cyan-300 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 bg-neutral-900/50 border border-transparent'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>2. Privacy, GDPR &amp; Optics Safeguards</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playRadarPing(850);
              setActiveSubTab('ethics');
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === 'ethics'
                ? 'bg-purple-500/20 border border-purple-500/60 text-purple-300 font-bold'
                : 'text-neutral-400 hover:text-neutral-200 bg-neutral-900/50 border border-transparent'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>3. Wildlife Law (Schedule 1)</span>
          </button>
        </div>

        {/* Tab 1: Copyright & Feed Ownership */}
        {activeSubTab === 'copyright' && (
          <div className="space-y-4 text-neutral-300 font-sans text-xs sm:text-sm leading-relaxed relative z-10 animate-fadeIn">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-display-tactical text-base font-bold">
                <Scale className="w-5 h-5 text-amber-400" />
                <span>UK Copyright Law, Station Ownership &amp; Third-Party Protection</span>
              </div>
              <p className="text-neutral-300">
                To guarantee strict intellectual property integrity and prevent unauthorised re-broadcasting or false attribution, RaptorLens enforces clear separation between station-owned hardware and external conservation projects:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-2xl space-y-2">
                <strong className="text-neutral-100 font-display-tactical text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  Official Station Camera (CAM 01)
                </strong>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Under the UK Copyright, Designs and Patents Act 1988 (CDPA) Section 9(3), the Barbury Castle Downland Field Cam (CAM 01) is owned, deployed, and operated directly by this station. Real-time telemetry, calibrated azimuths, and digital processing workflows are protected station IP.
                </p>
              </div>

              <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-2xl space-y-2">
                <strong className="text-neutral-100 font-display-tactical text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  External Wildlife Feeds Protection
                </strong>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  RaptorLens strictly respects third-party copyright and broadcaster agreements. External cameras and charity projects (e.g. Salisbury Cathedral Peregrine Project, RSPB reserves) are <strong>never</strong> scraped, re-streamed, embedded into custom players, or framed with unauthorised watermarks.
                </p>
              </div>

              <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-2xl space-y-2">
                <strong className="text-neutral-100 font-display-tactical text-xs flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Composite Graphic Overlay Protection
                </strong>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Livestream broadcasts from CAM 01 integrate human-curated real-time telemetry HUDs, live barometric calculations, thermal soaring vectors, and proprietary branding. This composite work possesses undisputed copyright authorship under UK broadcast and digital media jurisprudence.
                </p>
              </div>

              <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-2xl space-y-2">
                <strong className="text-neutral-100 font-display-tactical text-xs flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Database Right Directive (96/9/EC)
                </strong>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  All telemetry vectors, station observation datasets, and community logs on RaptorLens are protected under European and UK Database Rights. Unauthorised commercial scraping, automated mirroring, or unlicensed third-party broadcast is strictly forbidden without written licensing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Privacy, GDPR & Optics Safeguards */}
        {activeSubTab === 'privacy' && (
          <div className="space-y-4 text-neutral-300 font-sans text-xs sm:text-sm leading-relaxed relative z-10 animate-fadeIn">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-display-tactical text-base font-bold">
                <Lock className="w-5 h-5 text-cyan-400" />
                <span>GDPR, Privacy by Design &amp; High-Magnification Optics</span>
              </div>
              <p className="text-neutral-300">
                Operating high-magnification telephoto PTZ cameras across downland escarpments requires strict compliance with the UK Data Protection Act 2018 and Information Commissioner's Office (ICO) CCTV surveillance codes:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-2xl space-y-2">
                <strong className="text-neutral-100 font-display-tactical text-xs flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  Hardware-Level 3D Privacy Masking
                </strong>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Our TandemVu and PTZ cameras feature internal DSP privacy masks. Any residential properties, valley farmsteads, or private curtilages within the sweep are digitally occluded with permanent black polygon shields directly inside the camera before video is encoded for streaming.
                </p>
              </div>

              <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-2xl space-y-2">
                <strong className="text-neutral-100 font-display-tactical text-xs flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  Skyline &amp; Horizon Bounds (The Skyline Rule)
                </strong>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Station optics operate with programmed tilt limits (-5° minimum depression) to maintain focus solely on high ridges, airspace thermals, and tree canopies. Hikers on rights of way at distance appear as anonymous distant silhouettes (&lt;20px), well below the threshold of identifiable personal data.
                </p>
              </div>

              <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-2xl space-y-2 sm:col-span-2">
                <strong className="text-neutral-100 font-display-tactical text-xs flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  One-Way Outbound Streaming (Zero Open Inbound Ports)
                </strong>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Station hardware communicates exclusively via outbound RTMPS relays to YouTube/Twitch servers on isolated guest VLANs. No inbound ports are opened, preventing external unauthorised camera access or network intrusion.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Wildlife Law & Schedule 1 */}
        {activeSubTab === 'ethics' && (
          <div className="space-y-4 text-neutral-300 font-sans text-xs sm:text-sm leading-relaxed relative z-10 animate-fadeIn">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-display-tactical text-base font-bold">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>Wildlife &amp; Countryside Act 1981 Protection</span>
              </div>
              <p className="text-neutral-300">
                Breeding raptors and sensitive nesting species in the UK receive the highest level of legal protection. Observers and camera operators must adhere to these strict conservation protocols:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-2xl space-y-2">
                <strong className="text-neutral-100 font-display-tactical text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  Automated Coordinate Fuzzing
                </strong>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Schedule 1 sightings (Peregrines, Hen Harriers, Merlins, Ospreys) submitted by observers are automatically fuzzed to 5–10km hectad grids to conceal exact nesting hollows and eyries from potential egg collectors or disturbance.
                </p>
              </div>

              <div className="bg-neutral-900/70 border border-neutral-800 p-4 rounded-2xl space-y-2">
                <strong className="text-neutral-100 font-display-tactical text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  150m Roost &amp; Clump Standoff
                </strong>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Observers must never approach active winter roosts or high beech clumps. Optical magnification allows ethical observation from public rights of way without expending critical avian energy reserves.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-800/90 relative z-10 font-mono-tactical text-xs">
          <span className="text-neutral-400 text-[11px] hidden sm:inline">
            CHALK Environmental Intelligence Protocol
          </span>

          <button
            onClick={() => {
              tacticalAudio.playConfirmChime();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer ml-auto"
          >
            Acknowledge &amp; Return &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

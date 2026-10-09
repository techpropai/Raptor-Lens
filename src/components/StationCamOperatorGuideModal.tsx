import React from 'react';
import { 
  X, 
  Video, 
  Sun, 
  Battery, 
  Wifi, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Compass, 
  CloudSun, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Target,
  Clock,
  Coins,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface StationCamOperatorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StationCamOperatorGuideModal: React.FC<StationCamOperatorGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md p-3 sm:p-5 flex justify-center items-start overscroll-contain animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-neutral-950 border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 mb-16 sm:mb-24">
        {/* Header */}
        <div className="bg-neutral-900/95 border-b border-neutral-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-tactical uppercase tracking-wider text-amber-400 font-bold">
                  STATION OPERATOR DOSSIER
                </span>
                <span className="text-neutral-600">|</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-tactical font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PTZ &amp; TRAFFIC PLAYBOOK
                </span>
              </div>
              <h3 className="font-display-tactical text-lg sm:text-xl font-bold text-neutral-100">
                Operating a Moving Field Cam &amp; Driving Website Traffic
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              tacticalAudio.playRadarPing(800);
              onClose();
            }}
            className="p-2 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-850 rounded-xl transition-colors cursor-pointer"
            title="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 text-xs text-neutral-300 font-sans leading-relaxed max-h-[75vh] overflow-y-auto">
          
          {/* Key Takeaway Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-neutral-900 to-neutral-900 border border-amber-500/40 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold font-mono-tactical text-sm">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>The Two Core Traffic Engines: Live Hillfort Weather + Step-and-Dwell Wildlife PTZ</span>
            </div>
            <p className="text-neutral-200">
              Your intuition is 100% correct! A moving camera with distinct focus presets (Hilltop Fort, Raptor Perch, Field Margin) will keep the feed endlessly active. Crucially, pairing the live optical camera with <strong>Barbury Castle summit weather</strong> turns your site into a daily utility for tens of thousands of Ridgeway walkers, paragliders, and nature enthusiasts.
            </p>
          </div>

          {/* Section 1: The Moving Camera (PTZ Strategy) */}
          <div className="space-y-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <h4 className="font-display-tactical text-sm font-bold text-amber-300 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              1. The PTZ Moving Camera Strategy: "Step-and-Dwell" vs Continuous Sweep
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-neutral-300">
              <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800 space-y-1.5">
                <span className="font-bold text-rose-400 flex items-center gap-1 font-mono-tactical text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5" /> What to Avoid: Continuous Panning
                </span>
                <p className="text-neutral-400 text-[11px]">
                  Avoid setting your PTZ camera to constantly pan back and forth without stopping. Continuous panning causes severe motion blur, makes viewers dizzy, destroys YouTube's video compression (causing pixelation/artifacts), and prevents autofocus from locking onto perched or distant raptors.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800 space-y-1.5">
                <span className="font-bold text-emerald-400 flex items-center gap-1 font-mono-tactical text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Best Practice: "Guard Tour" (Step &amp; Dwell)
                </span>
                <p className="text-neutral-400 text-[11px]">
                  Programme your PTZ camera with a <strong>4-step automated cruise tour</strong> where it snaps quickly to a preset, pauses for <strong>45 to 90 seconds</strong> with locked autofocus, then moves to the next preset:
                </p>
              </div>
            </div>

            {/* Presets Blueprint */}
            <div className="space-y-2 pt-2">
              <span className="font-mono-tactical text-[11px] font-bold text-neutral-200 uppercase tracking-wide block">
                Recommended 4-Point Downland Guard Tour:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono-tactical">
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-amber-400 font-bold block">Preset 1 (60s): Barbury Castle Hillfort</span>
                  <span className="text-neutral-400">30x zoom on the northern ramparts and trig point (268m ASL). Shows live ridge weather, cloud base, and thermal soaring kites.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-cyan-400 font-bold block">Preset 2 (45s): High Raptor Perch &amp; Post</span>
                  <span className="text-neutral-400">18x zoom on your field boundary dead ash branch or sarsen stone. Frequent hunting perch for Kestrels, Buzzards, and Little Owls.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-emerald-400 font-bold block">Preset 3 (45s): Chalk Pasture &amp; Meadow Margin</span>
                  <span className="text-neutral-400">10x wide view scanning ground turf for low-quartering Barn Owls, hunting Harriers, and feeding hares.</span>
                </div>
                <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800">
                  <span className="text-purple-400 font-bold block">Preset 4 (45s): Escarpment Sky &amp; Thermals</span>
                  <span className="text-neutral-400">12x skyward view tracking Red Kite kettles and falcon stoops along the scarp lift corridor.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: How Weather Drives Massive Recurring Traffic */}
          <div className="space-y-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <h4 className="font-display-tactical text-sm font-bold text-cyan-300 flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-cyan-400" />
              2. The Barbury Castle Weather Hook (Your Biggest Traffic Magnet)
            </h4>
            <p className="text-neutral-300">
              Wildlife feeds can have quiet hours when birds are roosting. But <strong>weather is always happening</strong>! Barbury Castle sits exposed at 268m (879ft) on the Marlborough Downs. Local weather in Swindon or Marlborough town centre is frequently completely different from the windy, cloud-capped summit:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-neutral-300 pl-2">
              <li>
                <strong className="text-neutral-100">Ridgeway Walkers &amp; Trail Hikers:</strong> The Ridgeway National Trail passes directly through Barbury Castle (~85,000 visitors annually). Walkers want to check: <em>"Is it fogged in on the ridge? Is it raining? How strong is the wind?"</em>
              </li>
              <li>
                <strong className="text-neutral-100">Paragliders &amp; Hang Gliders:</strong> The Thames Valley and Avon hang gliding clubs fly from the Barbury Castle scarp. A live camera + wind readout is pure gold for them.
              </li>
              <li>
                <strong className="text-neutral-100">Landscape Photographers &amp; Stargazers:</strong> Checking for morning chalk mist inversion, sunset light over the ramparts, or clear night skies.
              </li>
              <li>
                <strong className="text-neutral-100">Daily Dog Walkers &amp; Cyclists:</strong> Checking ground conditions and cloud cover before driving up to the Barbury Castle car park.
              </li>
            </ul>
          </div>

          {/* Section 3: Recommended Hardware & Solar Setup */}
          <div className="space-y-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <h4 className="font-display-tactical text-sm font-bold text-amber-300 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              3. Practical Hardware &amp; Off-Grid Solar Setup for UK Downland
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-neutral-300 text-[11px]">
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-bold text-neutral-100 block font-mono-tactical flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-amber-400" /> 4G PTZ Camera
                </span>
                <p className="text-neutral-400">
                  <strong>Reolink TrackMix 4G / Go PT Ultra</strong> (dual-lens wide + telephoto with 4G SIM) or <strong>Hikvision 4G DarkFighter PTZ</strong> (for 25x-32x optical reach).
                </p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-bold text-neutral-100 block font-mono-tactical flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-emerald-400" /> Solar &amp; Battery
                </span>
                <p className="text-neutral-400">
                  For UK winters (Nov-Jan), pair with a <strong>100W-120W monocrystalline solar panel</strong> and a <strong>40Ah-50Ah LiFePO4 battery</strong> with MPPT controller to avoid winter blackouts.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-bold text-neutral-100 block font-mono-tactical flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" /> 24/7 Live Stream
                </span>
                <p className="text-neutral-400">
                  Pull the camera's RTSP feed into a low-power home PC / Raspberry Pi running <strong>OBS Studio</strong> or <strong>Restreamer</strong> to push 1080p stream to <strong>YouTube Live</strong> (free, unlimited viewers).
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: UK ICO Privacy & Legal Rules */}
          <div className="space-y-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <h4 className="font-display-tactical text-sm font-bold text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              4. UK Privacy Law &amp; ICO Compliance (Barbury Castle Public Footpaths)
            </h4>
            <p className="text-neutral-300 text-xs">
              Because Barbury Castle has public footpaths and visitors, follow UK Information Commissioner's Office (ICO) CCTV and GDPR guidelines:
            </p>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 pl-2 text-[11px]">
              <li>Keep the camera's optical horizon elevated towards the <strong>sky, hillfort ridges, and distant horizons</strong> (3km distance means individual faces cannot be resolved).</li>
              <li>Use the camera’s built-in <strong>digital privacy masking</strong> (black polygon zones) over any close public rights of way, car parks, or neighbouring farm curtilages.</li>
              <li>Maintain the transparent on-screen station watermark (&ldquo;RAPTORLENS • GDPR MASKED&rdquo;) which proves privacy compliance.</li>
            </ul>
          </div>

          {/* Section 5: Audience Growth Playbook */}
          <div className="space-y-3 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
            <h4 className="font-display-tactical text-sm font-bold text-purple-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              5. Local Wiltshire Audience Growth Playbook
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-300 text-[11px]">
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-bold text-amber-300 font-mono-tactical">1. Local Walking &amp; Outdoor Groups</span>
                <p className="text-neutral-400">
                  Share the link in Marlborough, Swindon, and Wiltshire hiking Facebook groups: <em>"Check live weather and see if the Barbury Castle ridge is clear before walking!"</em>
                </p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-bold text-cyan-300 font-mono-tactical">2. School Science &amp; Ecology Units</span>
                <p className="text-neutral-400">
                  Reach out to local primary and secondary schools in Swindon and Marlborough. Our <strong>Educational Cam ID Wizard</strong> and <strong>Daily ID Challenge</strong> fit directly into Key Stage 2 &amp; 3 biology/geography units on food webs, predator-prey dynamics, and Iron Age history.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-bold text-emerald-300 font-mono-tactical">3. Wiltshire Wildlife Trust &amp; BTO</span>
                <p className="text-neutral-400">
                  Submit the live field feed as an active public spotting resource for local bird clubs and conservation trusts tracking Red Kite and Harrier breeding recovery.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-bold text-purple-300 font-mono-tactical">4. Daily Community Spotter Reel</span>
                <p className="text-neutral-400">
                  Viewers love seeing their name on screen! When viewers hit <strong>"Spotted on Cam!"</strong> or use the <strong>Educational ID Wizard</strong>, their callsign and spot are permanently credited in the live feed.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6: Monetisation Blueprint & Generating Income from YouTube Live */}
          <div className="space-y-3 p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-neutral-900 border border-emerald-500/50">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-display-tactical text-sm font-bold text-emerald-300 flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-400" />
                6. Monetisation Blueprint: How to Generate Income from Your 24/7 Stream
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-tactical font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                PROFITABLE 24/7 NICHE
              </span>
            </div>

            <p className="text-neutral-200">
              <strong>Yes, 24/7 YouTube live streams are one of the most reliable and hands-off ways to generate recurring income on the internet.</strong> Nature, wildlife, and weather cams have extraordinarily long average watch times (viewers often leave the stream running on smart TVs or desktop monitors for 4 to 8 hours daily). Here is how you monetize:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-300 text-[11px] pt-1">
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1.5">
                <span className="font-bold text-emerald-400 font-mono-tactical flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> 1. YouTube Partner Program (AdSense)
                </span>
                <p className="text-neutral-400">
                  <strong>Threshold:</strong> 1,000 subscribers &amp; 4,000 watch hours. A 24/7 stream hits this rapidly: just 20 concurrent viewers watching 8 hours a day generates 160 watch hours daily (surpassing 4,000 hours in ~25 days!). YouTube automatically serves mid-roll ads every 30-45 minutes.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1.5">
                <span className="font-bold text-amber-400 font-mono-tactical flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 2. Super Chats &amp; Live Fan Tipping
                </span>
                <p className="text-neutral-400">
                  <strong>Fan Funding tier unlocks at 500 subs:</strong> When an exciting wildlife event happens (e.g. Red Kites kettling or a Kestrel landing on the perch), viewers routinely tip £2, £5, or £20 Super Chats to highlight their reaction in the live chat.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1.5">
                <span className="font-bold text-cyan-400 font-mono-tactical flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> 3. Channel Memberships (&ldquo;Cam Patrons&rdquo;)
                </span>
                <p className="text-neutral-400">
                  Monthly recurring subscriptions (e.g. £2.99 or £4.99/mo) to support camera maintenance, 4G SIM data, and solar batteries. 50 loyal members generate ~£175 - £200/mo net recurring revenue, covering all operational costs.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-1.5">
                <span className="font-bold text-purple-400 font-mono-tactical flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> 4. Local Sponsorships &amp; Affiliate Gear
                </span>
                <p className="text-neutral-400">
                  Local Wiltshire businesses (farm shops, pubs, B&amp;Bs, outdoor retailers) pay £50-£150/mo for a discrete on-screen bug or description link. Plus affiliate links for optics (binoculars, spotting scopes, bird guides).
                </p>
              </div>
            </div>

            {/* Income vs Expenses Balance Sheet */}
            <div className="p-3 rounded-lg bg-neutral-950/90 border border-neutral-800 text-[11px] font-mono-tactical space-y-1">
              <span className="text-neutral-300 font-bold block">
                TYPICAL 24/7 LIVESTREAM MONTHLY BALANCE SHEET:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-400 pt-1">
                <div>
                  <span className="text-rose-400 block font-bold">• Monthly Operating Costs: ~£15 - £25/mo</span>
                  <span>Unlimited 4G SIM card (Smarty/Three/Vodafone). Electricity is £0 with solar + LiFePO4 battery!</span>
                </div>
                <div>
                  <span className="text-emerald-400 block font-bold">• Realistic Revenue Potential: £150 - £800+/mo</span>
                  <span>From a combination of AdSense mid-rolls, Super Chats, 30-50 channel members, and Ko-fi donations.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-900/90 border-t border-neutral-800 p-4 flex items-center justify-between font-mono-tactical text-xs">
          <span className="text-neutral-500">
            RaptorLens UK • Engineering &amp; Operations Architecture
          </span>
          <button
            onClick={() => {
              tacticalAudio.playRadarPing(880);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold cursor-pointer transition-colors"
          >
            Understood &amp; Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};

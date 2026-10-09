import React, { useState, useEffect } from 'react';
import { RaptorSpecies } from '../types/raptor';
import { Target, CheckCircle2, XCircle, RotateCcw, Zap } from 'lucide-react';
import { tacticalAudio } from '../utils/audio';

interface SilhouetteQuizProps {
  speciesList: RaptorSpecies[];
  onSelectSpecies: (species: RaptorSpecies) => void;
}

export const SilhouetteQuiz: React.FC<SilhouetteQuizProps> = ({ speciesList, onSelectSpecies }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [highStreak, setHighStreak] = useState<number>(0);
  const [questions, setQuestions] = useState<Array<{ species: RaptorSpecies; options: RaptorSpecies[] }>>([]);

  // Generate randomized quiz
  const generateQuiz = () => {
    const shuffled = [...speciesList].sort(() => Math.random() - 0.5);
    const newQuestions = shuffled.slice(0, 7).map((target) => {
      // Pick 3 random distractor species
      const distractors = speciesList
        .filter((s) => s.id !== target.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      const options = [target, ...distractors].sort(() => Math.random() - 0.5);
      return { species: target, options };
    });

    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
  };

  useEffect(() => {
    generateQuiz();
  }, [speciesList]);

  if (questions.length === 0) return null;

  const currentQ = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleSelectOption = (option: RaptorSpecies) => {
    if (isAnswered) return;

    setSelectedOptionId(option.id);
    setIsAnswered(true);

    const isCorrect = option.id === currentQ.species.id;
    if (isCorrect) {
      tacticalAudio.playConfirmChime();
      setScore((prev) => prev + 1);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > highStreak) setHighStreak(nextStreak);
    } else {
      tacticalAudio.playRadarPing(350);
      setStreak(0);
    }
  };

  const handleNext = () => {
    tacticalAudio.playRadarPing(880);
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-neutral-950 border border-neutral-800 rounded-xl p-5 md:p-7 shadow-2xl space-y-6">
      {/* Quiz Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono-tactical uppercase tracking-wider text-amber-400 font-bold">
              OPTICAL SILHOUETTE DRILL // RAPID ID
            </span>
          </div>
          <h2 className="font-display-tactical text-xl md:text-2xl font-bold text-neutral-100">
            Overhead Reflex Training
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-xs font-mono-tactical text-right">
            <span className="text-neutral-500 block text-[9px]">ROUND PROGRESS</span>
            <span className="text-neutral-200 font-bold">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-xs font-mono-tactical text-right">
            <span className="text-neutral-500 block text-[9px]">RADAR LOCKS</span>
            <span className="text-amber-400 font-bold">{score} Hits</span>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-xs font-mono-tactical text-right">
            <span className="text-neutral-500 block text-[9px]">STREAK</span>
            <span className="text-emerald-400 font-bold flex items-center gap-0.5 justify-end">
              <Zap className="w-3 h-3 fill-current" /> {streak}
            </span>
          </div>
        </div>
      </div>

      {/* Target Silhouette Display */}
      <div className="relative w-full h-56 md:h-64 bg-neutral-900/80 border border-neutral-800 rounded-xl flex items-center justify-center p-4 overflow-hidden group">
        {/* Radar Crosshair background */}
        <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-40 h-40 rounded-full border border-neutral-700/30"></div>
          <div className="w-60 h-60 rounded-full border border-neutral-700/20"></div>
          <div className="w-full h-px bg-neutral-700/20 absolute"></div>
          <div className="h-full w-px bg-neutral-700/20 absolute"></div>
        </div>

        {/* Silhouette SVG */}
        <svg
          viewBox="0 0 300 200"
          className="w-full h-full max-h-48 text-neutral-100 fill-current drop-shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-transform duration-500 group-hover:scale-105"
        >
          <path d={currentQ.species.silhouetteSvg} />
        </svg>

        <div className="absolute bottom-2 left-3 text-[10px] font-mono-tactical text-neutral-500">
          RADAR CONTACT: TARGET #{currentQuestionIndex + 1} OVER WESSEX
        </div>
      </div>

      {/* Options Grid */}
      <div className="space-y-2">
        <div className="text-xs font-mono-tactical text-neutral-400 font-bold uppercase tracking-wider">
          CLASSIFY OVERHEAD SILHOUETTE:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt) => {
            const isCorrect = opt.id === currentQ.species.id;
            const isSelected = selectedOptionId === opt.id;

            let buttonStyle = 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-neutral-700 hover:bg-neutral-850';
            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10';
              } else if (isSelected) {
                buttonStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
              } else {
                buttonStyle = 'bg-neutral-900/40 border-neutral-850 text-neutral-600 opacity-60';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt)}
                disabled={isAnswered}
                className={`p-3.5 rounded-xl border text-left transition-all font-mono-tactical text-xs flex items-center justify-between cursor-pointer ${buttonStyle}`}
              >
                <div>
                  <div className="font-display-tactical text-sm font-bold tracking-wide">
                    {opt.commonName}
                  </div>
                  <div className="text-[10px] text-neutral-400 italic">
                    {opt.scientificName}
                  </div>
                </div>

                {isAnswered && (
                  <div>
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Answer Explanation Box */}
      {isAnswered && (
        <div className="bg-neutral-900/90 border border-neutral-800 p-4 rounded-xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono-tactical font-bold text-amber-400 uppercase">
                TARGET DE-BRIEF: {currentQ.species.commonName}
              </span>
            </div>
            <button
              onClick={() => onSelectSpecies(currentQ.species)}
              className="text-xs font-mono-tactical text-neutral-400 hover:text-amber-300 underline cursor-pointer"
            >
              Open Full Dossier
            </button>
          </div>

          <p className="text-xs font-mono-tactical text-neutral-300 leading-relaxed">
            {currentQ.species.flightDescription}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono-tactical text-neutral-300 pt-1">
            <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
              <span className="text-amber-400 font-bold block mb-0.5">TAIL DIAGNOSTIC:</span>
              {currentQ.species.tailShapeLabel}
            </div>
            <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
              <span className="text-emerald-400 font-bold block mb-0.5">WING DIAGNOSTIC:</span>
              {currentQ.species.wingShapeLabel}
            </div>
          </div>

          {/* Next Button */}
          <div className="pt-2 flex justify-end">
            {!isLastQuestion ? (
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-display-tactical text-sm font-bold tracking-wider cursor-pointer shadow-lg shadow-amber-500/20"
              >
                Next Silhouette Contact &rarr;
              </button>
            ) : (
              <button
                onClick={generateQuiz}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-display-tactical text-sm font-bold tracking-wider cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" /> Restart Drill ({score}/{questions.length})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

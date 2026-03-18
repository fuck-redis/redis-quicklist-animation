import React, { useEffect, useMemo, useState } from 'react';
import { parseValuesInput, randomValues, SCENARIO_PRESETS, validateValues } from '@/data/scenarios';
import { usePersistentPreference } from '@/hooks/usePersistentPreference';
import { usePlayback } from '@/hooks/usePlayback';
import { InputConfig, Language, SolutionId } from '@/types/quicklistViz';
import { loadGithubStars } from '@/utils/githubRepo';
import { generateQuickListSteps } from '@/utils/stepGenerators';
import { CanvasPanel } from './CanvasPanel';
import { CodePanel } from './CodePanel';
import { CommunityFloat } from './CommunityFloat';
import { ContextPanel } from './ContextPanel';
import { IdeaModal } from './IdeaModal';
import { InputBar } from './InputBar';
import { PlaybackControls } from './PlaybackControls';
import { SolutionTabs } from './SolutionTabs';
import { TopHeader } from './TopHeader';
import styles from './QuickListWorkbench.module.css';

const DEFAULT_INPUT_VALUES = [1, 3, 5, 7, 9, 11, 13, 15];
const DEFAULT_RAW_INPUT = `[${DEFAULT_INPUT_VALUES.join(', ')}]`;

const DEFAULT_CONFIG: InputConfig = {
  values: DEFAULT_INPUT_VALUES,
  fillByCount: 4,
  fillByBytes: 60,
  compressDepth: 1,
  queuePopCount: 3,
};

function valuesToRaw(values: Array<number | string>): string {
  const body = values.map((item) => (typeof item === 'number' ? item : String(item))).join(', ');
  return `[${body}]`;
}

export const QuickListWorkbench: React.FC = () => {
  const [rawInput, setRawInput] = useState(DEFAULT_RAW_INPUT);
  const [fillByCount, setFillByCount] = useState(DEFAULT_CONFIG.fillByCount);
  const [fillByBytes, setFillByBytes] = useState(DEFAULT_CONFIG.fillByBytes);
  const [compressDepth, setCompressDepth] = useState(DEFAULT_CONFIG.compressDepth);
  const [queuePopCount, setQueuePopCount] = useState(DEFAULT_CONFIG.queuePopCount);
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>(SCENARIO_PRESETS[0].key);
  const [generatedConfig, setGeneratedConfig] = useState<InputConfig>(DEFAULT_CONFIG);
  const [activeSolution, setActiveSolution] = useState<SolutionId>('countFill');
  const [ideaOpen, setIdeaOpen] = useState(false);
  const [stars, setStars] = useState(0);

  const [language, setLanguage] = usePersistentPreference<Language>('language', 'java');
  const [speed, setSpeed] = usePersistentPreference<number>('speed', 1);

  const parsedValues = useMemo(() => parseValuesInput(rawInput), [rawInput]);
  const validationError = useMemo(() => validateValues(parsedValues), [parsedValues]);

  const regenerateSteps = () => {
    if (validationError) {
      return;
    }

    setGeneratedConfig({
      values: parsedValues,
      fillByCount: Math.max(2, Math.min(14, fillByCount)),
      fillByBytes: Math.max(30, Math.min(240, fillByBytes)),
      compressDepth: Math.max(0, Math.min(5, compressDepth)),
      queuePopCount: Math.max(0, Math.min(16, queuePopCount)),
    });
  };

  useEffect(() => {
    void loadGithubStars().then((count) => setStars(count));
  }, []);

  useEffect(() => {
    regenerateSteps();
    // only auto-regenerate once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stepsBySolution = useMemo(
    () => ({
      countFill: generateQuickListSteps('countFill', generatedConfig),
      byteFill: generateQuickListSteps('byteFill', generatedConfig),
    }),
    [generatedConfig]
  );

  const countPlayback = usePlayback({ frameCount: stepsBySolution.countFill.length, speed });
  const bytePlayback = usePlayback({ frameCount: stepsBySolution.byteFill.length, speed });

  const activePlayback = activeSolution === 'countFill' ? countPlayback : bytePlayback;
  const activeSteps = stepsBySolution[activeSolution];
  const activeStep = activeSteps[Math.min(activePlayback.currentIndex, activeSteps.length - 1)];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        activePlayback.prev();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        activePlayback.next();
        return;
      }
      if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        activePlayback.reset();
        return;
      }
      if (event.code === 'Space') {
        event.preventDefault();
        activePlayback.toggle();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activePlayback]);

  return (
    <div className={styles.page}>
      <TopHeader stars={stars} onOpenIdea={() => setIdeaOpen(true)} />

      <InputBar
        rawInput={rawInput}
        fillByCount={fillByCount}
        fillByBytes={fillByBytes}
        compressDepth={compressDepth}
        queuePopCount={queuePopCount}
        selectedPresetKey={selectedPresetKey}
        validationError={validationError}
        onRawInputChange={(value) => setRawInput(value)}
        onPresetChange={(presetKey) => {
          const preset = SCENARIO_PRESETS.find((item) => item.key === presetKey);
          if (!preset) {
            return;
          }
          setSelectedPresetKey(presetKey);
          setRawInput(valuesToRaw(preset.values));
          setQueuePopCount(preset.queuePopCount);
          setTimeout(() => {
            setGeneratedConfig((prev) => ({
              ...prev,
              values: preset.values,
              queuePopCount: preset.queuePopCount,
            }));
          }, 0);
        }}
        onRandomize={() => {
          const generated = randomValues(12);
          setRawInput(valuesToRaw(generated));
          setSelectedPresetKey('random');
        }}
        onFillByCountChange={(value) => setFillByCount(value)}
        onFillByBytesChange={(value) => setFillByBytes(value)}
        onCompressDepthChange={(value) => setCompressDepth(value)}
        onQueuePopChange={(value) => setQueuePopCount(value)}
        onRegenerate={regenerateSteps}
      />

      <SolutionTabs active={activeSolution} onChange={setActiveSolution} />

      <main className={styles.main}>
        <section className={styles.leftArea}>
          <div className={styles.canvasWrap}>
            {activeStep ? <CanvasPanel step={activeStep} /> : null}
          </div>
          <PlaybackControls
            currentIndex={activePlayback.currentIndex}
            total={activeSteps.length}
            progress={activePlayback.progress}
            isPlaying={activePlayback.isPlaying}
            speed={speed}
            onSpeedChange={(value) => setSpeed(value)}
            onPrev={activePlayback.prev}
            onNext={activePlayback.next}
            onTogglePlay={activePlayback.toggle}
            onReset={activePlayback.reset}
            onSeek={activePlayback.setIndex}
          />
        </section>

        <section className={styles.rightArea}>
          <div className={styles.codeWrap}>
            {activeStep ? (
              <CodePanel
                solutionId={activeSolution}
                language={language}
                onLanguageChange={setLanguage}
                step={activeStep}
              />
            ) : null}
          </div>
          <div className={styles.contextWrap}>{activeStep ? <ContextPanel step={activeStep} /> : null}</div>
        </section>
      </main>

      <IdeaModal open={ideaOpen} solutionId={activeSolution} onClose={() => setIdeaOpen(false)} />
      <CommunityFloat />
    </div>
  );
};

import React, { useState } from 'react';
import { getRecommendation } from '../api.js';
import ChatBox from './ChatBox.jsx';

const QUESTIONS = [
  {
    id: 'vc_funding',
    text: 'Are you planning to raise venture capital funding?',
    options: ['Yes', 'No', 'Maybe later'],
  },
  {
    id: 'intl_cofounders',
    text: 'Do any of your co-founders live outside the US?',
    options: ['Yes', 'No', "I'm a solo founder"],
  },
  {
    id: 'equity_count',
    text: 'How many people will own equity?',
    options: ['Just me', '2–5 people', '6 or more'],
  },
  {
    id: 'mission_driven',
    text: 'Is your company built around a specific social or environmental mission?',
    options: ['Yes', 'No'],
  },
  {
    id: 'operations',
    text: 'Where will you primarily operate?',
    options: ['My home state', 'Multiple US states', 'Internationally'],
  },
  {
    id: 'stock_options',
    text: 'Do you plan to offer stock options to employees?',
    options: ['Yes', 'No', 'Not sure yet'],
  },
  {
    id: 'tax_preference',
    text: "What's your tax preference?",
    options: ['Pass income through to my personal return', 'Corporate tax structure is fine'],
  },
  {
    id: 'stage',
    text: "What stage are you at?",
    options: ['Just an idea', 'Pre-revenue', 'Early revenue'],
  },
];

const styles = {
  page: {
    minHeight: '100vh',
    background: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#1E293B',
  },
  topBar: {
    padding: '16px 24px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: 'inherit',
  },
  topBarTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1E293B',
  },
  main: {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '48px 24px 80px',
  },
  progressBarWrap: {
    marginBottom: '40px',
  },
  progressMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#94A3B8',
    marginBottom: '8px',
  },
  progressTrack: {
    height: '6px',
    background: '#E2E8F0',
    borderRadius: '99px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#4F46E5',
    borderRadius: '99px',
    transition: 'width 0.3s ease',
  },
  questionLabel: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: '28px',
    lineHeight: '1.4',
  },
  optionButton: {
    display: 'block',
    width: '100%',
    padding: '16px 20px',
    marginBottom: '12px',
    background: '#F8FAFC',
    border: '2px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#1E293B',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s ease, background 0.15s ease',
  },
  optionButtonSelected: {
    borderColor: '#4F46E5',
    background: '#EEF2FF',
    color: '#4F46E5',
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '24px',
  },
  secondaryButton: {
    padding: '10px 20px',
    background: '#ffffff',
    border: '1px solid #CBD5E1',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748B',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  primaryButton: {
    padding: '10px 24px',
    background: '#4F46E5',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  primaryButtonDisabled: {
    background: '#C7D2FE',
    cursor: 'not-allowed',
  },
  loadingState: {
    textAlign: 'center',
    padding: '60px 0',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #E2E8F0',
    borderTop: '3px solid #4F46E5',
    borderRadius: '50%',
    margin: '0 auto 20px',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: '#64748B',
    fontSize: '16px',
  },
  resultCard: {
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '24px',
  },
  entityBadge: {
    display: 'inline-block',
    background: '#4F46E5',
    color: '#ffffff',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '20px',
    fontWeight: '800',
    marginBottom: '20px',
    letterSpacing: '-0.3px',
  },
  resultExplanation: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: '#334155',
    marginBottom: '24px',
    whiteSpace: 'pre-wrap',
  },
  flagsHeader: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '12px',
  },
  flagItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    fontSize: '14px',
    color: '#334155',
    lineHeight: '1.6',
    marginBottom: '8px',
  },
  flagDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#F59E0B',
    marginTop: '7px',
    flexShrink: '0',
  },
  errorBanner: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    padding: '14px 16px',
    fontSize: '14px',
    color: '#DC2626',
    marginBottom: '20px',
  },
};

function ProgressBar({ current, total }) {
  return (
    <div style={styles.progressBarWrap}>
      <div style={styles.progressMeta}>
        <span>Question {current} of {total}</span>
        <span>{Math.round((current / total) * 100)}% complete</span>
      </div>
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${(current / total) * 100}%` }} />
      </div>
    </div>
  );
}

export default function IncorporationPage({ onBack }) {
  const [step, setStep] = useState(0); // 0-indexed question index
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState('wizard'); // 'wizard' | 'loading' | 'result'
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);

  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  function handleSelect(option) {
    setSelected(option);
  }

  function handleNext() {
    if (!selected) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);

    if (isLast) {
      submitAnswers(newAnswers);
    } else {
      setStep(step + 1);
      setSelected(answers[QUESTIONS[step + 1]?.id] || null);
    }
  }

  function handleBack() {
    if (step === 0) {
      onBack();
    } else {
      setStep(step - 1);
      setSelected(answers[QUESTIONS[step - 1].id] || null);
    }
  }

  async function submitAnswers(finalAnswers) {
    setPhase('loading');
    setError('');
    try {
      const data = await getRecommendation(finalAnswers);
      setResult(data);
      setPhase('result');
    } catch (err) {
      setError('Something went wrong while analyzing your answers. Please try again.');
      setPhase('wizard');
    }
  }

  function handleRetry() {
    setPhase('wizard');
    setStep(0);
    setAnswers({});
    setSelected(null);
    setResult(null);
    setError('');
    setShowChat(false);
  }

  if (phase === 'loading') {
    return (
      <div style={styles.page}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={styles.topBar}>
          <button style={styles.backButton} onClick={onBack}>← Back</button>
          <span style={styles.topBarTitle}>⚖️ Incorporation</span>
        </div>
        <div style={styles.main}>
          <div style={styles.loadingState}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Analysing your answers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result' && result) {
    const entity = result.entity || result.recommendation || result.entity_type || 'Entity Recommendation';
    const explanation = result.explanation || result.summary || result.description || '';
    const considerations = result.considerations || result.flags || result.warnings || [];

    return (
      <div style={styles.page}>
        <div style={styles.topBar}>
          <button style={styles.backButton} onClick={onBack}>← Back</button>
          <span style={styles.topBarTitle}>⚖️ Incorporation</span>
        </div>
        <div style={styles.main}>
          <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>
            Your recommendation is ready
          </h1>
          <p style={{ color: '#64748B', fontSize: '15px', marginBottom: '28px' }}>
            Based on your answers, here's what we suggest.
          </p>

          <div style={styles.resultCard}>
            <div style={styles.entityBadge}>{entity}</div>

            {explanation ? (
              <p style={styles.resultExplanation}>{explanation}</p>
            ) : null}

            {considerations.length > 0 && (
              <>
                <p style={styles.flagsHeader}>Things to know</p>
                {considerations.map((item, i) => (
                  <div key={i} style={styles.flagItem}>
                    <span style={styles.flagDot} />
                    <span>{typeof item === 'string' ? item : item.text || JSON.stringify(item)}</span>
                  </div>
                ))}
              </>
            )}
          </div>

          {!showChat && (
            <button
              style={styles.primaryButton}
              onClick={() => setShowChat(true)}
            >
              Ask follow-up questions
            </button>
          )}

          {showChat && (
            <ChatBox
              module="incorporation"
              context={{ entity, explanation, considerations, answers }}
            />
          )}

          <div style={{ marginTop: '24px' }}>
            <button style={styles.secondaryButton} onClick={handleRetry}>
              Start over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <button style={styles.backButton} onClick={handleBack}>← Back</button>
        <span style={styles.topBarTitle}>⚖️ Incorporation</span>
      </div>
      <div style={styles.main}>
        {error && <div style={styles.errorBanner}>{error}</div>}
        <ProgressBar current={step + 1} total={QUESTIONS.length} />

        <p style={styles.questionLabel}>{question.text}</p>

        {question.options.map((option) => (
          <button
            key={option}
            style={{
              ...styles.optionButton,
              ...(selected === option ? styles.optionButtonSelected : {}),
            }}
            onClick={() => handleSelect(option)}
          >
            {option}
          </button>
        ))}

        <div style={styles.navRow}>
          <button style={styles.secondaryButton} onClick={handleBack}>
            {step === 0 ? 'Cancel' : '← Back'}
          </button>
          <button
            style={{
              ...styles.primaryButton,
              ...(selected ? {} : styles.primaryButtonDisabled),
            }}
            onClick={handleNext}
            disabled={!selected}
          >
            {isLast ? 'Get my recommendation →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}

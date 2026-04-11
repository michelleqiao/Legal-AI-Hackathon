import React, { useState } from 'react';
import { getRecommendation, exportToPdf, generateFilingDoc } from '../api.js';
import ChatBox from './ChatBox.jsx';
import DocumentEditor from './DocumentEditor.jsx';

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

const FILING_FIELDS = [
  {
    id: 'company_name',
    label: 'What will your company be called?',
    placeholder: 'e.g. Acme Technologies Inc.',
    type: 'text',
    hint: 'Must end in Inc., Corp., or LLC',
  },
  {
    id: 'authorized_shares',
    label: 'Number of authorized shares',
    placeholder: '10,000,000',
    type: 'text',
  },
  {
    id: 'incorporator_name',
    label: 'Incorporator name',
    placeholder: 'e.g. Jane Smith',
    type: 'text',
  },
  {
    id: 'incorporator_address',
    label: 'Incorporator address',
    placeholder: 'e.g. 123 Main St, San Francisco, CA 94105',
    type: 'text',
  },
  {
    id: 'registered_agent_name',
    label: 'Registered agent name',
    placeholder: 'e.g. Northwest Registered Agent',
    type: 'text',
    hint: 'Must have a Delaware address',
  },
  {
    id: 'registered_agent_address',
    label: 'Registered agent address',
    placeholder: 'e.g. 8 The Green, Dover, DE 19901',
    type: 'text',
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
  primaryButtonLarge: {
    padding: '12px 28px',
    background: '#4F46E5',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  primaryButtonDisabled: {
    background: '#C7D2FE',
    cursor: 'not-allowed',
  },
  pdfButton: {
    padding: '10px 20px',
    background: '#ffffff',
    border: '2px solid #4F46E5',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4F46E5',
    cursor: 'pointer',
    fontFamily: 'inherit',
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
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  },
  hint: {
    fontSize: '12px',
    color: '#94A3B8',
    marginBottom: '6px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    color: '#1E293B',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  noticeBanner: {
    background: '#FFFBEB',
    border: '1px solid #FDE68A',
    borderRadius: '10px',
    padding: '16px 20px',
    fontSize: '14px',
    color: '#92400E',
    lineHeight: '1.6',
    marginBottom: '24px',
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
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState('wizard'); // 'wizard' | 'loading' | 'result' | 'filing' | 'filing-loading' | 'filing-result'
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');

  // Filing form state
  const [filingValues, setFilingValues] = useState(() =>
    Object.fromEntries(FILING_FIELDS.map((f) => [f.id, '']))
  );
  const [filingLoading, setFilingLoading] = useState(false);
  const [filingError, setFilingError] = useState('');
  const [filingDoc, setFilingDoc] = useState('');

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
    setPdfError('');
  }

  async function handleDownloadPdf(entity, explanation, considerations) {
    setPdfLoading(true);
    setPdfError('');
    try {
      const content = [
        `Recommended Entity: ${entity}`,
        explanation ? `\n\n${explanation}` : '',
        considerations.length > 0
          ? '\n\nThings to Know:\n' + considerations.map((c) => `• ${typeof c === 'string' ? c : c.text || JSON.stringify(c)}`).join('\n')
          : '',
      ].join('');
      const blob = await exportToPdf('Incorporation Recommendation', content);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Incorporation_Recommendation.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setPdfError('PDF export failed. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  }

  function handleFilingChange(id, value) {
    setFilingValues((prev) => ({ ...prev, [id]: value }));
  }

  function isFilingFormValid() {
    return FILING_FIELDS.every((f) => filingValues[f.id]?.trim());
  }

  async function handleFilingSubmit(e) {
    e.preventDefault();
    if (!isFilingFormValid()) return;
    setFilingLoading(true);
    setFilingError('');
    try {
      const entity = result
        ? result.entity || result.recommendation || result.entity_type || 'C-Corp'
        : 'C-Corp';
      const data = await generateFilingDoc(entity, 'Delaware', filingValues);
      const text = data.document || data.content || data.draft || JSON.stringify(data, null, 2);
      setFilingDoc(text);
      setPhase('filing-result');
    } catch (err) {
      setFilingError('Something went wrong generating your filing documents. Please try again.');
    } finally {
      setFilingLoading(false);
    }
  }

  // Filing loading screen
  if (filingLoading) {
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
            <p style={styles.loadingText}>Generating your filing documents...</p>
          </div>
        </div>
      </div>
    );
  }

  // Filing result screen
  if (phase === 'filing-result' && filingDoc) {
    return (
      <div style={styles.page}>
        <div style={styles.topBar}>
          <button style={styles.backButton} onClick={onBack}>← Back</button>
          <span style={styles.topBarTitle}>⚖️ Incorporation — Filing Documents</span>
        </div>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>
            Your filing documents are ready
          </h1>
          <p style={{ color: '#64748B', fontSize: '15px', marginBottom: '24px' }}>
            Review, edit, and download your incorporation documents below.
          </p>

          <div style={styles.noticeBanner}>
            ⚠️ This document is ready to review. Once you're satisfied, download it and submit it to the Delaware Division of Corporations at{' '}
            <a href="https://corp.delaware.gov" target="_blank" rel="noopener noreferrer" style={{ color: '#92400E', fontWeight: '700' }}>
              corp.delaware.gov
            </a>
            . Filing fee: $89.
          </div>

          <DocumentEditor content={filingDoc} title="Certificate of Incorporation" />

          <div style={{ marginTop: '20px' }}>
            <button
              style={styles.secondaryButton}
              onClick={() => { setPhase('result'); setFilingDoc(''); }}
            >
              ← Back to recommendation
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filing form screen
  if (phase === 'filing') {
    return (
      <div style={styles.page}>
        <div style={styles.topBar}>
          <button style={styles.backButton} onClick={() => setPhase('result')}>← Back</button>
          <span style={styles.topBarTitle}>⚖️ Incorporation — File My Company</span>
        </div>
        <div style={styles.main}>
          <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>
            File My Company
          </h1>
          <p style={{ color: '#64748B', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>
            Provide the details below to generate your incorporation documents. We'll create a Delaware Certificate of Incorporation ready to file.
          </p>

          {filingError && <div style={styles.errorBanner}>{filingError}</div>}

          <form onSubmit={handleFilingSubmit}>
            {FILING_FIELDS.map((field) => (
              <div key={field.id} style={styles.formGroup}>
                <label style={styles.label} htmlFor={field.id}>
                  {field.label}
                </label>
                {field.hint && (
                  <span style={styles.hint}>{field.hint}</span>
                )}
                <input
                  id={field.id}
                  type="text"
                  style={styles.input}
                  placeholder={field.placeholder}
                  value={filingValues[field.id]}
                  onChange={(e) => handleFilingChange(field.id, e.target.value)}
                />
              </div>
            ))}

            <button
              type="submit"
              style={{
                ...styles.primaryButtonLarge,
                ...(isFilingFormValid() ? {} : styles.primaryButtonDisabled),
              }}
              disabled={!isFilingFormValid()}
            >
              Generate My Filing Documents →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Loading screen (recommendation)
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

  // Result screen (recommendation)
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

          {pdfError && <div style={styles.errorBanner}>{pdfError}</div>}

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
            {!showChat && (
              <button style={styles.primaryButton} onClick={() => setShowChat(true)}>
                Ask follow-up questions
              </button>
            )}
            <button
              style={{ ...styles.pdfButton, opacity: pdfLoading ? 0.6 : 1, cursor: pdfLoading ? 'not-allowed' : 'pointer' }}
              onClick={() => handleDownloadPdf(entity, explanation, considerations)}
              disabled={pdfLoading}
            >
              {pdfLoading ? 'Exporting...' : '⬇ Download PDF'}
            </button>
          </div>

          {showChat && (
            <ChatBox
              module="incorporation"
              context={{ entity, explanation, considerations, answers }}
            />
          )}

          {/* File My Company button */}
          <div style={{
            marginTop: '28px',
            padding: '24px',
            background: '#EEF2FF',
            border: '1px solid #C7D2FE',
            borderRadius: '12px',
          }}>
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#3730A3', marginBottom: '6px' }}>
              Ready to make it official?
            </p>
            <p style={{ fontSize: '14px', color: '#4338CA', marginBottom: '16px', lineHeight: '1.5' }}>
              Generate your Delaware Certificate of Incorporation and get ready to file.
            </p>
            <button
              style={styles.primaryButtonLarge}
              onClick={() => setPhase('filing')}
            >
              File My Company →
            </button>
          </div>

          <div style={{ marginTop: '24px' }}>
            <button style={styles.secondaryButton} onClick={handleRetry}>
              Start over
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Wizard
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

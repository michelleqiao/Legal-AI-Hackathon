import React, { useState } from 'react';
import { getPatentGuidance } from '../api.js';
import ChatBox from './ChatBox.jsx';

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
    fontFamily: 'inherit',
  },
  topBarTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1E293B',
  },
  main: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '48px 24px 80px',
  },
  pageTitle: {
    fontSize: '26px',
    fontWeight: '800',
    marginBottom: '8px',
  },
  pageSubtitle: {
    color: '#64748B',
    fontSize: '15px',
    marginBottom: '28px',
    lineHeight: '1.6',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '10px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    color: '#1E293B',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '160px',
    boxSizing: 'border-box',
    lineHeight: '1.6',
  },
  charCount: {
    fontSize: '12px',
    color: '#94A3B8',
    textAlign: 'right',
    marginTop: '4px',
    marginBottom: '20px',
  },
  primaryButton: {
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
  resultSection: {
    marginBottom: '28px',
  },
  sectionCard: {
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '12px',
  },
  protectionTypeBadge: {
    display: 'inline-block',
    background: '#4F46E5',
    color: '#ffffff',
    borderRadius: '8px',
    padding: '8px 16px',
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '12px',
  },
  bodyText: {
    fontSize: '14px',
    lineHeight: '1.7',
    color: '#334155',
    whiteSpace: 'pre-wrap',
  },
  stepList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  stepItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    fontSize: '14px',
    color: '#334155',
    lineHeight: '1.6',
  },
  stepNumber: {
    minWidth: '24px',
    height: '24px',
    background: '#4F46E5',
    color: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    flexShrink: '0',
    marginTop: '1px',
  },
  warningItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    fontSize: '14px',
    color: '#92400E',
    lineHeight: '1.6',
    background: '#FFFBEB',
    border: '1px solid #FDE68A',
    borderRadius: '8px',
    padding: '12px 14px',
    marginBottom: '8px',
  },
  warningIcon: {
    fontSize: '16px',
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
    marginTop: '16px',
  },
};

export default function PatentsPage({ onBack }) {
  const [description, setDescription] = useState('');
  const [phase, setPhase] = useState('form'); // 'form' | 'loading' | 'result'
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);

  const MIN_LENGTH = 30;
  const canSubmit = description.trim().length >= MIN_LENGTH;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setPhase('loading');
    setError('');
    try {
      const data = await getPatentGuidance(description.trim());
      setResult(data);
      setPhase('result');
    } catch (err) {
      setError('Something went wrong analyzing your description. Please try again.');
      setPhase('form');
    }
  }

  function handleReset() {
    setPhase('form');
    setDescription('');
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
          <span style={styles.topBarTitle}>💡 Patents & IP</span>
        </div>
        <div style={styles.main}>
          <div style={styles.loadingState}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Analysing your IP description...</p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result' && result) {
    const protectionType = result.protection_type || result.ip_type || result.type || 'IP Protection';
    const explanation = result.explanation || result.summary || result.description || '';
    const steps = Array.isArray(result.next_steps || result.steps)
      ? (result.next_steps || result.steps)
      : typeof (result.next_steps || result.steps) === 'string'
        ? (result.next_steps || result.steps).split('\n').filter(Boolean)
        : [];
    const warnings = Array.isArray(result.warnings || result.key_warnings)
      ? (result.warnings || result.key_warnings)
      : typeof (result.warnings || result.key_warnings) === 'string'
        ? (result.warnings || result.key_warnings).split('\n').filter(Boolean)
        : [];

    return (
      <div style={styles.page}>
        <div style={styles.topBar}>
          <button style={styles.backButton} onClick={onBack}>← Back</button>
          <span style={styles.topBarTitle}>💡 Patents & IP</span>
        </div>
        <div style={styles.main}>
          <h1 style={styles.pageTitle}>Your IP guidance is ready</h1>
          <p style={{ color: '#64748B', fontSize: '15px', marginBottom: '28px' }}>
            Based on your description, here's what we recommend.
          </p>

          <div style={styles.sectionCard}>
            <p style={styles.sectionTitle}>Recommended IP protection</p>
            <div style={styles.protectionTypeBadge}>{protectionType}</div>
            {explanation ? <p style={styles.bodyText}>{explanation}</p> : null}
          </div>

          {steps.length > 0 && (
            <div style={styles.sectionCard}>
              <p style={styles.sectionTitle}>Recommended next steps</p>
              <ol style={styles.stepList}>
                {steps.map((step, i) => (
                  <li key={i} style={styles.stepItem}>
                    <span style={styles.stepNumber}>{i + 1}</span>
                    <span>{typeof step === 'string' ? step : step.text || JSON.stringify(step)}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {warnings.length > 0 && (
            <div>
              <p style={{ ...styles.sectionTitle, marginBottom: '12px' }}>Key warnings</p>
              {warnings.map((w, i) => (
                <div key={i} style={styles.warningItem}>
                  <span style={styles.warningIcon}>⚠️</span>
                  <span>{typeof w === 'string' ? w : w.text || JSON.stringify(w)}</span>
                </div>
              ))}
            </div>
          )}

          {!showChat && (
            <button style={{ ...styles.primaryButton, marginTop: '8px' }} onClick={() => setShowChat(true)}>
              Ask follow-up questions
            </button>
          )}

          {showChat && (
            <ChatBox
              module="patents"
              context={{ protectionType, explanation, steps, warnings, description }}
            />
          )}

          <div>
            <button style={styles.secondaryButton} onClick={handleReset}>
              Analyse a different invention
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <button style={styles.backButton} onClick={onBack}>← Back</button>
        <span style={styles.topBarTitle}>💡 Patents & IP</span>
      </div>
      <div style={styles.main}>
        <h1 style={styles.pageTitle}>💡 Patents & IP</h1>
        <p style={styles.pageSubtitle}>
          Describe your invention, creative work, or business method in plain English.
          We'll tell you what type of IP protection applies and what to do next.
        </p>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label} htmlFor="description">
            Describe your invention or creative work
          </label>
          <textarea
            id="description"
            style={styles.textarea}
            placeholder="e.g. I've built a mobile app that uses machine learning to predict when household appliances will fail before they break down. The core algorithm is original and I wrote all the code myself..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p style={styles.charCount}>
            {description.length} characters
            {description.length > 0 && description.length < MIN_LENGTH
              ? ` — please add a bit more detail (${MIN_LENGTH - description.length} more characters needed)`
              : ''}
          </p>

          <button
            type="submit"
            style={{
              ...styles.primaryButton,
              ...(canSubmit ? {} : styles.primaryButtonDisabled),
            }}
            disabled={!canSubmit}
          >
            Get IP guidance →
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { generateTermsheet } from '../api.js';
import ChatBox from './ChatBox.jsx';

const FIELDS = [
  {
    id: 'funding_stage',
    label: 'Funding stage',
    type: 'select',
    options: ['Pre-seed', 'Seed', 'Series A'],
  },
  {
    id: 'amount_raising',
    label: 'Amount raising',
    placeholder: 'e.g. $500,000 or $2,000,000',
    type: 'text',
  },
  {
    id: 'pre_money_valuation',
    label: 'Pre-money valuation',
    placeholder: 'e.g. $5,000,000 or "not yet determined"',
    type: 'text',
  },
  {
    id: 'investor_type',
    label: 'Investor type',
    type: 'select',
    options: ['Angels', 'Venture capitalists (VCs)', 'Both angels and VCs', 'Strategic / corporate investors'],
  },
  {
    id: 'instrument_type',
    label: 'Investment instrument',
    type: 'select',
    options: ['SAFE (Simple Agreement for Future Equity)', 'Convertible note', 'Priced round (equity)'],
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
    marginBottom: '36px',
    lineHeight: '1.6',
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
  select: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    color: '#1E293B',
    outline: 'none',
    fontFamily: 'inherit',
    background: '#ffffff',
    boxSizing: 'border-box',
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
    marginBottom: '14px',
  },
  termsheetBox: {
    whiteSpace: 'pre-wrap',
    fontSize: '13.5px',
    lineHeight: '1.75',
    color: '#334155',
    fontFamily: '"SF Mono", "Fira Code", "Courier New", monospace',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  clauseItem: {
    borderBottom: '1px solid #E2E8F0',
    paddingBottom: '16px',
    marginBottom: '16px',
  },
  clauseTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: '4px',
  },
  clauseExplanation: {
    fontSize: '13.5px',
    lineHeight: '1.6',
    color: '#64748B',
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

export default function FundraisingPage({ onBack }) {
  const [formValues, setFormValues] = useState(
    Object.fromEntries(FIELDS.map((f) => [f.id, '']))
  );
  const [phase, setPhase] = useState('form'); // 'form' | 'loading' | 'result'
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);

  function handleChange(id, value) {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  }

  function isFormValid() {
    return FIELDS.every((f) => formValues[f.id]?.trim());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isFormValid()) return;
    setPhase('loading');
    setError('');
    try {
      const data = await generateTermsheet(formValues);
      setResult(data);
      setPhase('result');
    } catch (err) {
      setError('Something went wrong generating your term sheet. Please try again.');
      setPhase('form');
    }
  }

  function handleReset() {
    setPhase('form');
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
          <span style={styles.topBarTitle}>💰 Fundraising</span>
        </div>
        <div style={styles.main}>
          <div style={styles.loadingState}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Generating your term sheet...</p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result' && result) {
    const termsheet = result.term_sheet || result.termsheet || result.summary || result.content || '';
    const clauses = Array.isArray(result.clauses || result.explanations)
      ? (result.clauses || result.explanations)
      : [];

    return (
      <div style={styles.page}>
        <div style={styles.topBar}>
          <button style={styles.backButton} onClick={onBack}>← Back</button>
          <span style={styles.topBarTitle}>💰 Fundraising</span>
        </div>
        <div style={styles.main}>
          <h1 style={styles.pageTitle}>Your term sheet is ready</h1>
          <p style={{ color: '#64748B', fontSize: '15px', marginBottom: '28px' }}>
            Review the summary and plain-English explanations below. Ask follow-up questions to explore scenarios.
          </p>

          <div style={styles.sectionCard}>
            <p style={styles.sectionTitle}>Term sheet summary</p>
            {termsheet ? (
              <div style={styles.termsheetBox}>{termsheet}</div>
            ) : (
              <p style={{ color: '#94A3B8', fontSize: '14px' }}>No summary returned.</p>
            )}
          </div>

          {clauses.length > 0 && (
            <div style={styles.sectionCard}>
              <p style={styles.sectionTitle}>Plain-English clause explanations</p>
              {clauses.map((clause, i) => (
                <div key={i} style={{ ...styles.clauseItem, ...(i === clauses.length - 1 ? { borderBottom: 'none', marginBottom: 0 } : {}) }}>
                  <p style={styles.clauseTitle}>
                    {typeof clause === 'string'
                      ? `Clause ${i + 1}`
                      : clause.title || clause.name || `Clause ${i + 1}`}
                  </p>
                  <p style={styles.clauseExplanation}>
                    {typeof clause === 'string'
                      ? clause
                      : clause.explanation || clause.description || clause.text || JSON.stringify(clause)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!showChat && (
            <button style={styles.primaryButton} onClick={() => setShowChat(true)}>
              Ask follow-up questions
            </button>
          )}

          {showChat && (
            <ChatBox
              module="fundraising"
              context={{ termsheet, clauses, details: formValues }}
            />
          )}

          <div>
            <button style={styles.secondaryButton} onClick={handleReset}>
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
        <button style={styles.backButton} onClick={onBack}>← Back</button>
        <span style={styles.topBarTitle}>💰 Fundraising</span>
      </div>
      <div style={styles.main}>
        <h1 style={styles.pageTitle}>💰 Fundraising</h1>
        <p style={styles.pageSubtitle}>
          Tell us about your round and we'll generate a term sheet summary with plain-English
          explanations of every clause — so you know what you're signing.
        </p>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {FIELDS.map((field) => (
            <div key={field.id} style={styles.formGroup}>
              <label style={styles.label} htmlFor={field.id}>
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  id={field.id}
                  style={styles.select}
                  value={formValues[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                >
                  <option value="">Select an option...</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.id}
                  type="text"
                  style={styles.input}
                  placeholder={field.placeholder}
                  value={formValues[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            style={{
              ...styles.primaryButton,
              ...(isFormValid() ? {} : styles.primaryButtonDisabled),
            }}
            disabled={!isFormValid()}
          >
            Generate term sheet →
          </button>
        </form>
      </div>
    </div>
  );
}

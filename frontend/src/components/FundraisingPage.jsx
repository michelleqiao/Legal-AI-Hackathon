import React, { useState } from 'react';
import { generateTermsheet, exportToPdf } from '../api.js';
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
    background: 'var(--lf-cream)',
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--lf-text)',
  },
  topBar: {
    background: 'var(--lf-white)',
    borderBottom: '1px solid var(--lf-border)',
    padding: '18px 40px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: 'var(--lf-text-muted)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontFamily: "'DM Sans', sans-serif",
  },
  topBarTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--lf-navy)',
  },
  main: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '48px 40px 80px',
  },
  pageTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: '28px',
    fontWeight: '600',
    color: 'var(--lf-navy)',
    marginBottom: '8px',
  },
  pageSubtitle: {
    color: 'var(--lf-text-muted)',
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
    fontWeight: '500',
    color: 'var(--lf-text)',
    marginBottom: '6px',
    fontFamily: "'DM Sans', sans-serif",
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid rgba(15,26,46,0.15)',
    background: 'var(--lf-white)',
    fontSize: '14px',
    color: 'var(--lf-text)',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid rgba(15,26,46,0.15)',
    fontSize: '14px',
    color: 'var(--lf-text)',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    background: 'var(--lf-white)',
    boxSizing: 'border-box',
  },
  primaryButton: {
    padding: '12px 28px',
    background: 'var(--lf-navy)',
    border: 'none',
    fontSize: '15px',
    fontWeight: '500',
    color: 'var(--lf-cream)',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  primaryButtonDisabled: {
    background: 'rgba(15,26,46,0.25)',
    cursor: 'not-allowed',
  },
  pdfButton: {
    padding: '10px 20px',
    background: 'none',
    border: '1px solid var(--lf-navy)',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--lf-navy)',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  loadingState: {
    textAlign: 'center',
    padding: '60px 0',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(15,26,46,0.08)',
    borderTop: '3px solid var(--lf-warm)',
    borderRadius: '50%',
    margin: '0 auto 20px',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    color: 'var(--lf-text-muted)',
    fontSize: '16px',
  },
  sectionCard: {
    background: 'var(--lf-white)',
    border: '1px solid var(--lf-border)',
    padding: '24px',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: '500',
    color: 'var(--lf-warm)',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: '14px',
    fontFamily: "'DM Sans', sans-serif",
  },
  termsheetBox: {
    whiteSpace: 'pre-wrap',
    fontSize: '13.5px',
    lineHeight: '1.75',
    color: 'var(--lf-text)',
    fontFamily: "'DM Sans', sans-serif",
    maxHeight: '400px',
    overflowY: 'auto',
  },
  clauseItem: {
    borderBottom: '1px solid var(--lf-border)',
    paddingBottom: '16px',
    marginBottom: '16px',
  },
  clauseTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--lf-navy)',
    marginBottom: '4px',
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  clauseExplanation: {
    fontSize: '13.5px',
    lineHeight: '1.6',
    color: 'var(--lf-text-muted)',
  },
  errorBanner: {
    borderLeft: '3px solid var(--lf-red-soft)',
    background: '#FEF2F2',
    padding: '14px 16px',
    fontSize: '14px',
    color: '#DC2626',
    marginBottom: '20px',
  },
  secondaryButton: {
    padding: '10px 20px',
    background: 'none',
    border: '1px solid rgba(15,26,46,0.2)',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--lf-text-muted)',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
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
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');

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
      const payload = {
        stage: formValues.funding_stage,
        amount: formValues.amount_raising,
        valuation: formValues.pre_money_valuation,
        investor_type: formValues.investor_type,
        instrument: formValues.instrument_type,
      };
      const data = await generateTermsheet(payload);
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
    setPdfError('');
  }

  async function handleDownloadPdf(termsheet, clauses) {
    setPdfLoading(true);
    setPdfError('');
    try {
      const content = [
        termsheet,
        clauses.length > 0
          ? '\n\nCLAUSE EXPLANATIONS\n' + clauses.map((c, i) =>
              `\n${c.clause || `Clause ${i + 1}`}\n${c.explanation || c.description || c.text || ''}`
            ).join('\n')
          : '',
      ].join('');
      const blob = await exportToPdf('Term Sheet', content);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Term_Sheet.pdf';
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
    const clauses = Array.isArray(result.clause_explanations)
      ? result.clause_explanations
      : [];

    return (
      <div style={styles.page}>
        <div style={styles.topBar}>
          <button style={styles.backButton} onClick={onBack}>← Back</button>
          <span style={styles.topBarTitle}>💰 Fundraising</span>
        </div>
        <div style={styles.main}>
          <h1 style={styles.pageTitle}>Your term sheet is ready</h1>
          <p style={{ color: 'var(--lf-text-muted)', fontSize: '15px', marginBottom: '28px' }}>
            Review the summary and plain-English explanations below. Ask follow-up questions to explore scenarios.
          </p>

          <div style={styles.sectionCard}>
            <p style={styles.sectionTitle}>Term sheet summary</p>
            {termsheet ? (
              <div style={styles.termsheetBox}>{termsheet}</div>
            ) : (
              <p style={{ color: 'var(--lf-text-muted)', fontSize: '14px' }}>No summary returned.</p>
            )}
          </div>

          {clauses.length > 0 && (
            <div style={styles.sectionCard}>
              <p style={styles.sectionTitle}>Plain-English clause explanations</p>
              {clauses.map((clause, i) => (
                <div key={i} style={{ ...styles.clauseItem, ...(i === clauses.length - 1 ? { borderBottom: 'none', paddingBottom: 0, marginBottom: 0 } : {}) }}>
                  <p style={styles.clauseTitle}>
                    {typeof clause === 'string'
                      ? `Clause ${i + 1}`
                      : clause.clause || `Clause ${i + 1}`}
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

          {pdfError && (
            <div style={styles.errorBanner}>{pdfError}</div>
          )}

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            {!showChat && (
              <button style={styles.primaryButton} onClick={() => setShowChat(true)}>
                Ask follow-up questions
              </button>
            )}
            <button
              style={{ ...styles.pdfButton, opacity: pdfLoading ? 0.6 : 1, cursor: pdfLoading ? 'not-allowed' : 'pointer' }}
              onClick={() => handleDownloadPdf(termsheet, clauses)}
              disabled={pdfLoading}
            >
              {pdfLoading ? 'Exporting...' : '⬇ Download PDF'}
            </button>
          </div>

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

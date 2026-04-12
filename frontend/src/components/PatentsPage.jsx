import React, { useState } from 'react';
import { getPatentGuidance, exportToPdf, generatePatentApp } from '../api.js';
import ChatBox from './ChatBox.jsx';
import DocumentEditor from './DocumentEditor.jsx';

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
    marginBottom: '28px',
    lineHeight: '1.6',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--lf-text)',
    marginBottom: '8px',
    fontFamily: "'DM Sans', sans-serif",
  },
  labelLarge: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--lf-text)',
    marginBottom: '8px',
    lineHeight: '1.4',
    fontFamily: "'DM Sans', sans-serif",
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid rgba(15,26,46,0.15)',
    background: 'var(--lf-white)',
    fontSize: '14px',
    color: 'var(--lf-text)',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    resize: 'vertical',
    minHeight: '160px',
    boxSizing: 'border-box',
    lineHeight: '1.6',
  },
  textareaLarge: {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid rgba(15,26,46,0.15)',
    background: 'var(--lf-white)',
    fontSize: '14px',
    color: 'var(--lf-text)',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    resize: 'vertical',
    minHeight: '220px',
    boxSizing: 'border-box',
    lineHeight: '1.6',
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
  charCount: {
    fontSize: '12px',
    color: 'var(--lf-text-muted)',
    textAlign: 'right',
    marginTop: '4px',
    marginBottom: '20px',
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
  resultSection: {
    marginBottom: '28px',
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
    marginBottom: '12px',
    fontFamily: "'DM Sans', sans-serif",
  },
  protectionTypeBadge: {
    display: 'inline-block',
    background: 'var(--lf-navy)',
    color: 'var(--lf-cream)',
    padding: '8px 16px',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px',
  },
  bodyText: {
    fontSize: '14px',
    lineHeight: '1.7',
    color: 'var(--lf-text)',
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
    color: 'var(--lf-text)',
    lineHeight: '1.6',
  },
  stepNumber: {
    minWidth: '24px',
    height: '24px',
    background: 'var(--lf-navy)',
    color: 'var(--lf-cream)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
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
    borderLeft: '3px solid var(--lf-amber-soft)',
    padding: '12px 14px',
    marginBottom: '8px',
  },
  warningIcon: {
    fontSize: '16px',
    flexShrink: '0',
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
  formGroup: {
    marginBottom: '20px',
  },
  inventorRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
    alignItems: 'flex-start',
  },
  removeBtn: {
    padding: '8px 12px',
    background: '#FEF2F2',
    border: '1px solid rgba(220,38,38,0.3)',
    color: '#DC2626',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    flexShrink: 0,
    marginTop: '0',
  },
  addBtn: {
    padding: '8px 16px',
    background: 'none',
    border: '1px solid rgba(15,26,46,0.2)',
    color: 'var(--lf-text-muted)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  noticeBanner: {
    borderLeft: '3px solid var(--lf-amber-soft)',
    background: '#FFFBEB',
    padding: '16px 20px',
    fontSize: '14px',
    color: '#92400E',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
};

export default function PatentsPage({ onBack }) {
  const [description, setDescription] = useState('');
  const [phase, setPhase] = useState('form'); // 'form' | 'loading' | 'result' | 'filing' | 'filing-loading' | 'filing-result'
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');

  // Filing form state
  const [inventionTitle, setInventionTitle] = useState('');
  const [inventionDesc, setInventionDesc] = useState('');
  const [inventors, setInventors] = useState([{ name: '', address: '' }]);
  const [priorArt, setPriorArt] = useState('');
  const [filingError, setFilingError] = useState('');
  const [filingDoc, setFilingDoc] = useState('');

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
    setPdfError('');
  }

  async function handleDownloadPdf(protectionType, explanation, steps, warnings) {
    setPdfLoading(true);
    setPdfError('');
    try {
      const content = [
        `Recommended IP Protection: ${protectionType}`,
        explanation ? `\n\n${explanation}` : '',
        steps.length > 0
          ? '\n\nNext Steps:\n' + steps.map((s, i) => `${i + 1}. ${typeof s === 'string' ? s : s.text || ''}`).join('\n')
          : '',
        warnings.length > 0
          ? '\n\nKey Warnings:\n' + warnings.map((w) => `• ${typeof w === 'string' ? w : w.text || ''}`).join('\n')
          : '',
      ].join('');
      const blob = await exportToPdf('IP Guidance', content);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'IP_Guidance.pdf';
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

  // Inventor helpers
  function addInventor() {
    setInventors((prev) => [...prev, { name: '', address: '' }]);
  }

  function removeInventor(i) {
    setInventors((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateInventor(i, field, value) {
    setInventors((prev) => prev.map((inv, idx) => idx === i ? { ...inv, [field]: value } : inv));
  }

  function isFilingValid() {
    return (
      inventionTitle.trim() &&
      inventionDesc.trim().length >= 50 &&
      inventors.every((inv) => inv.name.trim() && inv.address.trim()) &&
      priorArt
    );
  }

  async function handleFilingSubmit(e) {
    e.preventDefault();
    if (!isFilingValid()) return;
    setPhase('filing-loading');
    setFilingError('');
    try {
      const filingDetails = {
        invention_title: inventionTitle,
        description: inventionDesc,
        inventors,
        prior_art_search: priorArt,
      };
      const data = await generatePatentApp(result, filingDetails);
      const text = data.document || data.content || data.application || JSON.stringify(data, null, 2);
      setFilingDoc(text);
      setPhase('filing-result');
    } catch (err) {
      setFilingError('Something went wrong generating your patent application. Please try again.');
      setPhase('filing');
    }
  }

  // Filing loading
  if (phase === 'filing-loading') {
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
            <p style={styles.loadingText}>Generating your patent application...</p>
          </div>
        </div>
      </div>
    );
  }

  // Filing result
  if (phase === 'filing-result' && filingDoc) {
    return (
      <div style={styles.page}>
        <div style={styles.topBar}>
          <button style={styles.backButton} onClick={onBack}>← Back</button>
          <span style={styles.topBarTitle}>💡 Patents & IP — Patent Application</span>
        </div>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 40px 80px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: '600', color: 'var(--lf-navy)', marginBottom: '8px' }}>
            Your patent application is ready
          </h1>
          <p style={{ color: 'var(--lf-text-muted)', fontSize: '15px', marginBottom: '24px' }}>
            Review, edit, and download your provisional patent application below.
          </p>

          <div style={styles.noticeBanner}>
            ⚠️ This is a Provisional Patent Application template. Review carefully, then file at{' '}
            <a href="https://USPTO.gov" target="_blank" rel="noopener noreferrer" style={{ color: '#92400E', fontWeight: '700' }}>
              USPTO.gov
            </a>
            . Filing fee: ~$320 for micro entities.
          </div>

          <DocumentEditor content={filingDoc} title={`Patent Application — ${inventionTitle}`} />

          <div style={{ marginTop: '20px' }}>
            <button
              style={styles.secondaryButton}
              onClick={() => { setPhase('result'); setFilingDoc(''); }}
            >
              ← Back to IP guidance
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filing form
  if (phase === 'filing') {
    return (
      <div style={styles.page}>
        <div style={styles.topBar}>
          <button style={styles.backButton} onClick={() => setPhase('result')}>← Back</button>
          <span style={styles.topBarTitle}>💡 Patents & IP — Start Filing</span>
        </div>
        <div style={styles.main}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px', fontWeight: '600', color: 'var(--lf-navy)', marginBottom: '8px' }}>
            Start My Patent Filing
          </h1>
          <p style={{ color: 'var(--lf-text-muted)', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>
            Provide the details below to generate a Provisional Patent Application.
          </p>

          {filingError && <div style={styles.errorBanner}>{filingError}</div>}

          <form onSubmit={handleFilingSubmit}>
            {/* Invention title */}
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="invention-title">
                Invention title
              </label>
              <input
                id="invention-title"
                type="text"
                style={styles.input}
                placeholder="e.g. Smart Appliance Failure Prediction System"
                value={inventionTitle}
                onChange={(e) => setInventionTitle(e.target.value)}
              />
            </div>

            {/* Full description */}
            <div style={styles.formGroup}>
              <label style={styles.labelLarge} htmlFor="invention-desc">
                Describe exactly how your invention works, what makes it new, and what problem it solves
              </label>
              <textarea
                id="invention-desc"
                style={styles.textareaLarge}
                placeholder="Describe the invention in detail — how it works technically, what existing solutions it improves on, and what specific problem it addresses..."
                value={inventionDesc}
                onChange={(e) => setInventionDesc(e.target.value)}
              />
              <p style={styles.charCount}>{inventionDesc.length} characters{inventionDesc.length > 0 && inventionDesc.length < 50 ? ` — please add more detail (${50 - inventionDesc.length} more characters needed)` : ''}</p>
            </div>

            {/* Inventors */}
            <div style={styles.formGroup}>
              <label style={styles.label}>List of inventors</label>
              {inventors.map((inv, i) => (
                <div key={i} style={styles.inventorRow}>
                  <div style={{ flex: 1, display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      style={{ ...styles.input, flex: 1 }}
                      placeholder="Full name"
                      value={inv.name}
                      onChange={(e) => updateInventor(i, 'name', e.target.value)}
                    />
                    <input
                      type="text"
                      style={{ ...styles.input, flex: 2 }}
                      placeholder="Address"
                      value={inv.address}
                      onChange={(e) => updateInventor(i, 'address', e.target.value)}
                    />
                  </div>
                  {inventors.length > 1 && (
                    <button
                      type="button"
                      style={styles.removeBtn}
                      onClick={() => removeInventor(i)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" style={styles.addBtn} onClick={addInventor}>
                + Add inventor
              </button>
            </div>

            {/* Prior art */}
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="prior-art">
                Prior art search done?
              </label>
              <select
                id="prior-art"
                style={styles.select}
                value={priorArt}
                onChange={(e) => setPriorArt(e.target.value)}
              >
                <option value="">Select an option...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="In progress">In progress</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                ...styles.primaryButton,
                ...(isFilingValid() ? {} : styles.primaryButtonDisabled),
              }}
              disabled={!isFilingValid()}
            >
              Generate Patent Application →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Guidance loading
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

  // Guidance result
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
          <p style={{ color: 'var(--lf-text-muted)', fontSize: '15px', marginBottom: '28px' }}>
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

          {pdfError && <div style={styles.errorBanner}>{pdfError}</div>}

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginTop: '8px' }}>
            {!showChat && (
              <button style={styles.primaryButton} onClick={() => setShowChat(true)}>
                Ask follow-up questions
              </button>
            )}
            <button
              style={{ ...styles.pdfButton, opacity: pdfLoading ? 0.6 : 1, cursor: pdfLoading ? 'not-allowed' : 'pointer' }}
              onClick={() => handleDownloadPdf(protectionType, explanation, steps, warnings)}
              disabled={pdfLoading}
            >
              {pdfLoading ? 'Exporting...' : '⬇ Download PDF'}
            </button>
          </div>

          {showChat && (
            <ChatBox
              module="patents"
              context={{ protectionType, explanation, steps, warnings, description }}
            />
          )}

          {/* Start Filing button */}
          <div style={{
            marginTop: '28px',
            padding: '24px',
            background: 'var(--lf-navy)',
            color: 'var(--lf-cream)',
          }}>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '15px', fontWeight: '600', color: 'var(--lf-cream)', marginBottom: '6px' }}>
              Ready to file?
            </p>
            <p style={{ fontSize: '14px', color: 'rgba(247,245,240,0.75)', marginBottom: '16px', lineHeight: '1.5' }}>
              Generate a Provisional Patent Application to establish your priority date at the USPTO.
            </p>
            <button
              style={styles.primaryButton}
              onClick={() => setPhase('filing')}
            >
              Start My Filing →
            </button>
          </div>

          <div>
            <button style={styles.secondaryButton} onClick={handleReset}>
              Analyse a different invention
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Initial form
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

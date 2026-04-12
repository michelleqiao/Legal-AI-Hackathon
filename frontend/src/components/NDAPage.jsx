import React, { useState } from 'react';
import DocumentEditor from './DocumentEditor.jsx';
import ChatBox from './ChatBox.jsx';
import { draftAgreement } from '../api.js';

const NDA_QUESTIONS = [
  {
    id: 'nda_type',
    label: 'What type of NDA do you need?',
    type: 'select',
    options: [
      { value: 'mutual', label: 'Mutual NDA — both parties share confidential info' },
      { value: 'one_way', label: 'One-Way NDA — only one party shares confidential info' },
    ],
    help: 'Mutual NDAs are common for partnership discussions. One-way NDAs are typical when pitching to investors or sharing a prototype.',
  },
  {
    id: 'disclosing_party',
    label: 'Disclosing party name (your company or your name)',
    type: 'text',
    placeholder: 'e.g. Legal Foundry Inc.',
    help: 'The party sharing confidential information.',
  },
  {
    id: 'receiving_party',
    label: 'Receiving party name',
    type: 'text',
    placeholder: 'e.g. Acme Corp',
    help: 'The party receiving and agreeing to protect the confidential information.',
  },
  {
    id: 'purpose',
    label: 'What is the purpose of sharing this information?',
    type: 'text',
    placeholder: 'e.g. Exploring a potential business partnership, investor due diligence, vendor evaluation',
    help: 'This defines the permitted use of the confidential information.',
  },
  {
    id: 'confidential_info',
    label: 'What types of confidential information will be shared?',
    type: 'textarea',
    placeholder: 'e.g. Business plans, source code, financial projections, customer lists, trade secrets, product roadmap',
    help: 'Be specific — vague descriptions can make the NDA harder to enforce.',
  },
  {
    id: 'duration_years',
    label: 'How long should the confidentiality obligation last?',
    type: 'select',
    options: [
      { value: '1', label: '1 year' },
      { value: '2', label: '2 years' },
      { value: '3', label: '3 years (most common)' },
      { value: '5', label: '5 years' },
      { value: 'indefinite', label: 'Indefinite (trade secrets only)' },
    ],
  },
  {
    id: 'governing_state',
    label: "Which state's laws govern this agreement?",
    type: 'select',
    options: [
      { value: 'Delaware', label: 'Delaware' },
      { value: 'California', label: 'California' },
      { value: 'New York', label: 'New York' },
      { value: 'Texas', label: 'Texas' },
      { value: 'Other', label: 'Other (specify in notes)' },
    ],
    help: 'Usually the state where your company is incorporated or where the agreement will be performed.',
  },
  {
    id: 'notes',
    label: 'Any additional terms or context? (optional)',
    type: 'textarea',
    placeholder: 'e.g. This is for a Series A investor conversation. Include a non-solicitation clause.',
    required: false,
  },
];

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--lf-cream)',
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--lf-text)',
  },
  header: {
    background: 'var(--lf-white)',
    borderBottom: '1px solid var(--lf-border)',
    padding: '18px 40px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  backBtn: {
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
  title: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px', fontWeight: '600', color: 'var(--lf-navy)', margin: '0' },
  subtitle: { fontSize: '14px', color: 'var(--lf-text-muted)', margin: '4px 0 0' },
  main: { maxWidth: '680px', margin: '0 auto', padding: '48px 40px 80px' },
  card: {
    background: 'var(--lf-white)',
    border: '1px solid var(--lf-border)',
    padding: '32px',
  },
  fieldGroup: { marginBottom: '24px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--lf-text)', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" },
  help: { fontSize: '13px', color: 'var(--lf-text-muted)', marginBottom: '8px', display: 'block' },
  input: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid rgba(15,26,46,0.15)',
    outline: 'none',
    color: 'var(--lf-text)',
    background: 'var(--lf-white)',
    boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid rgba(15,26,46,0.15)',
    outline: 'none',
    color: 'var(--lf-text)',
    background: 'var(--lf-white)',
    minHeight: '90px',
    resize: 'vertical',
    boxSizing: 'border-box',
    fontFamily: "'DM Sans', sans-serif",
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid rgba(15,26,46,0.15)',
    outline: 'none',
    color: 'var(--lf-text)',
    background: 'var(--lf-white)',
    boxSizing: 'border-box',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: 'var(--lf-navy)',
    color: 'var(--lf-cream)',
    border: 'none',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '8px',
    fontFamily: "'DM Sans', sans-serif",
  },
  notice: {
    borderLeft: '3px solid var(--lf-amber-soft)',
    background: '#FFFBEB',
    padding: '14px 18px',
    fontSize: '13px',
    color: '#92400E',
    lineHeight: '1.6',
    marginBottom: '28px',
  },
  divider: { margin: '32px 0', borderTop: '1px solid var(--lf-border)' },
  typeTag: {
    display: 'inline-block',
    background: 'var(--lf-navy)',
    color: 'var(--lf-cream)',
    fontSize: '11px',
    fontWeight: '500',
    padding: '3px 10px',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    fontFamily: "'DM Sans', sans-serif",
  },
};

export default function NDAPage({ onBack }) {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function handleChange(id, val) {
    setValues((prev) => ({ ...prev, [id]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const answers = {
      ...values,
      nda_type_label: values.nda_type === 'mutual' ? 'Mutual NDA' : 'One-Way NDA',
    };

    try {
      const data = await draftAgreement('nda', answers);
      setResult(data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <button style={styles.backBtn} onClick={() => setResult(null)}>← Edit answers</button>
          <div>
            <h1 style={styles.title}>Your NDA is Ready</h1>
            <p style={styles.subtitle}>Review, edit, and download below</p>
          </div>

        </header>
        <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 40px 80px' }}>
          <div style={styles.notice}>
            ⚠️ <strong>Not legal advice.</strong> This NDA is AI-generated and provided for reference only. Have a qualified attorney review it before signing, especially for high-stakes relationships.
          </div>
          <span style={styles.typeTag}>
            {values.nda_type === 'mutual' ? '🤝 Mutual NDA' : '➡️ One-Way NDA'}
          </span>
          <DocumentEditor
            title={`NDA — ${values.disclosing_party || 'Party A'} & ${values.receiving_party || 'Party B'}`}
            content={result.draft || result.agreement || ''}
          />
          {result.summary && (
            <div style={{ marginTop: '24px', background: 'var(--lf-white)', border: '1px solid var(--lf-border)', padding: '20px 24px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '15px', fontWeight: '600', color: 'var(--lf-navy)', margin: '0 0 10px' }}>Plain-English Summary</h3>
              <p style={{ fontSize: '14px', color: 'var(--lf-text)', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-wrap' }}>{result.summary}</p>
            </div>
          )}
          <div style={{ marginTop: '32px' }}>
            <ChatBox module="nda" context={result.draft || ''} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <div>
          <h1 style={styles.title}>🤝 NDA Generator</h1>
          <p style={styles.subtitle}>Generate a mutual or one-way non-disclosure agreement in minutes</p>
        </div>
      </header>

      <main style={styles.main}>
        <form onSubmit={handleSubmit} style={styles.card}>
          {NDA_QUESTIONS.map((q) => (
            <div key={q.id} style={styles.fieldGroup}>
              <label style={styles.label}>
                {q.label}
                {q.required === false && <span style={{ color: 'var(--lf-text-muted)', fontWeight: 400 }}> (optional)</span>}
              </label>
              {q.help && <span style={styles.help}>{q.help}</span>}

              {q.type === 'text' && (
                <input
                  style={styles.input}
                  type="text"
                  placeholder={q.placeholder}
                  value={values[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  required={q.required !== false}
                />
              )}
              {q.type === 'textarea' && (
                <textarea
                  style={styles.textarea}
                  placeholder={q.placeholder}
                  value={values[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  required={q.required !== false}
                />
              )}
              {q.type === 'select' && (
                <select
                  style={styles.select}
                  value={values[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  required
                >
                  <option value="">Select…</option>
                  {q.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}
            </div>
          ))}

          {error && (
            <p style={{ color: '#DC2626', fontSize: '14px', marginBottom: '12px', borderLeft: '3px solid var(--lf-red-soft)', background: '#FEF2F2', padding: '10px 14px' }}>{error}</p>
          )}

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Generating NDA…' : 'Generate NDA →'}
          </button>
        </form>
      </main>
    </div>
  );
}

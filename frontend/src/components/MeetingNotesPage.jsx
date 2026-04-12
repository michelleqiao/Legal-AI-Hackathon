import React, { useState } from 'react';
import { summarizeMeeting } from '../api.js';
import ChatBox from './ChatBox.jsx';

const URGENCY_COLORS = {
  high: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', badge: '#DC2626', badgeBg: '#FEE2E2' },
  medium: { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', badge: '#D97706', badgeBg: '#FEF3C7' },
  low: { bg: '#F0F9FF', border: '#BAE6FD', text: '#0C4A6E', badge: '#0284C7', badgeBg: '#E0F2FE' },
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F8FAFC',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#1E293B',
  },
  header: {
    background: '#ffffff',
    borderBottom: '1px solid #E2E8F0',
    padding: '20px 32px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  backBtn: {
    background: 'none', border: 'none', color: '#64748B',
    fontSize: '14px', cursor: 'pointer', padding: '0', fontWeight: '500',
  },
  title: { fontSize: '20px', fontWeight: '700', color: '#1E293B', margin: '0' },
  subtitle: { fontSize: '14px', color: '#64748B', margin: '4px 0 0' },
  main: { maxWidth: '760px', margin: '0 auto', padding: '40px 24px 80px' },
  card: {
    background: '#ffffff', borderRadius: '12px',
    border: '1px solid #E2E8F0', padding: '32px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '24px',
  },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  fieldGroup: { marginBottom: '20px' },
  label: {
    display: 'block', fontSize: '14px', fontWeight: '600',
    color: '#374151', marginBottom: '6px',
  },
  help: { fontSize: '12px', color: '#94A3B8', marginBottom: '6px', display: 'block' },
  input: {
    width: '100%', padding: '10px 14px', fontSize: '14px',
    borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none',
    color: '#1E293B', background: '#ffffff', boxSizing: 'border-box', fontFamily: 'inherit',
  },
  textarea: {
    width: '100%', padding: '12px 14px', fontSize: '14px',
    borderRadius: '8px', border: '1px solid #CBD5E1', outline: 'none',
    color: '#1E293B', background: '#ffffff', minHeight: '200px',
    resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: '1.6',
  },
  submitBtn: {
    width: '100%', padding: '14px', background: '#4F46E5', color: '#ffffff',
    border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600',
    cursor: 'pointer', marginTop: '8px', fontFamily: 'inherit',
  },
  sectionTitle: {
    fontSize: '13px', fontWeight: '600', color: '#94A3B8',
    textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 14px',
  },
  tldrBox: {
    background: '#EEF2FF', border: '1px solid #C7D2FE',
    borderRadius: '10px', padding: '16px 20px', marginBottom: '24px',
  },
  tldrText: { fontSize: '15px', color: '#312E81', lineHeight: '1.7', margin: '0' },
  decisionItem: {
    display: 'flex', alignItems: 'flex-start', gap: '10px',
    padding: '10px 0', borderBottom: '1px solid #F1F5F9',
    fontSize: '14px', color: '#1E293B', lineHeight: '1.5',
  },
  checkIcon: {
    width: '20px', height: '20px', borderRadius: '50%',
    background: '#DCFCE7', color: '#16A34A', fontSize: '11px',
    fontWeight: '700', display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0, marginTop: '1px',
  },
  actionRow: {
    display: 'grid', gridTemplateColumns: '1fr auto auto',
    gap: '12px', alignItems: 'start',
    padding: '12px 0', borderBottom: '1px solid #F1F5F9',
  },
  actionTask: { fontSize: '14px', fontWeight: '500', color: '#1E293B', margin: '0' },
  actionMeta: { fontSize: '12px', color: '#64748B', margin: '4px 0 0' },
  ownerChip: {
    fontSize: '12px', fontWeight: '600', background: '#EEF2FF',
    color: '#4F46E5', padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap',
  },
  deadlineChip: {
    fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap',
    padding: '3px 10px', borderRadius: '999px',
  },
  flagCard: {
    borderRadius: '10px', padding: '14px 16px',
    marginBottom: '10px', border: '1px solid',
  },
  flagHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' },
  flagTitle: { fontSize: '14px', fontWeight: '600', margin: '0', flex: 1 },
  flagBadge: { fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '999px' },
  flagContext: { fontSize: '13px', color: '#64748B', margin: '0', lineHeight: '1.5' },
  followUpItem: {
    display: 'flex', gap: '10px', padding: '10px 0',
    borderBottom: '1px solid #F1F5F9', fontSize: '14px', color: '#475569',
  },
  saveBtn: {
    padding: '12px 24px', background: '#16A34A', color: '#ffffff',
    border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
    cursor: 'pointer', fontFamily: 'inherit',
  },
  savedBanner: {
    background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '8px',
    padding: '12px 18px', fontSize: '14px', color: '#166534',
    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px',
  },
  spinner: {
    width: '36px', height: '36px', border: '3px solid #E2E8F0',
    borderTop: '3px solid #4F46E5', borderRadius: '50%',
    margin: '60px auto 16px', animation: 'spin 0.8s linear infinite',
  },
  loadingText: { textAlign: 'center', color: '#64748B', fontSize: '15px' },
};

function DeadlineChip({ deadline }) {
  const isUrgent = deadline.toLowerCase().includes('30 day') || deadline.toLowerCase().includes('urgent') || deadline.toLowerCase().includes('no exception');
  return (
    <span style={{
      ...styles.deadlineChip,
      background: isUrgent ? '#FEE2E2' : '#F1F5F9',
      color: isUrgent ? '#DC2626' : '#64748B',
    }}>
      {deadline}
    </span>
  );
}

export default function MeetingNotesPage({ onBack }) {
  const [form, setForm] = useState({ title: '', attendees: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  function handleChange(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.notes.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await summarizeMeeting(form.title, form.attendees, form.notes);
      setResult(data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleSaveToVault() {
    const existing = JSON.parse(localStorage.getItem('lf_meeting_notes') || '[]');
    const entry = {
      id: Date.now(),
      title: form.title,
      attendees: form.attendees,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      summary: result,
      notes: form.notes,
    };
    localStorage.setItem('lf_meeting_notes', JSON.stringify([entry, ...existing]));
    setSaved(true);
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <header style={styles.header}>
          <button style={styles.backBtn} onClick={onBack}>← Back</button>
          <div><h1 style={styles.title}>🎙️ Meeting Notes</h1></div>
        </header>
        <div style={styles.main}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Analyzing your meeting notes…</p>
        </div>
      </div>
    );
  }

  if (result) {
    const flagCount = result.legal_flags?.length || 0;
    const urgentCount = result.legal_flags?.filter(f => f.urgency === 'high').length || 0;

    return (
      <div style={styles.page}>
        <header style={styles.header}>
          <button style={styles.backBtn} onClick={() => { setResult(null); setSaved(false); }}>← Edit notes</button>
          <div>
            <h1 style={styles.title}>Meeting Summary — {form.title}</h1>
            <p style={styles.subtitle}>
              {form.attendees && `${form.attendees} · `}
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {urgentCount > 0 && (
                <span style={{ marginLeft: '10px', background: '#DC2626', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '999px' }}>
                  {urgentCount} urgent legal flag{urgentCount > 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
        </header>

        <div style={styles.main}>
          {saved && (
            <div style={styles.savedBanner}>
              ✅ Saved to Foundry Vault — visible in your Document Repository
            </div>
          )}

          {/* TL;DR */}
          <div style={styles.tldrBox}>
            <p style={{ ...styles.sectionTitle, color: '#4338CA', margin: '0 0 8px' }}>TL;DR</p>
            <p style={styles.tldrText}>{result.tldr}</p>
          </div>

          {/* Legal Flags — show first if any urgent ones */}
          {flagCount > 0 && (
            <div style={styles.card}>
              <p style={styles.sectionTitle}>
                ⚠️ Legal Flags ({flagCount})
                {urgentCount > 0 && <span style={{ color: '#DC2626', marginLeft: '6px' }}>— {urgentCount} urgent</span>}
              </p>
              {result.legal_flags.map((flag, i) => {
                const c = URGENCY_COLORS[flag.urgency] || URGENCY_COLORS.low;
                return (
                  <div key={i} style={{ ...styles.flagCard, background: c.bg, borderColor: c.border }}>
                    <div style={styles.flagHeader}>
                      <p style={{ ...styles.flagTitle, color: c.text }}>{flag.flag}</p>
                      <span style={{ ...styles.flagBadge, background: c.badgeBg, color: c.badge }}>
                        {flag.urgency.toUpperCase()}
                      </span>
                    </div>
                    <p style={styles.flagContext}>{flag.context}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Decisions */}
          {result.decisions?.length > 0 && (
            <div style={styles.card}>
              <p style={styles.sectionTitle}>✅ Decisions Made ({result.decisions.length})</p>
              {result.decisions.map((d, i) => (
                <div key={i} style={{ ...styles.decisionItem, borderBottom: i < result.decisions.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <div style={styles.checkIcon}>✓</div>
                  <span>{d}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Items */}
          {result.action_items?.length > 0 && (
            <div style={styles.card}>
              <p style={styles.sectionTitle}>📋 Action Items ({result.action_items.length})</p>
              {result.action_items.map((item, i) => (
                <div key={i} style={{ ...styles.actionRow, borderBottom: i < result.action_items.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <div>
                    <p style={styles.actionTask}>{item.task}</p>
                  </div>
                  <span style={styles.ownerChip}>{item.owner}</span>
                  <DeadlineChip deadline={item.deadline} />
                </div>
              ))}
            </div>
          )}

          {/* Follow-ups */}
          {result.follow_ups?.length > 0 && (
            <div style={styles.card}>
              <p style={styles.sectionTitle}>❓ Open Questions ({result.follow_ups.length})</p>
              {result.follow_ups.map((q, i) => (
                <div key={i} style={{ ...styles.followUpItem, borderBottom: i < result.follow_ups.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <span style={{ color: '#94A3B8', flexShrink: 0 }}>→</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          )}

          {/* Save + Chat */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {!saved && (
              <button style={styles.saveBtn} onClick={handleSaveToVault}>
                💾 Save to Foundry Vault
              </button>
            )}
            <button
              style={{ ...styles.saveBtn, background: '#4F46E5' }}
              onClick={() => {
                const blob = new Blob([
                  `MEETING SUMMARY — ${form.title}\n`,
                  `Date: ${new Date().toLocaleDateString()}\n`,
                  form.attendees ? `Attendees: ${form.attendees}\n\n` : '\n',
                  `TL;DR\n${result.tldr}\n\n`,
                  `DECISIONS\n${result.decisions.map(d => `• ${d}`).join('\n')}\n\n`,
                  `ACTION ITEMS\n${result.action_items.map(a => `• ${a.task} [${a.owner}] — ${a.deadline}`).join('\n')}\n\n`,
                  `LEGAL FLAGS\n${result.legal_flags.map(f => `• [${f.urgency.toUpperCase()}] ${f.flag}: ${f.context}`).join('\n')}\n\n`,
                  `OPEN QUESTIONS\n${result.follow_ups.map(q => `• ${q}`).join('\n')}`,
                ], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${form.title.replace(/\s+/g, '_')}_Summary.txt`;
                a.click();
              }}
            >
              ⬇️ Download Summary
            </button>
          </div>

          <ChatBox module="general" context={`Meeting: ${form.title}. Summary: ${result.tldr}`} />
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <div>
          <h1 style={styles.title}>🎙️ Meeting Notes</h1>
          <p style={styles.subtitle}>Paste notes or a transcript — AI extracts decisions, action items, and legal flags</p>
        </div>
      </header>

      <main style={styles.main}>
        <form onSubmit={handleSubmit} style={styles.card}>
          <div style={styles.row2}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Meeting title</label>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. Founder sync — Incorporation & First Hire"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                required
              />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Attendees <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optional)</span></label>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. Alice (CEO), Bob (CTO), Jane (Investor)"
                value={form.attendees}
                onChange={e => handleChange('attendees', e.target.value)}
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Meeting notes or transcript</label>
            <span style={styles.help}>Paste raw notes, bullet points, or a full transcript. The more detail, the better the legal analysis.</span>
            <textarea
              style={styles.textarea}
              placeholder={`Example:\n- Decided to incorporate as Delaware C-Corp this week\n- Alice and Bob each get 45% with 4-year vesting, 1-year cliff\n- Plan to hire first engineer next month as full-time employee\n- Raising $500K SAFE from angel investors at $4M cap\n- Need to set up IP assignment agreements`}
              value={form.notes}
              onChange={e => handleChange('notes', e.target.value)}
              required
            />
          </div>

          {error && <p style={{ color: '#DC2626', fontSize: '14px', marginBottom: '8px' }}>{error}</p>}

          <button
            type="submit"
            style={{ ...styles.submitBtn, background: (!form.title.trim() || !form.notes.trim()) ? '#C7D2FE' : '#4F46E5', cursor: (!form.title.trim() || !form.notes.trim()) ? 'not-allowed' : 'pointer' }}
            disabled={!form.title.trim() || !form.notes.trim()}
          >
            Analyze Meeting Notes →
          </button>
        </form>

        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '14px 18px', fontSize: '13px', color: '#92400E' }}>
          <strong>What Legal Foundry extracts:</strong> Key decisions · Action items with owners & deadlines · Legal flags (83(b), IP assignments, securities issues, contractor risks) · Open questions requiring follow-up
        </div>
      </main>
    </div>
  );
}

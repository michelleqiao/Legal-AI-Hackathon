import React, { useState, useCallback } from 'react';
import { getAllVaultDocs, saveToVault, deleteVaultDoc } from '../utils/vault.js';

const STATIC_ALERTS = [
  {
    id: 1,
    type: 'urgent',
    icon: '🚨',
    title: '83(b) Election Due Soon',
    detail: 'Stock grant issued Apr 1, 2025. You must file an 83(b) election with the IRS within 30 days. There are NO extensions and NO grace periods.',
    due: 'Due May 1, 2025',
    link: 'https://www.irs.gov/pub/irs-pdf/f83b.pdf',
    linkLabel: 'Download IRS Form',
  },
  {
    id: 2,
    type: 'urgent',
    icon: '⚠️',
    title: 'BOI Report Not Filed',
    detail: 'All corporations and LLCs must file a Beneficial Ownership Information report with FinCEN within 90 days of formation. Penalty: $500/day.',
    due: 'Due Jun 15, 2025',
    link: 'https://www.fincen.gov/boi',
    linkLabel: 'File at FinCEN →',
  },
  {
    id: 3,
    type: 'warning',
    icon: '📋',
    title: 'NDA with Acme Corp — Expiring in 30 Days',
    detail: 'Your mutual NDA with Acme Corp expires May 11, 2025. Decide whether to renew, renegotiate, or let it expire.',
    due: 'Expires May 11, 2025',
    link: null,
    linkLabel: null,
  },
  {
    id: 4,
    type: 'warning',
    icon: '📬',
    title: 'CA Statement of Information Due',
    detail: 'California requires all corporations to file a Statement of Information (SI-550) annually. $25 fee. $250 late penalty.',
    due: 'Due Jun 12, 2025',
    link: 'https://bizfileonline.sos.ca.gov/',
    linkLabel: 'File with CA SOS →',
  },
  {
    id: 5,
    type: 'info',
    icon: '🗂️',
    title: 'Delaware Franchise Tax & Annual Report',
    detail: 'Delaware requires all corps to file an annual report and pay franchise tax by March 1 each year.',
    due: 'Due Mar 1, 2026',
    link: 'https://corp.delaware.gov/paytaxes.shtml',
    linkLabel: 'Pay at Delaware →',
  },
  {
    id: 6,
    type: 'info',
    icon: '📊',
    title: '409A Valuation Reminder',
    detail: 'Before issuing any stock options, you need a valid 409A independent valuation. Without one, option holders face immediate income tax + 20% excise tax.',
    due: 'Before any option grants',
    link: null,
    linkLabel: null,
  },
];

const CATEGORIES = ['All', 'Meeting Notes', 'Incorporation', 'NDA', 'Service', 'Employment', 'IP', 'Fundraising'];

const alertColors = {
  urgent: { bg: '#FEF2F2', borderColor: '#DC2626', badge: '#DC2626', badgeBg: '#FEE2E2', text: '#991B1B' },
  warning: { bg: '#FFFBEB', borderColor: '#D97706', badge: '#D97706', badgeBg: '#FEF3C7', text: '#92400E' },
  info: { bg: 'var(--lf-white)', borderColor: 'var(--lf-warm)', badge: 'var(--lf-warm)', badgeBg: 'rgba(197,165,114,0.1)', text: 'var(--lf-navy)' },
};

const statusConfig = {
  active: { color: '#16A34A', bg: 'rgba(22,163,74,0.1)', label: 'Active' },
  expiring: { color: '#D97706', bg: 'rgba(217,119,6,0.1)', label: 'Expiring Soon' },
  expired: { color: '#DC2626', bg: 'rgba(220,38,38,0.1)', label: 'Expired' },
};

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
    cursor: 'pointer',
    padding: 0,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontFamily: "'DM Sans', sans-serif",
  },
  title: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px', fontWeight: '600', color: 'var(--lf-navy)', margin: '0' },
  subtitle: { fontSize: '14px', color: 'var(--lf-text-muted)', margin: '4px 0 0' },
  main: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '36px 40px 80px',
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '28px',
    alignItems: 'start',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: '500',
    color: 'var(--lf-warm)',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    margin: '0 0 16px',
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: 'var(--lf-white)',
    border: '1px solid var(--lf-border)',
    overflow: 'hidden',
  },
  cardPad: { padding: '20px 24px' },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 24px',
    borderBottom: '1px solid var(--lf-border)',
    flexWrap: 'wrap',
  },
  filterChip: {
    fontSize: '13px',
    fontWeight: '500',
    padding: '5px 12px',
    border: '1px solid var(--lf-border)',
    background: 'var(--lf-cream)',
    cursor: 'pointer',
    color: 'var(--lf-text-muted)',
    fontFamily: "'DM Sans', sans-serif",
  },
  filterChipActive: {
    background: 'var(--lf-navy)',
    border: '1px solid var(--lf-navy)',
    color: 'var(--lf-cream)',
    fontWeight: '500',
  },
  uploadBtn: {
    marginLeft: 'auto',
    background: 'var(--lf-navy)',
    color: 'var(--lf-cream)',
    border: 'none',
    padding: '7px 16px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },
  docRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 24px',
    borderBottom: '1px solid var(--lf-border)',
    transition: 'background 0.1s ease',
    cursor: 'pointer',
  },
  docIcon: { fontSize: '22px', flexShrink: 0 },
  docBody: { flex: 1, minWidth: 0 },
  docName: { fontSize: '14px', fontWeight: '500', color: 'var(--lf-text)', margin: '0 0 2px' },
  docMeta: { fontSize: '12px', color: 'var(--lf-text-muted)', margin: '0' },
  docRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' },
  statusBadge: {
    fontSize: '11px',
    fontWeight: '500',
    padding: '2px 8px',
    fontFamily: "'DM Sans', sans-serif",
  },
  catTag: {
    fontSize: '11px',
    color: 'var(--lf-navy)',
    background: 'rgba(15,26,46,0.06)',
    padding: '2px 7px',
    fontWeight: '500',
    fontFamily: "'DM Sans', sans-serif",
  },
  emptyState: {
    padding: '48px 24px',
    textAlign: 'center',
    color: 'var(--lf-text-muted)',
    fontSize: '14px',
  },
  alertCard: {
    padding: '14px 16px',
    marginBottom: '10px',
    borderLeft: '3px solid',
  },
  alertHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    marginBottom: '6px',
  },
  alertTitle: { fontSize: '13px', fontWeight: '600', margin: '0', fontFamily: "'DM Sans', sans-serif" },
  alertDetail: { fontSize: '12px', color: 'var(--lf-text-muted)', margin: '0 0 8px', lineHeight: '1.5' },
  alertFooter: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  alertBadge: { fontSize: '11px', fontWeight: '500', padding: '2px 8px', fontFamily: "'DM Sans', sans-serif" },
  alertLink: {
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--lf-warm)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    textDecoration: 'underline',
    fontFamily: "'DM Sans', sans-serif",
  },
  // Modal
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,26,46,0.55)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  modalBox: {
    background: 'var(--lf-white)',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid var(--lf-border)',
  },
  modalHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--lf-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: '16px', fontWeight: '600', color: 'var(--lf-navy)', margin: 0 },
  modalBody: {
    padding: '20px',
    overflowY: 'auto',
    flex: 1,
    fontFamily: 'monospace',
    fontSize: '13px',
    lineHeight: '1.6',
    color: 'var(--lf-text)',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  modalFooter: {
    padding: '12px 20px',
    borderTop: '1px solid var(--lf-border)',
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
  },
};

function AlertCard({ alert }) {
  const c = alertColors[alert.type];
  return (
    <div style={{ ...styles.alertCard, background: c.bg, borderLeftColor: c.borderColor }}>
      <div style={styles.alertHeader}>
        <span style={{ fontSize: '16px' }}>{alert.icon}</span>
        <p style={{ ...styles.alertTitle, color: c.text }}>{alert.title}</p>
      </div>
      <p style={styles.alertDetail}>{alert.detail}</p>
      <div style={styles.alertFooter}>
        <span style={{ ...styles.alertBadge, background: c.badgeBg, color: c.badge }}>
          {alert.due}
        </span>
        {alert.link && (
          <a href={alert.link} target="_blank" rel="noopener noreferrer" style={styles.alertLink}>
            {alert.linkLabel}
          </a>
        )}
      </div>
    </div>
  );
}

function DocRow({ doc, onClick, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const sc = statusConfig[doc.status] || statusConfig.active;
  return (
    <div
      style={{ ...styles.docRow, background: hovered ? 'var(--lf-cream)' : 'var(--lf-white)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span style={styles.docIcon}>{doc.icon || '📄'}</span>
      <div style={styles.docBody}>
        <p style={styles.docName}>{doc.name}</p>
        <p style={styles.docMeta}>
          {doc.date ? `Added ${doc.date}` : 'Recently added'}
          {doc.expiresAt ? ` · Expires ${doc.expiresAt}` : ''}
          {doc.size && doc.size !== '—' ? ` · ${doc.size}` : ''}
          {doc.source ? ` · via ${doc.source}` : ''}
        </p>
      </div>
      <div style={styles.docRight}>
        <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
          {sc.label}
        </span>
        <span style={styles.catTag}>{doc.category}</span>
        {onDelete && (
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--lf-text-muted)', fontSize: '16px', padding: '0 2px', lineHeight: 1 }}
            onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }}
            title="Remove from vault"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default function DocumentRepositoryPage({ onBack }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [vaultDocs, setVaultDocs] = useState(() => getAllVaultDocs());
  const [previewDoc, setPreviewDoc] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = React.useRef(null);

  // Pull saved meeting notes from localStorage
  const savedMeetings = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('lf_meeting_notes') || '[]');
    } catch { return []; }
  }, []);

  const meetingDocs = React.useMemo(() =>
    savedMeetings.map((m, i) => ({
      id: `meeting-${m.id || i}`,
      icon: '🎙️',
      name: m.title,
      category: 'Meeting Notes',
      date: m.date || 'Recently',
      status: 'active',
      expiresAt: null,
      size: '—',
      source: 'meeting-notes',
      content: m.summary || m.notes || '',
    })), [savedMeetings]);

  // Combine vault docs + meeting docs (vault first, then meetings)
  const allDocs = React.useMemo(() => {
    // Avoid duplicates: filter out vault docs that are meeting notes (since we show them from lf_meeting_notes)
    const nonMeetingVaultDocs = vaultDocs.filter((d) => d.category !== 'Meeting Notes');
    return [...nonMeetingVaultDocs, ...meetingDocs];
  }, [vaultDocs, meetingDocs]);

  const filtered = activeFilter === 'All'
    ? allDocs
    : allDocs.filter((d) => d.category === activeFilter);

  const urgentCount = STATIC_ALERTS.filter((a) => a.type === 'urgent').length;

  function handleDelete(id) {
    deleteVaultDoc(id);
    setVaultDocs(getAllVaultDocs());
  }

  function handleUploadClick() {
    setUploadError('');
    fileInputRef.current?.click();
  }

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');

    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const isText = file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md');

    // Detect category from filename
    const nameLower = file.name.toLowerCase();
    let category = 'Service';
    if (nameLower.includes('incorporat') || nameLower.includes('articles') || nameLower.includes('certificate')) category = 'Incorporation';
    else if (nameLower.includes('nda') || nameLower.includes('confidential')) category = 'NDA';
    else if (nameLower.includes('employ') || nameLower.includes('offer letter')) category = 'Employment';
    else if (nameLower.includes('patent') || nameLower.includes('trademark') || nameLower.includes(' ip ')) category = 'IP';
    else if (nameLower.includes('safe') || nameLower.includes('term sheet') || nameLower.includes('fund')) category = 'Fundraising';

    const iconMap = { Incorporation: '⚖️', NDA: '🤝', Service: '📝', Employment: '👥', IP: '💡', Fundraising: '💰' };

    if (isText) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target.result;
        const doc = {
          id: `upload-${Date.now()}`,
          name: file.name.replace(/\.[^.]+$/, ''),
          category,
          icon: iconMap[category] || '📄',
          content,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          size: `${(file.size / 1024).toFixed(0)} KB`,
          status: 'active',
          source: 'upload',
        };
        saveToVault(doc);
        setVaultDocs(getAllVaultDocs());
      };
      reader.readAsText(file);
    } else if (allowedTypes.includes(file.type)) {
      // For non-text files (PDF, DOCX), store metadata only (content not extractable client-side)
      const doc = {
        id: `upload-${Date.now()}`,
        name: file.name.replace(/\.[^.]+$/, ''),
        category,
        icon: iconMap[category] || '📄',
        content: `[Binary file: ${file.name} — ${(file.size / 1024).toFixed(0)} KB. Content not available for AI context. For AI to use this document, paste its text content via a text file upload.]`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: `${(file.size / 1024).toFixed(0)} KB`,
        status: 'active',
        source: 'upload',
      };
      saveToVault(doc);
      setVaultDocs(getAllVaultDocs());
    } else {
      setUploadError(`Unsupported file type: ${file.type || 'unknown'}. Upload .txt, .md, .pdf, or .docx files.`);
    }
    // Reset so same file can be re-uploaded
    e.target.value = '';
  }, []);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Back</button>
        <div>
          <h1 style={styles.title}>🗄️ Legal Vault</h1>
          <p style={styles.subtitle}>Your company's legal brain — all documents and compliance alerts in one place</p>
        </div>
      </header>

      <main style={styles.main}>
        {/* Left: Documents */}
        <div>
          <p style={styles.sectionTitle}>Your Documents ({allDocs.length})</p>

          {uploadError && (
            <div style={{ borderLeft: '3px solid #DC2626', background: '#FEF2F2', padding: '10px 14px', fontSize: '13px', color: '#DC2626', marginBottom: '12px' }}>
              {uploadError}
            </div>
          )}

          <div style={styles.card}>
            <div style={styles.filterRow}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  style={{
                    ...styles.filterChip,
                    ...(activeFilter === cat ? styles.filterChipActive : {}),
                  }}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </button>
              ))}
              <button style={styles.uploadBtn} onClick={handleUploadClick}>
                + Upload Document
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            {filtered.length === 0 ? (
              <div style={styles.emptyState}>
                {activeFilter === 'All'
                  ? 'No documents saved yet. Generate documents in any module and save them to your Vault, or upload files directly.'
                  : `No ${activeFilter} documents yet.`}
              </div>
            ) : (
              filtered.map((doc) => (
                <DocRow
                  key={doc.id}
                  doc={doc}
                  onClick={() => setPreviewDoc(doc)}
                  onDelete={doc.source !== 'meeting-notes' ? handleDelete : undefined}
                />
              ))
            )}
          </div>

          {allDocs.length > 0 && (
            <p style={{ fontSize: '12px', color: 'var(--lf-text-muted)', marginTop: '12px' }}>
              ✦ Documents saved here are automatically used to customise your AI outputs across all modules.
            </p>
          )}
        </div>

        {/* Right: Alerts */}
        <div>
          <p style={styles.sectionTitle}>
            🔔 Action Required
            {urgentCount > 0 && (
              <span style={{
                background: '#DC2626',
                color: '#fff',
                fontSize: '11px',
                fontWeight: '500',
                padding: '1px 7px',
                marginLeft: '8px',
                verticalAlign: 'middle',
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {urgentCount} urgent
              </span>
            )}
          </p>
          {STATIC_ALERTS.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </main>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div style={styles.modalOverlay} onClick={() => setPreviewDoc(null)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{previewDoc.icon} {previewDoc.name}</h2>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'var(--lf-text-muted)', lineHeight: 1 }}
                onClick={() => setPreviewDoc(null)}
              >
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              {previewDoc.content
                ? previewDoc.content
                : 'No content available for preview.'}
            </div>
            <div style={styles.modalFooter}>
              <span style={{ fontSize: '12px', color: 'var(--lf-text-muted)', marginRight: 'auto' }}>
                {previewDoc.category} · {previewDoc.date}
              </span>
              <button
                style={{ padding: '7px 16px', background: 'none', border: '1px solid var(--lf-border)', fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", color: 'var(--lf-text-muted)' }}
                onClick={() => setPreviewDoc(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

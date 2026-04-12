import React, { useState } from 'react';

/* ─── SVG Icons (stroke-only, no fill) ────────────────────────────────────── */
const IconIncorporation = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
  </svg>
);
const IconService = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconEmployment = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconNDA = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    <line x1="12" y1="15" x2="12" y2="17"/>
    <circle cx="12" cy="15" r="1" fill="currentColor"/>
  </svg>
);
const IconMeetingNotes = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);
const IconIP = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18"/>
    <line x1="10" y1="22" x2="14" y2="22"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14z"/>
  </svg>
);
const IconFundraising = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const IconDocuments = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconBespoke = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

/* ─── Data ─────────────────────────────────────────────────────────────────── */
const MODULES = [
  { Icon: IconIncorporation, title: 'Incorporation', desc: 'Decide how to incorporate, where, and file the paperwork — guided by AI.', page: 'incorporation' },
  { Icon: IconService, title: 'Service Agreements', desc: 'Generate a contractor or vendor service agreement tailored to your needs.', page: 'service-agreements' },
  { Icon: IconEmployment, title: 'Employment Agreements', desc: 'Create compliant employment contracts for full-time hires in minutes.', page: 'employment-agreements' },
  { Icon: IconNDA, title: 'NDAs', desc: 'Generate mutual or one-way non-disclosure agreements in under 2 minutes.', page: 'nda' },
  { Icon: IconMeetingNotes, title: 'Meeting Notes', desc: 'Record meetings, extract decisions and action items, and auto-flag legal risks.', page: 'meeting-notes' },
  { Icon: IconIP, title: 'Intellectual Property & Licenses', desc: 'Understand what to protect and how to secure your patents, trademarks, and IP.', page: 'patents' },
  { Icon: IconFundraising, title: 'Fundraising', desc: 'Generate term sheets, understand SAFEs, and know your terms before you sign.', page: 'fundraising' },
  { Icon: IconBespoke, title: 'Bespoke Services', desc: 'Negotiation, litigation support, legal opinions, and tailored legal services for complex matters.', page: 'bespoke' },
];

const MOCK_ALERTS = [
  { id: 1, severity: 'urgent', title: '83(b) Election Due Soon', detail: 'Stock grant issued Apr 1 — 30-day IRS deadline. No extensions.', due: 'Due May 1' },
  { id: 2, severity: 'urgent', title: 'BOI Report Not Filed', detail: 'FinCEN BOI report required within 90 days. $500/day penalty.', due: 'Due Jun 15' },
  { id: 3, severity: 'warning', title: 'NDA with Acme Corp — Expiring', detail: 'Mutual NDA signed Jan 2025 expires in 30 days.', due: 'Expires May 11' },
  { id: 4, severity: 'info', title: 'Delaware Annual Report', detail: 'Franchise tax and annual report due March 1, 2027.', due: 'Due Mar 1, 2027' },
];

const MOCK_DOCS = [
  { Icon: IconIncorporation, name: 'Articles of Incorporation', date: 'Mar 12, 2025', tag: 'Incorporation' },
  { Icon: IconNDA, name: 'NDA — Acme Corp', date: 'Jan 8, 2025', tag: 'NDA' },
  { Icon: IconService, name: 'Contractor Agreement — Dev Team', date: 'Feb 20, 2025', tag: 'Service' },
  { Icon: IconIP, name: 'Provisional Patent Application', date: 'Mar 28, 2025', tag: 'IP' },
];

const FAQ_ITEMS = [
  {
    q: "What's the difference between an LLC and a C-Corp?",
    a: "A C-Corp is the standard structure for VC-backed startups — it allows multiple share classes, unlimited investors, and clean equity grants. An LLC is more flexible for tax purposes (pass-through taxation) and easier to maintain, but can't issue preferred stock or accommodate most institutional investors. If you plan to raise venture capital, choose C-Corp.",
  },
  {
    q: "Do I need an 83(b) election? What happens if I miss it?",
    a: "Yes — if you receive restricted stock with a vesting schedule, you must file an 83(b) election with the IRS within 30 days of the grant. There are NO extensions and NO grace periods. Missing it means you'll owe ordinary income tax on the full value of your stock as it vests — which can be hundreds of thousands of dollars at Series A valuations.",
  },
  {
    q: "What is a BOI report and when do I need to file it?",
    a: "The Beneficial Ownership Information (BOI) report is required by FinCEN for all corporations and LLCs. You must file within 90 days of formation. The penalty for missing it is $500/day, up to $10,000, with potential prison time for willful violation.",
  },
  {
    q: "Why do I keep hearing 'incorporate in Delaware'?",
    a: "Delaware has the most mature corporate law in the US, a dedicated business court (Court of Chancery), and is the standard for VC-backed companies. Most institutional investors expect Delaware C-Corps.",
  },
  {
    q: "What is a SAFE note and how does it work?",
    a: "A SAFE (Simple Agreement for Future Equity) is an investment instrument — not a loan — that converts to equity at your next priced round. Unlike a convertible note, a SAFE has no interest rate and no maturity date. Y Combinator's post-money SAFE is the most common version.",
  },
  {
    q: "Do I need a 409A valuation before issuing stock options?",
    a: "Yes — always. A 409A is an independent appraisal of your company's fair market value. You must have one before granting any stock options. Without it, option holders face immediate ordinary income tax plus a 20% IRS excise tax.",
  },
  {
    q: "Can an S-Corp work for my startup?",
    a: "S-Corps work well for small, bootstrapped businesses with US citizen owners, but have hard limits: no more than 100 shareholders, only one class of stock, and all shareholders must be US citizens or permanent residents. These restrictions make S-Corps incompatible with VC funding.",
  },
];

const ALERT_SEVERITY = {
  urgent: { border: '#C4544A', bg: '#FEF2F2', label: 'Urgent', labelColor: '#C4544A' },
  warning: { border: '#B8860B', bg: '#FFFBEB', label: 'Action Soon', labelColor: '#B8860B' },
  info: { border: '#3B7A57', bg: '#F0FFF4', label: 'Upcoming', labelColor: '#3B7A57' },
};

/* ─── Sub-components ────────────────────────────────────────────────────────── */

function ModuleCell({ module, onNavigate }) {
  const [hovered, setHovered] = useState(false);
  const { Icon, title, desc, page } = module;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#F0EDE6' : 'var(--lf-cream)',
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        cursor: 'pointer',
        transition: 'background 0.15s ease',
      }}
      onClick={() => onNavigate(page)}
    >
      <div style={{
        width: 40,
        height: 40,
        background: 'var(--lf-white)',
        border: '1px solid rgba(15,26,46,0.10)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--lf-warm)',
        flexShrink: 0,
      }}>
        <Icon />
      </div>
      <h3 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '17px',
        fontWeight: '600',
        color: 'var(--lf-navy)',
        margin: 0,
        lineHeight: 1.3,
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '13px',
        color: 'var(--lf-text-muted)',
        margin: 0,
        lineHeight: 1.65,
        flexGrow: 1,
      }}>
        {desc}
      </p>
      <span style={{
        fontSize: '12px',
        fontWeight: '500',
        color: 'var(--lf-warm)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>
        Open →
      </span>
    </div>
  );
}

function AlertRow({ alert }) {
  const s = ALERT_SEVERITY[alert.severity];
  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      padding: '14px 20px',
      borderLeft: `3px solid ${s.border}`,
      background: s.bg,
      marginBottom: '8px',
    }}>
      <div style={{ color: s.border, marginTop: '1px', flexShrink: 0 }}>
        <IconAlert />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--lf-text)', margin: 0 }}>
            {alert.title}
          </p>
          <span style={{ fontSize: '11px', fontWeight: '600', color: s.labelColor, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {alert.due}
          </span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--lf-text-muted)', margin: 0, lineHeight: 1.5 }}>
          {alert.detail}
        </p>
      </div>
    </div>
  );
}

function DocRow({ doc, isLast }) {
  const { Icon, name, date, tag } = doc;
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '11px 0',
      borderBottom: isLast ? 'none' : '1px solid var(--lf-border)',
    }}>
      <div style={{
        width: 32,
        height: 32,
        background: 'var(--lf-cream)',
        border: '1px solid var(--lf-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--lf-slate)',
        flexShrink: 0,
      }}>
        <Icon />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--lf-text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </p>
        <p style={{ fontSize: '11px', color: 'var(--lf-text-muted)', margin: '2px 0 0' }}>
          {date}
        </p>
      </div>
      <span style={{
        fontSize: '10px',
        fontWeight: '600',
        color: 'var(--lf-warm)',
        background: 'var(--lf-warm-muted)',
        padding: '3px 8px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        flexShrink: 0,
      }}>
        {tag}
      </span>
    </div>
  );
}

function FAQAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ background: 'var(--lf-white)', padding: '80px 24px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <p style={{
          fontSize: '11px',
          fontWeight: '500',
          color: 'var(--lf-warm)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          margin: '0 0 10px',
        }}>
          Frequently Asked
        </p>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '30px',
          fontWeight: '600',
          color: 'var(--lf-navy)',
          margin: '0 0 40px',
          lineHeight: 1.25,
        }}>
          Common legal questions,<br />
          <em style={{ fontStyle: 'italic', color: 'var(--lf-warm)' }}>answered plainly.</em>
        </h2>

        {FAQ_ITEMS.map((item, i) => (
          <div key={i} style={{ borderTop: '1px solid var(--lf-border)' }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '20px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                fontWeight: '500',
                color: 'var(--lf-text)',
                flex: 1,
                lineHeight: 1.4,
              }}>
                {item.q}
              </span>
              <span style={{
                fontSize: '20px',
                color: 'var(--lf-warm)',
                flexShrink: 0,
                fontWeight: '300',
                lineHeight: 1,
                transform: open === i ? 'rotate(45deg)' : 'none',
                transition: 'transform 0.2s ease',
                display: 'inline-block',
              }}>
                +
              </span>
            </button>
            {open === i && (
              <p style={{
                fontSize: '14px',
                color: 'var(--lf-text-muted)',
                lineHeight: '1.75',
                margin: '0 0 20px',
                paddingRight: '40px',
              }}>
                {item.a}
              </p>
            )}
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--lf-border)' }} />
      </div>
    </section>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */
export default function HomePage({ onNavigate }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--lf-cream)', color: 'var(--lf-text)' }}>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--lf-navy)', position: 'relative', overflow: 'hidden', padding: '72px 48px 80px' }}>
        {/* Concentric circle decoration */}
        <svg
          viewBox="0 0 600 600"
          style={{
            position: 'absolute', top: '-100px', right: '-80px',
            width: '520px', height: '520px', opacity: 0.06, pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          {[60, 120, 180, 240, 300, 360, 420].map((r) => (
            <circle key={r} cx="300" cy="300" r={r} fill="none" stroke="#C5A572" strokeWidth="1" />
          ))}
        </svg>

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
          {/* Wordmark */}
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(48px, 7vw, 80px)',
            fontWeight: '600',
            color: 'var(--lf-white)',
            margin: '0 0 14px',
            lineHeight: 1,
            letterSpacing: '-0.5px',
          }}>
            Legal Foundry
          </h1>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            fontWeight: '400',
            color: 'var(--lf-warm)',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            margin: '0 0 36px',
          }}>
            The Legal Stack You Deserve
          </p>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '16px',
            fontWeight: '300',
            color: 'rgba(247,245,240,0.6)',
            margin: 0,
            lineHeight: 1.65,
            maxWidth: '460px',
          }}>
            AI-powered incorporation, contracts, IP, and compliance — built for founders from day zero.
          </p>
        </div>
      </section>

      {/* ── Nav strip ────────────────────────────────────────────── */}
      <nav style={{
        background: 'var(--lf-white)',
        borderBottom: '1px solid var(--lf-border)',
        padding: '0 48px',
        overflowX: 'auto',
      }}>
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          gap: '0',
        }}>
          {MODULES.map((m) => (
            <button
              key={m.page}
              onClick={() => onNavigate(m.page)}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: 'none',
                border: 'none',
                borderBottom: '2px solid transparent',
                padding: '16px 18px',
                fontSize: '11px',
                fontWeight: '500',
                color: 'var(--lf-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--lf-navy)';
                e.currentTarget.style.borderBottomColor = 'var(--lf-warm)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--lf-text-muted)';
                e.currentTarget.style.borderBottomColor = 'transparent';
              }}
            >
              {m.title}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Module Grid ──────────────────────────────────────────── */}
      <section id="lf-modules" style={{ padding: '56px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            fontWeight: '500',
            color: 'var(--lf-warm)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            margin: '0 0 8px',
          }}>
            Legal Modules
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '26px',
            fontWeight: '600',
            color: 'var(--lf-navy)',
            margin: '0 0 32px',
          }}>
            Everything you need, from incorporation to fundraising.
          </h2>

          {/* 1px gap-as-border grid: navy bg shows through 1px gap */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1px',
            background: 'rgba(15,26,46,0.15)',
            border: '1px solid rgba(15,26,46,0.15)',
          }}>
            {MODULES.map((mod) => (
              <ModuleCell key={mod.page} module={mod} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Foundry Vault ────────────────────────────────────────── */}
      <section style={{ padding: '0 48px 64px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px',
                fontWeight: '500',
                color: 'var(--lf-warm)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                margin: '0 0 6px',
              }}>
                Foundry Vault
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '22px',
                fontWeight: '600',
                color: 'var(--lf-navy)',
                margin: 0,
              }}>
                Your documents &amp; compliance deadlines
              </h2>
            </div>
            <button
              onClick={() => onNavigate('documents')}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: 'none',
                border: '1px solid rgba(15,26,46,0.2)',
                color: 'var(--lf-navy)',
                padding: '9px 20px',
                fontSize: '12px',
                fontWeight: '500',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              Open Vault →
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1px',
            background: 'rgba(15,26,46,0.12)',
            border: '1px solid rgba(15,26,46,0.12)',
          }}>
            {/* Left: Alerts */}
            <div style={{ background: 'var(--lf-white)', padding: '28px 28px 20px' }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--lf-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: '0 0 16px',
              }}>
                Action Required
              </p>
              {MOCK_ALERTS.map((alert) => (
                <AlertRow key={alert.id} alert={alert} />
              ))}
            </div>

            {/* Right: Docs */}
            <div style={{ background: 'var(--lf-cream)', padding: '28px 28px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--lf-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  margin: 0,
                }}>
                  Recent Documents
                </p>
                <div style={{ color: 'var(--lf-warm)' }}>
                  <IconDocuments />
                </div>
              </div>
              {MOCK_DOCS.map((doc, i) => (
                <DocRow key={i} doc={doc} isLast={i === MOCK_DOCS.length - 1} />
              ))}
              <button
                onClick={() => onNavigate('documents')}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: 'none',
                  border: 'none',
                  color: 'var(--lf-warm)',
                  fontSize: '12px',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  padding: '16px 0 0',
                  display: 'block',
                }}
              >
                Upload a document →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <FAQAccordion />

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer style={{
        background: 'var(--lf-navy)',
        padding: '40px 48px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '11px',
          fontWeight: '500',
          color: 'var(--lf-warm)',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          margin: '0 0 12px',
        }}>
          Legal Foundry
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '12px',
          color: 'rgba(247,245,240,0.4)',
          lineHeight: 1.7,
          margin: 0,
          maxWidth: '560px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Legal Foundry is not a law firm and does not provide legal advice. All outputs are for informational purposes only. Always consult a qualified attorney before making legal decisions.
        </p>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';

const IconNegotiation = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconLitigation = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 0 0 6.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 0 0 6.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
  </svg>
);
const IconOpinion = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);
const IconOther = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const SERVICES = [
  {
    id: 'negotiation',
    Icon: IconNegotiation,
    title: 'Negotiation Services',
    tagline: 'Strategic support for high-stakes negotiations',
    desc: 'Get AI-assisted preparation and guidance for contract negotiations, term sheet discussions, partnership deals, and vendor agreements. Know your leverage, anticipate counterparty positions, and walk in prepared.',
    questions: [
      'What type of negotiation are you preparing for?',
      'Who is the counterparty (investor, vendor, partner, acquirer)?',
      'What is the deal value or importance?',
      'What are your key priorities and red lines?',
      'What is your timeline?',
    ],
  },
  {
    id: 'litigation',
    Icon: IconLitigation,
    title: 'Litigation Services',
    tagline: 'Pre-litigation analysis and dispute support',
    desc: 'Understand your legal position before engaging outside counsel. AI-assisted analysis of your dispute, assessment of claims and defenses, and preparation of a clear brief for your attorney — saving hours of expensive billing.',
    questions: [
      'What is the nature of the dispute?',
      'Are you the claimant or respondent?',
      'What jurisdiction governs this matter?',
      'What documents or contracts are relevant?',
      'What outcome are you seeking?',
    ],
  },
  {
    id: 'opinion',
    Icon: IconOpinion,
    title: 'Legal Opinions',
    tagline: 'Plain-English legal analysis on specific questions',
    desc: 'Get a structured AI-drafted legal opinion memo on a specific legal question — including applicable law, analysis, and practical implications. Designed to help you brief outside counsel more effectively or make informed internal decisions.',
    questions: [
      'What is the specific legal question you need answered?',
      'What jurisdiction or governing law applies?',
      'What is the business context or decision you are trying to make?',
      'Have you received any prior legal advice on this matter?',
      'What is your timeline for needing an answer?',
    ],
  },
  {
    id: 'other',
    Icon: IconOther,
    title: 'Other Services',
    tagline: 'Describe your need — we will scope it',
    desc: 'Have a legal matter that does not fit neatly into a category? Describe what you are dealing with and our AI will help scope the work, identify the right type of legal support, and prepare materials to brief a specialist attorney.',
    questions: [
      'Describe the legal matter or situation you are facing.',
      'What outcome are you hoping to achieve?',
      'Are there any deadlines or urgency factors?',
      'What documents or agreements are involved?',
      'Have you engaged legal counsel on this before?',
    ],
  },
];

function ServiceCard({ service, onSelect, selected }) {
  const { Icon, title, tagline, desc } = service;
  const isSelected = selected === service.id;
  return (
    <div
      onClick={() => onSelect(service.id)}
      style={{
        background: isSelected ? 'var(--lf-navy)' : 'var(--lf-cream)',
        padding: '32px 28px',
        cursor: 'pointer',
        transition: 'background 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{
        width: 52,
        height: 52,
        background: isSelected ? 'rgba(197,165,114,0.15)' : 'var(--lf-white)',
        border: `1px solid ${isSelected ? 'rgba(197,165,114,0.3)' : 'rgba(15,26,46,0.10)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--lf-warm)',
        flexShrink: 0,
      }}>
        <Icon />
      </div>
      <div>
        <h3 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '20px',
          fontWeight: '600',
          color: isSelected ? 'var(--lf-white)' : 'var(--lf-navy)',
          margin: '0 0 6px',
          lineHeight: 1.2,
        }}>
          {title}
        </h3>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '11px',
          fontWeight: '500',
          color: 'var(--lf-warm)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          margin: 0,
        }}>
          {tagline}
        </p>
      </div>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '13px',
        color: isSelected ? 'rgba(247,245,240,0.65)' : 'var(--lf-text-muted)',
        lineHeight: 1.65,
        margin: 0,
        flexGrow: 1,
      }}>
        {desc}
      </p>
      <span style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '12px',
        fontWeight: '500',
        color: 'var(--lf-warm)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        {isSelected ? 'Selected ✓' : 'Select →'}
      </span>
    </div>
  );
}

function IntakeForm({ service, onBack }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div style={{
        background: 'var(--lf-white)',
        border: '1px solid rgba(15,26,46,0.12)',
        padding: '48px 40px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <div style={{
          width: 48,
          height: 48,
          background: 'rgba(59,122,87,0.1)',
          border: '1px solid rgba(59,122,87,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: 'var(--lf-green-soft)',
          fontSize: '22px',
        }}>
          ✓
        </div>
        <h3 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '22px',
          fontWeight: '600',
          color: 'var(--lf-navy)',
          margin: '0 0 12px',
        }}>
          Request Received
        </h3>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px',
          color: 'var(--lf-text-muted)',
          lineHeight: 1.65,
          margin: '0 0 28px',
        }}>
          Your intake has been submitted for <strong style={{ color: 'var(--lf-navy)' }}>{service.title}</strong>. A member of our team will review your matter and follow up within 1 business day with a scoped proposal and cost estimate.
        </p>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '12px',
          color: 'var(--lf-text-muted)',
          lineHeight: 1.6,
          margin: '0 0 28px',
          padding: '16px',
          background: 'var(--lf-cream)',
          borderLeft: '3px solid var(--lf-warm)',
        }}>
          Legal Foundry coordinates with qualified attorneys. This is not legal advice. All substantive legal work is performed by licensed counsel.
        </p>
        <button
          onClick={onBack}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: 'var(--lf-navy)',
            color: 'var(--lf-cream)',
            border: 'none',
            padding: '12px 28px',
            fontSize: '12px',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}
        >
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{
        background: 'var(--lf-navy)',
        padding: '24px 28px',
        marginBottom: '1px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <div style={{ color: 'var(--lf-warm)' }}>
          <service.Icon />
        </div>
        <div>
          <h3 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--lf-white)',
            margin: '0 0 3px',
          }}>
            {service.title}
          </h3>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            color: 'rgba(197,165,114,0.7)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            margin: 0,
          }}>
            Intake Form
          </p>
        </div>
      </div>

      <div style={{
        background: 'var(--lf-white)',
        border: '1px solid rgba(15,26,46,0.12)',
        borderTop: 'none',
        padding: '32px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>
        {service.questions.map((q, i) => (
          <div key={i}>
            <label style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--lf-navy)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'block',
              marginBottom: '8px',
            }}>
              {i + 1}. {q}
            </label>
            <textarea
              rows={3}
              required
              value={answers[i] || ''}
              onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
              style={{
                width: '100%',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                color: 'var(--lf-text)',
                background: 'var(--lf-cream)',
                border: '1px solid rgba(15,26,46,0.12)',
                padding: '10px 14px',
                resize: 'vertical',
                lineHeight: 1.6,
                outline: 'none',
              }}
              placeholder="Your answer..."
            />
          </div>
        ))}

        <div style={{
          padding: '14px 16px',
          background: 'rgba(197,165,114,0.08)',
          borderLeft: '3px solid var(--lf-warm)',
          marginTop: '4px',
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            color: 'var(--lf-text-muted)',
            lineHeight: 1.6,
            margin: 0,
          }}>
            Legal Foundry is not a law firm. Bespoke services connect you with qualified attorneys. This intake is for scoping purposes only and does not create an attorney-client relationship.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: 'none',
              border: '1px solid rgba(15,26,46,0.2)',
              color: 'var(--lf-text-muted)',
              padding: '11px 20px',
              fontSize: '12px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
            }}
          >
            ← Back
          </button>
          <button
            type="submit"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              background: 'var(--lf-navy)',
              color: 'var(--lf-cream)',
              border: 'none',
              padding: '11px 28px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              flexGrow: 1,
            }}
          >
            Submit Intake →
          </button>
        </div>
      </div>
    </form>
  );
}

export default function BespokeServicesPage({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const selectedService = SERVICES.find((s) => s.id === selected);

  function handleSelect(id) {
    setSelected(id);
    setShowForm(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--lf-cream)', color: 'var(--lf-text)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--lf-white)',
        borderBottom: '1px solid var(--lf-border)',
        padding: '18px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <button
          onClick={onBack}
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: 'none',
            border: 'none',
            color: 'var(--lf-text-muted)',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            padding: 0,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          ← Back
        </button>
        <div style={{ width: '1px', height: '16px', background: 'var(--lf-border)' }} />
        <div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--lf-navy)',
            margin: 0,
          }}>
            Bespoke Services
          </h1>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 40px 80px' }}>
        {/* Intro */}
        <div style={{ maxWidth: '600px', marginBottom: '40px' }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            fontWeight: '500',
            color: 'var(--lf-warm)',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            margin: '0 0 10px',
          }}>
            High-Touch Legal Support
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '28px',
            fontWeight: '600',
            color: 'var(--lf-navy)',
            margin: '0 0 14px',
            lineHeight: 1.2,
          }}>
            For matters that go beyond the standard toolkit.
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            color: 'var(--lf-text-muted)',
            lineHeight: 1.7,
            margin: 0,
          }}>
            Select a service below. We will scope your matter, prepare the relevant materials, and connect you with the right legal specialist.
          </p>
        </div>

        {/* Service grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1px',
          background: 'rgba(15,26,46,0.15)',
          border: '1px solid rgba(15,26,46,0.15)',
          marginBottom: '40px',
        }}>
          {SERVICES.map((s) => (
            <ServiceCard key={s.id} service={s} onSelect={handleSelect} selected={selected} />
          ))}
        </div>

        {/* Proceed button / form */}
        {selected && !showForm && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
            <button
              onClick={() => setShowForm(true)}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: 'var(--lf-navy)',
                color: 'var(--lf-cream)',
                border: 'none',
                padding: '13px 32px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              Continue with {selectedService?.title} →
            </button>
          </div>
        )}

        {showForm && selectedService && (
          <IntakeForm service={selectedService} onBack={() => setShowForm(false)} />
        )}
      </main>
    </div>
  );
}

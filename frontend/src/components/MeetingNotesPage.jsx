import React, { useState, useRef, useEffect } from 'react';
import { summarizeMeeting } from '../api.js';
import ChatBox from './ChatBox.jsx';

/* ─── Urgency colours ──────────────────────────────────────────────────────── */
const URGENCY = {
  high:   { bg: '#FEF2F2', borderColor: '#C4544A', text: '#991B1B', badge: '#C4544A', badgeBg: '#FEE2E2' },
  medium: { bg: '#FFFBEB', borderColor: '#B8860B', text: '#92400E', badge: '#B8860B', badgeBg: '#FEF3C7' },
  low:    { bg: '#F0FFF4', borderColor: '#3B7A57', text: '#1A3D2B', badge: '#3B7A57', badgeBg: '#DCFCE7' },
};

/* ─── Mic SVG icon ─────────────────────────────────────────────────────────── */
const MicIcon = ({ size = 36, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const StopIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="4" width="16" height="16"/>
  </svg>
);

/* ─── Waveform animation (CSS) ─────────────────────────────────────────────── */
const WAVE_CSS = `
@keyframes wave1 { 0%,100%{height:8px} 50%{height:28px} }
@keyframes wave2 { 0%,100%{height:14px} 50%{height:36px} }
@keyframes wave3 { 0%,100%{height:20px} 50%{height:48px} }
@keyframes wave4 { 0%,100%{height:10px} 50%{height:32px} }
@keyframes wave5 { 0%,100%{height:6px}  50%{height:24px} }
@keyframes spin  { to { transform: rotate(360deg); } }
@keyframes pulse { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.15;transform:scale(1.15)} }
`;

function Waveform() {
  const bars = [
    { anim: 'wave1', delay: '0ms' },
    { anim: 'wave2', delay: '80ms' },
    { anim: 'wave3', delay: '160ms' },
    { anim: 'wave4', delay: '240ms' },
    { anim: 'wave5', delay: '320ms' },
    { anim: 'wave3', delay: '400ms' },
    { anim: 'wave2', delay: '480ms' },
    { anim: 'wave1', delay: '560ms' },
    { anim: 'wave4', delay: '640ms' },
    { anim: 'wave5', delay: '720ms' },
    { anim: 'wave2', delay: '800ms' },
    { anim: 'wave3', delay: '880ms' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '56px' }}>
      {bars.map((b, i) => (
        <div key={i} style={{
          width: '4px',
          background: 'var(--lf-warm)',
          animation: `${b.anim} 1s ease-in-out infinite`,
          animationDelay: b.delay,
        }} />
      ))}
    </div>
  );
}

function Timer({ seconds }) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return (
    <span style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '28px',
      fontWeight: '300',
      color: 'var(--lf-navy)',
      letterSpacing: '0.08em',
    }}>
      {m}:{s}
    </span>
  );
}

function DeadlineChip({ deadline }) {
  const urgent = /30.day|urgent|no.exception/i.test(deadline);
  return (
    <span style={{
      fontSize: '12px', fontWeight: '500', padding: '3px 10px',
      background: urgent ? '#FEE2E2' : 'rgba(15,26,46,0.06)',
      color: urgent ? '#C4544A' : 'var(--lf-text-muted)',
      whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif",
    }}>
      {deadline}
    </span>
  );
}

export default function MeetingNotesPage({ onBack }) {
  /* Recording state */
  const [recState, setRecState] = useState('idle'); // idle | recording | transcribing | done
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [liveText, setLiveText] = useState('');
  const [recError, setRecError] = useState('');

  /* Manual input mode */
  const [manualMode, setManualMode] = useState(false);
  const [manualText, setManualText] = useState('');

  /* Meeting meta */
  const [meetingTitle, setMeetingTitle] = useState('');
  const [attendees, setAttendees] = useState('');

  /* AI analysis */
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [aiError, setAiError] = useState('');

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const transcriptRef = useRef('');

  /* ── Timer ── */
  useEffect(() => {
    if (recState === 'recording') {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [recState]);

  /* ── Start recording ── */
  function startRecording() {
    setRecError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecError('Your browser does not support speech recognition. Please use Chrome or use the manual input below.');
      setManualMode(true);
      return;
    }
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    transcriptRef.current = '';
    setTranscript('');
    setLiveText('');
    setTimer(0);

    rec.onresult = (e) => {
      let interim = '';
      let final = transcriptRef.current;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript + ' ';
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      transcriptRef.current = final;
      setTranscript(final);
      setLiveText(interim);
    };

    rec.onerror = (e) => {
      if (e.error === 'not-allowed') {
        setRecError('Microphone access denied. Please allow microphone access in your browser settings.');
      }
      stopRecording();
    };

    rec.start();
    recognitionRef.current = rec;
    setRecState('recording');
  }

  /* ── Stop recording ── */
  function stopRecording() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    const finalTranscript = transcriptRef.current.trim();
    setTranscript(finalTranscript);
    setLiveText('');
    setRecState(finalTranscript ? 'done' : 'idle');
  }

  /* ── Analyze ── */
  async function handleAnalyze() {
    const notes = manualMode ? manualText : transcript;
    if (!notes.trim()) return;
    setLoading(true);
    setAiError('');
    try {
      const data = await summarizeMeeting(
        meetingTitle || 'Untitled Meeting',
        attendees,
        notes
      );
      setResult(data);
    } catch {
      setAiError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  /* ── Save to vault ── */
  function handleSave() {
    const existing = JSON.parse(localStorage.getItem('lf_meeting_notes') || '[]');
    localStorage.setItem('lf_meeting_notes', JSON.stringify([{
      id: Date.now(),
      title: meetingTitle || 'Untitled Meeting',
      attendees,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      summary: result,
      notes: manualMode ? manualText : transcript,
    }, ...existing]));
    setSaved(true);
  }

  /* ── Result view ── */
  if (result) {
    const urgentCount = result.legal_flags?.filter(f => f.urgency === 'high').length || 0;
    return (
      <div style={{ minHeight: '100vh', background: 'var(--lf-cream)' }}>
        <style>{WAVE_CSS}</style>
        <header style={{ background: 'var(--lf-white)', borderBottom: '1px solid var(--lf-border)', padding: '18px 40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => { setResult(null); setSaved(false); }} style={{ background: 'none', border: 'none', color: 'var(--lf-text-muted)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: 0, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'DM Sans', sans-serif" }}>
            ← Edit
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px', fontWeight: '600', color: 'var(--lf-navy)', margin: 0 }}>
              {meetingTitle || 'Meeting Summary'}
            </h1>
            {attendees && <p style={{ fontSize: '12px', color: 'var(--lf-text-muted)', margin: '3px 0 0', fontFamily: "'DM Sans', sans-serif" }}>{attendees}</p>}
          </div>
          {urgentCount > 0 && (
            <span style={{ background: '#C4544A', color: '#fff', fontSize: '11px', fontWeight: '500', padding: '4px 10px', fontFamily: "'DM Sans', sans-serif" }}>
              {urgentCount} urgent flag{urgentCount > 1 ? 's' : ''}
            </span>
          )}
        </header>

        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 40px 80px' }}>
          {saved && (
            <div style={{ borderLeft: '3px solid var(--lf-warm)', background: 'var(--lf-white)', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: 'var(--lf-text)', fontFamily: "'DM Sans', sans-serif" }}>
              Saved to Foundry Vault
            </div>
          )}

          {/* TL;DR */}
          <div style={{ background: 'var(--lf-white)', border: '1px solid var(--lf-border)', borderLeft: '3px solid var(--lf-warm)', padding: '20px 24px', marginBottom: '16px' }}>
            <p style={{ fontSize: '10px', fontWeight: '600', color: 'var(--lf-warm)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px', fontFamily: "'DM Sans', sans-serif" }}>TL;DR</p>
            <p style={{ fontSize: '15px', color: 'var(--lf-text)', lineHeight: '1.7', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{result.tldr}</p>
          </div>

          {/* Legal Flags */}
          {result.legal_flags?.length > 0 && (
            <div style={{ background: 'var(--lf-white)', border: '1px solid var(--lf-border)', padding: '20px 24px', marginBottom: '16px' }}>
              <p style={{ fontSize: '10px', fontWeight: '600', color: 'var(--lf-warm)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 14px', fontFamily: "'DM Sans', sans-serif" }}>
                Legal Flags ({result.legal_flags.length})
              </p>
              {result.legal_flags.map((flag, i) => {
                const c = URGENCY[flag.urgency] || URGENCY.low;
                return (
                  <div key={i} style={{ padding: '12px 14px', marginBottom: '8px', borderLeft: `3px solid ${c.borderColor}`, background: c.bg }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: c.text, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{flag.flag}</p>
                      <span style={{ fontSize: '10px', fontWeight: '600', padding: '2px 7px', background: c.badgeBg, color: c.badge, textTransform: 'uppercase', letterSpacing: '0.06em', flexShrink: 0, fontFamily: "'DM Sans', sans-serif" }}>{flag.urgency}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--lf-text-muted)', margin: 0, lineHeight: '1.5', fontFamily: "'DM Sans', sans-serif" }}>{flag.context}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Decisions */}
          {result.decisions?.length > 0 && (
            <div style={{ background: 'var(--lf-white)', border: '1px solid var(--lf-border)', padding: '20px 24px', marginBottom: '16px' }}>
              <p style={{ fontSize: '10px', fontWeight: '600', color: 'var(--lf-warm)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 14px', fontFamily: "'DM Sans', sans-serif" }}>Decisions Made</p>
              {result.decisions.map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 0', borderBottom: i < result.decisions.length - 1 ? '1px solid var(--lf-border)' : 'none' }}>
                  <div style={{ width: '18px', height: '18px', background: 'var(--lf-navy)', color: 'var(--lf-cream)', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>✓</div>
                  <span style={{ fontSize: '14px', color: 'var(--lf-text)', lineHeight: '1.5', fontFamily: "'DM Sans', sans-serif" }}>{d}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Items */}
          {result.action_items?.length > 0 && (
            <div style={{ background: 'var(--lf-white)', border: '1px solid var(--lf-border)', padding: '20px 24px', marginBottom: '16px' }}>
              <p style={{ fontSize: '10px', fontWeight: '600', color: 'var(--lf-warm)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 14px', fontFamily: "'DM Sans', sans-serif" }}>Action Items</p>
              {result.action_items.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'start', padding: '12px 0', borderBottom: i < result.action_items.length - 1 ? '1px solid var(--lf-border)' : 'none' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--lf-text)', margin: '0 0 3px', fontFamily: "'DM Sans', sans-serif" }}>{item.task}</p>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '500', background: 'var(--lf-navy)', color: 'var(--lf-cream)', padding: '3px 10px', whiteSpace: 'nowrap', fontFamily: "'DM Sans', sans-serif" }}>{item.owner}</span>
                  <DeadlineChip deadline={item.deadline} />
                </div>
              ))}
            </div>
          )}

          {/* Open Questions */}
          {result.follow_ups?.length > 0 && (
            <div style={{ background: 'var(--lf-white)', border: '1px solid var(--lf-border)', padding: '20px 24px', marginBottom: '24px' }}>
              <p style={{ fontSize: '10px', fontWeight: '600', color: 'var(--lf-warm)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 14px', fontFamily: "'DM Sans', sans-serif" }}>Open Questions</p>
              {result.follow_ups.map((q, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', padding: '9px 0', borderBottom: i < result.follow_ups.length - 1 ? '1px solid var(--lf-border)' : 'none', fontSize: '14px', color: 'var(--lf-text)', fontFamily: "'DM Sans', sans-serif" }}>
                  <span style={{ color: 'var(--lf-warm)', flexShrink: 0 }}>→</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {!saved && (
              <button onClick={handleSave} style={{ padding: '11px 24px', background: 'var(--lf-navy)', color: 'var(--lf-cream)', border: 'none', fontSize: '13px', fontWeight: '500', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'DM Sans', sans-serif" }}>
                Save to Vault
              </button>
            )}
            <button
              onClick={() => {
                const blob = new Blob([
                  `MEETING SUMMARY — ${meetingTitle || 'Untitled'}\n`,
                  attendees ? `Attendees: ${attendees}\n\n` : '\n',
                  `TL;DR\n${result.tldr}\n\n`,
                  `DECISIONS\n${result.decisions.map(d => `• ${d}`).join('\n')}\n\n`,
                  `ACTION ITEMS\n${result.action_items.map(a => `• ${a.task} [${a.owner}] — ${a.deadline}`).join('\n')}\n\n`,
                  `LEGAL FLAGS\n${result.legal_flags.map(f => `• [${f.urgency.toUpperCase()}] ${f.flag}: ${f.context}`).join('\n')}\n`,
                ], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${(meetingTitle || 'Meeting').replace(/\s+/g, '_')}_Summary.txt`;
                a.click();
              }}
              style={{ padding: '11px 24px', background: 'none', border: '1px solid rgba(15,26,46,0.2)', color: 'var(--lf-text-muted)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'DM Sans', sans-serif" }}
            >
              Download .txt
            </button>
          </div>

          <ChatBox module="general" context={`Meeting: ${meetingTitle}. Summary: ${result.tldr}`} />
        </div>
      </div>
    );
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--lf-cream)', display: 'flex', flexDirection: 'column' }}>
        <style>{WAVE_CSS}</style>
        <header style={{ background: 'var(--lf-white)', borderBottom: '1px solid var(--lf-border)', padding: '18px 40px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px', fontWeight: '600', color: 'var(--lf-navy)', margin: 0 }}>Meeting Notes</h1>
        </header>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid rgba(15,26,46,0.1)', borderTop: '2px solid var(--lf-warm)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--lf-text-muted)' }}>Analyzing your meeting…</p>
        </div>
      </div>
    );
  }

  /* ── Main: recorder + manual mode ── */
  const notesReady = manualMode ? manualText.trim().length > 20 : (recState === 'done' && transcript.trim());

  return (
    <div style={{ minHeight: '100vh', background: 'var(--lf-cream)' }}>
      <style>{WAVE_CSS}</style>

      {/* Header */}
      <header style={{ background: 'var(--lf-white)', borderBottom: '1px solid var(--lf-border)', padding: '18px 40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--lf-text-muted)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', padding: 0, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'DM Sans', sans-serif" }}>
          ← Back
        </button>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px', fontWeight: '600', color: 'var(--lf-navy)', margin: 0 }}>
          Meeting Notes
        </h1>
      </header>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Meta fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '40px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--lf-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>Meeting Title</label>
            <input
              type="text"
              value={meetingTitle}
              onChange={e => setMeetingTitle(e.target.value)}
              placeholder="e.g. Founder sync — Q2 planning"
              style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid rgba(15,26,46,0.15)', background: 'var(--lf-white)', outline: 'none', fontFamily: "'DM Sans', sans-serif", color: 'var(--lf-text)', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--lf-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', fontFamily: "'DM Sans', sans-serif" }}>Attendees <span style={{ fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
            <input
              type="text"
              value={attendees}
              onChange={e => setAttendees(e.target.value)}
              placeholder="e.g. Alice, Bob, Jane"
              style={{ width: '100%', padding: '10px 14px', fontSize: '14px', border: '1px solid rgba(15,26,46,0.15)', background: 'var(--lf-white)', outline: 'none', fontFamily: "'DM Sans', sans-serif", color: 'var(--lf-text)', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {!manualMode && (
          <>
            {/* Recorder UI */}
            <div style={{ background: 'var(--lf-white)', border: '1px solid var(--lf-border)', padding: '48px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', marginBottom: '16px' }}>

              {recState === 'idle' && (
                <>
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '22px', fontWeight: '600', color: 'var(--lf-navy)', margin: 0, textAlign: 'center' }}>
                    Ready to record
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--lf-text-muted)', margin: 0, textAlign: 'center', lineHeight: 1.6, maxWidth: '320px' }}>
                    Tap the microphone to start. Legal Foundry will transcribe your meeting and extract decisions, action items, and legal flags automatically.
                  </p>
                  {/* Pulsing mic button */}
                  <div style={{ position: 'relative', marginTop: '8px' }}>
                    <div style={{ position: 'absolute', inset: '-20px', background: 'rgba(197,165,114,0.12)', borderRadius: '50%', animation: 'pulse 2s ease-in-out infinite' }} />
                    <div style={{ position: 'absolute', inset: '-8px', background: 'rgba(197,165,114,0.08)', borderRadius: '50%', animation: 'pulse 2s ease-in-out infinite 0.4s' }} />
                    <button
                      onClick={startRecording}
                      style={{ position: 'relative', width: '88px', height: '88px', borderRadius: '50%', background: 'var(--lf-navy)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--lf-cream)' }}
                    >
                      <MicIcon size={36} color="var(--lf-cream)" />
                    </button>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--lf-text-muted)', margin: 0 }}>Tap to start recording</p>
                </>
              )}

              {recState === 'recording' && (
                <>
                  <Timer seconds={timer} />
                  <Waveform />
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--lf-text-muted)', margin: 0 }}>Recording in progress…</p>
                  {liveText && (
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--lf-text-muted)', fontStyle: 'italic', margin: '0', maxWidth: '400px', textAlign: 'center', lineHeight: 1.5 }}>
                      "{liveText}"
                    </p>
                  )}
                  <button
                    onClick={stopRecording}
                    style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#C4544A', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginTop: '8px' }}
                  >
                    <StopIcon size={24} />
                  </button>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'var(--lf-text-muted)', margin: 0 }}>Tap to stop</p>
                </>
              )}

              {recState === 'done' && (
                <>
                  <div style={{ width: '56px', height: '56px', background: 'rgba(59,122,87,0.1)', border: '1px solid rgba(59,122,87,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B7A57', fontSize: '24px' }}>
                    ✓
                  </div>
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px', fontWeight: '600', color: 'var(--lf-navy)', margin: 0 }}>
                    Recording complete
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--lf-text-muted)', margin: 0 }}>
                    {Math.floor(timer / 60)}m {timer % 60}s recorded
                  </p>

                  {/* Transcript preview */}
                  {transcript && (
                    <div style={{ width: '100%', background: 'var(--lf-cream)', border: '1px solid var(--lf-border)', padding: '14px 16px', maxHeight: '120px', overflow: 'auto' }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'var(--lf-text)', lineHeight: 1.6, margin: 0 }}>{transcript}</p>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => { setRecState('idle'); setTranscript(''); setTimer(0); transcriptRef.current = ''; }} style={{ padding: '10px 20px', background: 'none', border: '1px solid rgba(15,26,46,0.2)', color: 'var(--lf-text-muted)', fontSize: '12px', fontWeight: '500', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: "'DM Sans', sans-serif" }}>
                      Re-record
                    </button>
                  </div>
                </>
              )}

              {recError && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#C4544A', margin: 0, textAlign: 'center', maxWidth: '360px', lineHeight: 1.5 }}>
                  {recError}
                </p>
              )}
            </div>

            {/* Toggle to manual */}
            <button
              onClick={() => setManualMode(true)}
              style={{ background: 'none', border: 'none', color: 'var(--lf-text-muted)', fontSize: '12px', fontWeight: '500', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0 32px', fontFamily: "'DM Sans', sans-serif", display: 'block', width: '100%', textAlign: 'center' }}
            >
              Or paste notes manually →
            </button>
          </>
        )}

        {manualMode && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--lf-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'DM Sans', sans-serif" }}>Notes / Transcript</label>
              <button onClick={() => setManualMode(false)} style={{ background: 'none', border: 'none', color: 'var(--lf-text-muted)', fontSize: '12px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                ← Use recorder instead
              </button>
            </div>
            <textarea
              value={manualText}
              onChange={e => setManualText(e.target.value)}
              rows={12}
              placeholder={`Paste raw notes, bullet points, or a transcript.\n\nExample:\n- Decided to incorporate as Delaware C-Corp this week\n- Alice and Bob each get 45% with 4-year vesting, 1-year cliff\n- Raising $500K SAFE from angel investors at $4M cap\n- Need to set up IP assignment agreements before first hire`}
              style={{ width: '100%', padding: '14px 16px', fontSize: '14px', border: '1px solid rgba(15,26,46,0.15)', background: 'var(--lf-white)', outline: 'none', resize: 'vertical', lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif", color: 'var(--lf-text)', boxSizing: 'border-box' }}
            />
          </div>
        )}

        {/* Analyze button */}
        {notesReady && (
          <button
            onClick={handleAnalyze}
            style={{ width: '100%', padding: '14px', background: 'var(--lf-navy)', color: 'var(--lf-cream)', border: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'DM Sans', sans-serif" }}
          >
            Analyze Meeting →
          </button>
        )}

        {aiError && (
          <p style={{ fontSize: '13px', color: '#C4544A', marginTop: '12px', fontFamily: "'DM Sans', sans-serif", borderLeft: '3px solid #C4544A', padding: '10px 14px', background: '#FEF2F2' }}>
            {aiError}
          </p>
        )}

        {/* What it extracts */}
        <div style={{ marginTop: '32px', borderLeft: '3px solid rgba(197,165,114,0.4)', background: 'var(--lf-white)', padding: '14px 18px', fontSize: '13px', color: 'var(--lf-text-muted)', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
          <strong style={{ color: 'var(--lf-navy)' }}>What Legal Foundry extracts:</strong> Key decisions · Action items with owners & deadlines · Legal flags (83(b), IP assignments, securities issues, contractor risks) · Open questions requiring follow-up
        </div>
      </div>
    </div>
  );
}

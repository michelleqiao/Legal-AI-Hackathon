import React, { useState, useRef, useEffect } from 'react';
import { chat } from '../api.js';

const FAQ_SUGGESTIONS = [
  "What's the difference between an LLC and a C-Corp?",
  "Do I need an 83(b) election?",
  "What is a SAFE note?",
  "When do I need to file a BOI report?",
  "What's the California $800 franchise tax?",
  "Do I need an NDA before pitching investors?",
  "What is a 409A valuation?",
  "Can I use an S-Corp for a VC-backed startup?",
];

const styles = {
  // Floating button
  fab: {
    position: 'fixed',
    bottom: '28px',
    right: '28px',
    width: '52px',
    height: '52px',
    background: 'var(--lf-navy)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    zIndex: 1000,
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '16px',
    height: '16px',
    background: 'var(--lf-red-soft)',
    color: '#fff',
    fontSize: '9px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid var(--lf-cream)',
  },
  // Chat window
  window: {
    position: 'fixed',
    bottom: '92px',
    right: '28px',
    width: '360px',
    maxHeight: '540px',
    background: 'var(--lf-white)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 999,
    overflow: 'hidden',
    border: '1px solid var(--lf-border)',
    fontFamily: "'DM Sans', sans-serif",
  },
  windowHeader: {
    padding: '16px 18px',
    background: 'var(--lf-navy)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
  },
  avatar: {
    width: '30px',
    height: '30px',
    background: 'rgba(197,165,114,0.2)',
    border: '1px solid rgba(197,165,114,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    flexShrink: 0,
  },
  headerTitle: {
    flex: 1,
  },
  headerName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0',
  },
  headerStatus: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.7)',
    margin: '0',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0',
    lineHeight: '1',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    minHeight: '200px',
  },
  welcomeBox: {
    background: '#F8FAFC',
    borderRadius: '10px',
    padding: '14px',
    marginBottom: '4px',
  },
  welcomeText: {
    fontSize: '13px',
    color: '#1E293B',
    margin: '0 0 10px',
    lineHeight: '1.5',
  },
  suggestionsLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: '0 0 8px',
  },
  suggestionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  suggestion: {
    background: '#ffffff',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    color: '#4F46E5',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.1s',
  },
  bubble: {
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    lineHeight: '1.6',
    maxWidth: '88%',
    whiteSpace: 'pre-wrap',
  },
  userBubble: {
    background: '#4F46E5',
    color: '#ffffff',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '3px',
  },
  assistantBubble: {
    background: '#F1F5F9',
    color: '#1E293B',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '3px',
  },
  thinkingBubble: {
    background: '#F1F5F9',
    color: '#94A3B8',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '3px',
    fontSize: '13px',
    padding: '10px 14px',
    borderRadius: '10px',
  },
  inputArea: {
    borderTop: '1px solid #E2E8F0',
    padding: '10px 12px',
    display: 'flex',
    gap: '8px',
    background: '#ffffff',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: '9px 12px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '13px',
    color: '#1E293B',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'none',
    lineHeight: '1.4',
  },
  sendBtn: {
    padding: '9px 14px',
    background: '#4F46E5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    alignSelf: 'flex-end',
  },
  sendBtnDisabled: {
    background: '#C7D2FE',
    cursor: 'not-allowed',
  },
  disclaimer: {
    fontSize: '10px',
    color: '#CBD5E1',
    textAlign: 'center',
    padding: '4px 12px 8px',
    flexShrink: 0,
  },
};

export default function FloatingChat({ currentModule }) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [open, history]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const newHistory = [...history, { role: 'user', content: trimmed }];
    setHistory(newHistory);
    setInput('');
    setLoading(true);

    try {
      const data = await chat(currentModule || 'general', null, history, trimmed);
      const reply = data.reply || data.message || data.content || JSON.stringify(data);
      setHistory([...newHistory, { role: 'assistant', content: reply }]);
      if (!open) setHasUnread(true);
    } catch {
      setHistory([...newHistory, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div style={styles.window}>
          <div style={styles.windowHeader}>
            <div style={styles.avatar}>⚖️</div>
            <div style={styles.headerTitle}>
              <p style={styles.headerName}>Legal Foundry AI</p>
              <p style={styles.headerStatus}>● Online · Plain English answers</p>
            </div>
            <button style={styles.closeBtn} onClick={() => setOpen(false)}>✕</button>
          </div>

          <div style={styles.messages}>
            {history.length === 0 ? (
              <div style={styles.welcomeBox}>
                <p style={styles.welcomeText}>
                  Hi! I'm your Legal Foundry assistant. Ask me anything about incorporation, contracts, IP, fundraising, or compliance — in plain English.
                </p>
                <p style={styles.suggestionsLabel}>Common questions</p>
                <div style={styles.suggestionsGrid}>
                  {FAQ_SUGGESTIONS.slice(0, 4).map((q, i) => (
                    <button
                      key={i}
                      style={styles.suggestion}
                      onClick={() => sendMessage(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              history.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.bubble,
                    ...(msg.role === 'user' ? styles.userBubble : styles.assistantBubble),
                  }}
                >
                  {msg.content}
                </div>
              ))
            )}
            {loading && (
              <div style={styles.thinkingBubble}>Thinking…</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputArea}>
            <textarea
              style={styles.input}
              rows={2}
              placeholder="Ask a legal question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              style={{ ...styles.sendBtn, ...(loading || !input.trim() ? styles.sendBtnDisabled : {}) }}
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
          <p style={styles.disclaimer}>Not legal advice. Consult a qualified attorney for decisions.</p>
        </div>
      )}

      {/* FAB */}
      <button
        style={styles.fab}
        onClick={() => setOpen((o) => !o)}
        title="Ask Legal Foundry AI"
      >
        {open ? '✕' : '💬'}
        {hasUnread && !open && <span style={styles.badge}>1</span>}
      </button>
    </>
  );
}

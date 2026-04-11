import React, { useState, useRef, useEffect } from 'react';
import { chat } from '../api.js';

const styles = {
  container: {
    marginTop: '32px',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#ffffff',
  },
  header: {
    padding: '14px 20px',
    background: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748B',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  messages: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '360px',
    overflowY: 'auto',
  },
  bubble: {
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    lineHeight: '1.6',
    maxWidth: '85%',
    whiteSpace: 'pre-wrap',
  },
  userBubble: {
    background: '#4F46E5',
    color: '#ffffff',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '4px',
  },
  assistantBubble: {
    background: '#F1F5F9',
    color: '#1E293B',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px',
  },
  inputRow: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    borderTop: '1px solid #E2E8F0',
    background: '#ffffff',
  },
  input: {
    flex: '1',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    color: '#1E293B',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'none',
    lineHeight: '1.5',
  },
  sendButton: {
    padding: '10px 18px',
    background: '#4F46E5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    alignSelf: 'flex-end',
  },
  sendButtonDisabled: {
    background: '#C7D2FE',
    cursor: 'not-allowed',
  },
  errorText: {
    fontSize: '12px',
    color: '#EF4444',
    padding: '0 16px 8px',
  },
  disclaimer: {
    fontSize: '11px',
    color: '#94A3B8',
    padding: '6px 16px 10px',
    textAlign: 'center',
  },
};

export default function ChatBox({ module, context }) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newHistory = [...history, { role: 'user', content: trimmed }];
    setHistory(newHistory);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const data = await chat(module, context, history, trimmed);
      const reply = data.reply || data.message || data.content || JSON.stringify(data);
      setHistory([...newHistory, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setHistory(newHistory);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span>💬</span>
        <span>Ask follow-up questions</span>
      </div>

      <div style={styles.messages}>
        {history.length === 0 && (
          <p style={{ color: '#94A3B8', fontSize: '13px', margin: '0', textAlign: 'center' }}>
            Have questions? Ask anything about your results.
          </p>
        )}
        {history.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              ...(msg.role === 'user' ? styles.userBubble : styles.assistantBubble),
            }}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div style={{ ...styles.bubble, ...styles.assistantBubble, color: '#94A3B8' }}>
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <p style={styles.errorText}>{error}</p>}

      <div style={styles.inputRow}>
        <textarea
          style={styles.input}
          rows={2}
          placeholder="Ask a follow-up question... (Shift+Enter for new line)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          style={{
            ...styles.sendButton,
            ...(loading || !input.trim() ? styles.sendButtonDisabled : {}),
          }}
          onClick={handleSend}
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </div>
      <p style={styles.disclaimer}>
        Legal Foundry does not provide legal advice. Always consult a qualified attorney.
      </p>
    </div>
  );
}

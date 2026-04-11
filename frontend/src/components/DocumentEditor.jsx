import React, { useState, useRef, useEffect, useCallback } from 'react';
import { exportToPdf } from '../api.js';

export default function DocumentEditor({ content, title }) {
  const [editMode, setEditMode] = useState(false);
  const [commentMode, setCommentMode] = useState(false);
  const [comments, setComments] = useState([]);
  const [pendingComment, setPendingComment] = useState(null); // { text: '', selectedText: '', range info }
  const [commentInput, setCommentInput] = useState('');
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [copyConfirm, setCopyConfirm] = useState(false);

  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);

  // Keep track of highlighted spans so we can remove them
  const highlightedSpansRef = useRef([]);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerText = content;
    }
  }, [content]);

  function handleToolbarEdit() {
    setEditMode((prev) => {
      const next = !prev;
      if (next) setCommentMode(false);
      return next;
    });
  }

  function handleToolbarComment() {
    setCommentMode((prev) => {
      const next = !prev;
      if (next) setEditMode(false);
      return next;
    });
  }

  function handleCopy() {
    const text = editorRef.current ? editorRef.current.innerText : content;
    navigator.clipboard.writeText(text).then(() => {
      setCopyConfirm(true);
      setTimeout(() => setCopyConfirm(false), 2000);
    });
  }

  async function handleDownloadPdf() {
    setPdfLoading(true);
    setPdfError('');
    try {
      const text = editorRef.current ? editorRef.current.innerText : content;
      const blob = await exportToPdf(title, text);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}.pdf`;
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

  function handleEditorMouseUp() {
    if (!commentMode) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    // Save the range for later highlight
    savedRangeRef.current = selection.getRangeAt(0).cloneRange();

    // Position the popover near the selection
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();

    setPopoverPos({
      top: rect.bottom - editorRect.top + 8,
      left: Math.min(rect.left - editorRect.left, editorRef.current.offsetWidth - 280),
    });

    setPendingComment({ selectedText });
    setCommentInput('');
  }

  function handleAddComment() {
    if (!commentInput.trim() || !pendingComment) return;

    // Highlight the selected text in the editor
    if (savedRangeRef.current && editorRef.current) {
      try {
        const span = document.createElement('span');
        span.style.backgroundColor = '#FEF08A';
        span.style.borderRadius = '2px';
        span.dataset.commentId = String(comments.length);
        savedRangeRef.current.surroundContents(span);
        highlightedSpansRef.current.push(span);
      } catch (e) {
        // surroundContents fails if selection crosses element boundaries — skip highlight
      }
    }

    setComments((prev) => [
      ...prev,
      {
        id: prev.length,
        selectedText: pendingComment.selectedText,
        comment: commentInput.trim(),
      },
    ]);

    setPendingComment(null);
    setCommentInput('');
    savedRangeRef.current = null;

    // Clear browser selection
    window.getSelection().removeAllRanges();
  }

  function handleCancelComment() {
    setPendingComment(null);
    setCommentInput('');
    savedRangeRef.current = null;
    window.getSelection().removeAllRanges();
  }

  function handleRemoveComment(id) {
    // Remove highlight span for this comment
    const span = highlightedSpansRef.current.find((s) => s.dataset.commentId === String(id));
    if (span) {
      const parent = span.parentNode;
      while (span.firstChild) parent.insertBefore(span.firstChild, span);
      parent.removeChild(span);
      highlightedSpansRef.current = highlightedSpansRef.current.filter((s) => s !== span);
    }
    setComments((prev) => prev.filter((c) => c.id !== id));
  }

  const editorBorderColor = editMode ? '#F59E0B' : commentMode ? '#6366F1' : '#E2E8F0';
  const editorBg = editMode ? '#FFFEF0' : '#FFFFFF';

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      {/* Main editor column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          marginBottom: '12px',
          padding: '8px 12px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={handleToolbarEdit}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: editMode ? '2px solid #F59E0B' : '1px solid #CBD5E1',
              background: editMode ? '#FFFBEB' : '#FFFFFF',
              color: editMode ? '#92400E' : '#374151',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ✏️ Edit
          </button>

          <button
            onClick={handleToolbarComment}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: commentMode ? '2px solid #6366F1' : '1px solid #CBD5E1',
              background: commentMode ? '#EEF2FF' : '#FFFFFF',
              color: commentMode ? '#4338CA' : '#374151',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            💬 Comment
          </button>

          <div style={{ height: '20px', width: '1px', background: '#E2E8F0', margin: '0 2px' }} />

          <button
            onClick={handleCopy}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              background: copyConfirm ? '#ECFDF5' : '#FFFFFF',
              color: copyConfirm ? '#059669' : '#374151',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {copyConfirm ? '✓ Copied!' : '📋 Copy'}
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '2px solid #4F46E5',
              background: '#FFFFFF',
              color: '#4F46E5',
              fontSize: '13px',
              fontWeight: '600',
              cursor: pdfLoading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: pdfLoading ? 0.6 : 1,
            }}
          >
            {pdfLoading ? 'Exporting...' : '⬇ Download PDF'}
          </button>

          {editMode && (
            <span style={{ fontSize: '12px', color: '#B45309', marginLeft: '4px' }}>
              Edit mode active — your changes are tracked
            </span>
          )}
          {commentMode && (
            <span style={{ fontSize: '12px', color: '#4338CA', marginLeft: '4px' }}>
              Select text to add a comment
            </span>
          )}
        </div>

        {pdfError && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '13px',
            color: '#DC2626',
            marginBottom: '8px',
          }}>
            {pdfError}
          </div>
        )}

        {/* Document area — relative so popover can be positioned inside */}
        <div style={{ position: 'relative' }}>
          <div
            ref={editorRef}
            contentEditable={editMode}
            suppressContentEditableWarning={true}
            onMouseUp={handleEditorMouseUp}
            style={{
              background: editorBg,
              border: `2px solid ${editorBorderColor}`,
              borderRadius: '10px',
              padding: '28px 32px',
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#1E293B',
              fontFamily: '"SF Mono", "Fira Code", "Courier New", monospace',
              whiteSpace: 'pre-wrap',
              minHeight: '300px',
              maxHeight: '560px',
              overflowY: 'auto',
              outline: 'none',
              transition: 'border-color 0.2s ease, background 0.2s ease',
              cursor: commentMode ? 'text' : editMode ? 'text' : 'default',
              userSelect: commentMode ? 'text' : undefined,
            }}
          />

          {/* Comment popover */}
          {pendingComment && (
            <div style={{
              position: 'absolute',
              top: popoverPos.top,
              left: Math.max(0, popoverPos.left),
              width: '280px',
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '10px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              padding: '16px',
              zIndex: 100,
            }}>
              <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px', fontFamily: 'inherit' }}>
                Comment on: <em style={{ color: '#1E293B' }}>"{pendingComment.selectedText.slice(0, 40)}{pendingComment.selectedText.length > 40 ? '…' : ''}"</em>
              </p>
              <textarea
                autoFocus
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add your comment..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); }
                  if (e.key === 'Escape') handleCancelComment();
                }}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  minHeight: '72px',
                  boxSizing: 'border-box',
                  outline: 'none',
                  lineHeight: '1.5',
                  color: '#1E293B',
                }}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  onClick={handleAddComment}
                  disabled={!commentInput.trim()}
                  style={{
                    flex: 1,
                    padding: '7px 0',
                    background: commentInput.trim() ? '#4F46E5' : '#C7D2FE',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: commentInput.trim() ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit',
                  }}
                >
                  Add
                </button>
                <button
                  onClick={handleCancelComment}
                  style={{
                    padding: '7px 14px',
                    background: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    color: '#64748B',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comments panel — only visible when there are comments or commentMode is active */}
      {(comments.length > 0 || commentMode) && (
        <div style={{
          width: '240px',
          flexShrink: 0,
          borderLeft: '2px solid #E0E7FF',
          paddingLeft: '16px',
        }}>
          <p style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '12px',
          }}>
            Comments ({comments.length})
          </p>

          {comments.length === 0 && (
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.5' }}>
              Select text in the document and click the comment button to add a comment.
            </p>
          )}

          {comments.map((c) => (
            <div key={c.id} style={{
              background: '#FEFCE8',
              border: '1px solid #FDE68A',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '10px',
            }}>
              <p style={{
                fontSize: '11px',
                color: '#92400E',
                marginBottom: '6px',
                fontStyle: 'italic',
                lineHeight: '1.4',
              }}>
                "{c.selectedText.slice(0, 50)}{c.selectedText.length > 50 ? '…' : ''}"
              </p>
              <p style={{ fontSize: '13px', color: '#1E293B', lineHeight: '1.5', marginBottom: '8px' }}>
                {c.comment}
              </p>
              <button
                onClick={() => handleRemoveComment(c.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: '11px',
                  cursor: 'pointer',
                  padding: '0',
                  fontFamily: 'inherit',
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

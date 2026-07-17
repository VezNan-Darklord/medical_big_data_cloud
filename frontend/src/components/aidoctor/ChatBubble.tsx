import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  messages: Message[];
  isLoading: boolean;
  onSend: (text: string) => void;
  onClose: () => void;
}

export function ChatBubble({ messages, isLoading, onSend, onClose }: Props) {
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div style={{ position: 'relative', filter: 'drop-shadow(0 12px 40px rgba(14,165,233,0.2))' }}>
      <div style={{
        width: 380, maxHeight: 520, background: '#fff', borderRadius: 16,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* 标题 */}
        <div style={{ padding: '12px 16px', background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: 15 }}>💖 Taffy</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>

        {/* 消息 */}
        <div ref={listRef} style={{ flex: 1, overflow: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%', padding: '10px 14px', borderRadius: m.role === 'user' ? '16px 6px 16px 16px' : '6px 16px 16px 16px',
              background: m.role === 'user' ? 'linear-gradient(135deg, #0ea5e9, #38bdf8)' : '#f1f5f9',
              color: m.role === 'user' ? '#fff' : '#0f172a', fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap',
            }}>
              {m.content}
            </div>
          ))}
          {isLoading && (
            <div style={{ alignSelf: 'flex-start', padding: '10px 14px', background: '#f1f5f9', borderRadius: '6px 16px 16px 16px', fontSize: 14, color: '#94a3b8' }}>
              思考中...
            </div>
          )}
        </div>

        {/* 输入 */}
        <div style={{ padding: '10px 12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入消息..."
            disabled={isLoading}
            style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: 12, padding: '8px 12px', fontSize: 14, outline: 'none' }}
          />
          <button onClick={handleSend} disabled={isLoading || !input.trim()} style={{
            background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: '#fff', border: 'none',
            borderRadius: 12, padding: '8px 16px', cursor: 'pointer', fontSize: 14, fontWeight: 500,
            opacity: isLoading || !input.trim() ? 0.5 : 1,
          }}>
            发送
          </button>
        </div>
      </div>

      {/* 气泡小尾巴 */}
      <div style={{
        position: 'absolute',
        right: 32,
        bottom: -8,
        width: 0,
        height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: '8px solid #fff',
      }} />
    </div>
  );
}

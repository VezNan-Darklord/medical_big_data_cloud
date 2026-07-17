import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChatBubble } from './ChatBubble';
import { usePetChat } from './usePetChat';
import './AIPet.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME: Message = {
  role: 'assistant',
  content: '你好！我是 Taffy 💖\n\n可以问我医疗健康问题、系统操作指引，或者聊聊天~',
};

export function AIPet() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const startRef = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const hasMovedRef = useRef(false);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const { sendMessage } = usePetChat();

  useEffect(() => {
    if (!dragging) return;

    const start = startRef.current;
    const move = (e: MouseEvent) => {
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMovedRef.current = true;
      setPos({ x: start.px + dx, y: start.py + dy });
    };

    const up = () => {
      setDragging(false);
      if (!hasMovedRef.current) {
        setIsOpen(true);
        if (messagesRef.current.length === 0) setMessages([WELCOME]);
      }
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, [dragging]);

  const onMouseDown = (e: React.MouseEvent) => {
    hasMovedRef.current = false;
    startRef.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    setDragging(true);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages((p) => [...p, userMsg]);
    setIsLoading(true);
    try {
      const reply = await sendMessage(text, messages);
      setMessages((p) => [...p, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((p) => [...p, { role: 'assistant', content: '抱歉，暂时无法回复~' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div
      style={{
        position: 'fixed', right: 24, bottom: 24, zIndex: 10000,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        userSelect: 'none',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8,
      }}
    >
      {isOpen && (
        <ChatBubble
          messages={messages}
          isLoading={isLoading}
          onSend={handleSend}
          onClose={() => setIsOpen(false)}
        />
      )}
      <div
        onMouseDown={onMouseDown}
        className="ai-pet"
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      >
        <img
          src="/taffy/taffy.png"
          alt="Taffy"
          style={{ width: 180, display: 'block', borderRadius: 16, mixBlendMode: 'multiply' }}
        />
      </div>
    </div>,
    document.body,
  );
}

import { useEffect, useRef, useState, memo } from 'react'

function ChatBubble({ sender, text }) {
  return (
    <div
      className={`chat-bubble ${sender}`}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
}

function ChatWindow({ messages, onSend, disabled }) {
  const [inputVal, setInputVal] = useState('')
  const chatEndRef = useRef(null)

  // Auto-scroll to latest message whenever messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = () => {
    const trimmed = inputVal.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setInputVal('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="panel" id="chat-panel">
      <div className="panel-hdr">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        AI Interviewer Session
      </div>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <ChatBubble key={i} sender={msg.sender} text={msg.text} />
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-bar">
        <input
          type="text"
          className="chat-input"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Session complete! Great work 🚀' : 'Type your answer here...'}
          disabled={disabled}
          autoComplete="off"
        />
        <button
          className="chat-send-btn"
          onClick={handleSubmit}
          disabled={disabled || !inputVal.trim()}
          aria-label="Send response"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default memo(ChatWindow)

import { useState, memo } from 'react'
import Flashcards from './Flashcards'

const FLASHCARD_DATA = [
  { title: "Big-O Notation", desc: "A mathematical representation of the upper boundary of execution time relative to input size. O(1) < O(log n) < O(n) < O(n log n) < O(n²)." },
  { title: "OOP Polymorphism", desc: "The ability of different objects to respond to the same method call uniquely. Achieved via method overriding (runtime) or overloading (compile time)." },
  { title: "REST Idempotency", desc: "A property where executing the same request multiple times leaves the system state unchanged. PUT/GET/DELETE are idempotent; POST is NOT." },
  { title: "JavaScript Event Loop", desc: "The browser/Node mechanism that picks async tasks from the callback queue and pushes them onto the call stack after the stack is empty." },
  { title: "Process vs Thread", desc: "A process is an isolated program with its own memory. A thread is a lightweight sub-unit sharing process memory for concurrent execution." },
  { title: "RAG (AI/ML)", desc: "Retrieval-Augmented Generation — pairs an LLM with a vector database to retrieve factual context before generating a response, reducing hallucinations." },
  { title: "Foreground Service", desc: "An Android service that runs with a persistent notification, keeping the OS from killing it. Essential for GPS tracking, music, or SOS monitoring." },
  { title: "JWT Authentication", desc: "JSON Web Token — a compact, URL-safe token that encodes user identity and claims. Signed with a secret key, verified without hitting the database." },
]

function GradeBar({ label, value }) {
  return (
    <div className="grade-metric-card">
      <div className="grade-hdr">
        <span className="grade-title">{label}</span>
        <span className="grade-val">{value}%</span>
      </div>
      <div className="grade-bar-bg">
        <div className="grade-bar-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

function EvaluationPanel({ scores, feedback }) {
  const [activeTab, setActiveTab] = useState('metrics')

  return (
    <div className="panel" id="evaluation-panel">
      <div className="tab-headers">
        <button
          className={`tab-btn${activeTab === 'metrics' ? ' active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          Metrics Dashboard
        </button>
        <button
          className={`tab-btn${activeTab === 'flashcards' ? ' active' : ''}`}
          onClick={() => setActiveTab('flashcards')}
        >
          DSA Flashcards
        </button>
      </div>

      <div className="tab-contents-wrap">
        {/* METRICS TAB */}
        <div className={`tab-content${activeTab === 'metrics' ? ' active' : ''}`}>
          <div className="grading-grid">
            <GradeBar label="Concept Accuracy" value={scores.accuracy} />
            <GradeBar label="Technical Depth" value={scores.depth} />
            <GradeBar label="Code Quality Index" value={scores.code} />
          </div>

          {/* Overall Score Ring */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '16px',
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.04)',
            borderRadius: '8px'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              border: '3px solid var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 12px rgba(168,85,247,0.3)',
              fontFamily: 'var(--font-heading)',
              fontWeight: '800',
              fontSize: '0.9rem',
              color: '#fff'
            }}>
              {Math.round((scores.accuracy + scores.depth + scores.code) / 3)}%
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Overall Grade</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                {Math.round((scores.accuracy + scores.depth + scores.code) / 3) >= 70 ? '🌟 Strong Performance' :
                 Math.round((scores.accuracy + scores.depth + scores.code) / 3) >= 45 ? '📈 Good Progress' : '📚 Keep Practicing'}
              </div>
            </div>
          </div>

          {/* AI Feedback block */}
          <div style={{
            borderLeft: '3px solid var(--accent-purple)',
            background: 'rgba(168,85,247,0.03)',
            padding: '14px 18px',
            borderRadius: '0 8px 8px 0',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>AI Grading Feedback:</strong>
            <div dangerouslySetInnerHTML={{ __html: feedback }} />
          </div>
        </div>

        {/* FLASHCARDS TAB */}
        <div className={`tab-content${activeTab === 'flashcards' ? ' active' : ''}`}>
          <Flashcards cards={FLASHCARD_DATA} />
        </div>
      </div>
    </div>
  )
}

export default memo(EvaluationPanel)

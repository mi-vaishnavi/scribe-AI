import { memo } from 'react'

const ROLE_LABELS = {
  swe: 'Software Engineer (General)',
  fullstack: 'Full-Stack Developer',
  mobile: 'Mobile Application Engineer',
}

const Q_LABELS = [
  'Q1: Core DSA Complexities',
  'Q2: OOP & Design Patterns',
  'Q3: Systems / Concurrency',
  'Q4: APIs & Architecture',
]

function Sidebar({ role, onRoleChange, currentIndex, completedIndexes }) {
  return (
    <div className="panel" id="progress-panel">
      <div className="panel-hdr">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        Interview Agenda
      </div>

      <div className="sidebar-body">
        {/* Role Selector */}
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Target Profile
          </label>
          <select
            className="role-selector"
            value={role}
            onChange={e => onRoleChange(e.target.value)}
          >
            {Object.entries(ROLE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* Question Progress Checklist */}
        <div style={{ flexGrow: 1 }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Examination Timeline
          </label>
          <ul className="progress-list">
            {Q_LABELS.map((label, idx) => {
              const isActive = idx === currentIndex && !completedIndexes.includes(idx)
              const isDone = completedIndexes.includes(idx)
              return (
                <li
                  key={idx}
                  className={`prog-item${isActive ? ' active' : ''}${isDone ? ' completed' : ''}`}
                >
                  <span className="prog-dot" />
                  <span>{label}</span>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Session Progress Summary */}
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--text-primary)' }}>Session Progress</strong>
          <div style={{ marginTop: '8px' }}>
            {completedIndexes.length} / 4 Questions Answered
          </div>
          <div style={{ marginTop: '6px', height: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(completedIndexes.length / 4) * 100}%`,
              background: 'linear-gradient(to right, var(--accent-purple), var(--accent-indigo))',
              borderRadius: '4px',
              transition: 'width 0.6s ease'
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Sidebar)

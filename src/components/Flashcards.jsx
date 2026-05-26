import { useState, memo } from 'react'

function Flashcards({ cards }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const goNext = () => {
    setFlipped(false)
    setTimeout(() => setIndex(i => (i + 1) % cards.length), 250)
  }

  const goPrev = () => {
    setFlipped(false)
    setTimeout(() => setIndex(i => (i - 1 + cards.length) % cards.length), 250)
  }

  const current = cards[index]

  return (
    <div className="flashcards-container">
      {/* Card count indicator */}
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-heading)' }}>
        Card {index + 1} of {cards.length}
      </div>

      {/* 3D Flip Card */}
      <div
        className={`flashcard-card-wrap${flipped ? ' flipped' : ''}`}
        onClick={() => setFlipped(f => !f)}
        role="button"
        aria-label={flipped ? 'Click to show question' : 'Click to reveal answer'}
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && setFlipped(f => !f)}
      >
        <div className="flashcard-inner">
          {/* Front Face */}
          <div className="flashcard-face flashcard-front">
            <h3>{current.title}</h3>
            <p>Tap card to reveal definition</p>
          </div>
          {/* Back Face */}
          <div className="flashcard-face flashcard-back">
            <p>{current.desc}</p>
          </div>
        </div>
      </div>

      {/* Hint text */}
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        {flipped ? '✅ Definition revealed — click again to flip back' : '👆 Click the card to flip'}
      </div>

      {/* Navigation dots */}
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
        {cards.map((_, i) => (
          <div
            key={i}
            onClick={() => { setFlipped(false); setTimeout(() => setIndex(i), 250) }}
            style={{
              width: i === index ? '20px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === index ? 'var(--accent-purple)' : 'rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: i === index ? '0 0 6px var(--accent-purple)' : 'none'
            }}
          />
        ))}
      </div>

      {/* Prev / Next Buttons */}
      <div className="flashcard-actions">
        <button className="fc-btn" onClick={goPrev}>← Previous</button>
        <button className="fc-btn" onClick={goNext}>Next Card →</button>
      </div>
    </div>
  )
}

export default memo(Flashcards)

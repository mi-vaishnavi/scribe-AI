import { useState, useCallback } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'
import EvaluationPanel from './components/EvaluationPanel'
import './index.css'

// Interview questions database per role
const QUESTIONS_DB = {
  swe: [
    { q: "Question 1: What is the time complexity of Quick Sort in the average and worst cases, and what causes the worst-case scenario?", keywords: ["n log n", "n^2", "pivot", "worst", "partition", "sort"] },
    { q: "Question 2: What is the difference between composition and inheritance in OOP, and why do professionals recommend composition?", keywords: ["is-a", "has-a", "coupling", "flexible", "reuse", "extend"] },
    { q: "Question 3: Explain the difference between a process and a thread. How does multi-threading improve CPU efficiency?", keywords: ["memory", "shared", "lightweight", "concurrency", "thread", "process"] },
    { q: "Question 4: What are key HTTP methods in RESTful APIs? Explain idempotency between POST and PUT.", keywords: ["idempotent", "create", "update", "payload", "post", "put"] },
  ],
  fullstack: [
    { q: "Question 1: Explain the difference between CSR and SSR in React/Next.js. When would you prefer SSR?", keywords: ["seo", "hydrate", "server", "initial load", "ssr", "csr"] },
    { q: "Question 2: How do you secure a REST API? Explain the difference between authentication and authorization.", keywords: ["jwt", "token", "auth", "identity", "permission", "cors", "role"] },
    { q: "Question 3: When would you choose MongoDB over MySQL?", keywords: ["schema", "rigid", "scale", "document", "relation", "join", "flex"] },
    { q: "Question 4: How does the JavaScript event loop manage asynchronous execution?", keywords: ["callback", "stack", "queue", "async", "non-blocking", "event", "loop"] },
  ],
  mobile: [
    { q: "Question 1: What is the difference between a foreground and background service in Android? How do you maintain continuous monitoring?", keywords: ["foreground", "notification", "battery", "service", "background", "wake"] },
    { q: "Question 2: How do you handle app-wide state management in React Native? Why are local caches important?", keywords: ["state", "redux", "context", "cache", "store", "persistence", "prop"] },
    { q: "Question 3: Explain the architecture of an offline-first mobile sync workflow with cellular latencies.", keywords: ["sync", "sqlite", "offline", "storage", "queue", "conflict", "network"] },
    { q: "Question 4: What is the purpose of Gradle/CocoaPods in build pipelines, and how do they resolve version conflicts?", keywords: ["dependency", "gradle", "cocoapods", "build", "conflict", "package", "version"] },
  ],
}

export default function App() {
  const [role, setRole] = useState('swe')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "Hello! I'm ScribeAI, your technical interview prep coach. Select your target profile on the left and start answering questions. I'll evaluate your responses live!" }
  ])
  const [scores, setScores] = useState({ accuracy: 0, depth: 0, code: 0 })
  const [feedback, setFeedback] = useState("Awaiting your response. Answer the questions to see real-time grading.")
  const [completedIndexes, setCompletedIndexes] = useState([])
  const [sessionDone, setSessionDone] = useState(false)

  const handleRoleChange = useCallback((newRole) => {
    setRole(newRole)
    setQuestionIndex(0)
    setCompletedIndexes([])
    setSessionDone(false)
    setScores({ accuracy: 0, depth: 0, code: 0 })
    setFeedback("Interview started. Submit responses to update your technical grading metrics.")
    setMessages([
      { sender: 'ai', text: `Target profile updated! Let's begin the <strong>${newRole === 'swe' ? 'Software Engineer' : newRole === 'fullstack' ? 'Full-Stack Developer' : 'Mobile App Engineer'}</strong> session.` },
      { sender: 'ai', text: QUESTIONS_DB[newRole][0].q }
    ])
  }, [])

  const handleUserMessage = useCallback((userText) => {
    const questions = QUESTIONS_DB[role]
    const currentQ = questions[questionIndex]
    const normalized = userText.toLowerCase()

    // Keyword scoring
    const matchCount = currentQ.keywords.filter(kw => normalized.includes(kw)).length
    const total = currentQ.keywords.length
    const accuracyScore = Math.round((matchCount / total) * 80) + 15
    const depthScore = Math.round(Math.min(95, Math.max(10, userText.length * 0.15 + matchCount * 10)))
    const codeScore = /function|class|\(|code|implement/i.test(userText) ? 90 : 40

    const newQIdx = questionIndex + 1
    const prevCompleted = completedIndexes.length

    // Cumulative averaging
    const newAccuracy = Math.round((scores.accuracy * prevCompleted + accuracyScore) / (prevCompleted + 1))
    const newDepth = Math.round((scores.depth * prevCompleted + depthScore) / (prevCompleted + 1))
    const newCode = Math.round((scores.code * prevCompleted + codeScore) / (prevCompleted + 1))

    setScores({ accuracy: newAccuracy, depth: newDepth, code: newCode })
    setCompletedIndexes(prev => [...prev, questionIndex])

    // Feedback message generation
    let fb = ''
    if (accuracyScore >= 70) {
      fb = `<strong>Strong Response!</strong> You correctly referenced key concepts like <code>${currentQ.keywords.slice(0, 2).join(', ')}</code>. Technical understanding verified.`
    } else if (accuracyScore >= 45) {
      fb = `<strong>Satisfactory.</strong> You covered core aspects. Tip: expand on <code>${currentQ.keywords[0]}</code> to strengthen answers.`
    } else {
      fb = `<strong>Needs improvement.</strong> Focus on defining <code>${currentQ.keywords.slice(0, 2).join(' / ')}</code> in your next answer.`
    }
    setFeedback(fb)

    // Build reply messages
    const newMessages = [
      { sender: 'user', text: userText },
    ]

    if (newQIdx < questions.length) {
      newMessages.push({ sender: 'ai', text: 'Grade processed. Let\'s move to the next topic.' })
      newMessages.push({ sender: 'ai', text: questions[newQIdx].q })
      setQuestionIndex(newQIdx)
    } else {
      const avg = Math.round((newAccuracy + newDepth + newCode) / 3)
      newMessages.push({
        sender: 'ai',
        text: `<strong>Technical Session Complete! 🚀</strong><br><br>Overall Score: <strong>${avg}%</strong><br>Concept Accuracy: <strong>${newAccuracy}%</strong><br>Technical Depth: <strong>${newDepth}%</strong><br><br>You demonstrate strong software engineering fundamentals. Great work!`
      })
      setSessionDone(true)
    }

    setMessages(prev => [...prev, ...newMessages])
  }, [role, questionIndex, scores, completedIndexes])

  const currentQuestions = QUESTIONS_DB[role]

  return (
    <>
      <div className="ambient-bg" />
      <header>
        <div className="header-container">
          <div>
            <h1 className="logo-txt">ScribeAI <span className="logo-badge">Developer Prep Coach</span></h1>
          </div>
          <a href="../index.html" className="back-btn">
            ← Back to Portfolio
          </a>
        </div>
      </header>

      <main>
        <Sidebar
          role={role}
          onRoleChange={handleRoleChange}
          questions={currentQuestions}
          currentIndex={questionIndex}
          completedIndexes={completedIndexes}
        />

        <ChatWindow
          messages={messages}
          onSend={handleUserMessage}
          disabled={sessionDone}
        />

        <EvaluationPanel
          scores={scores}
          feedback={feedback}
        />
      </main>
    </>
  )
}

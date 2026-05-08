import { useEffect, useState } from "react"

function CourtGame() {
  const [cases, setCases] = useState([])
  const [currentCase, setCurrentCase] = useState(null)
  const [loading, setLoading] = useState(true)

  const [activeTab, setActiveTab] = useState("home")
  const [caseRevealed, setCaseRevealed] = useState(false)

  const [timePerTeam, setTimePerTeam] = useState(60)
  const [secondsLeft, setSecondsLeft] = useState(60)
  const [timerOn, setTimerOn] = useState(false)
  const [currentSpeaker, setCurrentSpeaker] = useState("No Side Selected")

  const [prosecutorTicked, setProsecutorTicked] = useState(false)
  const [defenseTicked, setDefenseTicked] = useState(false)
  const [prosecutorDone, setProsecutorDone] = useState(false)
  const [defenseDone, setDefenseDone] = useState(false)

  const [winner, setWinner] = useState("")
  const [juryReason, setJuryReason] = useState("")
  const [fairnessScore, setFairnessScore] = useState("")
  const [justiceScore, setJusticeScore] = useState("")
  const [commonGoodScore, setCommonGoodScore] = useState("")

  const timeOptions = [
    { label: "30 sec", value: 30 },
    { label: "1 min", value: 60 },
    { label: "2 min", value: 120 },
    { label: "3 min", value: 180 }
  ]

  useEffect(() => {
    fetch("/courtCases.json")
      .then((response) => response.json())
      .then((data) => {
        setTimeout(() => {
          setCases(data)
          setCurrentCase(data[0])
          setLoading(false)
        }, 900)
      })
      .catch((error) => {
        console.log("Error loading court cases:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!timerOn) {
      return
    }

    if (secondsLeft === 0) {
      setTimerOn(false)
      playBell()

      if (currentSpeaker === "Prosecutor") {
        setProsecutorDone(true)
      }

      if (currentSpeaker === "Defense") {
        setDefenseDone(true)
      }

      return
    }

    const timer = setTimeout(() => {
      setSecondsLeft(secondsLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timerOn, secondsLeft, currentSpeaker])

  function playBell() {
    const AudioContext = window.AudioContext || window.webkitAudioContext

    if (!AudioContext) {
      return
    }

    const audio = new AudioContext()
    const oscillator = audio.createOscillator()
    const gain = audio.createGain()

    oscillator.type = "sine"
    oscillator.frequency.value = 880

    gain.gain.setValueAtTime(0.25, audio.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.7)

    oscillator.connect(gain)
    gain.connect(audio.destination)

    oscillator.start()
    oscillator.stop(audio.currentTime + 0.7)
  }

  function resetTrial(caseData) {
    setCurrentCase(caseData)
    setSecondsLeft(timePerTeam)
    setTimerOn(false)
    setCurrentSpeaker("No Side Selected")

    setProsecutorTicked(false)
    setDefenseTicked(false)
    setProsecutorDone(false)
    setDefenseDone(false)

    setWinner("")
    setJuryReason("")
    setFairnessScore("")
    setJusticeScore("")
    setCommonGoodScore("")
  }

  function pickRandomCase() {
    if (cases.length === 0) {
      return
    }

    let randomIndex = Math.floor(Math.random() * cases.length)

    if (currentCase && cases.length > 1) {
      while (cases[randomIndex].id === currentCase.id) {
        randomIndex = Math.floor(Math.random() * cases.length)
      }
    }

    resetTrial(cases[randomIndex])
    setCaseRevealed(true)
  }

  function proceedToCaseDisplay() {
    setActiveTab("case")
  }

  function chooseTime(value) {
    setTimePerTeam(value)
    setSecondsLeft(value)
    setTimerOn(false)
    setCurrentSpeaker("No Side Selected")

    setProsecutorTicked(false)
    setDefenseTicked(false)
    setProsecutorDone(false)
    setDefenseDone(false)
  }

  function selectSpeaker(side) {
    setCurrentSpeaker(side)
    setSecondsLeft(timePerTeam)
    setTimerOn(true)
    playBell()

    if (side === "Prosecutor") {
      setProsecutorTicked(true)
    }

    if (side === "Defense") {
      setDefenseTicked(true)
    }
  }

  function startTimer() {
    if (currentSpeaker === "No Side Selected") {
      return
    }

    if (secondsLeft > 0) {
      setTimerOn(true)
    }
  }

  function pauseTimer() {
    setTimerOn(false)
  }

  function resetTimer() {
    setSecondsLeft(timePerTeam)
    setTimerOn(false)
  }

  function goToVoting() {
    setActiveTab("vote")
    setTimerOn(false)
  }

  function submitVote(result) {
    setWinner(result)
    playBell()
  }

  function nextCase() {
    setCaseRevealed(false)
    setWinner("")
    setJuryReason("")
    setFairnessScore("")
    setJusticeScore("")
    setCommonGoodScore("")
    setActiveTab("randomizer")
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60

    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`
  }

  const progress = (secondsLeft / timePerTeam) * 100
  const bothSidesTicked = prosecutorTicked && defenseTicked

  if (loading) {
    return (
      <div className="loader-box">
        <div className="loader"></div>
        <h2>Preparing the Courtroom</h2>
        <p>Loading justice and fairness cases...</p>
      </div>
    )
  }

  return (
    <div className="court-container">
      <header className="court-header">
        <div className="court-badge">⚖️ Justice and Fairness Game</div>
        <h1>The Fairness Trial</h1>
        <p>
          The reporters act as Judges. Half of the class becomes Prosecutor.
          The other half becomes Defense. The Subject Teacher serves as Jury.
        </p>
      </header>

      <nav className="tabs">
        <TabButton
          title="Home"
          activeTab={activeTab}
          tabName="home"
          setActiveTab={setActiveTab}
        />

        <TabButton
          title="Randomizer"
          activeTab={activeTab}
          tabName="randomizer"
          setActiveTab={setActiveTab}
        />

        <TabButton
          title="Case Display"
          activeTab={activeTab}
          tabName="case"
          setActiveTab={setActiveTab}
        />

        <TabButton
          title="Jury Voting"
          activeTab={activeTab}
          tabName="vote"
          setActiveTab={setActiveTab}
        />
      </nav>

      {activeTab === "home" && (
        <section className="page-card">
          <p className="label">Game Mechanics</p>
          <h2>How the Game Works</h2>

          <div className="role-grid">
            <div>
              <span>👩‍⚖️</span>
              <h3>Judges</h3>
              <p>The reporters lead the trial, control the game, and guide each round.</p>
            </div>

            <div>
              <span>📢</span>
              <h3>Prosecutor</h3>
              <p>The first half of the class defends why the action is unfair or unjust.</p>
            </div>

            <div>
              <span>🛡️</span>
              <h3>Defense</h3>
              <p>The second half of the class defends the other side of the case.</p>
            </div>

            <div>
              <span>🗳️</span>
              <h3>Jury</h3>
              <p>The Subject Teacher listens, evaluates, and gives the final decision.</p>
            </div>
          </div>

          <div className="rules-box">
            <h3>Rules</h3>
            <p>1. Pick a random case.</p>
            <p>2. Reveal the case title.</p>
            <p>3. Proceed to Case Display.</p>
            <p>4. Choose which side speaks first.</p>
            <p>5. Switching sides resets and starts the timer.</p>
            <p>6. Jury Voting opens after both sides speak.</p>
          </div>

          <button onClick={() => setActiveTab("randomizer")}>
            Start Game
          </button>
        </section>
      )}

      {activeTab === "randomizer" && (
        <section className="page-card randomizer-card">
          <p className="label">Random Question Picker</p>
          <h2>Pick a Court Case</h2>
          <p>
            The title stays hidden first. Click the button to reveal the case.
          </p>

          <div className="random-display">
            <h3>{caseRevealed ? currentCase.title : "?"}</h3>
            <p>{caseRevealed ? currentCase.topic : "Hidden Case Topic"}</p>
          </div>

          <div className="random-actions">
            <button className="big-button" onClick={pickRandomCase}>
              🎲 Reveal Random Case
            </button>

            {caseRevealed && (
              <button className="big-button proceed-button" onClick={proceedToCaseDisplay}>
                Proceed to Case Display
              </button>
            )}
          </div>
        </section>
      )}

      {activeTab === "case" && (
        <section className="case-layout">
          <div className="question-display">
            <p className="label">{currentCase.topic}</p>
            <h2>{currentCase.title}</h2>

            <div className="situation-box">
              <h3>Situation</h3>
              <p>{currentCase.situation}</p>
            </div>

            <div className="question-box">
              <h3>Court Question</h3>
              <p>{currentCase.question}</p>
            </div>

            <div className="notice-box">
              <p>
                No suggested answers are shown. Students must defend their own side.
              </p>
            </div>
          </div>

          <div className="timer-card">
            <p className="label">Debate Timer</p>
            <h2>{currentSpeaker}</h2>

            <div
              className="timer-circle"
              style={{
                background: `conic-gradient(#ffd166 ${progress}%, #3a2923 ${progress}%)`
              }}
            >
              <div className="timer-inner">
                <h1>{formatTime(secondsLeft)}</h1>
                <p>{timerOn ? "Timer ON" : secondsLeft === 0 ? "Time is up" : "Timer OFF"}</p>
              </div>
            </div>

            <div className="time-options">
              {timeOptions.map((item) => (
                <button
                  key={item.value}
                  onClick={() => chooseTime(item.value)}
                  className={timePerTeam === item.value ? "time-active" : ""}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="timer-buttons">
              <button onClick={startTimer}>Start</button>
              <button onClick={pauseTimer}>Pause</button>
              <button onClick={resetTimer}>Reset</button>
            </div>

            <div className="side-pick-box">
              <p>Choose which side speaks now:</p>

              <div className="side-pick-buttons">
                <button
                  onClick={() => selectSpeaker("Prosecutor")}
                  className={currentSpeaker === "Prosecutor" ? "side-active" : ""}
                >
                  {prosecutorTicked ? "✓ " : ""}Prosecutor
                </button>

                <button
                  onClick={() => selectSpeaker("Defense")}
                  className={currentSpeaker === "Defense" ? "side-active" : ""}
                >
                  {defenseTicked ? "✓ " : ""}Defense
                </button>
              </div>
            </div>

            <div className="turn-status">
              <p className={prosecutorTicked ? "done" : ""}>
                Prosecutor: {prosecutorDone ? "Time Ended" : prosecutorTicked ? "Turn Used" : "Waiting"}
              </p>

              <p className={defenseTicked ? "done" : ""}>
                Defense: {defenseDone ? "Time Ended" : defenseTicked ? "Turn Used" : "Waiting"}
              </p>
            </div>

            {bothSidesTicked && (
              <button className="wide-button vote-now" onClick={goToVoting}>
                Jury Vote Now
              </button>
            )}
          </div>
        </section>
      )}

      {activeTab === "vote" && (
        <section className="page-card vote-card">
          <p className="label">Jury Voting</p>
          <h2>Subject Teacher’s Final Decision</h2>

          <div className="vote-layout">
            <div className="mini-case">
              <h3>{currentCase.title}</h3>
              <p>{currentCase.question}</p>
            </div>

            <div className="judge-score-card">
              <h3>Judge Evaluation</h3>

              <label>
                Fairness Score
                <select
                  value={fairnessScore}
                  onChange={(event) => setFairnessScore(event.target.value)}
                >
                  <option value="">Select score</option>
                  <option value="1">1 - Weak</option>
                  <option value="2">2 - Needs improvement</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Strong</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </label>

              <label>
                Justice Score
                <select
                  value={justiceScore}
                  onChange={(event) => setJusticeScore(event.target.value)}
                >
                  <option value="">Select score</option>
                  <option value="1">1 - Weak</option>
                  <option value="2">2 - Needs improvement</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Strong</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </label>

              <label>
                Common Good Score
                <select
                  value={commonGoodScore}
                  onChange={(event) => setCommonGoodScore(event.target.value)}
                >
                  <option value="">Select score</option>
                  <option value="1">1 - Weak</option>
                  <option value="2">2 - Needs improvement</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Strong</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </label>
            </div>
          </div>

          <textarea
            value={juryReason}
            onChange={(event) => setJuryReason(event.target.value)}
            placeholder="Type the reason for the decision..."
          ></textarea>

          <div className="vote-buttons">
            <button onClick={() => submitVote("Prosecutor Wins")}>
              Prosecutor Wins
            </button>

            <button onClick={() => submitVote("Defense Wins")}>
              Defense Wins
            </button>

            <button onClick={() => submitVote("Fair Solution Needed")}>
              Fair Solution Needed
            </button>
          </div>

          {winner && (
            <div className="winner-box">
              <p className="label">Final Decision</p>
              <h2>{winner}</h2>

              <div className="score-summary">
                <p>Fairness: {fairnessScore || "No score"}</p>
                <p>Justice: {justiceScore || "No score"}</p>
                <p>Common Good: {commonGoodScore || "No score"}</p>
              </div>

              <p>
                {juryReason || "The Jury has made a decision based on fairness and justice."}
              </p>
            </div>
          )}

          <button className="big-button" onClick={nextCase}>
            Next Random Case
          </button>
        </section>
      )}
    </div>
  )
}

function TabButton({ title, activeTab, tabName, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(tabName)}
      className={activeTab === tabName ? "tab active-tab" : "tab"}
    >
      {title}
    </button>
  )
}

export default CourtGame
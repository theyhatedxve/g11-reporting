import { useEffect, useState } from "react"

function GameTimer() {
  const timeOptions = [
    { label: "30 Seconds", value: 30 },
    { label: "1 Minute", value: 60 },
    { label: "2 Minutes", value: 120 },
    { label: "3 Minutes", value: 180 }
  ]

  const [selectedTime, setSelectedTime] = useState(120)
  const [secondsLeft, setSecondsLeft] = useState(120)
  const [timerOn, setTimerOn] = useState(false)

  useEffect(() => {
    if (!timerOn) {
      return
    }

    if (secondsLeft === 0) {
      setTimerOn(false)
      return
    }

    const timer = setTimeout(() => {
      setSecondsLeft(secondsLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timerOn, secondsLeft])

  function chooseTime(value) {
    setSelectedTime(value)
    setSecondsLeft(value)
    setTimerOn(false)
  }

  function startTimer() {
    if (secondsLeft > 0) {
      setTimerOn(true)
    }
  }

  function pauseTimer() {
    setTimerOn(false)
  }

  function resetTimer() {
    setSecondsLeft(selectedTime)
    setTimerOn(false)
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60

    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`
  }

  const progress = (secondsLeft / selectedTime) * 100

  return (
    <section className="timer-card">
      <div className="timer-left">
        <p className="label">Court Timer</p>
        <h2>Time for Each Round</h2>
        <p>
          Use this timer for opening statements, witness questions, jury voting,
          and final arguments.
        </p>

        <div className="time-options">
          {timeOptions.map((item) => (
            <button
              key={item.value}
              onClick={() => chooseTime(item.value)}
              className={selectedTime === item.value ? "time-active" : ""}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="timer-right">
        <div
          className="timer-circle"
          style={{
            background: `conic-gradient(#f7c76b ${progress}%, #3a2923 ${progress}%)`
          }}
        >
          <div className="timer-inner">
            <h1>{formatTime(secondsLeft)}</h1>
            <p>{timerOn ? "Timer is ON" : secondsLeft === 0 ? "Time is Up" : "Timer is OFF"}</p>
          </div>
        </div>

        <div className="timer-buttons">
          <button onClick={startTimer}>Start</button>
          <button onClick={pauseTimer}>Pause</button>
          <button onClick={resetTimer}>Reset</button>
        </div>
      </div>
    </section>
  )
}

export default GameTimer
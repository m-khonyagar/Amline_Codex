import { useState, useEffect, useRef, useCallback } from 'react'

const calculate = (total) => {
  const seconds = total % 60
  const days = Math.floor(total / (3600 * 24))
  const hours = Math.floor((total % (3600 * 24)) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  return {
    days,
    total,
    hours,
    seconds,
    minutes,
    formattedDays: `0${days}`.slice(-2),
    formattedHours: `0${hours}`.slice(-2),
    formattedSeconds: `0${seconds}`.slice(-2),
    formattedMinutes: `0${minutes}`.slice(-2),
  }
}

const useCountdown = (seconds, { onTimesUp, startOnMount = true } = {}) => {
  const timer = useRef({
    timeLeft: undefined,
    timeoutID: undefined,
  })

  const [timeLeft, setTimeLeft] = useState(calculate(seconds))

  const run = useCallback(
    (_timeLeft = seconds) => {
      if (timer.current.timeLeft === undefined) {
        timer.current.timeLeft = _timeLeft
      }

      timer.current.timeoutID = setTimeout(() => {
        if (timer.current.timeLeft && timer.current.timeLeft > 0) {
          setTimeLeft((p) => {
            timer.current.timeLeft = p.total - 1
            return calculate(timer.current.timeLeft)
          })
        }

        if (timer.current.timeLeft && timer.current.timeLeft > 0) {
          run()
        } else if (timer.current.timeLeft === 0) {
          onTimesUp?.()
        }
      }, 1000)
    },
    [onTimesUp, seconds]
  )

  const start = useCallback(
    (newSeconds) => {
      clearTimeout(timer.current.timeoutID)
      run(newSeconds)
    },
    [run]
  )

  const reset = useCallback(
    (newSeconds = seconds) => {
      clearTimeout(timer.current.timeoutID)
      setTimeLeft(calculate(newSeconds))
      timer.current = {}
      start(newSeconds)
    },
    [seconds, start]
  )

  useEffect(() => {
    if (startOnMount) start(seconds)

    return () => clearTimeout(timer.current.timeoutID)
  }, [start, startOnMount, seconds])

  return { timeLeft, start, reset }
}

export { useCountdown }

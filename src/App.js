import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [running, setRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);

  const audioRef = useRef(null);

  const decrementBreakLength = () => {
    if (breakLength > 1 && !running) {
      setBreakLength(breakLength - 1);
    }
  };

  const incrementBreakLength = () => {
    if (breakLength < 60 && !running) {
      setBreakLength(breakLength + 1);
    }
  };

  const decrementSessionLength = () => {
    if (sessionLength > 1 && !running) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };

  const incrementSessionLength = () => {
    if (sessionLength < 60 && !running) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };

  const startStopTimer = () => {
    setRunning(!running);
  };

  const resetTimer = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel('Session');
    setTimeLeft(25 * 60);
    setRunning(false);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (running) {
      setTimerInterval(
        setInterval(() => {
          setTimeLeft((prevTimeLeft) => {
            if (prevTimeLeft === 0) {
              setTimerLabel((prevTimerLabel) =>
                prevTimerLabel === 'Session' ? 'Break' : 'Session'
              );
              const newTimeLeft =
                timerLabel === 'Session' ? breakLength * 60 : sessionLength * 60;
              audioRef.current.play();
              return newTimeLeft;
            }
            return prevTimeLeft - 1;
          });
        }, 1000)
      );
    } else if (!running && timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [running, timerInterval, breakLength, sessionLength, timerLabel]);

  useEffect(() => {
    if (timeLeft === 0) {
      audioRef.current.play();
    }
  }, [timeLeft]);

  return (
    <div className="App">
      <div id="break-label">
        <h2>Break Length</h2>
        <div>
          <button id="break-decrement" onClick={decrementBreakLength}>
            -
          </button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={incrementBreakLength}>
            +
          </button>
        </div>
      </div>
      <div id="session-label">
        <h2>Session Length</h2>
        <div>
          <button id="session-decrement" onClick={decrementSessionLength}>
            -
          </button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={incrementSessionLength}>
            +
          </button>
        </div>
      </div>
      <div id="timer-label">
        <h2>{timerLabel}</h2>
        <div id="time-left">{formatTime(timeLeft)}</div>
      </div>
      <button id="start_stop" onClick={startStopTimer}>
        Start/Stop
      </button>
      <button id="reset" onClick={resetTimer}>
        Reset
      </button>
      <audio
        id="beep"
        ref={audioRef}
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      ></audio>
    </div>
  );
};

export default App;

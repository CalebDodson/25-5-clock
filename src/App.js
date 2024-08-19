import './App.css';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import React, { useEffect, useState, useRef } from 'react';
import beepSound from './Ring-sound-effect.mp3'

function App() {

  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const audioRef = useRef(null);

  const incrementBreak = () => {
    setBreakLength(prev => {
      const newBreakLength = Math.min(prev + 1, 60);
      if (!isPlaying && !isSession) {
        setTimeLeft(newBreakLength * 60);
      }
      return newBreakLength;
    });
  };

  const decrementBreak = () => {
    setBreakLength(prev => {
      const newBreakLength = Math.max(prev - 1, 1);
      if (!isPlaying && !isSession) {
        setTimeLeft(newBreakLength * 60);
      }
      return newBreakLength;
    });
  };

  const incrementSession = () => {
    setSessionLength(prev => {
      const newSessionLength = Math.min(prev + 1, 60);
      if (!isPlaying && isSession) {
        setTimeLeft(newSessionLength * 60);
      }
      return newSessionLength;
    });
  };

  const decrementSession = () => {
    setSessionLength(prev => {
      const newSessionLength = Math.max(prev - 1, 1);
      if (!isPlaying && isSession) {
        setTimeLeft(newSessionLength * 60);
      }
      return newSessionLength;
    });
  };
  const decrementTimeLeft = () => setTimeLeft(prev => Math.max(prev - 1, 0))

  const reset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsPlaying(false);
    setIsSession(true);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds/60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  const handleStartStop = () => setIsPlaying(prev => !prev);

  useEffect(() => {
    if (isPlaying && timeLeft === 0) {
      if (audioRef.current) {
        audioRef.current.play();
      }
      if (isSession) {
        setIsSession(false);
        setTimeLeft(breakLength * 60);
      } else {
        setIsSession(true);
        setTimeLeft(sessionLength * 60);
      }
    }
    let interval = null;
    if (isPlaying) {
      interval = setInterval(decrementTimeLeft, 1000);
    } else if (!isPlaying && timeLeft !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, isSession, breakLength, sessionLength]);

  return (
    <div id="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper 
        elevation={3} 
        sx={{ paddingY: 3, paddingX: 8, backgroundColor: "#fbdd74" }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          pb={3}
          style={{ display: "flex", justifyContent: "center", color: "#1f1235", fontWeight: "bold" }}
        >
          Pomodoro Clock
        </Typography>
        <Grid 
          container 
          spacing ={4}
        >
          <Grid 
            item 
            xs={6}
          >
            <Typography 
              id="break-label" 
              variant="h5" 
              component="h2" 
              style={{ display: "flex", justifyContent: "center", whiteSpace: 'nowrap', color: "#1b1425", fontWeight: "bold" }}
            >
              Break Length
            </Typography>
            <Grid container pb={3}>
              <Grid 
                item 
                xs={4}
              >
                <Button 
                  id="break-decrement" 
                  onClick={decrementBreak} 
                  sx={{
                    '&:hover': {
                      backgroundColor: '#ff6e6c', // Change this to your desired highlight color
                    },
                  }}
                >
                  <ArrowDownwardIcon style={{ color: "black" }}/>
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Typography 
                  id="break-length"
                  sx={{ fontSize:"h6.fontSize" }} 
                  style={{ display: "flex", justifyContent: "center", color: "#1b1425", fontWeight: "bold" }}
                >
                  {breakLength}
                </Typography>
              </Grid>
              <Grid 
                item 
                xs={4}
              >
                <Button 
                  id="break-increment" 
                  onClick={incrementBreak}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#ff6e6c', // Change this to your desired highlight color
                    },
                  }}
                >
                  <ArrowUpwardIcon style={{ color: "black" }}/>
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid 
            item 
            xs={6}
          >
            <Typography 
              id="session-label"
              variant="h5" 
              component="h2" 
              style={{ display: "flex", justifyContent: "center", whiteSpace: 'nowrap', color: "#1b1425", fontWeight: "bold" }}
            >
              Session Length
            </Typography>
            <Grid container>
              <Grid 
                item 
                xs={4}
              >
                <Button 
                  id="session-decrement" 
                  onClick={decrementSession}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#ff6e6c', // Change this to your desired highlight color
                    },
                  }}
                >
                  <ArrowDownwardIcon style={{ color: "black" }}/>
                </Button>
              </Grid>
              <Grid 
                item 
                xs={4}
              >
                <Typography 
                  id="session-length"
                  sx={{ fontSize:"h6.fontSize" }}
                  style={{ display: "flex", justifyContent: "center", color: "#1b1425", fontWeight: "bold" }}
                >
                  {sessionLength}
                </Typography>
              </Grid>
              <Grid 
                item 
                xs={4}
              >
                <Button 
                  id="session-increment" 
                  onClick={incrementSession}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#ff6e6c', // Change this to your desired highlight color
                    },
                  }}
                >
                  <ArrowUpwardIcon style={{ color: "black" }}/>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Card>
          <Typography 
            id="timer-label"
            variant="h5" 
            component="h2" 
            style={{ display: "flex", justifyContent: "center", color: "#1f12355", fontWeight: "bold" }}
          >
            {isSession ? "Session" : "Break"}
          </Typography>
          <Typography 
            id="time-left"
            variant="h1" 
            component="div" 
            style={{ display: "flex", justifyContent: "center" }}
          >
            {formatTime(timeLeft)}
          </Typography>
        </Card>
        <Grid container mt={1}>
          <Grid 
            item 
            xs={6}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button 
              id="start_stop" 
              onClick={handleStartStop}
              sx={{
                '&:hover': {
                  backgroundColor: '#ff6e6c', // Change this to your desired highlight color
                },
              }}
            >
              <PlayArrowIcon style={{ color: "black" }}/>
              <PauseIcon style={{ color: "black" }}/>
            </Button>
          </Grid>
          <Grid 
            item 
            xs={6}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button 
              id="reset" 
              onClick={reset}
              sx={{
                '&:hover': {
                  backgroundColor: '#ff6e6c', // Change this to your desired highlight color
                },
              }}
            >
              <ReplayIcon style={{ color: "black" }}/>
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <audio id="beep" ref={audioRef} src={beepSound}></audio>
      <footer><a class="footer-link" href="https://www.freepik.com/search">Icon by sonnycandra</a></footer>
    </div>
  );
}

export default App;

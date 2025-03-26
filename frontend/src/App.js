import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Container, Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, TextField, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import { deepPurple, green, blue, grey, red, orange } from '@mui/material/colors';
import { createGlobalStyle } from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import cyberBg from './cyber-bg.jpg';

// Add this import near the top with other imports
import logo from './logo.png';

const PerformanceIndicator = styled('div')(({ value }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#fff',
  background: value > 80 ? red[500] :
              value > 60 ? orange[500] :
              value > 40 ? blue[500] : green[500],
  transition: 'all 0.3s ease',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1)' },
  }
}));

const AnimatedValue = styled(Typography)(({ theme }) => ({
  animation: 'slideIn 0.5s ease',
  '@keyframes slideIn': {
    '0%': { transform: 'translateY(10px)', opacity: 0 },
    '100%': { transform: 'translateY(0)', opacity: 1 },
  }
}));

// Update the StyledPaper component
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderRadius: 24,
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  background: 'rgba(20, 20, 20, 0.75)', // Increased opacity from 0.1 to 0.75
  backdropFilter: 'blur(2px)', // Further reduced blur
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '@::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 100%), url(${cyberBg})`, // Reduced gradient opacity
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.05, // Further reduced opacity
    zIndex: 0,
  },
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
    background: 'rgba(20, 20, 20, 0.15)', // Reduced hover opacity from 0.5
    '&::before': {
      opacity: 0.15, // Reduced from 0.2
    },
  }
}));

const ChartContainer = styled('div')({
  margin: '20px 0',
  height: 300,
  width: '100%',  // Added width
  '& .recharts-surface': {
    borderRadius: 12,
  }
});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${grey[200]}`,
  padding: theme.spacing(2),
}));

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Orbitron', sans-serif;
  }
`;

// Remove this import
// import { createGlobalStyle } from 'styled-components';

// Replace GlobalStyle with MUI's styled utility
// Update the GlobalStyles to include Ubuntu font
const GlobalStyles = styled('div')({
  '@global': {
    '@import': "url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap')",
    body: {
      margin: 0,
      padding: 0,
      fontFamily: "'Orbitron', sans-serif",
    }
  }
});

// Remove all these duplicate imports
// Remove from "// Keep only one set of imports at the top"
// through all the import statements that follow it

function App() {
  // Add search state
  const [searchTerm, setSearchTerm] = useState('');
  
  const [metrics, setMetrics] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8000/ws');
    
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMetrics(current => [...current, data.metrics].slice(-50));
      setProcesses(data.processes);
    };

    setWs(websocket);
    return () => websocket.close();
  }, []);

  const getPerformanceStatus = (value) => {
    if (value > 80) return 'Critical';
    if (value > 60) return 'Warning';
    if (value > 40) return 'Moderate';
    return 'Good';
  };

  // Add this function to filter processes
  const filteredProcesses = processes.filter(proc => 
    proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proc.pid.toString().includes(searchTerm)
  );

  // Add this function for AI analysis
  const getSystemAnalysis = () => {
    const latestMetrics = metrics[metrics.length - 1];
    if (!latestMetrics) return [];
    
    return [
      { name: 'CPU Headroom', value: 100 - (latestMetrics.cpu || 0), color: blue[300] },
      { name: 'CPU Usage', value: latestMetrics.cpu || 0, color: blue[600] },
      { name: 'Memory Free', value: 100 - (latestMetrics.memory || 0), color: green[300] },
      { name: 'Memory Used', value: latestMetrics.memory || 0, color: green[600] }
    ];
  };

  return (
    <>
      <GlobalStyles />
      <Box sx={{ 
        background: `linear-gradient(
          to bottom,
          rgba(0, 0, 0, 0.1) 0%,
          rgba(0, 0, 0, 0.1) 85%,
          rgba(0, 0, 0, 0.95) 100%
        ), url(${cyberBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        pt: 4,
        pb: 8,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'transparent',
          pointerEvents: 'none',
        }
      }}>
        <Container maxWidth="xl" sx={{ 
          position: 'relative', 
          zIndex: 1,
          py: 4,
          px: { xs: 2, sm: 4 }
        }}>
          {/* Updated logo styles */}
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              position: 'absolute',
              top: 30,
              left: 30,
              width: 100,  // Increased from 60
              height: 100, // Increased from 60
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 15px rgba(77, 249, 255, 0.7))', // Enhanced glow
              zIndex: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                filter: 'drop-shadow(0 0 20px rgba(77, 249, 255, 0.9))',
              }
            }}
          />
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h3" sx={{ 
                fontWeight: 800, 
                background: 'linear-gradient(120deg, #ffffff 0%, #e8eaed 20%, #a4a6a8 40%, #727475 60%, #a4a6a8 80%, #e8eaed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                mb: 4,
                mt: 2,
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                lineHeight: 1.2,
                padding: '15px',
                textShadow: `
                  0 0 10px rgba(77, 249, 255, 0.4),
                  0 0 15px rgba(77, 249, 255, 0.2)
                `,
                fontFamily: "'Ubuntu', sans-serif",
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '180px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(77, 249, 255, 0.3), transparent)',
                }
              }}>
                OS Process Monitor
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <StyledPaper elevation={6}>
                <PerformanceIndicator value={metrics[metrics.length - 1]?.cpu || 0}>
                  {metrics[metrics.length - 1]?.cpu?.toFixed(0)}%
                </PerformanceIndicator>
                <Typography variant="h5" sx={{ color: blue[700], mb: 1, fontWeight: 600 }}>
                  CPU Usage
                </Typography>
                <AnimatedValue variant="subtitle1" sx={{ color: grey[600], mb: 2 }}>
                  Status: {getPerformanceStatus(metrics[metrics.length - 1]?.cpu || 0)}
                </AnimatedValue>
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke={grey[300]} />
                      <XAxis dataKey="timestamp" stroke={grey[600]} />
                      <YAxis stroke={grey[600]} />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'rgba(255,255,255,0.95)', 
                          border: 'none', 
                          borderRadius: 12, 
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="cpu" 
                        stroke={blue[500]} 
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </StyledPaper>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledPaper elevation={3}>
                <Typography variant="h5" sx={{ color: green[700], mb: 2 }}>
                  Memory Usage
                </Typography>
                <ChartContainer>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                      <XAxis dataKey="timestamp" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip contentStyle={{ background: '#fff', border: 'none', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                      <Legend />
                      <Line type="monotone" dataKey="memory" stroke={green[500]} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </StyledPaper>
            </Grid>

          <Grid item xs={12}>
            <StyledPaper elevation={3}>
              <Typography variant="h5" sx={{ color: '#9c27b0', mb: 3, fontWeight: 600 }}>
                Process List
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search processes by name or PID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#9c27b0',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell sx={{ 
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Increased opacity
                        color: '#00e5ff'
                      }}>PID</StyledTableCell>
                      <StyledTableCell sx={{ 
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Increased opacity
                        color: '#00e5ff'
                      }}>Name</StyledTableCell>
                      <StyledTableCell sx={{ 
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Increased opacity
                        color: '#00e5ff'
                      }}>CPU %</StyledTableCell>
                      <StyledTableCell sx={{ 
                        fontWeight: 'bold',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Increased opacity
                        color: '#00e5ff'
                      }}>Memory %</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProcesses.map(proc => (
                        <TableRow 
                          key={proc.pid} 
                          hover
                          sx={{
                            '& .MuiTableCell-root': {
                              color: '#fff',
                              backgroundColor: 'rgba(0, 0, 0, 0.75)', // Added background color
                            },
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.85) !important', // Darker hover state
                              transform: 'scale(1.01)',
                              transition: 'all 0.2s ease',
                            },
                            backgroundColor: proc.cpu_percent > 50 ? 'rgba(244, 67, 54, 0.7) !important' : // Increased opacity
                                           proc.cpu_percent > 30 ? 'rgba(255, 152, 0, 0.7) !important' : 'rgba(0, 0, 0, 0.75)', // Increased opacity
                          }}
                        >
                          <StyledTableCell>{proc.pid}</StyledTableCell>
                          <StyledTableCell>{proc.name}</StyledTableCell>
                          <StyledTableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ 
                                width: '50px', 
                                height: '6px', 
                                borderRadius: '3px',
                                background: `linear-gradient(90deg, ${blue[500]} ${proc.cpu_percent}%, ${grey[200]} ${proc.cpu_percent}%)`
                              }} />
                              {proc.cpu_percent?.toFixed(1)}%
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ 
                                width: '50px', 
                                height: '6px', 
                                borderRadius: '3px',
                                background: `linear-gradient(90deg, ${green[500]} ${proc.memory_percent}%, ${grey[200]} ${proc.memory_percent}%)`
                              }} />
                              {proc.memory_percent?.toFixed(1)}%
                            </Box>
                          </StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </StyledPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default App;

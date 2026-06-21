// --- State Management ---
const AppState = {
  theme: 'dark',
  uptimeStart: Date.now(),
  consoleHistory: [],
  cpuHistory: Array(20).fill(10), // Initialize empty history
  ramUsage: 42,
  swapUsage: 18,
  isRecording: false,
  mediaRecorder: null,
  recordedChunks: [],
  screenStream: null,
  capturedBlob: null,
  capturedType: null, // 'video' or 'image'
};

// --- DOM Elements ---
const themeToggle = document.getElementById('themeToggle');
const themeIconDark = document.querySelector('.theme-icon-dark');
const themeIconLight = document.querySelector('.theme-icon-light');

const timeClock = document.getElementById('timeClock');
const dateCalendar = document.getElementById('dateCalendar');
const uptimeVal = document.getElementById('uptime-val');

const networkStatus = document.getElementById('network-status');
const networkIcon = document.getElementById('network-icon');
const pingLatency = document.getElementById('ping-latency');
const batteryStatus = document.getElementById('battery-status');
const batteryIcon = document.getElementById('battery-icon');

const ramProgress = document.getElementById('ram-progress');
const ramPercent = document.getElementById('ram-percent');
const ramUsed = document.getElementById('ram-used');
const ramTotalVal = document.getElementById('ram-total');

const swapProgress = document.getElementById('swap-progress');
const swapPercent = document.getElementById('swap-percent');
const swapUsed = document.getElementById('swap-used');

const cmdInput = document.getElementById('cmdInput');
const cmdBtn = document.getElementById('cmdBtn');
const consoleLogs = document.getElementById('consoleLogs');
const clearConsoleBtn = document.getElementById('clearConsole');

const startRecordBtn = document.getElementById('startRecordBtn');
const stopRecordBtn = document.getElementById('stopRecordBtn');
const takeSnipBtn = document.getElementById('takeSnipBtn');
const previewViewport = document.getElementById('previewViewport');
const recordPreview = document.getElementById('recordPreview');
const snipCanvas = document.getElementById('snipCanvas');
const snipEditorContainer = document.querySelector('.snip-editor-container');
const outputActions = document.getElementById('outputActions');
const downloadCaptureBtn = document.getElementById('downloadCaptureBtn');
const clearCaptureBtn = document.getElementById('clearCaptureBtn');
const captureBadge = document.getElementById('capture-badge');
const cpuBadge = document.getElementById('cpu-badge');
const cpuFreq = document.getElementById('cpu-freq');
const cpuProcesses = document.getElementById('cpu-processes');

// --- Helper Functions ---
function logConsole(message, type = 'system') {
  const line = document.createElement('div');
  line.className = `console-line ${type}-msg`;
  line.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
  consoleLogs.appendChild(line);
  consoleLogs.scrollTop = consoleLogs.scrollHeight;
}

// Update Circular Progress Bar Gauge
function setProgressGauge(circleElement, percent) {
  const radius = circleElement.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  circleElement.style.strokeDasharray = `${circumference} ${circumference}`;
  
  const offset = circumference - (percent / 100) * circumference;
  circleElement.style.strokeDashoffset = offset;
}

// --- Theme Switcher ---
function initTheme() {
  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    AppState.theme = nextTheme;
    
    if (nextTheme === 'light') {
      themeIconDark.style.display = 'none';
      themeIconLight.style.display = 'inline-block';
      logConsole('Theme switched to LIGHT mode', 'system');
    } else {
      themeIconDark.style.display = 'inline-block';
      themeIconLight.style.display = 'none';
      logConsole('Theme switched to DARK mode', 'system');
    }
  });
}

// --- Clock & Uptime & Battery ---
function initSystemClock() {
  setInterval(() => {
    // Current time
    const now = new Date();
    timeClock.innerText = now.toLocaleTimeString();
    
    // Current date
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    dateCalendar.innerText = now.toLocaleDateString('en-US', options);
    
    // Uptime counter
    const uptimeDiff = Date.now() - AppState.uptimeStart;
    const uptimeSecs = Math.floor(uptimeDiff / 1000) % 60;
    const uptimeMins = Math.floor(uptimeDiff / (1000 * 60)) % 60;
    const uptimeHours = Math.floor(uptimeDiff / (1000 * 60 * 60));
    
    const pad = (num) => String(num).padStart(2, '0');
    uptimeVal.innerText = `${pad(uptimeHours)}:${pad(uptimeMins)}:${pad(uptimeSecs)}`;
  }, 1000);
}

function initBatteryAPI() {
  if ('getBattery' in navigator) {
    navigator.getBattery().then((battery) => {
      const updateBatteryInfo = () => {
        const pct = Math.round(battery.level * 100);
        const charging = battery.charging ? ' (Charging)' : '';
        batteryStatus.innerText = `${pct}%${charging}`;
        
        // Update Icon based on status
        if (battery.charging) {
          batteryIcon.setAttribute('data-lucide', 'battery-charging');
        } else if (battery.level > 0.8) {
          batteryIcon.setAttribute('data-lucide', 'battery');
        } else if (battery.level > 0.3) {
          batteryIcon.setAttribute('data-lucide', 'battery-medium');
        } else {
          batteryIcon.setAttribute('data-lucide', 'battery-warning');
        }
        lucide.createIcons();
      };
      
      updateBatteryInfo();
      battery.addEventListener('levelchange', updateBatteryInfo);
      battery.addEventListener('chargingchange', updateBatteryInfo);
    });
  } else {
    batteryStatus.innerText = '94% (AC Mode)';
  }
}

// --- Network & Online Status ---
function initNetworkDiagnostics() {
  const updateOnlineStatus = () => {
    if (navigator.onLine) {
      networkStatus.innerText = 'Online';
      networkStatus.style.color = '';
      networkIcon.setAttribute('data-lucide', 'wifi');
      logConsole('Internet connection restored.', 'system');
    } else {
      networkStatus.innerText = 'Offline';
      networkStatus.style.color = 'var(--accent-red)';
      networkIcon.setAttribute('data-lucide', 'wifi-off');
      logConsole('Internet connection disconnected!', 'error');
    }
    lucide.createIcons();
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // Real network latency simulator
  setInterval(() => {
    if (!navigator.onLine) {
      pingLatency.innerText = 'Disconnected';
      return;
    }
    
    // Simulate real ping check
    const start = Date.now();
    fetch('https://httpbin.org/delay/0', { mode: 'no-cors', cache: 'no-store' })
      .then(() => {
        const latency = Date.now() - start;
        pingLatency.innerText = `${latency} ms`;
      })
      .catch(() => {
        // Fallback to randomized realistic ping if blocked by CORS or network issues
        const mockLatency = Math.floor(Math.random() * 20) + 12;
        pingLatency.innerText = `${mockLatency} ms`;
      });
  }, 4000);
}

// --- Dynamic Memory & Gauge Simulator ---
function initMemoryMonitor() {
  // Check device physical RAM (available via Chrome navigator.deviceMemory in GB)
  const physicalRam = navigator.deviceMemory || 16;
  ramTotalVal.innerText = `${physicalRam.toFixed(1)} GB Physical`;
  
  setInterval(() => {
    // RAM usage fluctuations
    let delta = (Math.random() - 0.5) * 2; // -1% to +1%
    AppState.ramUsage = Math.min(Math.max(AppState.ramUsage + delta, 30), 85);
    
    // SWAP usage fluctuations (slow fluctuation)
    let swapDelta = (Math.random() - 0.5) * 0.5;
    AppState.swapUsage = Math.min(Math.max(AppState.swapUsage + swapDelta, 10), 35);
    
    // Update RAM Gauge UI
    const ramPctText = `${Math.round(AppState.ramUsage)}%`;
    ramPercent.innerText = ramPctText;
    const ramUsedGB = ((AppState.ramUsage / 100) * physicalRam).toFixed(1);
    ramUsed.innerText = `${ramUsedGB} GB`;
    setProgressGauge(ramProgress, AppState.ramUsage);
    
    // Update SWAP Gauge UI
    const swapPctText = `${Math.round(AppState.swapUsage)}%`;
    swapPercent.innerText = swapPctText;
    const swapUsedGB = ((AppState.swapUsage / 100) * 4).toFixed(1); // Virtual swap total as 4.0 GB
    swapUsed.innerText = `${swapUsedGB} GB`;
    setProgressGauge(swapProgress, AppState.swapUsage);
  }, 2000);
}

// --- Canvas CPU Performance Graph ---
function initCpuChart() {
  const canvas = document.getElementById('cpuChart');
  const ctx = canvas.getContext('2d');
  
  // Dynamic resize canvas for resolution scaling
  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  
  // CPU Metric updates loop
  setInterval(() => {
    // Simulating CPU load spikes & cooling
    let spike = 0;
    if (AppState.isRecording) spike = Math.random() * 25 + 30; // Heavy capture load
    
    let baseLoad = Math.sin(Date.now() / 15000) * 10 + 20; // Periodic oscillation
    let randomJitter = (Math.random() - 0.5) * 8;
    
    const finalLoad = Math.min(Math.max(Math.round(baseLoad + randomJitter + spike), 3), 99);
    
    // Frequency indicator fluctuation
    const freq = (3.2 + (finalLoad / 100) * 0.8 + (Math.random() - 0.5) * 0.1).toFixed(2);
    cpuFreq.innerText = `${freq} GHz`;
    
    // Active processes fluctuation
    const procs = Math.floor(138 + Math.sin(Date.now() / 30000) * 10 + Math.random() * 5);
    cpuProcesses.innerText = procs;
    
    cpuBadge.innerText = `Load: ${finalLoad}%`;
    
    AppState.cpuHistory.push(finalLoad);
    if (AppState.cpuHistory.length > 30) {
      AppState.cpuHistory.shift();
    }
  }, 1000);
  
  // Graphic Render Loop
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const width = canvas.width;
    const height = canvas.height;
    const history = AppState.cpuHistory;
    const totalPoints = history.length;
    
    if (totalPoints < 2) return requestAnimationFrame(draw);
    
    // Calculate Step width
    const stepX = width / (totalPoints - 1);
    
    // Draw grid lines
    ctx.strokeStyle = AppState.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      let y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Create CPU line gradient path
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    if (AppState.theme === 'dark') {
      grad.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
      grad.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
    } else {
      grad.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
      grad.addColorStop(1, 'rgba(59, 130, 246, 0.02)');
    }
    
    // Fill Area under curve
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let i = 0; i < totalPoints; i++) {
      const val = history[i];
      const x = i * stepX;
      const y = height - (val / 100) * (height - 10);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    
    // Draw outline stroke line
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'var(--accent-blue)';
    
    for (let i = 0; i < totalPoints; i++) {
      const val = history[i];
      const x = i * stepX;
      const y = height - (val / 100) * (height - 10);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    requestAnimationFrame(draw);
  }
  
  // Start canvas animation frame loop
  requestAnimationFrame(draw);
}

// --- Screen Snip & Recording Hub ---

function resetCaptureUI() {
  recordPreview.style.display = 'none';
  recordPreview.src = '';
  snipEditorContainer.style.display = 'none';
  
  // Show placeholder
  const placeholder = document.querySelector('.viewport-placeholder');
  if (placeholder) placeholder.style.display = 'flex';
  
  outputActions.style.display = 'none';
  AppState.capturedBlob = null;
  AppState.capturedType = null;
}

// Start screen capture/record
async function startScreenRecording() {
  try {
    logConsole('Accessing MediaDevices Display API...', 'system');
    AppState.recordedChunks = [];
    
    // Standard screen share stream request
    AppState.screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always"
      },
      audio: true
    });
    
    logConsole('Screen share initialized successfully. Starting recording compiler...', 'system');
    
    // Setup MediaRecorder
    let options = { mimeType: 'video/webm; codecs=vp9' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: 'video/webm; codecs=vp8' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm' };
      }
    }
    
    AppState.mediaRecorder = new MediaRecorder(AppState.screenStream, options);
    
    AppState.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        AppState.recordedChunks.push(event.data);
      }
    };
    
    AppState.mediaRecorder.onstop = () => {
      logConsole('Media capture stopped. Processing raw clip data...', 'system');
      
      const blob = new Blob(AppState.recordedChunks, { type: 'video/webm' });
      AppState.capturedBlob = blob;
      AppState.capturedType = 'video';
      
      // Load file to preview
      recordPreview.src = URL.createObjectURL(blob);
      recordPreview.style.display = 'block';
      
      // Hide placeholder
      const placeholder = document.querySelector('.viewport-placeholder');
      if (placeholder) placeholder.style.display = 'none';
      
      outputActions.style.display = 'flex';
      
      // Stop all tracks in stream
      if (AppState.screenStream) {
        AppState.screenStream.getTracks().forEach(track => track.stop());
      }
      
      AppState.isRecording = false;
      captureBadge.style.display = 'none';
      startRecordBtn.style.display = 'flex';
      stopRecordBtn.style.display = 'none';
      logConsole('Video recording compiled! Ready for download.', 'system');
    };
    
    // Handle stream stop directly from browser bar click
    AppState.screenStream.getVideoTracks()[0].onended = () => {
      if (AppState.mediaRecorder && AppState.mediaRecorder.state !== 'inactive') {
        AppState.mediaRecorder.stop();
      }
    };
    
    AppState.mediaRecorder.start();
    AppState.isRecording = true;
    captureBadge.style.display = 'flex';
    startRecordBtn.style.display = 'none';
    stopRecordBtn.style.display = 'flex';
    logConsole('Recording active. Capture your desktop screen.', 'system');
    
  } catch (err) {
    logConsole(`Recording aborted: ${err.message}`, 'error');
    console.error(err);
  }
}

// Snipping/Screenshot capture engine
async function takeScreenSnip() {
  try {
    logConsole('Requesting desktop interface to take snip...', 'system');
    
    const snipStream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: "monitor" }
    });
    
    // Create temporary video element to hold frame data
    const tempVideo = document.createElement('video');
    tempVideo.srcObject = snipStream;
    tempVideo.autoplay = true;
    tempVideo.playsInline = true;
    
    tempVideo.onloadedmetadata = () => {
      // Small timeout to allow stream buffer render frame
      setTimeout(() => {
        const width = tempVideo.videoWidth;
        const height = tempVideo.videoHeight;
        
        snipCanvas.width = width;
        snipCanvas.height = height;
        
        const canvasCtx = snipCanvas.getContext('2d');
        canvasCtx.drawImage(tempVideo, 0, 0, width, height);
        
        // Output result to preview
        recordPreview.style.display = 'none';
        const placeholder = document.querySelector('.viewport-placeholder');
        if (placeholder) placeholder.style.display = 'none';
        
        snipEditorContainer.style.display = 'flex';
        outputActions.style.display = 'flex';
        
        // Stop screen sharing tracks instantly
        snipStream.getTracks().forEach(track => track.stop());
        
        // Export Canvas frame to blob
        snipCanvas.toBlob((blob) => {
          AppState.capturedBlob = blob;
          AppState.capturedType = 'image';
          logConsole('Desktop screen snip captured successfully!', 'system');
        }, 'image/png');
      }, 500);
    };
    
  } catch (err) {
    logConsole(`Snipping aborted: ${err.message}`, 'error');
  }
}

// Download Trigger
function downloadCapture() {
  if (!AppState.capturedBlob) return;
  
  const url = URL.createObjectURL(AppState.capturedBlob);
  const a = document.createElement('a');
  a.href = url;
  
  if (AppState.capturedType === 'video') {
    a.download = `OS-Record-${Date.now()}.webm`;
  } else if (AppState.capturedType === 'image') {
    a.download = `OS-Snip-${Date.now()}.png`;
  }
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  logConsole(`Downloaded file successfully.`, 'system');
}

// Setup Events
function initCaptureModule() {
  startRecordBtn.addEventListener('click', startScreenRecording);
  stopRecordBtn.addEventListener('click', () => {
    if (AppState.mediaRecorder && AppState.mediaRecorder.state !== 'inactive') {
      AppState.mediaRecorder.stop();
    }
  });
  
  takeSnipBtn.addEventListener('click', takeScreenSnip);
  clearCaptureBtn.addEventListener('click', () => {
    resetCaptureUI();
    logConsole('Capture preview cleared.', 'system');
  });
  
  downloadCaptureBtn.addEventListener('click', downloadCapture);
}

// --- CLI Command Input System ---
function runSystemCommand(cmdText) {
  const trimmed = cmdText.trim();
  if (!trimmed) return;
  
  logConsole(`$ ${trimmed}`, 'user');
  
  const tokens = trimmed.split(' ');
  const command = tokens[0].toLowerCase();
  
  switch(command) {
    case '/help':
    case 'help':
      logConsole('--- Available Dashboard CLI Commands ---', 'system');
      logConsole('/snip       : Triggers the Screen Snip utility', 'system');
      logConsole('/record     : Starts direct screen recording', 'system');
      logConsole('/stop       : Stops active recording process', 'system');
      logConsole('/theme      : Toggles Dark / Light visual mode', 'system');
      logConsole('/clear      : Clears console logs terminal', 'system');
      logConsole('/info       : Outputs simulated CPU specs', 'system');
      break;
      
    case '/snip':
    case 'snip':
      takeScreenSnip();
      break;
      
    case '/record':
    case 'record':
      if (!AppState.isRecording) {
        startScreenRecording();
      } else {
        logConsole('A screen recording is already in progress.', 'error');
      }
      break;
      
    case '/stop':
    case 'stop':
      if (AppState.isRecording) {
        AppState.mediaRecorder.stop();
      } else {
        logConsole('No active recording task found.', 'error');
      }
      break;
      
    case '/theme':
    case 'theme':
    case '/dark':
    case '/light':
      themeToggle.click();
      break;
      
    case '/clear':
    case 'clear':
      consoleLogs.innerHTML = '';
      logConsole('Terminal interface buffer cleared.', 'system');
      break;
      
    case '/info':
    case 'info':
      logConsole(`--- SYSTEM HARDWARE REPORT ---`, 'system');
      logConsole(`CPU Cores: 8x Logical Processors`, 'system');
      logConsole(`CPU Clock: ${cpuFreq.innerText}`, 'system');
      logConsole(`Memory Total: ${ramTotalVal.innerText}`, 'system');
      logConsole(`System OS Type: WebAssembly Native Sandbox (Chrome Core)`, 'system');
      break;
      
    default:
      logConsole(`CLI Shell Error: Command not recognized "${command}". Type /help for assistance.`, 'error');
      break;
  }
  
  cmdInput.value = '';
}

function initCommandCLI() {
  cmdBtn.addEventListener('click', () => {
    runSystemCommand(cmdInput.value);
  });
  
  cmdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runSystemCommand(cmdInput.value);
    }
  });
  
  clearConsoleBtn.addEventListener('click', () => {
    consoleLogs.innerHTML = '';
    logConsole('Dashboard Console logs cleared.', 'system');
  });
}

// --- App Initialization ---
function initApp() {
  logConsole('VisionOS Framework Initialized. Allocating buffer sectors...', 'system');
  
  initTheme();
  initSystemClock();
  initBatteryAPI();
  initNetworkDiagnostics();
  initMemoryMonitor();
  initCpuChart();
  initCaptureModule();
  initCommandCLI();
  
  logConsole('System status indicators online.', 'system');
}

// Start everything
window.addEventListener('DOMContentLoaded', initApp);

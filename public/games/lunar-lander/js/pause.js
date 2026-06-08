// ── PAUSE + ALWAYS-ACTIVE ──────────────────────────────────────────────────────
// P or SPACE = toggle pause
// Game keeps running when you switch apps, minimize, or change tabs
// ─────────────────────────────────────────────────────────────────────────────
let _paused = false;
let _pauseOverlay = null;

function _showPauseOverlay() {
  if (_pauseOverlay) return;
  _pauseOverlay = document.createElement('div');
  Object.assign(_pauseOverlay.style, {
    position:'fixed', inset:'0', background:'rgba(0,0,0,0.72)',
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
    zIndex:'9999', fontFamily:"'Courier New',monospace", pointerEvents:'none'
  });
  _pauseOverlay.innerHTML = `
    <div style="color:#00ff88;font-size:clamp(24px,5vw,48px);letter-spacing:6px;font-weight:bold;text-shadow:0 0 30px #00ff8888">PAUSED</div>
    <div style="color:#1a3a2a;font-size:12px;letter-spacing:3px;margin-top:14px">PRESS P OR SPACE TO RESUME</div>
  `;
  document.body.appendChild(_pauseOverlay);
}

function _hidePauseOverlay() {
  if (_pauseOverlay) { _pauseOverlay.remove(); _pauseOverlay = null; }
}

function _setPaused(val) {
  _paused = val;
  if (_paused) _showPauseOverlay(); else _hidePauseOverlay();
}

document.addEventListener('keydown', e => {
  if (e.code === 'KeyP' || e.code === 'Space') {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    e.preventDefault();
    _setPaused(!_paused);
  }
});

// ── Override requestAnimationFrame ───────────────────────────────────────────
// The browser freezes rAF when the tab/window is not visible.
// Replace it with setTimeout so the simulation keeps running regardless.
(function() {
  const _nativeRAF = window.requestAnimationFrame.bind(window);
  const _handles = new Map();
  let _nextId = 1;

  window.requestAnimationFrame = function(callback) {
    const id = _nextId++;
    let handle;
    if (document.hidden) {
      // Tab/window not visible — use setTimeout to bypass browser throttle
      handle = setTimeout(() => {
        _handles.delete(id);
        callback(performance.now());
      }, 1000 / 60);
    } else {
      handle = _nativeRAF((ts) => {
        _handles.delete(id);
        callback(ts);
      });
    }
    _handles.set(id, { type: document.hidden ? 'timeout' : 'raf', handle });
    return id;
  };

  window.cancelAnimationFrame = function(id) {
    const entry = _handles.get(id);
    if (!entry) return;
    if (entry.type === 'timeout') clearTimeout(entry.handle);
    else _nativeRAF.cancel ? _nativeRAF.cancel(entry.handle) : cancelAnimationFrame(entry.handle);
    _handles.delete(id);
  };
})();

// ── Web Worker heartbeat (legacy — keeps existing onWorkerTick code happy) ───
let _workerBlob = new Blob([`
  let t = null;
  self.onmessage = e => {
    if (e.data === 'start') t = setInterval(()=>self.postMessage('tick'), 1000/60);
    if (e.data === 'stop')  { clearInterval(t); t = null; }
  };
`], {type:'application/javascript'});
let _worker = new Worker(URL.createObjectURL(_workerBlob));
let _workerCallbacks = [];
_worker.onmessage = () => { if (!_paused) _workerCallbacks.forEach(fn=>fn()); };
_worker.postMessage('start');

function onWorkerTick(fn) { _workerCallbacks.push(fn); }
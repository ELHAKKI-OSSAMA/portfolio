// pause.js — P or SPACE toggles pause
// Keeps game alive when tab is hidden via setTimeout fallback
'use strict';

let _paused = false;
let _pauseOverlay = null;

function _showPauseOverlay(){
  if(_pauseOverlay) return;
  _pauseOverlay=document.createElement('div');
  Object.assign(_pauseOverlay.style,{
    position:'fixed', inset:'0',
    background:'rgba(0,0,0,0.72)',
    display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center',
    zIndex:'9999', fontFamily:"'Courier New',monospace",
    pointerEvents:'none'
  });
  _pauseOverlay.innerHTML=`
    <div style="color:#00ff88;font-size:clamp(24px,5vw,48px);letter-spacing:6px;font-weight:bold">PAUSED</div>
    <div style="color:#1a3a2a;font-size:12px;letter-spacing:3px;margin-top:14px">PRESS P OR SPACE TO RESUME</div>
  `;
  document.body.appendChild(_pauseOverlay);
}
function _hidePauseOverlay(){
  if(_pauseOverlay){_pauseOverlay.remove();_pauseOverlay=null;}
}
function _setPaused(val){
  _paused=val;
  if(_paused) _showPauseOverlay(); else _hidePauseOverlay();
}

document.addEventListener('keydown',e=>{
  if(e.code==='KeyP'||e.code==='Space'){
    if(document.activeElement&&document.activeElement.tagName==='INPUT') return;
    e.preventDefault();
    _setPaused(!_paused);
  }
});

// Override rAF to keep running when tab is hidden
(function(){
  const _native=window.requestAnimationFrame.bind(window);
  const _handles=new Map();
  let _nextId=1;
  window.requestAnimationFrame=function(cb){
    const id=_nextId++;
    let h;
    if(document.hidden){
      h=setTimeout(()=>{_handles.delete(id);cb(performance.now());},1000/60);
      _handles.set(id,{type:'timeout',h});
    } else {
      h=_native(ts=>{_handles.delete(id);cb(ts);});
      _handles.set(id,{type:'raf',h});
    }
    return id;
  };
  window.cancelAnimationFrame=function(id){
    const e=_handles.get(id);
    if(!e) return;
    if(e.type==='timeout') clearTimeout(e.h);
    else cancelAnimationFrame(e.h);
    _handles.delete(id);
  };
})();

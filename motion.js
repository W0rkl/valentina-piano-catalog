const root=document.documentElement;
const reduceQuery=matchMedia('(prefers-reduced-motion: reduce)');
const pointerQuery=matchMedia('(hover: hover) and (pointer: fine)');
let manual=false;try{manual=localStorage.getItem('valentina-motion-reduced')==='true';}catch{}
const active=new Set(),states=new Set(),bound=new WeakSet(),observed=new WeakSet();
let frame=0,observer;
export const reducedMotion=()=>manual||reduceQuery.matches;
function revealAll(){document.querySelectorAll('.reveal').forEach(el=>el.classList.add('is-visible'));}
function tick(){
  frame=0;if(document.hidden||reducedMotion())return;
  for(const s of active){
    if(!s.el.isConnected){active.delete(s);continue;}
    for(const k of ['x','y','lift']){s.v[k]=(s.v[k]+(s.target[k]-s.pos[k])*.095)*.76;s.pos[k]+=s.v[k];}
    if(s.kind==='magnetic')s.surface.style.transform=`translate3d(${s.pos.x*9}px,${s.pos.y*7}px,0)`;
    else {const factor=s.strength;s.surface.style.transform=`perspective(1300px) translate3d(${s.pos.x*10*factor}px,${s.pos.y*7*factor-s.pos.lift*10}px,${s.pos.lift*12}px) rotateX(${-s.pos.y*10*factor}deg) rotateY(${s.pos.x*13*factor}deg)`;s.surface.style.setProperty('--gx',`${50+s.pos.x*48}%`);s.surface.style.setProperty('--gy',`${50+s.pos.y*48}%`);s.surface.style.setProperty('--shine',String(.12+s.pos.lift*.58));}
    if(['x','y','lift'].every(k=>Math.abs(s.target[k]-s.pos[k])<.003&&Math.abs(s.v[k])<.003)){active.delete(s);s.surface.style.willChange='';}
  }
  if(active.size)frame=requestAnimationFrame(tick);
}
function wake(s){active.add(s);s.surface.style.willChange='transform';if(!frame&&!document.hidden)frame=requestAnimationFrame(tick);}
function resetMotion(){if(frame)cancelAnimationFrame(frame);frame=0;for(const s of states){s.surface.style.transform='';s.surface.style.willChange='';s.surface.style.removeProperty('--shine');s.pos={x:0,y:0,lift:0};s.v={x:0,y:0,lift:0};s.target={x:0,y:0,lift:0};}active.clear();}
function sync(){const reduced=reducedMotion();root.classList.toggle('motion-reduced',reduced);root.classList.toggle('motion-enabled',!reduced);const button=document.querySelector('#motion-toggle');if(button){button.disabled=reduceQuery.matches;button.setAttribute('aria-pressed',String(reduced));button.setAttribute('aria-label',reduceQuery.matches?'анимация уменьшена в настройках устройства':reduced?'анимация уменьшена; включить эффекты':'уменьшить анимацию');button.title=reduced?'анимация уменьшена':'уменьшить анимацию';}if(reduced){resetMotion();revealAll();}}
function bind(el){if(bound.has(el))return;bound.add(el);const magnetic=el.classList.contains('magnetic');const surface=el.querySelector(magnetic?':scope > span':'.score-surface,.score-stack');if(!surface)return;const s={el,surface,kind:magnetic?'magnetic':'glass',strength:Number(el.dataset.strength||1),pos:{x:0,y:0,lift:0},v:{x:0,y:0,lift:0},target:{x:0,y:0,lift:0}};states.add(s);
  el.addEventListener('pointermove',event=>{if(reducedMotion()||!pointerQuery.matches)return;const r=el.getBoundingClientRect();s.target={x:Math.max(-1,Math.min(1,(event.clientX-r.left)/r.width*2-1)),y:Math.max(-1,Math.min(1,(event.clientY-r.top)/r.height*2-1)),lift:1};wake(s);});
  el.addEventListener('pointerleave',()=>{s.target={x:0,y:0,lift:0};if(!reducedMotion())wake(s);});
}
export function refreshMotion(){
  for(const s of states)if(!s.el.isConnected){states.delete(s);active.delete(s);}sync();document.querySelectorAll('.motion-frame,.magnetic').forEach(bind);
  if(reducedMotion()||!('IntersectionObserver' in window)){revealAll();return;}
  observer??=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.04,rootMargin:'0px 0px -7% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>{if(!observed.has(el)){observed.add(el);observer.observe(el);}});
}
document.querySelector('#motion-toggle')?.addEventListener('click',()=>{manual=!reducedMotion();try{localStorage.setItem('valentina-motion-reduced',String(manual));}catch{}sync();refreshMotion();});
reduceQuery.addEventListener('change',sync);
document.addEventListener('visibilitychange',()=>{if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;}else if(active.size&&!reducedMotion())frame=requestAnimationFrame(tick);});
document.addEventListener('focusin',event=>{event.target.closest('.reveal')?.classList.add('is-visible');});
refreshMotion();

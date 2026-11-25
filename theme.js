(()=>{
  const root=document.documentElement,key='valentina-catalog-theme';
  let theme='dark';
  try{if(localStorage.getItem(key)==='light')theme='light';}catch{}
  function apply(){
    root.dataset.theme=theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#050505':'#d7dbdc');
    const button=document.querySelector('#theme-toggle');
    if(button){const label=theme==='dark'?'включить светлую тему':'включить тёмную тему';button.setAttribute('aria-label',label);button.setAttribute('aria-pressed',String(theme==='light'));button.title=label;}
  }
  apply();
  document.addEventListener('DOMContentLoaded',()=>{
    apply();
    document.querySelector('#theme-toggle')?.addEventListener('click',()=>{
      theme=theme==='dark'?'light':'dark';apply();
      try{localStorage.setItem(key,theme);}catch{}
    });
  },{once:true});
})();

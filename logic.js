export const LEVELS={easy:'простой',medium:'средний',hard:'сложный'};
export function filterCatalog(items,{level='all',video=false,view='all',favorites=new Set()}={}){
  return items.filter(item=>(level==='all'||item.level===level)&&(!video||item.video)&&(view!=='favorites'||favorites.has(item.id)));
}
export function readFavorites(value,ids){try{const a=JSON.parse(value);return new Set(Array.isArray(a)?a.filter(x=>typeof x==='string'&&ids.has(x)):[]);}catch{return new Set();}}
export function isAuthorUrl(value){try{const u=new URL(value);return u.protocol==='https:'&&u.hostname==='boosty.to'&&!u.username&&!u.password&&/^\/piano_with_valentina\/posts\/[0-9a-f-]{36}$/.test(u.pathname);}catch{return false;}}
export function validateCatalog(data){
  if(!Array.isArray(data)||data.length===0)throw new Error('empty catalog');
  const seen=new Set();for(const p of data){if(!p||typeof p.id!=='string'||seen.has(p.id)||!Object.hasOwn(LEVELS,p.level)||!isAuthorUrl(p.url)||['title','author','context','description'].some(k=>typeof p[k]!=='string')||typeof p.video!=='boolean'||typeof p.free!=='boolean'||!Array.isArray(p.details)||p.details.some(x=>typeof x!=='string')||(p.image!==null&&(!/^assets\/[a-z-]+\.jpg$/.test(p.image))))throw new Error('invalid catalog');seen.add(p.id);}return data;
}
export function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

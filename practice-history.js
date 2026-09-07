(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QuizPractice=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  // These are local study counters, not a login or a saved quiz session.
  function fingerprint(q){
    const text=JSON.stringify([q.prompt,q.options.slice().sort((a,b)=>a.key.localeCompare(b.key)),q.answer]);
    let a=2166136261,b=5381;
    for(let i=0;i<text.length;i++){a=Math.imul(a^text.charCodeAt(i),16777619);b=Math.imul(b,33)^text.charCodeAt(i);}
    return text.length+':'+(a>>>0).toString(16)+':'+(b>>>0).toString(16);
  }
  function createStore(storage,key){
    let records=Object.create(null), persistent=!!storage;
    try{
      const parsed=JSON.parse(storage?.getItem(key)||'null');
      if(parsed?.version===1&&parsed.records&&typeof parsed.records==='object'){
        for(const [id,row] of Object.entries(parsed.records)){
          if(!row||typeof row.fingerprint!=='string')continue;
          const valid=['attempts','misses','streak','last'].every(k=>Number.isSafeInteger(row[k])&&row[k]>=0);
          if(valid&&row.attempts>0&&row.misses<=row.attempts&&row.streak<=row.attempts)records[id]={...row};
        }
      }
    }catch(error){if(error.name!=='SyntaxError')persistent=false;}
    const get=q=>records[q.id]?.fingerprint===fingerprint(q)?records[q.id]:null;
    function persist(){
      if(!persistent)return;
      try{storage.setItem(key,JSON.stringify({version:1,records}));}catch{persistent=false;}
    }
    function record(q,now=Date.now(),eventId=null){
      if(q.selected===null&&!q.timedOut)return false;
      const previous=get(q), correct=q.selected===q.answer;
      if(eventId&&previous?.lastEvent===eventId)return false;
      records[q.id]={fingerprint:fingerprint(q),attempts:(previous?.attempts||0)+1,misses:(previous?.misses||0)+(correct?0:1),streak:correct?(previous?.streak||0)+1:0,last:now,lastEvent:eventId};
      persist();return true;
    }
    function reconcile(bank){
      const valid=new Map(bank.map(q=>[q.id,fingerprint(q)]));
      // Discard stale counters for removed/edited questions; preserve category-only edits.
      for(const id of Object.keys(records))if(valid.get(id)!==records[id].fingerprint)delete records[id];
    }
    return {get,record,reconcile,isPersistent:()=>persistent};
  }
  function weakScore(row){
    if(!row||!row.misses||row.streak>=2)return 0;
    return row.misses/row.attempts*2+Math.min(row.misses,8)/4-row.streak/2;
  }
  function mix(list,random){
    const result=list.slice();
    for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  }
  function prioritize(bank,count,history,random=Math.random){
    const n=count==='all'?bank.length:Math.min(bank.length,Math.max(1,Math.floor(Number(count)||10)));
    if(n===bank.length)return bank.slice();
    const rows=bank.map(q=>({q,row:history.get(q)}));
    const weak=mix(rows.filter(x=>weakScore(x.row)>0),random).sort((a,b)=>weakScore(b.row)-weakScore(a.row));
    if(!weak.length)return bank.slice();
    const other=rows.filter(x=>weakScore(x.row)===0);
    const fresh=mix(other.filter(x=>!x.row),random),review=mix(other.filter(x=>x.row),random);
    const quota=Math.min(weak.length,Math.max(1,Math.floor(n*.7)));
    const selected=[...weak.slice(0,quota),...fresh,...review,...weak.slice(quota)].slice(0,n);
    const ids=new Set(selected.map(x=>x.q.id));
    // Session construction owns final shuffling; no duplicate questions.
    return bank.filter(q=>ids.has(q.id));
  }
  return {fingerprint,createStore,weakScore,prioritize};
});

(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.QuizSession=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const durations=[0,10,20,30,45];
  function pack(state,fingerprint,now=Date.now()){
    return {version:1,status:'active',id:state.id,mode:state.mode,seconds:state.seconds,index:state.index,deadline:state.deadline,savedAt:now,config:state.config,
      questions:state.session.map(q=>({id:q.id,fingerprint:fingerprint(q),category:q.category,order:q.options.map(o=>o.key),selected:q.selected,timedOut:!!q.timedOut}))};
  }
  function restore(data,bank,fingerprint){
    const invalid=()=>({status:'invalid'});
    if(!data||data.status==='completed')return {status:'empty'};
    if(data.version!==1||data.status!=='active'||typeof data.id!=='string'||!data.id||data.id.length>150)return invalid();
    if(!['study','exam'].includes(data.mode)||!durations.includes(data.seconds))return invalid();
    if(!Array.isArray(data.questions)||!data.questions.length||data.questions.length>5000||!Number.isInteger(data.index)||data.index<0||data.index>=data.questions.length)return invalid();
    if(!Number.isFinite(data.deadline)||data.deadline<0||!Number.isFinite(data.savedAt)||data.savedAt<0)return invalid();
    if(data.seconds===0&&data.deadline!==0)return invalid();
    if(data.seconds>0&&(data.deadline<=0||data.deadline>data.savedAt+data.seconds*1000+1000))return invalid();
    const config=data.config;
    if(!config||!Array.isArray(config.materials)||config.materials.length>1000)return invalid();
    if(config.count!=='all'&&(!Number.isInteger(config.count)||config.count<1||config.count>5000))return invalid();
    if(!['shuffleQuestions','shuffleOptions','prioritize'].every(key=>typeof config[key]==='boolean'))return invalid();
    if(!config.materials.every(m=>m&&typeof m.module==='string'&&typeof m.submodule==='string'&&/^(?:[1-9]|1\d|2[0-6]|other)$/.test(m.module)))return invalid();
    const lookup=new Map(bank.map(q=>[q.id,q])),seen=new Set(),session=[];
    for(const [i,row] of data.questions.entries()){
      if(!row||typeof row.id!=='string'||seen.has(row.id))return invalid();seen.add(row.id);
      const q=lookup.get(row.id);
      if(!q||row.fingerprint!==fingerprint(q)||row.category!==q.category)return {status:'changed'};
      if(!Array.isArray(row.order)||row.order.length!==4||new Set(row.order).size!==4||row.order.some(key=>!q.options.some(o=>o.key===key)))return invalid();
      if(row.selected!==null&&!row.order.includes(row.selected))return invalid();
      if(typeof row.timedOut!=='boolean'||(row.timedOut&&row.selected!==null))return invalid();
      const done=row.selected!==null||row.timedOut;
      if((i<data.index&&!done)||(i>data.index&&done))return invalid();
      session.push({...q,options:row.order.map(key=>({...q.options.find(o=>o.key===key)})),selected:row.selected,timedOut:row.timedOut});
    }
    return {status:'ready',state:{id:data.id,mode:data.mode,seconds:data.seconds,index:data.index,deadline:data.deadline,config:{...config,materials:config.materials.map(m=>({...m}))},session}};
  }
  function createStore(storage,key,fingerprint){
    let available=!!storage;
    function clear(){
      if(!storage)return false;
      try{storage.removeItem(key);return true;}
      catch{try{storage.setItem(key,JSON.stringify({version:1,status:'completed'}));return true;}catch{available=false;return false;}}
    }
    function read(bank){
      if(!storage)return {status:'unavailable'};
      try{
        const raw=storage.getItem(key);
        if(!raw)return {status:'empty'};
        if(raw.length>5*1024*1024)return {status:'invalid'};
        return restore(JSON.parse(raw),bank,fingerprint);
      }catch(error){if(error.name==='SyntaxError')return {status:'invalid'};available=false;return {status:'unavailable'};}
    }
    function save(state){
      if(!available)return false;
      try{storage.setItem(key,JSON.stringify(pack(state,fingerprint)));return true;}
      catch{available=false;return false;}
    }
    return {read,save,clear};
  }
  return {pack,restore,createStore,durations};
});

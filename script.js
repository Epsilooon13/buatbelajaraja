'use strict';
(() => {
  const $=id=>document.getElementById(id);
  const C=window.QuizCore;
  const H=window.QuizCurriculum;
  const P=window.QuizPractice;
  const F=window.QuizContent;
  let storage=null;
  try{storage=window.localStorage;}catch{}
  const history=P.createStore(storage,'buatbelajaraja:practice:v1:'+(location.pathname||'/').replace(/index\.html$/,''));
  const sessionStore=window.QuizSession.createStore(storage,'buatbelajaraja:session:v1:'+(location.pathname||'/').replace(/index\.html$/,''),P.fingerprint);
  let selectedMaterials=[],pendingResume=null,sessionId='',mode='study',currentConfig={},saved=false;
  let materialIndex=[];
  let bank=[], session=[], index=0, active=false, timerHandle=null, deadline=0, secondsPerQuestion=30;
  const settings=()=>({count:Number($('count').value),shuffleQuestions:$('shuffle-questions').checked,shuffleOptions:$('shuffle-options').checked,prioritize:$('prioritize-mistakes').checked,materials:selectedMaterials.map(m=>({...m})),mode:$('mode').value,seconds:Number($('duration').value)});
  const pool=()=>H.filterMany(bank,selectedMaterials);
  const resolved=q=>q.selected!==null||q.timedOut;
  function show(view) {
    for(const id of ['quiz','results'])$(id).hidden=id!==view;
    $('main-panel').hidden=view==='welcome';
    document.body.classList.toggle('setup-view',view==='welcome');
  }
  function updatePriorityStatus(){
    const weak=pool().filter(q=>P.weakScore(history.get(q))>0).length;
    const text=!$('prioritize-mistakes').checked?'Prioritas dimatikan. Latihan mengikuti pilihan materi dan acak soal.':weak?weak+' soal perlu diulang; dicampur dengan soal lain yang tersedia.':'Belum ada soal yang perlu diprioritaskan pada materi ini.';
    $('priority-status').textContent=text+(history.isPersistent()?' Catatan tersimpan di browser ini.':' Penyimpanan browser tidak tersedia; catatan hanya berlaku sampai halaman ditutup atau dimuat ulang.');
  }
  function materialLabel(item){
    return materialIndex.find(m=>m.module===item.module&&m.submodule===item.submodule)?.label||(item.module==='other'?(item.submodule||'Materi lainnya'):'Module '+item.module);
  }
  function renderSelections(){
    $('selected-materials').replaceChildren();
    for(const item of selectedMaterials){
      const li=document.createElement('li'),label=document.createElement('span'),remove=document.createElement('button');
      label.textContent=materialLabel(item);remove.type='button';remove.className='remove-material';remove.textContent='×';remove.setAttribute('aria-label','Hapus '+label.textContent);
      remove.addEventListener('click',()=>{if(active||pendingResume)return;selectedMaterials=selectedMaterials.filter(x=>x!==item);renderSelections();renderSearch();updateControls();$('material-toggle').focus();});
      li.append(label,remove);$('selected-materials').append(li);
    }
    $('clear-materials').hidden=!selectedMaterials.length;
  }
  function addMaterial(item){
    if(active||pendingResume||!item.module)return;
    const already=selectedMaterials.some(x=>H.covers(x,item));
    selectedMaterials=H.addSelection(selectedMaterials,item);
    $('selection-announcement').textContent=materialLabel(item)+(already?' sudah termasuk dalam pilihan.':' ditambahkan.');
    renderSelections();updateControls();renderSearch();
  }
  function clearSearch(){ $('material-search').value='';renderSearch(); }
  function renderSearch(){
    const query=$('material-search').value.trim(),results=H.search(query,materialIndex);
    $('search-clear').hidden=!query;$('search-status').hidden=!query;
    $('search-results').hidden=!query||!results.length;$('search-results').replaceChildren();
    $('search-status').textContent=results.length?results.length+' materi ditemukan. Tambahkan satu atau beberapa hasil.':'Materi tidak ditemukan. Coba nama atau kode submodul lain.';
    for(const result of results){
      const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.className='search-result';
      const label=document.createElement('span');label.textContent=result.label;
      const chosen=selectedMaterials.some(x=>H.covers(x,result));
      const meta=document.createElement('span');meta.className='muted small';meta.textContent=result.count+' soal · '+(chosen?'Sudah dipilih':'Tambahkan');
      button.disabled=chosen;button.append(label,meta);
      button.addEventListener('click',()=>{addMaterial(result);clearSearch();$('material-search').focus();});
      li.append(button);$('search-results').append(li);
    }
  }
  function updateModeHelp(){
    $('mode-help').textContent=$('mode').value==='exam'?'Jawaban langsung dikunci. Benar/salah, skor, dan pembahasan baru ditampilkan setelah sesi selesai.':'Jawaban langsung dikunci. Benar/salah dan pembahasan muncul setelah menjawab.';
  }
  function updateControls() {
    const available=pool().length, count=Number($('count').value);
    const valid=Number.isInteger(count)&&count>=1&&count<=5000;
    const requested=valid?Math.min(available,count):0;
    $('start').disabled=!!pendingResume||!available||!valid;
    $('all-questions').disabled=!available;
    $('start').textContent='Mulai '+requested+' soal →';
    $('bank-status').textContent=!available?'Belum ada soal untuk materi ini.':!valid?'Masukkan jumlah soal bulat antara 1 dan 5.000.':available+' soal tersedia · sesi menggunakan '+requested+' soal.';
    const labels=selectedMaterials.map(materialLabel);
    const label=!labels.length?'Semua materi':labels.length===1?labels[0]:labels.length+' materi dipilih';
    $('material-summary').textContent=label;
    $('selection-detail').textContent=labels.length?'Soal digabung dari pilihan di atas, tanpa duplikasi.':'Semua materi digunakan.';
    $('add-material').disabled=!$('module').value;
    updatePriorityStatus();
  }
  function updateSubmodules() {
    const select=$('submodule'), moduleId=$('module').value;
    select.replaceChildren(new Option(moduleId?'Semua submodul':'Pilih modul terlebih dahulu',''));
    select.disabled=!moduleId;
    const mod=H.modules.find(m=>m.id===moduleId);
    if(mod)for(const sub of mod.children){
      const n=H.filter(bank,moduleId,sub.id).length;
      select.add(new Option(sub.id+' '+sub.title+' ('+n+')',sub.id));
    }
    if(moduleId==='other')for(const topic of [...new Set(H.filter(bank,'other').map(q=>q.category))].sort())select.add(new Option(topic,topic));
    updateControls();
  }
  function setBank(questions) {
    bank=questions;
    history.reconcile(bank);
    materialIndex=H.makeIndex(bank);
    renderSearch();
    $('module').replaceChildren(new Option('Pilih modul',''));
    for(const mod of H.modules){
      const n=H.filter(bank,mod.id).length;
      $('module').add(new Option('Module '+mod.id+' — '+mod.title+' ('+n+')',mod.id));
    }
    const other=H.filter(bank,'other').length;
    if(other)$('module').add(new Option('Materi lainnya ('+other+')','other'));
    $('source-name').textContent='soal.csv';
    $('bank-count').textContent=bank.length+' soal';
    updateSubmodules();renderSelections();updateModeHelp();show('welcome');
    const previous=sessionStore.read(bank);
    if(previous.status==='ready'){
      pendingResume=previous.state;
      $('resume-summary').textContent=(pendingResume.mode==='exam'?'Mode Ujian':'Mode Belajar')+' · soal '+(pendingResume.index+1)+' dari '+pendingResume.session.length+' · '+pendingResume.session.filter(resolved).length+' soal sudah dikunci';
      $('resume-panel').hidden=false;$('settings-fields').disabled=true;updateControls();
    }else if(previous.status!=='empty'){
      $('resume-notice').hidden=false;
      $('resume-notice').textContent=previous.status==='changed'?'Soal pada sesi tersimpan sudah diubah atau dihapus. Mulai sesi baru menggunakan bank soal terbaru.':previous.status==='invalid'?'Sesi tersimpan tidak dapat dibaca. Kamu bisa memulai sesi baru.':'Penyimpanan sesi tidak tersedia di browser ini. Sesi belum dapat dipulihkan setelah halaman ditutup.';
      if(previous.status!=='unavailable')sessionStore.clear();
    }
  }
  function saveSession(){
    if(!active)return;
    saved=sessionStore.save({id:sessionId,mode,seconds:secondsPerQuestion,index,deadline,config:currentConfig,session});
    $('save-status').textContent=saved?'Sesi tersimpan di browser ini.':'Sesi belum tersimpan. Hindari menutup halaman jika ingin melanjutkan latihan ini.';
  }
  function recordOutcome(q){ history.record(q,Date.now(),sessionId+'|'+q.id); }
  function stopTimer(){clearInterval(timerHandle);timerHandle=null;}
  function tick(){
    if(!active||secondsPerQuestion===0||resolved(session[index]))return;
    const remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));
    $('timer').textContent=remaining+' dtk';$('timer').classList.toggle('urgent',remaining<=5);
    if(remaining===0){session[index].timedOut=true;stopTimer();saveSession();recordOutcome(session[index]);revealAnswer();}
  }
  function startTimer(restoring=false){
    stopTimer();
    if(secondsPerQuestion===0){deadline=0;$('timer').textContent='Tanpa timer';$('timer').classList.toggle('urgent',false);saveSession();return;}
    if(!restoring)deadline=Date.now()+secondsPerQuestion*1000;
    tick();
    if(!resolved(session[index]))timerHandle=setInterval(tick,200);
    saveSession();
  }
  function lockSession(value) {
    active=value;$('settings-fields').disabled=value;
    document.body.classList.toggle('session-active',value);
  }
  function setSessionCopy(){
    $('session-mode').textContent=mode==='exam'?'Mode Ujian':'Mode Belajar';
    $('session-hint').textContent=mode==='exam'?'Jawaban dikunci saat dipilih. Pembahasan dan skor muncul setelah sesi selesai.':'Baca pembahasan sebelum menekan Soal berikutnya.';
    $('end-description').textContent=(secondsPerQuestion?'Timer tetap berjalan selama dialog ini terbuka. ':'')+'Soal yang belum dijawab bernilai 0.';
  }
  function begin(questions,config) {
    if(active||pendingResume)return;
    stopTimer();mode=config.mode;secondsPerQuestion=config.seconds;
    currentConfig={...config,materials:config.materials.map(m=>({...m}))};
    session=C.makeSession(questions,config);
    if(!session.length){updateControls();return;}
    sessionId=window.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
    index=0;lockSession(true);setSessionCopy();show('quiz');renderQuestion();
  }
  function resume(){
    if(!pendingResume||active)return;
    const data=pendingResume;pendingResume=null;
    session=data.session;sessionId=data.id;mode=data.mode;secondsPerQuestion=data.seconds;index=data.index;deadline=data.deadline;currentConfig=data.config;
    selectedMaterials=currentConfig.materials.map(m=>({...m}));
    $('count').value=currentConfig.count==='all'?session.length:currentConfig.count;
    $('mode').value=mode;$('duration').value=String(secondsPerQuestion);
    $('shuffle-questions').checked=currentConfig.shuffleQuestions;$('shuffle-options').checked=currentConfig.shuffleOptions;$('prioritize-mistakes').checked=currentConfig.prioritize;
    $('resume-panel').hidden=true;renderSelections();updateControls();updateModeHelp();
    for(const q of session)if(resolved(q))recordOutcome(q);
    lockSession(true);setSessionCopy();show('quiz');renderQuestion(true);
  }
  function renderQuestion(restoring=false) {
    const q=session[index];
    const scored=C.score(session);
    $('topic-label').textContent=q.category;
    $('question-progress').textContent=(index+1)+' / '+session.length;
    $('progress-bar').max=session.length;
    $('progress-bar').value=session.filter(resolved).length;
    $('question-number').textContent='SOAL '+String(index+1).padStart(2,'0');
    $('live-score').textContent=mode==='exam'?session.filter(resolved).length+' soal dikunci':scored.correct+' benar';
    F.render($('question-text'),q.prompt);
    $('options').replaceChildren();
    q.options.forEach((option,i)=>{
      const button=document.createElement('button');button.type='button';button.className='option';
      const letter=document.createElement('span');letter.className='option-letter';letter.textContent=C.LETTERS[i];
      const copy=document.createElement('span');copy.className='option-copy';F.render(copy,option.text,{interactive:true});
      button.append(letter,copy);
      button.addEventListener('click',()=>choose(option.key));
      button.addEventListener('keydown',event=>{
        if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
        const code=copy.querySelector('.code-content');
        if(code&&code.scrollWidth>code.clientWidth){event.preventDefault();code.scrollLeft+=(event.key==='ArrowRight'?80:-80);}
      });
      $('options').append(button);
    });
    $('feedback').hidden=true;
    $('next').disabled=true;
    $('next').textContent=index===session.length-1?'Lihat hasil →':'Soal berikutnya →';
    $('question-text').focus({preventScroll:true});
    $('quiz').scrollIntoView({block:'start',behavior:'instant'});
    if(resolved(q)){
      stopTimer();$('timer').classList.toggle('urgent',false);$('timer').textContent=secondsPerQuestion?(q.timedOut?'0 dtk':'Selesai'):'Tanpa timer';
      revealAnswer();saveSession();
    }else startTimer(restoring);
  }
  function choose(key) {
    const q=session[index];
    if(!active)return;
    tick();
    if(!C.answer(q,key))return;
    stopTimer();
    saveSession();recordOutcome(q);revealAnswer();
  }
  function revealAnswer(){
    const q=session[index],exam=mode==='exam';
    [...$('options').children].forEach((button,i)=>{
      const option=q.options[i];button.disabled=true;let badge='';
      if(exam){if(option.key===q.selected){button.classList.add('selected');badge='Pilihanmu';}}
      else if(option.key===q.answer){button.classList.add('correct');badge='✓ Benar';}
      else if(option.key===q.selected){button.classList.add('wrong');badge='× Pilihanmu';}
      if(badge){const span=document.createElement('span');span.className='option-status';span.textContent=badge;button.append(span);}
    });
    $('feedback').classList.toggle('wrong',!exam&&q.selected!==q.answer);
    $('feedback').classList.toggle('neutral',exam);
    if(exam){
      $('feedback-title').textContent=q.timedOut?'Waktu habis.':'Jawaban tersimpan.';
      F.render($('feedback-text'),'Pembahasan dan skor ditampilkan setelah sesi selesai.');
    }else{
      const letter=C.LETTERS[q.options.findIndex(o=>o.key===q.answer)];
      $('feedback-title').textContent=q.timedOut?'Waktu habis. Jawaban yang benar: '+letter+'.':q.selected===q.answer?'✓ Jawabanmu benar.':'Belum tepat. Jawaban yang benar: '+letter+'.';
      F.render($('feedback-text'),q.explanation);
    }
    $('feedback').hidden=false;$('progress-bar').value=session.filter(resolved).length;
    $('live-score').textContent=exam?session.filter(resolved).length+' soal dikunci':C.score(session).correct+' benar';
    $('next').disabled=false;$('next').focus({preventScroll:true});
  }
  function finish() {
    stopTimer();
    for(const q of session)if(resolved(q))recordOutcome(q);
    sessionStore.clear();saved=false;
    lockSession(false);show('results');updateControls();
    $('save-status').textContent='Sesi selesai.';
    const s=C.score(session);
    $('score-number').textContent=s.percent;
    $('result-count').textContent=(s.total-s.unanswered)+' / '+s.total+' soal dijawab';
    $('result-title').textContent=s.correct===s.total?'Semua jawaban tepat!':s.percent>=70?'Pemahamanmu makin kuat.':'Yuk, pelajari pembahasannya.';
    const timedOut=session.filter(q=>q.timedOut).length;
    $('result-summary').textContent=s.correct+' benar · '+s.wrong+' salah · '+timedOut+' waktu habis · '+(s.unanswered-timedOut)+' belum dijawab';
    $('retry-wrong').hidden=s.correct===s.total;
    $('review-list').replaceChildren();
    session.forEach((q,i)=>{
      const correct=q.selected===q.answer;
      const details=document.createElement('details');details.className='review-item'+(correct?'':' wrong');
      const summary=document.createElement('summary');
      const icon=document.createElement('span');icon.className='review-icon';icon.textContent=correct?'✓':q.selected===null?'—':'×';
      icon.setAttribute('aria-label',correct?'Benar':q.selected===null?'Belum dijawab':'Salah');
      const formatted=F.hasBlocks(q.prompt);
      const title=document.createElement('span');title.className='review-title';title.textContent=(i+1)+'. '+(formatted?F.preview(q.prompt):q.prompt);
      const caret=document.createElement('span');caret.className='review-caret';caret.textContent='+';caret.setAttribute('aria-hidden','true');
      summary.append(icon,title,caret);details.append(summary);
      const answer=document.createElement('div');answer.className='review-answer';
      const describe=key=>{const n=q.options.findIndex(o=>o.key===key);return n<0?'Belum dijawab':C.LETTERS[n]+'. '+q.options[n].text;};
      if(formatted){const prompt=document.createElement('div');prompt.className='review-prompt';F.render(prompt,q.prompt);answer.append(prompt);}
      const own=document.createElement('div');own.className='review-response';F.render(own,'Jawabanmu: '+(q.timedOut?'Waktu habis':describe(q.selected)));
      const expected=document.createElement('div');expected.className='review-response';F.render(expected,'Jawaban benar: '+describe(q.answer));
      const explanation=document.createElement('div');explanation.className='explanation';F.render(explanation,q.explanation);
      answer.append(own,expected,explanation);details.append(answer);
      details.addEventListener('toggle',()=>{caret.textContent=details.open?'−':'+';});
      $('review-list').append(details);
    });
    $('result-title').focus({preventScroll:true});$('results').scrollIntoView({block:'start',behavior:'instant'});
  }
  async function loadBank(){
    try{
      const response=await fetch('./soal.csv',{cache:'no-store'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      setBank(C.parseCSV(await response.text()));
    }catch(error){
      $('bank-status').textContent='Bank soal belum bisa dimuat. '+(location.protocol==='file:'?'Buka web melalui GitHub Pages atau server lokal.':error.message);
    }
  }
  function startFromSettings(){
    if(active||pendingResume||!$('settings').reportValidity()||!pool().length)return;
    $('material-picker').open=false;
    const config=settings();
    const selected=config.prioritize?P.prioritize(pool(),config.count,history):pool();
    begin(selected,config);
  }
  $('add-material').addEventListener('click',()=>addMaterial({module:$('module').value,submodule:$('submodule').value}));
  $('clear-materials').addEventListener('click',()=>{if(active||pendingResume)return;selectedMaterials=[];renderSelections();renderSearch();updateControls();});
  $('mode').addEventListener('change',updateModeHelp);
  $('resume-session').addEventListener('click',resume);
  $('discard-session').addEventListener('click',()=>$('discard-dialog').showModal());
  $('cancel-discard').addEventListener('click',()=>$('discard-dialog').close());
  $('confirm-discard').addEventListener('click',()=>{
    const cleared=sessionStore.clear();pendingResume=null;$('discard-dialog').close();$('resume-panel').hidden=true;$('settings-fields').disabled=false;
    if(!cleared){$('resume-notice').hidden=false;$('resume-notice').textContent='Sesi belum dapat dihapus dari penyimpanan browser. Sesi baru akan mencoba menggantikannya.';}
    updateControls();$('start').focus();
  });
  $('settings').addEventListener('submit',e=>{e.preventDefault();startFromSettings();});
  $('prioritize-mistakes').addEventListener('change',updatePriorityStatus);
  $('material-search').addEventListener('input',renderSearch);
  $('material-search').addEventListener('keydown',e=>{
    if(e.key==='Enter'){e.preventDefault();$('search-results').querySelector('button:not(:disabled)')?.click();}
    if(e.key==='ArrowDown'){e.preventDefault();$('search-results').querySelector('button:not(:disabled)')?.focus();}
    if(e.key==='Escape'){e.preventDefault();clearSearch();}
  });
  $('search-clear').addEventListener('click',()=>{clearSearch();$('material-search').focus();});
  $('search-results').addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();clearSearch();$('material-search').focus();return;}
    if(e.key!=='ArrowDown'&&e.key!=='ArrowUp')return;
    const buttons=[...$('search-results').querySelectorAll('button:not(:disabled)')];
    const next=buttons.indexOf(e.target)+(e.key==='ArrowDown'?1:-1);
    e.preventDefault();if(next<0)$('material-search').focus();else buttons[Math.min(next,buttons.length-1)]?.focus();
  });
  $('module').addEventListener('change',updateSubmodules);
  $('submodule').addEventListener('change',updateControls);
  $('count').addEventListener('input',updateControls);
  $('all-questions').addEventListener('click',()=>{$('count').value=pool().length;updateControls();});
  $('next').addEventListener('click',()=>{if(!active||!resolved(session[index]))return;if(index===session.length-1)finish();else{index++;renderQuestion();}});
  $('end-session').addEventListener('click',()=>$('end-dialog').showModal());
  $('continue-session').addEventListener('click',()=>$('end-dialog').close());
  $('confirm-end').addEventListener('click',()=>{$('end-dialog').close();tick();finish();});
  $('retry').addEventListener('click',startFromSettings);
  $('retry-wrong').addEventListener('click',()=>begin(session.filter(q=>q.selected!==q.answer),{...settings(),count:'all'}));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});
  window.addEventListener('pagehide',()=>{if(active){tick();saveSession();}});
  window.addEventListener('beforeunload',event=>{if(active){tick();saveSession();if(!saved){event.preventDefault();event.returnValue='';}}});
  loadBank();
})();

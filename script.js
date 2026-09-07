'use strict';
(() => {
  const $=id=>document.getElementById(id);
  const C=window.QuizCore;
  const H=window.QuizCurriculum;
  const P=window.QuizPractice;
  let storage=null;
  try{storage=window.localStorage;}catch{}
  const history=P.createStore(storage,'buatbelajaraja:practice:v1:'+(location.pathname||'/').replace(/index\.html$/,''));
  const recorded=new WeakSet();
  let materialIndex=[];
  let bank=[], session=[], index=0, active=false, timerHandle=null, deadline=0, secondsPerQuestion=30;
  const settings=()=>({count:Number($('count').value),shuffleQuestions:$('shuffle-questions').checked,shuffleOptions:$('shuffle-options').checked});
  const pool=()=>H.filter(bank,$('module').value,$('submodule').value);
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
  function clearSearch(){
    $('material-search').value='';renderSearch();
  }
  function renderSearch(){
    const query=$('material-search').value.trim(),results=H.search(query,materialIndex);
    $('search-clear').hidden=!query;
    $('search-status').hidden=!query;
    $('search-results').hidden=!query||!results.length;
    $('search-results').replaceChildren();
    $('search-status').textContent=results.length?results.length+' materi ditemukan. Pilih hasil untuk mengatur sesi.':'Materi tidak ditemukan. Coba nama atau kode submodul lain.';
    for(const result of results){
      const li=document.createElement('li'),button=document.createElement('button');
      button.type='button';button.className='search-result';
      const label=document.createElement('span');label.textContent=result.label;
      const meta=document.createElement('span');meta.className='muted small';meta.textContent=(result.submodule?'Submodul · ':'Modul · ')+result.count+' soal';
      button.append(label,meta);
      button.addEventListener('click',()=>{
        if(active)return;
        $('module').value=result.module;updateSubmodules();
        $('submodule').value=result.submodule;updateControls();clearSearch();
        $('material-picker').open=false;$('material-toggle').focus();
      });
      li.append(button);$('search-results').append(li);
    }
  }
  function updateControls() {
    const available=pool().length, count=Number($('count').value);
    const valid=Number.isInteger(count)&&count>=1&&count<=5000;
    const requested=valid?Math.min(available,count):0;
    $('start').disabled=!available||!valid;
    $('all-questions').disabled=!available;
    $('start').textContent='Mulai '+requested+' soal →';
    $('bank-status').textContent=!available?'Belum ada soal untuk materi ini.':!valid?'Masukkan jumlah soal bulat antara 1 dan 5.000.':available+' soal tersedia · sesi menggunakan '+requested+' soal.';
    const mod=H.modules.find(m=>m.id===$('module').value);
    const sub=mod?.children.find(c=>c.id===$('submodule').value);
    const label=sub?sub.id+' '+sub.title:mod?'Module '+mod.id+' — '+mod.title:$('module').value==='other'?($('submodule').value||'Materi lainnya'):'Semua materi';
    $('material-summary').textContent=label;
    $('selection-detail').textContent=label;
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
    $('module').replaceChildren(new Option('Semua modul',''));
    for(const mod of H.modules){
      const n=H.filter(bank,mod.id).length;
      $('module').add(new Option('Module '+mod.id+' — '+mod.title+' ('+n+')',mod.id));
    }
    const other=H.filter(bank,'other').length;
    if(other)$('module').add(new Option('Materi lainnya ('+other+')','other'));
    $('source-name').textContent='soal.csv';
    $('bank-count').textContent=bank.length+' soal';
    updateSubmodules();show('welcome');
  }
  function stopTimer(){clearInterval(timerHandle);timerHandle=null;}
  function tick(){
    if(!active||resolved(session[index]))return;
    const remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));
    $('timer').textContent=remaining+' dtk';
    $('timer').classList.toggle('urgent',remaining<=5);
    if(remaining===0){session[index].timedOut=true;stopTimer();revealAnswer(null);}
  }
  function startTimer(){
    stopTimer();deadline=Date.now()+secondsPerQuestion*1000;
    tick();timerHandle=setInterval(tick,200);
  }
  function lockSession(value) {
    active=value;
    $('settings-fields').disabled=value;
    document.body.classList.toggle('session-active',value);
  }
  function begin(questions,config) {
    if(active)return;
    stopTimer();
    secondsPerQuestion=Number($('duration').value);
    session=C.makeSession(questions,config);
    if(!session.length) {updateControls();return;}
    index=0;lockSession(true);show('quiz');renderQuestion();
  }
  function renderQuestion() {
    const q=session[index];
    const scored=C.score(session);
    $('topic-label').textContent=q.category;
    $('question-progress').textContent=(index+1)+' / '+session.length;
    $('progress-bar').max=session.length;
    $('progress-bar').value=session.filter(resolved).length;
    $('question-number').textContent='SOAL '+String(index+1).padStart(2,'0');
    $('live-score').textContent=scored.correct+' benar';
    $('question-text').textContent=q.prompt;
    $('options').replaceChildren();
    q.options.forEach((option,i)=>{
      const button=document.createElement('button');button.type='button';button.className='option';
      const letter=document.createElement('span');letter.className='option-letter';letter.textContent=C.LETTERS[i];
      const copy=document.createElement('span');copy.className='option-copy';copy.textContent=option.text;
      button.append(letter,copy);
      button.addEventListener('click',()=>choose(option.key));
      $('options').append(button);
    });
    $('feedback').hidden=true;
    $('next').disabled=true;
    $('next').textContent=index===session.length-1?'Lihat hasil →':'Soal berikutnya →';
    $('question-text').focus({preventScroll:true});
    $('quiz').scrollIntoView({block:'start',behavior:'instant'});
    startTimer();
  }
  function choose(key) {
    const q=session[index];
    if(!active)return;
    tick();
    if(!C.answer(q,key))return;
    stopTimer();
    revealAnswer(key);
  }
  function revealAnswer(key){
    const q=session[index];
    if(!recorded.has(q)){recorded.add(q);history.record(q);updatePriorityStatus();}
    [...$('options').children].forEach((button,i)=>{
      const option=q.options[i];
      button.disabled=true;
      let badge='';
      if(option.key===q.answer) {button.classList.add('correct');badge='✓ Benar';}
      else if(option.key===key) {button.classList.add('wrong');badge='× Pilihanmu';}
      if(badge) {const s=document.createElement('span');s.className='option-status';s.textContent=badge;button.append(s);}
    });
    const isCorrect=q.selected===q.answer;
    const correctLetter=C.LETTERS[q.options.findIndex(o=>o.key===q.answer)];
    $('feedback').classList.toggle('wrong',!isCorrect);
    $('feedback-title').textContent=q.timedOut?'Waktu habis. Jawaban yang benar: '+correctLetter+'.':isCorrect?'✓ Jawabanmu benar.':'Belum tepat. Jawaban yang benar: '+correctLetter+'.';
    $('feedback-text').textContent=q.explanation;
    $('feedback').hidden=false;
    $('progress-bar').value=session.filter(resolved).length;
    $('live-score').textContent=C.score(session).correct+' benar';
    $('next').disabled=false;
    $('next').focus({preventScroll:true});
  }
  function finish() {
    stopTimer();
    lockSession(false);show('results');
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
      const title=document.createElement('span');title.className='review-title';title.textContent=(i+1)+'. '+q.prompt;
      const caret=document.createElement('span');caret.className='review-caret';caret.textContent='+';caret.setAttribute('aria-hidden','true');
      summary.append(icon,title,caret);details.append(summary);
      const answer=document.createElement('div');answer.className='review-answer';
      const describe=key=>{const n=q.options.findIndex(o=>o.key===key);return n<0?'Belum dijawab':C.LETTERS[n]+'. '+q.options[n].text;};
      const own=document.createElement('p');own.textContent='Jawabanmu: '+(q.timedOut?'Waktu habis':describe(q.selected));
      const expected=document.createElement('p');expected.textContent='Jawaban benar: '+describe(q.answer);
      const explanation=document.createElement('p');explanation.className='explanation';explanation.textContent=q.explanation;
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
    if(!$('settings').reportValidity()||!pool().length)return;
    $('material-picker').open=false;
    const config=settings();
    const selected=$('prioritize-mistakes').checked?P.prioritize(pool(),config.count,history):pool();
    begin(selected,config);
  }
  $('settings').addEventListener('submit',e=>{e.preventDefault();startFromSettings();});
  $('prioritize-mistakes').addEventListener('change',updatePriorityStatus);
  $('material-search').addEventListener('input',renderSearch);
  $('material-search').addEventListener('keydown',e=>{
    if(e.key==='Enter'){e.preventDefault();$('search-results').firstElementChild?.firstElementChild?.click();}
    if(e.key==='ArrowDown'){e.preventDefault();$('search-results').firstElementChild?.firstElementChild?.focus();}
    if(e.key==='Escape'){e.preventDefault();clearSearch();}
  });
  $('search-clear').addEventListener('click',()=>{clearSearch();$('material-search').focus();});
  $('search-results').addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();clearSearch();$('material-search').focus();return;}
    if(e.key!=='ArrowDown'&&e.key!=='ArrowUp')return;
    const buttons=[...$('search-results').querySelectorAll('button')];
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
  window.addEventListener('beforeunload',event=>{if(active && session.some(resolved)){event.preventDefault();event.returnValue='';}});
  loadBank();
})();

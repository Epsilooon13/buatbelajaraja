'use strict';
(() => {
  const $=id=>document.getElementById(id);
  const C=window.QuizCore;
  let bank=[], session=[], index=0, active=false, pendingBank=null, pendingName='', loadToken=0, importToken=0;
  const settings=()=>({category:$('category').value,count:$('count').value,shuffleQuestions:$('shuffle-questions').checked,shuffleOptions:$('shuffle-options').checked});
  function show(view) {for(const id of ['welcome','quiz','results']) $(id).hidden=id!==view;}
  function updateControls() {
    const available=bank.filter(q=>!$('category').value || q.category===$('category').value).length;
    const requested=$('count').value==='all'?available:Math.min(available,Number($('count').value));
    $('start').disabled=!available;
    $('quick-start').disabled=!available;
    $('quick-start').textContent='Mulai '+requested+' soal →';
    $('bank-status').textContent=available?available+' soal tersedia'+(requested<Number($('count').value)?' · sesi menggunakan '+requested+' soal.':'.'):'Tidak ada soal pada topik ini.';
  }
  function setBank(questions,name) {
    bank=questions;
    const category=$('category');
    category.replaceChildren(new Option('Semua topik',''));
    const topics=[...new Set(bank.map(q=>q.category))].sort((a,b)=>a.localeCompare(b,'id'));
    for(const topic of topics) category.add(new Option(topic,topic));
    $('source-name').textContent=name;
    $('bank-count').textContent=bank.length+' soal · '+topics.length+' topik';
    updateControls();
    show('welcome');
  }
  function lockSession(value) {
    active=value;
    $('settings-fields').disabled=value;
    $('bank-open').disabled=value;
    document.body.classList.toggle('session-active',value);
  }
  function begin(pool,config) {
    session=C.makeSession(pool,config);
    if(!session.length) {updateControls();return;}
    index=0;lockSession(true);show('quiz');renderQuestion();
  }
  function renderQuestion() {
    const q=session[index];
    const scored=C.score(session);
    $('topic-label').textContent=q.category;
    $('question-progress').textContent=(index+1)+' / '+session.length;
    $('progress-bar').max=session.length;
    $('progress-bar').value=session.filter(item=>item.selected!==null).length;
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
  }
  function choose(key) {
    const q=session[index];
    if(!active || !C.answer(q,key)) return;
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
    $('feedback-title').textContent=isCorrect?'✓ Jawabanmu benar.':'Belum tepat. Jawaban yang benar: '+correctLetter+'.';
    $('feedback-text').textContent=q.explanation;
    $('feedback').hidden=false;
    $('progress-bar').value=session.filter(item=>item.selected!==null).length;
    $('live-score').textContent=C.score(session).correct+' benar';
    $('next').disabled=false;
    $('next').focus({preventScroll:true});
  }
  function finish() {
    lockSession(false);show('results');
    const s=C.score(session);
    $('score-number').textContent=s.percent;
    $('result-count').textContent=(s.total-s.unanswered)+' / '+s.total+' soal dijawab';
    $('result-title').textContent=s.correct===s.total?'Semua jawaban tepat!':s.percent>=70?'Pemahamanmu makin kuat.':'Yuk, pelajari pembahasannya.';
    $('result-summary').textContent=s.correct+' benar · '+s.wrong+' salah · '+s.unanswered+' belum dijawab';
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
      const own=document.createElement('p');own.textContent='Jawabanmu: '+describe(q.selected);
      const expected=document.createElement('p');expected.textContent='Jawaban benar: '+describe(q.answer);
      const explanation=document.createElement('p');explanation.className='explanation';explanation.textContent=q.explanation;
      answer.append(own,expected,explanation);details.append(answer);
      details.addEventListener('toggle',()=>{caret.textContent=details.open?'−':'+';});
      $('review-list').append(details);
    });
    $('result-title').focus({preventScroll:true});$('results').scrollIntoView({block:'start',behavior:'instant'});
  }
  async function loadExample() {
    const token=++loadToken;
    $('restore-default').disabled=true;
    try {
      const response=await fetch('./soal.csv',{cache:'no-store'});
      if(!response.ok) throw new Error('HTTP '+response.status);
      const raw=await response.text();
      const questions=C.parseCSV(raw);
      if(token!==loadToken) return;
      setBank(questions,'Contoh BGP');
    } catch(error) {
      if(token!==loadToken) return;
      $('bank-status').textContent=location.protocol==='file:'?'Untuk uji dari folder komputer, klik Bank soal lalu pilih soal.csv.':'Bank soal belum termuat. Klik Bank soal untuk mengimpor CSV, atau muat ulang halaman.';
    } finally {$('restore-default').disabled=false;}
  }
  function clearImport() {
    ++importToken;pendingBank=null;pendingName='';$('csv-file').value='';$('import-preview').hidden=true;$('import-message').hidden=true;
  }
  $('settings').addEventListener('submit',e=>{e.preventDefault();if(!active)begin(bank,settings());});
  $('quick-start').addEventListener('click',()=>begin(bank,settings()));
  $('category').addEventListener('change',updateControls);
  $('count').addEventListener('change',updateControls);
  $('next').addEventListener('click',()=>{if(!active||session[index].selected===null)return;if(index===session.length-1)finish();else{index++;renderQuestion();}});
  $('end-session').addEventListener('click',()=>$('end-dialog').showModal());
  $('continue-session').addEventListener('click',()=>$('end-dialog').close());
  $('confirm-end').addEventListener('click',()=>{$('end-dialog').close();finish();});
  $('retry').addEventListener('click',()=>begin(bank,settings()));
  $('retry-wrong').addEventListener('click',()=>begin(session.filter(q=>q.selected!==q.answer),{...settings(),category:'',count:'all'}));
  $('bank-open').addEventListener('click',()=>{clearImport();$('bank-dialog').showModal();});
  $('bank-close').addEventListener('click',()=>$('bank-dialog').close());
  $('csv-file').addEventListener('change',async e=>{
    const file=e.target.files[0];const token=++importToken;
    pendingBank=null;$('import-preview').hidden=true;$('import-message').hidden=true;
    if(!file)return;
    try {
      if(file.size>5*1024*1024)throw new Error('File terlalu besar. Maksimal 5 MB.');
      const raw=await file.text();
      if(token!==importToken)return;
      pendingBank=C.parseCSV(raw);pendingName=file.name;
      $('import-total').textContent=pendingBank.length+' soal siap digunakan';
      $('import-topics').textContent='Topik: '+[...new Set(pendingBank.map(q=>q.category))].join(', ');
      $('import-preview').hidden=false;
    } catch(error) {
      if(token!==importToken)return;
      $('import-message').textContent=error.message;$('import-message').hidden=false;
    }
  });
  $('use-import').addEventListener('click',()=>{if(!pendingBank)return;++loadToken;setBank(pendingBank,pendingName);$('bank-dialog').close();clearImport();});
  $('restore-default').addEventListener('click',async()=>{clearImport();await loadExample();$('bank-dialog').close();});
  window.addEventListener('beforeunload',event=>{if(active && session.some(q=>q.selected!==null)){event.preventDefault();event.returnValue='';}});
  loadExample();
})();

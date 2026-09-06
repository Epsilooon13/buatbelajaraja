(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.QuizCore = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const HEADERS = ['id','kategori','pertanyaan','opsi_a','opsi_b','opsi_c','opsi_d','jawaban','pembahasan'];
  const LETTERS = ['A','B','C','D'];

  function tokenize(text, delimiter) {
    const rows = [];
    let row = [], field = '', quoted = false, closed = false, record = 1;
    const pushField = () => { row.push(field); field = ''; closed = false; };
    const pushRow = () => { pushField(); if(row.some(v => v.trim())) rows.push({values:row, record}); row=[]; record++; };
    for (let i=0; i<text.length; i++) {
      const ch=text[i];
      if (quoted) {
        if(ch==='"' && text[i+1]==='"') {field+='"'; i++;}
        else if(ch==='"') {quoted=false; closed=true;}
        else field+=ch;
      } else if(ch===delimiter) pushField();
      else if(ch==='\n' || ch==='\r') {if(ch==='\r' && text[i+1]==='\n') i++; pushRow();}
      else if(ch==='"') {
        if(field.trim() || closed) throw new Error('Data ke-'+record+': tanda kutip tidak valid. Ekspor ulang sebagai CSV UTF-8.');
        field=''; quoted=true;
      } else if(closed) {
        if(ch!==' ' && ch!=='\t') throw new Error('Data ke-'+record+': ada karakter setelah penutup tanda kutip.');
      } else field+=ch;
    }
    if(quoted) throw new Error('Ada tanda kutip yang belum ditutup. Ekspor ulang dari Excel sebagai CSV UTF-8.');
    if(field || row.length || closed) pushRow();
    return rows;
  }

  function parseCSV(raw) {
    if(typeof raw!=='string') throw new Error('Isi file tidak bisa dibaca sebagai teks.');
    let text=raw.replace(/^\uFEFF/,'');
    if(text.includes('\u0000')) throw new Error('Format teks tidak didukung. Simpan sebagai CSV UTF-8, bukan UTF-16.');
    if(!text.trim()) throw new Error('File CSV kosong. Isi setidaknya satu soal.');
    if(text.length>5*1024*1024) throw new Error('File terlalu besar. Maksimal 5 MB.');
    let delimiter;
    const sep=text.match(/^sep=([,;\t])\r?\n/i);
    if(sep) {delimiter=sep[1];text=text.slice(sep[0].length);}
    if(!delimiter) {
      const firstLine=text.split(/\r?\n/).find(line=>line.trim()) || '';
      delimiter=[',',';','\t'].map(d=>({d,n:firstLine.split(d).length})).sort((a,b)=>b.n-a.n)[0].d;
    }
    const records=tokenize(text,delimiter);
    if(records.length<2) throw new Error('CSV harus memiliki baris nama kolom dan setidaknya satu soal.');
    const names=records[0].values.map(v=>v.trim().toLowerCase());
    if(new Set(names).size!==names.length) throw new Error('Nama kolom CSV tidak boleh berulang.');
    const missing=HEADERS.filter(h=>!names.includes(h));
    if(missing.length) throw new Error('Kolom wajib belum ada: '+missing.join(', ')+'. Gunakan template CSV.');
    if(records.length>5001) throw new Error('Maksimal 5.000 soal per bank. Pisahkan menjadi beberapa file.');
    const seen=new Set(), errors=[], questions=[];
    for(const {values,record} of records.slice(1)) {
      if(values.length!==names.length) {errors.push('Data ke-'+record+': jumlah kolom '+values.length+', seharusnya '+names.length+'.');continue;}
      const v=Object.fromEntries(names.map((h,i)=>[h,values[i].trim()]));
      const empty=HEADERS.filter(h=>!v[h]);
      if(empty.length) {errors.push('Data ke-'+record+': kolom kosong '+empty.join(', ')+'.');continue;}
      if(seen.has(v.id)) {errors.push('Data ke-'+record+': ID '+v.id+' berulang.');continue;}
      seen.add(v.id);
      const answer=v.jawaban.toUpperCase();
      if(!LETTERS.includes(answer)) {errors.push('Data ke-'+record+': jawaban harus A, B, C, atau D.');continue;}
      questions.push({id:v.id,category:v.kategori,prompt:v.pertanyaan,options:LETTERS.map(key=>({key,text:v['opsi_'+key.toLowerCase()]})),answer,explanation:v.pembahasan});
    }
    if(errors.length) throw new Error(errors.slice(0,6).join('\n')+(errors.length>6?'\n… dan '+(errors.length-6)+' kesalahan lain.':'')+'\nBank soal belum diganti.');
    if(!questions.length) throw new Error('Tidak ada soal yang valid.');
    return questions;
  }

  function shuffle(items, random=Math.random) {
    const copy=items.slice();
    for(let i=copy.length-1;i>0;i--) {const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
    return copy;
  }

  function makeSession(bank, settings={}, random=Math.random) {
    let pool=bank.filter(q=>!settings.category || q.category===settings.category);
    if(settings.shuffleQuestions!==false) pool=shuffle(pool,random);
    const requested=settings.count==='all'?pool.length:Math.max(1,Number(settings.count)||10);
    pool=pool.slice(0,requested);
    const positionOrder=shuffle([0,1,2,3],random);
    const targets=shuffle(pool.map((_,i)=>positionOrder[i%4]),random);
    return pool.map((q,i)=>{
      let options=q.options.map(o=>({...o}));
      if(settings.shuffleOptions!==false) {
        const correct=options.find(o=>o.key===q.answer);
        options=shuffle(options.filter(o=>o.key!==q.answer),random);
        options.splice(targets[i],0,correct);
      }
      return {...q,options,selected:null,timedOut:false};
    });
  }

  function answer(question,key) {
    if(question.timedOut || question.selected!==null || !question.options.some(o=>o.key===key)) return false;
    question.selected=key;
    return true;
  }

  function score(session) {
    const total=session.length;
    const correct=session.filter(q=>q.selected===q.answer).length;
    const unanswered=session.filter(q=>q.selected===null).length;
    return {total,correct,unanswered,wrong:total-correct-unanswered,percent:total?Math.round(correct/total*100):0};
  }
  return {parseCSV,shuffle,makeSession,answer,score,HEADERS,LETTERS};
}));

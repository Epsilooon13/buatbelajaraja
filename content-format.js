(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.QuizContent = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const labels = {cli:'CLI',output:'OUTPUT',xml:'XML',json:'JSON',code:'CODE'};

  // Only explicit, paired markers are interpreted. HTML remains literal text.
  function parse(value) {
    const text=String(value??'').replace(/\r\n?/g,'\n'), parts=[];
    const markers=/\[(\/)?(cli|output|xml|json|code)\]/gi;
    let cursor=0, opening=null, match;
    while((match=markers.exec(text))!==null){
      const kind=match[2].toLowerCase();
      if(!opening&&!match[1]){
        opening={kind,start:match.index,body:markers.lastIndex};
      }else if(opening&&match[1]&&kind===opening.kind){
        if(opening.start>cursor)parts.push({kind:'text',text:text.slice(cursor,opening.start)});
        const body=text.slice(opening.body,match.index).replace(/^\n/,'').replace(/\n$/,'');
        parts.push({kind,text:body});cursor=markers.lastIndex;opening=null;
      }
    }
    // An unclosed block remains visible, including its marker, for easy repair.
    if(cursor<text.length)parts.push({kind:'text',text:text.slice(cursor)});
    return parts;
  }

  function hasBlocks(value){return parse(value).some(part=>part.kind!=='text');}

  function preview(value){
    const prose=parse(value).filter(part=>part.kind==='text').map(part=>part.text).join(' ').replace(/\s+/g,' ').trim();
    const text=prose||'Soal konfigurasi / output';
    return text.length>220?text.slice(0,217)+'…':text;
  }

  function render(target,value,{interactive=false}={}){
    const parts=parse(value),hasCode=parts.some(part=>part.kind!=='text');
    target.replaceChildren();target.classList.add('rich-content');target.classList.toggle('has-code',hasCode);
    if(!hasCode){target.textContent=String(value??'');return;}
    const doc=target.ownerDocument;
    for(const part of parts){
      if(part.kind==='text'){
        if(!part.text.trim())continue;
        const prose=doc.createElement('span');prose.className='quiz-prose';prose.textContent=part.text.replace(/^\n/,'').replace(/\n$/,'');target.append(prose);
      }else{
        // Phrasing elements also keep this valid inside option buttons/headings.
        const block=doc.createElement('span');block.className='code-block';
        const label=doc.createElement('span');label.className='code-label';label.textContent=labels[part.kind];
        const code=doc.createElement('code');code.className='code-content';code.textContent=part.text;
        if(!interactive){code.tabIndex=0;code.setAttribute('role','region');code.setAttribute('aria-label',labels[part.kind]+' — gunakan panah kiri/kanan untuk menggulir');}
        block.append(label,code);target.append(block);
      }
    }
  }
  return {parse,hasBlocks,preview,render};
}));

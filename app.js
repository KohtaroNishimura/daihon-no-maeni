import {barriers, required, validate, generate, direction} from './prompt.js';
const $ = id => document.getElementById(id);
const form = $('form');
const fields = [
 ['basics','role','所属・役割','あなたの所属と、この動画での立場を入力します。','例：プログラミングスクールSUNABACOの集客担当者','プログラミングスクールSUNABACOの集客担当者'],
 ['basics','purpose','目的','視聴後に起こしてほしい変化・行動を具体的に。','例：講座の詳細を確認してもらう。'],
 ['audience-fields','audience','どんな人','状況や関心を添えると、伝える相手が明確になります。','例：プログラミングに興味はあるが受講を迷っている人'],
 ['reason-fields','reason','具体的な行動しない理由','視聴者が感じている不安や疑問を書きます。','例：未経験でも学習についていけるか分からないという不安'],
 ['video-fields','video','どんな動画','上の候補から選ぶか、自由に入力してください。','例：学習の進め方と授業風景を紹介する動画'],
 ['issue-fields','issue','集客・受講申し込みにつながらない理由','発信内容や、次の行動への導線に足りない点を書きます。','例：講座の案内だけでは学習の進め方や授業の雰囲気が伝わらないこと'],
 ['issue-fields','appeal','どんな訴求','課題を解消するために、何をどう伝えるか。','例：確認済みの学習内容と実際の授業風景による安心感の訴求'],
 ['optional-fields','cta','行動喚起（CTA）','最後に促す行動を1つに絞ります。','例：プロフィールから講座の詳細を確認してください'],
 ['optional-fields','emotion','視聴後に持ってほしい気持ち','目的に向かう手前で、どんな気持ちになってほしいか。','例：学習の進め方が分かり、自分にも取り組めそうだと感じる'],
 ['optional-fields','constraints','撮影・編集の条件','出演者、場所、顔出し可否、使える機材など。決まった条件だけで大丈夫です。','例：出演は担当者1名、顔出しなし、スマートフォンで撮影'],
 ['optional-fields','facts','使用できる事実・素材','確認済みの情報や、使用許可のある素材を書きます。','例：撮影許可を得た授業風景、公開済みのカリキュラム']
];
for(const [parent,id,title,help,example,value=''] of fields) {
 const wrap=document.createElement('div'); wrap.className='field';
 const label=document.createElement('label'); label.htmlFor=id; label.textContent=title;
 const badge=document.createElement('span'); badge.className='required'; badge.textContent=required[id]?'必須':'任意'; label.append(badge);
 const desc=document.createElement('p'); desc.className='help'; desc.id=id+'-help'; desc.textContent=help;
 const input=document.createElement('textarea'); input.id=id; input.name=id; input.rows=id==='role'?2:3; input.defaultValue=value; input.placeholder=example; input.setAttribute('aria-describedby',`${id}-help ${id}-error`); if(required[id]) input.required=true;
 const error=document.createElement('p'); error.id=id+'-error'; error.className='field-error';
 wrap.append(label,desc,input,error); $(parent).append(wrap);
}
barriers.forEach((item,i)=>$('barrier').add(new Option(item.name,String(i))));
function suggestions(){
 const barrier=barriers[Number($('barrier').value)];
 for(const [container,key,items] of [['video-suggestions','video',barrier.videos],['appeal-suggestions','appeal',[barrier.appeal]]]) {
  $(container).replaceChildren();
  for(const item of items){ const b=document.createElement('button'); b.type='button'; b.textContent=item; b.addEventListener('click',()=>{
   if($(key).value.trim() && $(key).value!==item && !confirm(`${required[key]}の入力内容を、この候補に置き換えますか？`)) return;
   $(key).value=item; $(key).dispatchEvent(new Event('input',{bubbles:true})); $(key).focus();
  }); $(container).append(b); }
 }
}
suggestions(); $('barrier').addEventListener('change',suggestions); $('direction-preview').textContent=direction;
const read=()=>({...Object.fromEntries(new FormData(form)),direction:form.elements.direction.checked});
const initial=JSON.stringify(read()); let generated=null; let generatedForm=null;
const edited=()=>generated!==null && $('output').value!==generated;
function update(){
 const data=read(); const filled=Object.keys(required).length-validate(data).length;
 $('progress').value=filled; $('progress-text').textContent=`必須項目 ${filled} / 7 入力済み`;
 $('general-options').hidden=data.mode==='agent';
 $('mode-help').textContent=data.mode==='agent'?'企画と制作条件を引き継ぎ、フック・台本・制作メモなどの作成を依頼します。':'基本テンプレートを使います。必要に応じて下の構成・演出条件を追加できます。';
 $('next-step-text').textContent=data.mode==='agent'?'「ショート動画台本ディレクター」を開き、チャットに貼り付けて送信してください。':'利用する生成AIを開き、チャットに貼り付けて台本を依頼してください。';
 $('stale').hidden=generated===null || JSON.stringify(data)===generatedForm;
 $('generate').textContent=generated===null?'指示書を生成する →':'入力内容から再生成する →';
 $('count').textContent=`${$('output').value.length.toLocaleString('ja-JP')}文字`;
 $('copy').disabled=!$('output').value.trim();
 $('state').textContent=generated===null?'未生成':edited()?'直接編集中':JSON.stringify(read())!==generatedForm?'入力変更あり・要再生成':'生成済み';
}
form.addEventListener('input',e=>{if(e.target.id && required[e.target.id] && e.target.value.trim()){e.target.removeAttribute('aria-invalid'); $(e.target.id+'-error').textContent='';} update(); $('message').textContent='';});
form.addEventListener('change',update);
form.addEventListener('submit',e=>{
 e.preventDefault(); const data=read(); const missing=validate(data);
 for(const id of Object.keys(required)){ $(id).setAttribute('aria-invalid',String(missing.includes(id))); $(id+'-error').textContent=missing.includes(id)?`${required[id]}を入力してください。`:''; }
 $('errors').hidden=!missing.length; $('errors').textContent=missing.length?`未入力の項目が${missing.length}件あります：${missing.map(id=>required[id]).join('、')}`:'';
 if(missing.length){$(missing[0]).focus();return;}
 if(edited() && !confirm('直接編集した指示書が上書きされます。入力内容から再生成しますか？')) return;
 generated=generate(data); generatedForm=JSON.stringify(data); $('output').value=generated; $('output').hidden=false; $('empty').hidden=true; $('message').textContent='指示書を生成しました。内容を確認して編集できます。'; update(); $('output').focus();
});
$('output').addEventListener('input',()=>{update();$('message').textContent='';});
$('copy').addEventListener('click',async()=>{
 try {await navigator.clipboard.writeText($('output').value);$('message').textContent='コピーしました。渡し先のチャットに貼り付けて台本を依頼してください。';}
 catch {$('output').focus();$('output').select();$('message').textContent='コピーできませんでした。指示書を選択しました。Ctrl+C / ⌘C、または長押しで手動コピーしてください。';}
});
$('reset').addEventListener('click',()=>{
 if((JSON.stringify(read())!==initial || generated!==null) && !confirm('入力内容と指示書をすべてリセットしますか？必要な内容は先にコピーしてください。'))return;
 form.reset(); generated=null;generatedForm=null; $('output').value='';$('output').hidden=true;$('empty').hidden=false;$('errors').hidden=true;
 for(const id of Object.keys(required)){$(id).removeAttribute('aria-invalid');$(id+'-error').textContent='';}
 suggestions(); update();$('message').textContent='初期状態に戻しました。';$('role').focus();
});
// Reloading or leaving should not silently discard the current work.
window.addEventListener('beforeunload',e=>{if(JSON.stringify(read())!==initial || generated!==null){e.preventDefault();e.returnValue='';}});

update();

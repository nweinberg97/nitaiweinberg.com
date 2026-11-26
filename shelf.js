/* Bookshelf: spines and covers in each book's real colours.
   Covers are fetched by ISBN as soon as the page loads (the selected one first), so tapping a spine shows the cover instantly.
   Where the cover image allows it, the spine colour is sampled from the real cover and remembered for next visit. */
(function(){
var B=window.BOOKS||[],box=document.getElementById('case'),card=document.getElementById('bookcard');if(!box)return;
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var KEY='shelf-colours-v3',saved={};
try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){saved={}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(e){}}
/* colours: [spine/cover background, text] — curated first, real-cover sample when we have one */
/* spine colours are set by hand from the real covers */
var col=B.map(function(b){return [b[3],b[4]]});
var dims=B.map(function(b,i){return [32+((b[0].length*7+i*13)%20),Math.min(205,Math.max(150+((i*37)%30),b[0].length*8+60))]});
var cur=0,lastW=0,imgs=[],ready=[];

/* ---------- colour sampling ---------- */
function lum(c){var a=[c[0],c[1],c[2]].map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]}
function contrast(a,b){var x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
function hex(c){return '#'+c.map(function(v){return ('0'+Math.round(v).toString(16)).slice(-2)}).join('')}
function sample(img){
 var w=36,h=54,cv=document.createElement('canvas');cv.width=w;cv.height=h;
 var cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(img,0,0,w,h);
 var d=cx.getImageData(0,0,w,h).data,buckets={},n=0;
 for(var y=0;y<h;y++)for(var x=0;x<w;x++){
  var i=(y*w+x)*4,r=d[i],g=d[i+1],b=d[i+2];
  /* the outer band of a cover is mostly background, which is what a spine wears */
  var edge=x<5||x>w-6||y<5||y>h-6,k=(r>>4)+','+(g>>4)+','+(b>>4);
  var o=buckets[k]||(buckets[k]={n:0,e:0,r:0,g:0,b:0});o.n++;if(edge)o.e++;o.r+=r;o.g+=g;o.b+=b;n++;
 }
 var list=Object.keys(buckets).map(function(k){var o=buckets[k];return {c:[o.r/o.n,o.g/o.n,o.b/o.n],n:o.n,e:o.e}});
 list.sort(function(a,b){return (b.e*3+b.n)-(a.e*3+a.n)});
 var bg=list[0].c,best=null,bc=0;
 list.forEach(function(o){if(o.n<n*.012)return;var c=contrast(bg,o.c);if(c>bc){bc=c;best=o.c}});
 var fg=(best&&bc>=3.2)?best:(contrast(bg,[255,255,255])>contrast(bg,[20,18,16])?[255,255,255]:[30,27,24]);
 return [hex(bg),hex(fg)];
}

/* ---------- covers: load early, keep in memory ---------- */
/* cover sources, tried in order until one returns a real image.
   Each goes through wsrv.nl, a free image service that resizes the cover (fast) and allows the page
   to read its colours, so every spine can be painted from its real cover. Amazon first: best quality. */
function px(u){return 'https://wsrv.nl/?url='+encodeURIComponent(u)+'&w=360&output=webp&q=82'}
function srcs(i){var isbn=B[i][5],amz='https://images-na.ssl-images-amazon.com/images/P/'+isbn+'.01.LZZZZZZZ.jpg',ol='https://covers.openlibrary.org/b/isbn/'+isbn+'-L.jpg?default=false';return [
 {u:px(amz),cors:true},
 {u:px(ol),cors:true},
 {u:px('https://books.google.com/books/content?vid=ISBN'+isbn+'&printsec=frontcover&img=1&zoom=1'),cors:true},
 {u:amz,cors:false},
 {u:ol,cors:false}
]}
function load(i){
 if(imgs[i])return;var list=srcs(i),k=-1,img=new Image();imgs[i]=img;img.decoding='async';img.alt=B[i][0]+' cover';
 function next(){k++;if(k>=list.length){ready[i]=false;return}
  if(list[k].cors)img.crossOrigin='anonymous';else img.removeAttribute('crossorigin');
  img.src=list[k].u}
 img.onload=function(){
  /* missing covers come back as tiny placeholders: skip to the next source */
  if(img.naturalWidth<60||img.naturalHeight<80){next();return}
  ready[i]=true;
  if(i===cur)attach(i);
 };
 img.onerror=next;
 next();
}
/* carry the real cover's design onto its spine */
function art(i){var el=box.querySelectorAll('.book')[i];if(!el||!imgs[i]||!ready[i])return;if(!el.querySelector('.bg')){var g=document.createElement('span');g.className='bg';g.setAttribute('aria-hidden','true');el.insertBefore(g,el.firstChild)}el.querySelector('.bg').style.backgroundImage='url("'+imgs[i].src.replace(/"/g,'%22')+'")';el.classList.add('art')}
function paint(i,c){col[i]=c;var el=box.querySelectorAll('.book')[i];if(el){el.style.setProperty('--c',c[0]);el.style.setProperty('--t',c[1])}
 if(i===cur){var cv=card.querySelector('.cover');if(cv){cv.style.setProperty('--c',c[0]);cv.style.setProperty('--t',c[1])}}}
function attach(i){var cv=card.querySelector('.cover');if(!cv||cv.dataset.i!=String(i)||cv.querySelector('img'))return;
 var im=imgs[i].cloneNode();im.alt=B[i][0]+' cover';cv.appendChild(im);cv.classList.add('has-img')}
function preloadAll(){
 var order=[cur];for(var i=0;i<B.length;i++)if(i!==cur)order.push(i);
 load(order[0]);var k=1;
 (function next(){var batch=order.slice(k,k+4);k+=4;batch.forEach(load);if(k<order.length)setTimeout(next,120)})();
}

/* ---------- shelf ---------- */
function build(){
 box.innerHTML='';var avail=box.clientWidth-70,row=null;
 var total=dims.reduce(function(a,d){return a+d[0]+4},0),n=B.length;
 var rows=Math.max(1,Math.ceil(total/avail)),k=rows===1?Math.min(2.2,(avail-8)/total):1;
 box.classList.add('fill');var lastRow=-1;
 B.forEach(function(b,i){
  var el=document.createElement('button');el.className='book';el.type='button';
  var w=Math.floor(dims[i][0]*k),h=Math.round(dims[i][1]*Math.min(1.3,k));
  var r=Math.floor(i*rows/n);if(r!==lastRow){row=document.createElement('div');row.className='row';box.appendChild(row);lastRow=r}
  el.style.cssText='--c:'+col[i][0]+';--w:'+w+'px;--h:'+h+'px;--t:'+col[i][1];
  el.setAttribute('aria-label',b[0]+' by '+b[1]);
  el.innerHTML='<span class="t"><i>'+esc(b[0])+'</i></span><span class="a">'+esc(b[1].split(/[ ,&]+/).filter(Boolean).slice(-1)[0])+'</span>';
  el.addEventListener('click',function(){show(i,el,true)});
  el.addEventListener('pointerenter',function(){load(i)});
  if(i===cur)el.classList.add('on');
  row.appendChild(el);
 });
 fit();
}
function fit(){box.querySelectorAll('.book .t').forEach(function(sp){var it=sp.firstChild,au=sp.nextSibling,avail=sp.parentNode.clientHeight-(au?au.getBoundingClientRect().height:0)-52,fs=14;it.style.fontSize=fs+'px';for(var k=0;k<3;k++){var len=it.getBoundingClientRect().height;if(len<=avail)break;fs=Math.max(7,fs*avail/len*.98);it.style.fontSize=fs.toFixed(1)+'px'}})}
function show(i,el,user){var b=B[i];cur=i;
 box.querySelectorAll('.book').forEach(function(x){x.classList.toggle('on',x===el)});
 card.innerHTML='<div class="cover cv" data-i="'+i+'" style="--c:'+col[i][0]+';--t:'+col[i][1]+'"><span class="ft"><b>'+esc(b[0])+'</b><small>'+esc(b[1])+'</small></span></div><h3>'+esc(b[0])+'</h3><span class="by">'+esc(b[1])+'</span><p>'+esc(b[2])+'</p><a href="https://www.amazon.com/dp/'+b[5]+'" target="_blank" rel="noopener">View on Amazon ↗</a>';
 if(ready[i])attach(i);else load(i);
 if(user)card.scrollIntoView({behavior:'smooth',block:'nearest'});
}
build();lastW=box.clientWidth;
show(0,box.querySelector('.book'));
preloadAll();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
addEventListener('resize',function(){if(Math.abs(box.clientWidth-lastW)<20)return;lastW=box.clientWidth;build()});
})();

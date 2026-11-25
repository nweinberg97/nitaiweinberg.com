/* Bookshelf: spines in each book's real colours; tap one to pull out its real cover (loaded by ISBN, with a typeset fallback). */
(function(){
var B=window.BOOKS||[],box=document.getElementById('case'),card=document.getElementById('bookcard');if(!box)return;
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var dims=B.map(function(b,i){return [32+((b[0].length*7+i*13)%20),Math.min(205,Math.max(150+((i*37)%30),b[0].length*7.2+34))]});
var cur=0,lastW=0;
function build(){
 box.innerHTML='';var avail=box.clientWidth-70,row=null,used=0;
 var total=dims.reduce(function(a,d){return a+d[0]+4},0),n=B.length;
 var rows=Math.max(1,Math.ceil(total/avail)),k=rows===1?Math.min(2.2,(avail-8)/total):1;
 box.classList.add('fill');var lastRow=-1;
 B.forEach(function(b,i){
  var el=document.createElement('button');el.className='book';el.type='button';
  var w=Math.floor(dims[i][0]*k),h=Math.round(dims[i][1]*Math.min(1.3,k));
  var r=Math.floor(i*rows/n);if(r!==lastRow){row=document.createElement('div');row.className='row';box.appendChild(row);lastRow=r}
  el.style.cssText='--c:'+b[3]+';--w:'+w+'px;--h:'+h+'px;--t:'+b[4];
  el.setAttribute('aria-label',b[0]+' by '+b[1]);
  el.innerHTML='<span class="t"><i>'+esc(b[0])+'</i></span><span class="a">'+esc(b[1].split(/[ ,&]+/).filter(Boolean).slice(-1)[0])+'</span>';
  el.addEventListener('click',function(){show(i,el,true)});
  if(i===cur)el.classList.add('on');
  row.appendChild(el);
 });
 /* size each title to fill its spine without running off it */
 box.querySelectorAll('.book .t').forEach(function(sp){var it=sp.firstChild,au=sp.nextSibling,avail=sp.parentNode.clientHeight-(au?au.getBoundingClientRect().height:0)-30,fs=15;it.style.fontSize=fs+'px';var len=it.getBoundingClientRect().height;if(len>avail){fs=Math.max(7.5,fs*avail/len);it.style.fontSize=fs.toFixed(1)+'px'}});
}
function show(i,el,user){var b=B[i];cur=i;
 box.querySelectorAll('.book').forEach(function(x){x.classList.toggle('on',x===el)});
 card.innerHTML='<div class="cover cv" style="--c:'+b[3]+';--t:'+b[4]+'"><span class="ft"><b>'+esc(b[0])+'</b><small>'+esc(b[1])+'</small></span></div><h3>'+esc(b[0])+'</h3><span class="by">'+esc(b[1])+'</span><p>'+esc(b[2])+'</p><a href="https://www.amazon.com/dp/'+b[5]+'" target="_blank" rel="noopener">View on Amazon ↗</a>';
 var cv=card.querySelector('.cover'),img=new Image();img.alt=b[0]+' cover';
 img.onload=function(){if(img.naturalWidth>40)cv.appendChild(img)};
 img.src='https://covers.openlibrary.org/b/isbn/'+b[5]+'-L.jpg?default=false';
 if(user)card.scrollIntoView({behavior:'smooth',block:'nearest'});
}
build();lastW=box.clientWidth;
show(0,box.querySelector('.book'));
addEventListener('resize',function(){if(Math.abs(box.clientWidth-lastW)<20)return;lastW=box.clientWidth;build()});
})();

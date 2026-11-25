(function(){
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var sleep=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
function fmt(s){var h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return (h?h+':'+String(m).padStart(2,'0'):m)+':'+String(x).padStart(2,'0')}
function visible(el,cb){if(!('IntersectionObserver' in window)){cb();return}var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){io.disconnect();cb()}},{threshold:.25});io.observe(el)}

/* TEMRO: feature list drives the screen, like its landing page */
var $=function(id){return document.getElementById(id)};
var HAS_T=!!$('ln');var ln=$('ln'),lnt=$('lnt'),lnp=$('lnp'),mic=$('mic'),caret=$('caret'),stack=$('stack'),mbt=$('mbt'),mbtt=$('mbtt');
var keyEls={opt:$('k1'),space:$('k2'),ret:$('k3')};
var feats=[].slice.call(document.querySelectorAll('#feats li'));
var run=0,timers=[],tickH=null;
function W(label,secs,opts){opts=opts||{};var el=document.createElement('div');el.className='w'+(opts.cls?' '+opts.cls:'');el.innerHTML='<span class="dot"></span><span class="l">'+label+'</span><span class="t">'+fmt(secs)+'</span>'+(opts.extra||'')+'<span class="ctl">❚❚ ✕</span>';stack.appendChild(el);var t={el:el,s:secs,label:label,tEl:el.querySelector('.t')};timers.push(t);return t}
function tick(){timers.forEach(function(t){if(t.s>0)t.s--;t.tEl.textContent=fmt(t.s)});if(mbt.classList.contains('on')&&timers[0])mbtt.textContent=fmt(timers[0].s)}
function reset(){stack.innerHTML='';timers=[];ln.classList.remove('on');mic.classList.remove('live');caret.style.display='';lnt.textContent='';lnp.innerHTML='&nbsp;';mbt.classList.remove('on');for(var k in keyEls){keyEls[k].classList.remove('show','down')}}
async function press(names,tok){names.forEach(function(n){keyEls[n].classList.add('show')});await sleep(350);if(tok!==run)return;for(var n of names){keyEls[n].classList.add('down');await sleep(140)}await sleep(160);names.forEach(function(n){keyEls[n].classList.remove('down')});await sleep(250);names.forEach(function(n){keyEls[n].classList.remove('show')})}
async function typeIn(text,tok,parse,speed){for(var i=1;i<=text.length;i++){if(tok!==run)return;lnt.textContent=text.slice(0,i);if(parse)lnp.innerHTML=parse(i);await sleep(speed||80)}}
var P=function(a,b){return '<b>Start '+a+'</b>'+(b?' · '+b:'')+'<span class="ret">return</span>'};
var scenes=[
 async function(tok){await sleep(400);await press(['opt','space'],tok);if(tok!==run)return;ln.classList.add('on');await sleep(400);
  await typeIn('45m writing',tok,function(i){return i<3?'&nbsp;':P('45:00',i>4?'Writing':'')});if(tok!==run)return;await sleep(500);await press(['ret'],tok);ln.classList.remove('on');await sleep(250);W('Writing',2700)},
 async function(tok){await sleep(300);ln.classList.add('on');caret.style.display='none';await sleep(500);mic.classList.add('live');await sleep(700);
  var words=['twenty','five','minutes','reading'],txt='';for(var i=0;i<words.length;i++){if(tok!==run)return;txt+=(i?' ':'')+words[i];lnt.textContent=txt;lnp.innerHTML=i<2?'&nbsp;':P('25:00',i>2?'Reading':'');await sleep(520)}
  await sleep(500);mic.classList.remove('live');await sleep(300);ln.classList.remove('on');await sleep(250);if(tok!==run)return;W('Reading',1500)},
 async function(tok){var t=W('Writing',750);await sleep(1400);if(tok!==run)return;await press(['opt','space'],tok);ln.classList.add('on');await sleep(300);
  await typeIn('add 5 minutes',tok,function(i){return i<5?'&nbsp;':'<b>Add 5:00</b> · to Writing<span class="ret">return</span>'},70);if(tok!==run)return;await sleep(400);await press(['ret'],tok);ln.classList.remove('on');await sleep(200);
  t.s+=300;t.tEl.textContent=fmt(t.s);t.tEl.classList.add('flash');await sleep(1200);t.tEl.classList.remove('flash')},
 async function(tok){W('Writing',1994);await sleep(900);if(tok!==run)return;W('Laundry',723);await sleep(900);if(tok!==run)return;W('Stretch',299)},
 async function(tok){var t=W('Writing',749);await sleep(1800);if(tok!==run)return;t.el.classList.add('to-bar');await sleep(400);mbtt.textContent=fmt(t.s);mbt.classList.add('on')},
 async function(tok){var t=W('Writing',4);await sleep(4300);if(tok!==run)return;t.el.classList.add('out');await sleep(380);stack.innerHTML='';timers=[];W('Break',300,{cls:'brk'})},
 async function(tok){var t=W('Writing',1500,{extra:'<span class="eq"><i></i><i></i><i></i><i></i></span><span class="snd" id="snd">Rain</span>'});var names=['Rain','Café','Brown noise'];
  for(var k=1;k<6;k++){await sleep(1300);if(tok!==run)return;var el=document.getElementById('snd');if(el)el.textContent=names[k%3]}}
];
var DUR=7000,adv=null;
addEventListener('message',function(e){if(!e.data)return;var f=document.getElementById('temroFrame'),g=document.getElementById('lhcFrame');if(f&&e.data.temroHeight)f.style.height=e.data.temroHeight+'px';if(g&&e.data.lhcHeight)g.style.height=e.data.lhcHeight+'px';var tp=document.getElementById('temroProto'),lp=document.getElementById('lecProto');if(tp&&e.data.temroProtoHeight)tp.style.height=e.data.temroProtoHeight+'px';if(lp&&e.data.lecProtoHeight)lp.style.height=e.data.lecProtoHeight+'px'});
function select(i){run++;var tok=run;reset();feats.forEach(function(f,j){f.classList.toggle('on',i===j);f.style.setProperty('--dur',DUR+'ms')});
 var bar=feats[i].querySelector('i');bar.style.display='none';void bar.offsetWidth;bar.style.display='';
 scenes[i](tok);clearTimeout(adv);if(!reduce)adv=setTimeout(function(){select((i+1)%scenes.length)},DUR)}
feats.forEach(function(f,i){f.querySelector('button').addEventListener('click',function(){select(i)})});
function startTemro(){if(!HAS_T)return;tickH=setInterval(tick,1000);select(0)}

/* Type it the way you'd say it */
var rows=[].slice.call(document.querySelectorAll('#say .row'));if(!rows.length)rows=null;
async function sayLoop(){
 if(!rows)return;
 if(reduce){rows.forEach(function(r){var c=r.querySelector('code');c.textContent=c.dataset.t;r.classList.add('on','done')});return}
 while(true){
  rows.forEach(function(r){r.classList.remove('on','done');r.querySelector('code').textContent=''});
  for(var r of rows){var c=r.querySelector('code'),t=c.dataset.t;r.classList.add('on');for(var i=1;i<=t.length;i++){c.textContent=t.slice(0,i);await sleep(70)}await sleep(250);r.classList.add('done');await sleep(650)}
  await sleep(2400);
 }
}
/* Let Her Cook walkthrough */
var imgs=[].slice.call(document.querySelectorAll('#stage>img')),cur=document.getElementById('cur'),rip=document.getElementById('rip'),steps=[].slice.call(document.querySelectorAll('#lsteps span'));
var ov={dim:document.getElementById('ovDim'),hl:document.getElementById('ovHl'),chk:document.getElementById('ovChk'),url:document.getElementById('ovUrl')};
function show(i){imgs.forEach(function(m,j){m.classList.toggle('on',i===j)})}
function step(i){steps.forEach(function(s,j){s.classList.toggle('on',i===j)})}
function move(x,y){cur.style.left=x+'%';cur.style.top=y+'%'}
async function click(x,y){rip.style.left=x+'%';rip.style.top=y+'%';rip.classList.remove('go');void rip.offsetWidth;rip.classList.add('go');await sleep(350)}
function clear(){for(var k in ov)ov[k].classList.remove('on');ov.url.textContent=''}
async function tour(){
 if(reduce){step(0);cur.style.display='none';return}
 while(true){
  clear();show(0);step(0);move(60,30);await sleep(1200);
  move(36,85);await sleep(1300);await click(36,85);
  show(1);step(1);await sleep(900);move(28,67);await sleep(1300);await click(28,67);
  show(2);step(2);await sleep(900);move(46.6,29.5);await sleep(1300);await click(46.6,29.5);ov.chk.classList.add('on');await sleep(700);
  move(91,95);await sleep(1200);await click(91,95);ov.dim.classList.add('on');ov.hl.classList.add('on');await sleep(1600);
  clear();show(0);step(3);move(12,15);await sleep(1300);await click(12,15);
  show(3);await sleep(800);move(27.7,30);await sleep(1100);await click(27.7,30);
  move(40,56);await sleep(1000);await click(40,56);ov.url.classList.add('on');
  var u='https://www.myfavouriteblog.com/banana-bread';for(var i=1;i<=u.length;i++){ov.url.textContent=u.slice(0,i);await sleep(40)}
  await sleep(400);move(89,56);await sleep(1000);await click(89,56);await sleep(1500);
 }
}
if(document.getElementById('temro'))visible(document.getElementById('temro'),function(){startTemro();sayLoop()});
if(document.getElementById('stage'))visible(document.getElementById('lhc'),tour);
})();

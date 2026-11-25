(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* ---------- Walla (ported from the app's WallaFeed) ---------- */
var GREY='#AEB9C7',FACE='#BCC6D2',PINK='#F6C3CF',CHEEK='#F59AAE',NOSE='#3A3F4B',EYE='#262A33',APRON='#FF7A3D',LEAF='#8DB9A2',EDGE='#5E8F78';
var BUBBLE={idle:'Psst… is that eucalyptus I smell?',incoming:'Is that… for ME?!',eating:'nom nom nom',burp:'*burp*  …oh my, excuse me!',happy:'THANK YOU!! You’re the best.'};
function wallaSVG(size){
 var hearts=[[42,60,0],[160,52,.5],[30,120,1],[172,118,1.5]].map(function(h,i){return '<path class="wf-heart" style="animation-delay:'+h[2]+'s" transform="translate('+h[0]+' '+h[1]+')" d="M0 6c-4-3-7-5.5-7-8.5a3.6 3.6 0 0 1 7-1.2 3.6 3.6 0 0 1 7 1.2c0 3-3 5.5-7 8.5z" fill="'+(i%2?APRON:CHEEK)+'"/>'}).join('');
 return '<svg width="'+size+'" height="'+(size*1.15)+'" viewBox="0 0 200 230" class="walla-feed__svg" role="img" aria-label="Walla the koala">'+
 '<g class="wf-hearts">'+hearts+'</g><g class="wf-body">'+
 '<ellipse cx="78" cy="214" rx="20" ry="11" fill="#8E9AAB"/><ellipse cx="122" cy="214" rx="20" ry="11" fill="#8E9AAB"/>'+
 '<path d="M52 168c0-30 21-48 48-48s48 18 48 48v20c0 18-14 28-48 28s-48-10-48-28z" fill="'+GREY+'"/>'+
 '<path d="M68 140h64v50c0 12-10 20-32 20s-32-8-32-20z" fill="'+APRON+'"/>'+
 '<path d="M68 140c-6-6-10-14-10-22M132 140c6-6 10-14 10-22" stroke="'+APRON+'" stroke-width="6" stroke-linecap="round" fill="none"/>'+
 '<path d="M100 186c-7-5-12-9-12-14a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 5-5 9-12 14z" fill="#FFF6EC"/><path d="M74 152h52" stroke="#FFB48A" stroke-width="3" stroke-linecap="round"/>'+
 '<ellipse class="wf-paw-l" cx="55" cy="170" rx="13" ry="17" fill="'+GREY+'" transform="rotate(20 55 170)"/><g class="wf-paw-r"><ellipse cx="145" cy="170" rx="13" ry="17" fill="'+GREY+'" transform="rotate(-20 145 170)"/></g>'+
 '<g class="wf-head"><circle cx="46" cy="76" r="30" fill="'+GREY+'"/><circle cx="154" cy="76" r="30" fill="'+GREY+'"/><circle cx="48" cy="78" r="18" fill="'+PINK+'"/><circle cx="152" cy="78" r="18" fill="'+PINK+'"/>'+
 '<ellipse cx="100" cy="92" rx="54" ry="50" fill="'+FACE+'"/><rect x="68" y="42" width="64" height="22" rx="7" fill="#F4EEE5"/><circle cx="78" cy="34" r="17" fill="#fff"/><circle cx="122" cy="34" r="17" fill="#fff"/><circle cx="100" cy="24" r="21" fill="#fff"/>'+
 '<path d="M84 50v10M100 50v10M116 50v10" stroke="#E4DCD0" stroke-width="2.5" stroke-linecap="round"/>'+
 '<g class="wf-eyes-normal"><ellipse cx="78" cy="94" rx="6" ry="7" fill="'+EYE+'"/><ellipse cx="122" cy="94" rx="6" ry="7" fill="'+EYE+'"/><circle cx="80" cy="91" r="2.2" fill="#fff"/><circle cx="124" cy="91" r="2.2" fill="#fff"/></g>'+
 '<g class="wf-eyes-sparkle"><ellipse cx="78" cy="94" rx="9" ry="10" fill="'+EYE+'"/><ellipse cx="122" cy="94" rx="9" ry="10" fill="'+EYE+'"/><path d="M81 87l1.3 3 3 1.3-3 1.3-1.3 3-1.3-3-3-1.3 3-1.3z" fill="#fff"/><path d="M125 87l1.3 3 3 1.3-3 1.3-1.3 3-1.3-3-3-1.3 3-1.3z" fill="#fff"/><circle cx="74" cy="99" r="1.8" fill="#fff"/><circle cx="118" cy="99" r="1.8" fill="#fff"/></g>'+
 '<g class="wf-eyes-happy" fill="none" stroke="'+EYE+'" stroke-width="4" stroke-linecap="round"><path d="M70 97q8-10 16 0"/><path d="M114 97q8-10 16 0"/></g>'+
 '<ellipse class="wf-cheek wf-cheek-l" cx="66" cy="112" rx="9" ry="6" fill="'+CHEEK+'" opacity=".75"/><ellipse class="wf-cheek wf-cheek-r" cx="134" cy="112" rx="9" ry="6" fill="'+CHEEK+'" opacity=".75"/>'+
 '<path d="M100 96c11 0 15 8 15 15 0 9-7 15-15 15s-15-6-15-15c0-7 4-15 15-15z" fill="'+NOSE+'"/><ellipse cx="95" cy="104" rx="4" ry="2.5" fill="#fff" opacity=".35"/>'+
 '<path class="wf-mouth-smile" d="M92 131c4 4 12 4 16 0" stroke="'+NOSE+'" stroke-width="3.5" stroke-linecap="round" fill="none"/>'+
 '<g class="wf-mouth-open"><ellipse cx="100" cy="134" rx="8" ry="7" fill="#5B2B33"/><ellipse cx="100" cy="138" rx="5" ry="3" fill="#F28CA0"/></g>'+
 '<path class="wf-mouth-chew" d="M91 132q4.5 4 9 0q4.5 4 9 0" stroke="'+NOSE+'" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'+
 '<g class="wf-mouth-grin"><path d="M88 129q12 14 24 0z" fill="#5B2B33" stroke="'+NOSE+'" stroke-width="2.5" stroke-linejoin="round"/><path d="M94 135q6 4 12 0" fill="#F28CA0"/></g>'+
 '<ellipse class="wf-crumb-stuck" cx="117" cy="127" rx="4.6" ry="3" fill="'+LEAF+'" stroke="'+EDGE+'" stroke-width="1" transform="rotate(-25 117 127)"/>'+
 '</g></g><g class="wf-sprig-slot"></g><g class="wf-crumb-slot"></g></svg>';
}
function makeWalla(el,size){
 el.innerHTML='<div class="walla-feed is-idle" aria-live="polite"><p class="walla-feed__bubble">'+BUBBLE.idle+'</p>'+wallaSVG(size)+'</div>';
 var root=el.firstChild,bubble=root.querySelector('.walla-feed__bubble'),sprigSlot=root.querySelector('.wf-sprig-slot'),crumbSlot=root.querySelector('.wf-crumb-slot'),timers=[],busy=false;
 function phase(p){root.className='walla-feed is-'+p;var b=bubble.cloneNode(false);b.textContent=BUBBLE[p];bubble.replaceWith(b);bubble=b}
 function say(t){var b=bubble.cloneNode(false);b.textContent=t;bubble.replaceWith(b);bubble=b}
 function clear(){timers.forEach(clearTimeout);timers=[]}
 function at(ms,fn){timers.push(setTimeout(fn,ms))}
 function feed(leaves,done){
  clear();busy=true;
  if(reduce){phase('happy');busy=false;done&&done();return}
  var STEP=7.5,SCALE=1.7,originX=100+SCALE*(leaves*STEP)+2;
  var leafs='';for(var k=0;k<leaves;k++){var x=-leaves*STEP+k*STEP,up=k%2===0;leafs+='<ellipse class="wf-leaf" cx="'+x+'" cy="'+(up?-7:3.5)+'" rx="5.6" ry="4.4" fill="'+LEAF+'" stroke="'+EDGE+'" stroke-width="1.2" transform="rotate('+(up?-24:24)+' '+x+' '+(up?-7:3.5)+')"/>'}
  sprigSlot.innerHTML='<g class="wf-sprig-in"><g class="wf-sprig" transform="translate('+originX+' 138) scale('+SCALE+')"><path d="M0 0 L'+(-leaves*STEP-4)+' -4" stroke="#8A7458" stroke-width="2" stroke-linecap="round"/>'+leafs+'</g></g>';
  var sprig=sprigSlot.querySelector('.wf-sprig'),leafEls=sprigSlot.querySelectorAll('.wf-leaf');
  phase('incoming');var CH=950;
  at(1300,function(){phase('eating')});
  for(var i=1;i<=leaves;i++)(function(i){at(1300+i*CH,function(){
   leafEls[i-1].classList.add('is-eaten');
   var shift=-Math.min(i,leaves-1)*STEP*SCALE;sprig.setAttribute('transform','translate('+(originX+shift)+' 138) scale('+SCALE+')');
   crumbSlot.innerHTML='<g class="wf-crumbs">'+[[-14,-10],[12,-12],[-18,4],[16,6],[0,-16]].map(function(d,j){return '<ellipse class="wf-crumb" cx="100" cy="134" rx="2.4" ry="1.6" fill="'+(j%2?LEAF:EDGE)+'" style="--dx:'+d[0]+'px;--dy:'+d[1]+'px"/>'}).join('')+'</g>';
  })})(i);
  var end=1300+leaves*CH;
  at(end+150,function(){sprigSlot.innerHTML='';crumbSlot.innerHTML='';phase('burp')});
  at(end+1250,function(){phase('happy')});
  at(end+4200,function(){phase('idle');busy=false;done&&done()});
 }
 return {feed:feed,say:say,phase:phase,isBusy:function(){return busy}};
}
window.makeWalla=makeWalla;
})();

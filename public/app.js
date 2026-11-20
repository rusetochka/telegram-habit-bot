'use strict';
const HABITS=[['water','💧','Water'],['steps','👟','Steps'],['food','🥗','Nutrition'],['sleep','🌙','Sleep'],['sport','💪','Exercise']];
const KEY='habit-bot-demo-v1';
let state={started:false,done:[]};
try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&typeof saved.started==='boolean'&&Array.isArray(saved.done)){state={started:saved.started,done:[...new Set(saved.done.filter(key=>HABITS.some(h=>h[0]===key)))]};}}catch{}
const $=id=>document.getElementById(id);
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}}
function renderWeek(){
  $('week-tracker').hidden=!state.started;
  const previous=[3,5,2,4,1,4];
  const counts=[...previous,state.done.length];
  $('week-bars').replaceChildren();
  counts.forEach((count,index)=>{
    const date=new Date();date.setDate(date.getDate()-6+index);
    const label=index===6?'Today':date.toLocaleDateString('en',{weekday:'short'});
    const column=document.createElement('div');column.className='week-day'+(index===6?' is-today':'');
    column.setAttribute('aria-label',`${label}, ${date.toLocaleDateString('en',{month:'short',day:'numeric'})}: ${count} of 5 habits complete${index<6?', sample data':''}`);
    const value=document.createElement('span');value.className='week-value';value.textContent=`${count}/5`;
    const track=document.createElement('div');track.className='week-track';
    const bar=document.createElement('div');bar.className='week-bar';bar.style.height=`${count*20}%`;track.append(bar);
    const name=document.createElement('span');name.className='week-label';name.textContent=label;
    column.append(value,track,name);$('week-bars').append(column);
  });
  $('week-total').textContent=`${counts.reduce((a,b)=>a+b,0)} of 35 habits complete across this demo week`;
}
function render(){renderWeek(); $('checklist').hidden=!state.started; $('habits').replaceChildren();for(const [key,icon,label] of HABITS){const button=document.createElement('button');button.className='habit';button.type='button';button.setAttribute('aria-pressed',String(state.done.includes(key)));button.setAttribute('aria-label',label);button.innerHTML=`<span aria-hidden="true">${icon}</span><span>${label}</span><span class="check" aria-hidden="true">${state.done.includes(key)?'✓':''}</span>`;button.onclick=()=>{state.done=state.done.includes(key)?state.done.filter(v=>v!==key):[...state.done,key];save();render();$('reply').hidden=true;};$('habits').append(button);} $('count').textContent=`${state.done.length} of 5 habits complete`;$('fill').style.width=`${state.done.length*20}%`;}
$('chat-form').onsubmit=event=>{event.preventDefault();const input=$('chat-input');if(input.value.trim().toLowerCase()!=='/today'){$('command-status').textContent='Type /today to start a fresh checklist.';return;}input.value='';$('command-status').textContent='';state={started:true,done:[]};save();render();$('reply').hidden=true;$('checklist').scrollIntoView({behavior:'smooth',block:'nearest'});};
$('summary').onclick=()=>{const n=state.done.length;const message=n>=4?'Great work! Your everyday effort is adding up.':n>=2?'A solid start. Every small step counts—keep going.':'A fresh start is always available. Choose one small habit to begin.';$('reply').textContent=`${n}/5 habits complete. ${message}`;$('reply').hidden=false;$('reply').scrollIntoView({behavior:'smooth',block:'nearest'});};
$('reset').onclick=()=>{state={started:false,done:[]};try{localStorage.removeItem(KEY);}catch{}render();$('reply').hidden=true;};render();

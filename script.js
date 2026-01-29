/* ================= НАВИГАЦИЯ ================= */
function openScreen(id){
  document.querySelectorAll('.screen')
    .forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  if(id==="rps") resetRPS();
  if(id==="ttt") resetTTT();
}

/* О НАС */
const aboutModal=document.getElementById('aboutModal');
function openAbout(){
  aboutModal.style.display="flex";
}
function closeAbout(){
  aboutModal.style.display="none";
}

/* ripple + звук */
const audio=new AudioContext();
function clickSound(){
  const o=audio.createOscillator();
  const g=audio.createGain();
  o.frequency.value=400;
  g.gain.value=.1;
  o.connect(g);
  g.connect(audio.destination);
  o.start(); o.stop(audio.currentTime+.05);
}

document.addEventListener("click",e=>{
  if(e.target.tagName==="BUTTON"){
    clickSound();
    const r=document.createElement("span");
    r.className="ripple";
    e.target.appendChild(r);
    const s=Math.max(e.target.offsetWidth,e.target.offsetHeight);
    r.style.width=r.style.height=s+"px";
    r.style.left=e.offsetX-s/2+"px";
    r.style.top=e.offsetY-s/2+"px";
    setTimeout(()=>r.remove(),600);
  }
});

/* BLOCK BLAST */
const board=document.getElementById('board');
board.innerHTML="";
for(let i=0;i<100;i++){
  const c=document.createElement('div');
  c.className='cell';
  c.onclick=()=>c.classList.add('filled');
  board.appendChild(c);
}
function spawnBlocks(){
  const box=document.getElementById('blocks');
  box.innerHTML="";
  for(let i=0;i<3;i++){
    const b=document.createElement('div');
    for(let j=0;j<4;j++) b.appendChild(document.createElement('div'));
    b.onclick=()=>{b.remove(); if(!box.children.length) spawnBlocks();}
    box.appendChild(b);
  }
}
spawnBlocks();

/* Камень-Ножницы-Бумага */
const rpsResult=document.getElementById('rpsResult');
const rpsChoices=['✂️','🪨','🧻'];
let rpsLock=false;

function resetRPS(){
  rpsResult.innerHTML="";
  rpsLock=false;
}

function playRPS(player){
  if(rpsLock) return;
  rpsLock=true;
  rpsResult.textContent="🤖 Бот думает...";
  setTimeout(()=>{
    const bot=rpsChoices[Math.floor(Math.random()*3)];
    let res;
    if(player===bot) res="Ничья 😐";
    else if(
      (player==='✂️'&&bot==='🧻')||
      (player==='🪨'&&bot==='✂️')||
      (player==='🧻'&&bot==='🪨')
    ) res="Ты выиграл 🎉";
    else res="Ты проиграл 😵";
    rpsResult.innerHTML=
      `Ты: ${player}<br>Бот: ${bot}<br><b>${res}</b>
      <br><button onclick="resetRPS()">🔁 Ещё раз</button>`;
    rpsLock=false;
  },1000);
}

/* Крестики-нолики */
const tic=document.getElementById('tic');
let tCells=[];
let tGameOver=false;

function resetTTT(){
  tic.innerHTML="";
  tCells=[];
  tGameOver=false;
  for(let i=0;i<9;i++){
    const c=document.createElement('div');
    c.className='tcell';
    c.onclick=()=>playerMove(i);
    tCells.push("");
    tic.appendChild(c);
  }
}

function playerMove(i){
  if(tGameOver||tCells[i]) return;
  tCells[i]='❌';
  tic.children[i].textContent='❌';
  if(checkWin('❌')) return endTTT("Ты выиграл 🎉");
  if(tCells.every(v=>v)) return endTTT("Ничья 😐");
  setTimeout(botMove,500);
}
function botMove(){
  let empty=tCells
    .map((v,i)=>v===""?i:null)
    .filter(v=>v!==null);
  if(!empty.length) return;
  const idx=empty[Math.floor(Math.random()*empty.length)];
  tCells[idx]='⭕';
  tic.children[idx].textContent='⭕';
  if(checkWin('⭕')) endTTT("Бот выиграл 🤖");
}
function checkWin(s){
  const w=[
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return w.some(a=>a.every(i=>tCells[i]===s));
}
function endTTT(text){
  tGameOver=true;
  setTimeout(()=>{
    alert(text);
    resetTTT();
  },200);
}

/* КЕСТЕ */
const lessonTime=[
"8:00 - 8:45","8:50 - 9:35","9:40 - 10:30",
"10:40 - 11:25","11:30 - 12:15",
"12:20 - 13:05","13:10 - 13:55",""
];
const schedule={
1:["Қазақ тілі","Дж/тарих","Алгебра","Құқық негіздері","Ағылшын","География (ф)","Дене шын-у","Сынып сағаты"],
2:["Қазақ әдебиет","Информатика","Қазақ т (ф)","Геометрия","Химия","География","Орыс т"],
3:["Ағылшын","Информатика","Биология","Алгебра","Физика","Қазақстан тарих","География"],
4:["АӘД","Геометрия","Алгебра","Қазақстан тарих","Химия","Дене шын-у","Орыс т"],
5:["Қазақ әдебиет","Алгебра","Физика","Биология","Дене шын-у","Ағылшын","Жаһандық құз (ф)"]
};
function showDay(d){
  const box=document.getElementById('lessons');
  box.innerHTML="";
  schedule[d].forEach((l,i)=>{
    const div=document.createElement('div');
    div.className="lesson";
    div.textContent=
      `${i+1} сабақ ${lessonTime[i]?`(${lessonTime[i]})`:''} — ${l}`;
    box.appendChild(div);
  });
}

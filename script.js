let points = 0;
let played = 0;

let players = [];
let positions = ["GK","DEF","MID","FWD"];

let comments=[
 "⚡ Quick counter attack!",
 "🔥 What a powerful shot!",
 "🧤 Great save!",
 "🎯 Perfect pass!",
 "⚽ GOAAAL!",
 "🏃 Fast break!",
 "📣 Crowd is loud!"
];


// ================= SAVE / LOAD =================
function saveTeam(){
 localStorage.setItem("footballTeam",JSON.stringify(players));
 localStorage.setItem("points",points);
 localStorage.setItem("played",played);
}

function loadTeam(){
 let saved=localStorage.getItem("footballTeam");
 if(saved) players=JSON.parse(saved);

 let sp=localStorage.getItem("points");
 let pl=localStorage.getItem("played");

 if(sp) points=parseInt(sp);
 if(pl) played=parseInt(pl);

 renderPlayers();
 updatePowerBar();

 document.getElementById("points").textContent=points;
 document.getElementById("played").textContent=played;
}


// ================= FIFA STATS =================
function getSmartStats(){
 return{
  shooting: Math.floor(Math.random()*40)+60,
  passing: Math.floor(Math.random()*40)+60,
  dribbling: Math.floor(Math.random()*40)+60,
  defending: Math.floor(Math.random()*40)+60,
  pace: Math.floor(Math.random()*40)+60
 };
}


// ================= ADD PLAYER =================
function addPlayer(){

 if(players.length>=11){
  alert("Max 11 players");
  return;
 }

 let name=document.getElementById("playerName").value.trim();
 let position=document.getElementById("playerPosition").value;

 if(!name){ alert("Enter name"); return; }

 let s=getSmartStats();

 let player={
  name,
  position,
  shooting:s.shooting,
  passing:s.passing,
  dribbling:s.dribbling,
  defending:s.defending,
  pace:s.pace
 };

 players.push(player);

 document.getElementById("playerName").value="";
 renderPlayers();
 updatePowerBar();
 saveTeam();
}


// ================= DELETE =================
function deletePlayer(i){
 players.splice(i,1);
 renderPlayers();
 updatePowerBar();
 saveTeam();
}


// ================= TRAIN =================
function trainPlayer(i){

 let p=players[i];
 let boost=Math.floor(Math.random()*3)+1;

 p.shooting+=boost;
 p.passing+=boost;
 p.dribbling+=boost;
 p.defending+=boost;
 p.pace+=boost;

 alert(p.name+" improved +"+boost);

 renderPlayers();
 updatePowerBar();
 saveTeam();
}


// ================= RENDER =================
function renderPlayers(){

 let formation=document.getElementById("formationSelect").value;

 let gkRow=document.getElementById("gkRow");
 let defRow=document.getElementById("defRow");
 let midRow=document.getElementById("midRow");
 let fwdRow=document.getElementById("fwdRow");

 gkRow.innerHTML="";
 defRow.innerHTML="";
 midRow.innerHTML="";
 fwdRow.innerHTML="";

 let GK=players.map((p,i)=>({...p,index:i}))
  .filter(p=>p.position=="GK").slice(0,1);

 let DEF=players.map((p,i)=>({...p,index:i}))
  .filter(p=>p.position=="DEF");

 let MID=players.map((p,i)=>({...p,index:i}))
  .filter(p=>p.position=="MID");

 let FWD=players.map((p,i)=>({...p,index:i}))
  .filter(p=>p.position=="FWD");

 let limits={
  "433":{def:4,mid:3,fwd:3},
  "442":{def:4,mid:4,fwd:2},
  "352":{def:3,mid:5,fwd:2}
 };

 let lim=limits[formation];

 DEF=DEF.slice(0,lim.def);
 MID=MID.slice(0,lim.mid);
 FWD=FWD.slice(0,lim.fwd);

 function card(p){

  let rating=Math.floor(
   (p.shooting+p.passing+p.dribbling+p.defending+p.pace)/5
  );

  return `
   <div class="player-card">
    <div><b>${p.name}</b></div>
    <div>⭐ ${rating}</div>

    <div>SHT ${p.shooting}</div>
    <div>PAS ${p.passing}</div>
    <div>DRI ${p.dribbling}</div>
    <div>DEF ${p.defending}</div>
    <div>PAC ${p.pace}</div>

    <button onclick="deletePlayer(${p.index})">❌</button>
    <button onclick="trainPlayer(${p.index})">🏋️</button>
   </div>`;
 }

 GK.forEach(p=>gkRow.innerHTML+=card(p));
 DEF.forEach(p=>defRow.innerHTML+=card(p));
 MID.forEach(p=>midRow.innerHTML+=card(p));
 FWD.forEach(p=>fwdRow.innerHTML+=card(p));
}


// ================= POWER BAR =================
function updatePowerBar(){
 let total=0;

 players.forEach(p=>{
  total+=p.shooting+p.passing+p.dribbling+p.defending+p.pace;
 });

 let percent=(total/(11*500))*100;
 document.getElementById("powerBar").style.width=percent+"%";
}


// ================= CPU =================
function generateCpuTeam(){
 let cpu=[];
 for(let i=0;i<11;i++){
  cpu.push(getSmartStats());
 }
 return cpu;
}


// ================= MATCH =================
function playMatch(){

 if(players.length==0){
  alert("Add players first");
  return;
 }

 let res=document.getElementById("result");
 let com=document.getElementById("commentary");

 res.textContent="⏳ Playing...";
 com.textContent="";

 let interval=setInterval(()=>{
  com.textContent=
   comments[Math.floor(Math.random()*comments.length)];
 },1000);

 setTimeout(()=>{

  clearInterval(interval);

  let myScore=0;

  players.forEach(p=>{
   myScore+=p.shooting+p.passing+p.dribbling+p.defending+p.pace;
  });

  let cpu=generateCpuTeam();
  let cpuScore=0;

  cpu.forEach(p=>{
   cpuScore+=p.shooting+p.passing+p.dribbling+p.defending+p.pace;
  });

  let g1=Math.floor(myScore/300);
  let g2=Math.floor(cpuScore/300);

  document.getElementById("scoreBoard").textContent=
   `${g1}-${g2}`;

  if(g1>g2){
   res.textContent="YOU WIN 🏆";
   points+=3;
   played++;
  }
  else if(g2>g1){
   res.textContent="YOU LOSE ❌";
   played++;
  }
  else{
   res.textContent="DRAW 🤝";
   points+=1;
   played++;
  }

  saveTeam();

  document.getElementById("points").textContent=points;
  document.getElementById("played").textContent=played;

 },3000);
}


// ================= PVP SHARE =================
function exportTeam(){
 let code=btoa(JSON.stringify(players));
 prompt("Copy & send to friend:",code);
}

function importTeam(){
 let code=prompt("Paste opponent code:");
 if(!code) return;

 let opp=JSON.parse(atob(code));
 playVsHuman(opp);
}

function playVsHuman(opp){

 let my=0, other=0;

 players.forEach(p=>{
  my+=p.shooting+p.passing+p.dribbling+p.defending+p.pace;
 });

 opp.forEach(p=>{
  other+=p.shooting+p.passing+p.dribbling+p.defending+p.pace;
 });

 let g1=Math.floor(my/300);
 let g2=Math.floor(other/300);

 document.getElementById("scoreBoard").textContent=
  `${g1}-${g2}`;

 if(g1>g2) alert("You beat your friend 😎");
 else if(g2>g1) alert("Friend wins 😮");
 else alert("Draw!");
}


// INIT
loadTeam();





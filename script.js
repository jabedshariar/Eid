const qs=[
"I made something just for you... 🥹",
"Promise you won't laugh? 😅",
"Okay... One tiny question... ❤️",
"Are you really really sure? 🥺",
"Like... REALLY REALLY REALLY sure?? 😭💕",
"Can I have your heart forever? ❤️",
"Will you let me annoy you for the rest of our lives? 😂",
"Can I be your favorite notification? 📱💕",
"Can I be your safe place? 🌸",
"Will you stay with me forever? 🥺❤️"
];
let i=0;
const msg=document.getElementById('msg');
const yes=document.getElementById('yes');
const no=document.getElementById('no');
msg.textContent=qs[0];
function move(){no.style.left=Math.random()*(innerWidth-120)+'px';no.style.top=Math.random()*(innerHeight-60)+'px';}
no.onmouseover=move;no.onclick=move;
yes.onclick=()=>{
i++;
if(i<qs.length){msg.textContent=qs[i];if(i===qs.length-1){yes.textContent='YES 💕';}}
else{
document.getElementById('box').style.display='none';
document.getElementById('final').classList.remove('hidden');
for(let j=0;j<180;j++){let d=document.createElement('div');d.className='confetti';
d.style.left=Math.random()*100+'vw';d.style.background='hsl('+Math.random()*360+',100%,60%)';
document.body.appendChild(d);setTimeout(()=>d.remove(),3000);}
}
};
setInterval(()=>{let h=document.createElement('div');h.className='heart';h.innerHTML='❤️';
h.style.left=Math.random()*100+'vw';document.body.appendChild(h);setTimeout(()=>h.remove(),6000);},350);

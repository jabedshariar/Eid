
const no=document.getElementById('no');
const yes=document.getElementById('yes');

function move(){
const x=Math.random()*(window.innerWidth-120);
const y=Math.random()*(window.innerHeight-60);
no.style.left=x+'px';
no.style.top=y+'px';
yes.style.transform='scale('+(1+Math.random()*0.5)+')';
}
no.addEventListener('mouseover',move);
no.addEventListener('click',move);

yes.onclick=()=>{
document.getElementById('card').style.display='none';
document.getElementById('final').classList.remove('hidden');
for(let i=0;i<150;i++){
let c=document.createElement('div');
c.className='confetti';
c.style.left=Math.random()*100+'vw';
c.style.background='hsl('+Math.random()*360+',100%,60%)';
document.body.appendChild(c);
setTimeout(()=>c.remove(),3000);
}
};

setInterval(()=>{
let h=document.createElement('div');
h.className='heart';
h.innerHTML='❤️';
h.style.left=Math.random()*100+'vw';
document.body.appendChild(h);
setTimeout(()=>h.remove(),6000);
},300);

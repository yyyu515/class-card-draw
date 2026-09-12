// weight 為抽中權重；總和為 100，可直接把數字當百分比理解。
const cards = [
  {name:'DJ卡', image:'images/1.png', weight:14},
  {name:'午休自由卡', image:'images/2.png', weight:12},
  {name:'快速通關卡', image:'images/3.png', weight:15},
  {name:'無敵卡', image:'images/4.png', weight:2},
  {name:'籤王卡', image:'images/5.png', weight:4},
  {name:'免掃地卡', image:'images/6.png', weight:10},
  {name:'能量補充卡', image:'images/7.png', weight:20},
  {name:'北風太陽卡', image:'images/8.png', weight:9},
  {name:'平板卡', image:'images/9.png', weight:8},
  {name:'任性卡', image:'images/10.png', weight:6}
];


function launchConfetti(){
  if(window.innerWidth<=600 || !confettiLayer) return;

  confettiLayer.innerHTML='';

  const colors=[
    '#E76F51',
    '#F4A261',
    '#E9C46A',
    '#5F9E8B',
    '#8E87B2',
    '#D77A91',
    '#6FA3C8'
  ];

  const amount=70;

  for(let i=0;i<amount;i++){
    const piece=document.createElement('div');
    piece.className='confetti-piece';

    const fromLeft=i%2===0;
    const startX=fromLeft ? Math.random()*8 : 92+Math.random()*8;
    const startY=28+Math.random()*46;
    const moveX=fromLeft ? 180+Math.random()*450 : -(180+Math.random()*450);
    const moveY=-180+Math.random()*500;
    const rotate=-720+Math.random()*1440;
    const duration=1.6+Math.random()*1.2;

    piece.style.setProperty('--start-x',`${startX}vw`);
    piece.style.setProperty('--start-y',`${startY}vh`);
    piece.style.setProperty('--move-x',`${moveX}px`);
    piece.style.setProperty('--move-y',`${moveY}px`);
    piece.style.setProperty('--rotate',`${rotate}deg`);
    piece.style.setProperty('--duration',`${duration}s`);
    piece.style.setProperty('--color',colors[Math.floor(Math.random()*colors.length)]);

    confettiLayer.appendChild(piece);
  }

  setTimeout(()=>{
    confettiLayer.innerHTML='';
  },3000);
}

function weightedDraw(){
  const total=cards.reduce((s,c)=>s+c.weight,0);
  let r=Math.random()*total;
  for(const c of cards){
    r-=c.weight;
    if(r<0)return c;
  }
  return cards.at(-1);
}

const img=document.querySelector('#card');
const result=document.querySelector('#result');
const placeholder=document.querySelector('#placeholder');
const rollingBadge=document.querySelector('#rollingBadge');
const draw=document.querySelector('#draw');
const stop=document.querySelector('#stop');
const confettiLayer=document.querySelector('#confettiLayer');
const claimNotice=document.querySelector('#claimNotice');

let rollingTimer=null;
let currentIndex=Math.floor(Math.random()*cards.length);
let finalCard=null;
let isStopping=false;

function showCard(index, animationClass='rolling'){
  placeholder.style.display='none';
  img.style.display='block';
  img.classList.remove('show','rolling');
  img.src=cards[index].image;
  img.alt=cards[index].name;
  void img.offsetWidth;
  if(animationClass) img.classList.add(animationClass);
}

function startRoulette(){
  if(rollingTimer || isStopping) return;

  // 結果在按「開始抽卡」時就依權重決定。
  // 停止鍵只決定何時揭曉，不會改變抽中機率。
  finalCard=weightedDraw();
  claimNotice.hidden=true;
  result.textContent='抽卡中… 想停就按停止！';
  rollingBadge.hidden=false;
  draw.disabled=true;
  stop.disabled=false;

  showCard(currentIndex);
  rollingTimer=setInterval(()=>{
    currentIndex=(currentIndex+1)%cards.length;
    showCard(currentIndex);
  },85);
}

async function stopRoulette(){
  if(!rollingTimer || isStopping) return;

  isStopping=true;
  clearInterval(rollingTimer);
  rollingTimer=null;
  stop.disabled=true;
  result.textContent='慢慢停下來…';
  rollingBadge.textContent='即將揭曉…';

  const targetIndex=cards.indexOf(finalCard);
  const distance=(targetIndex-currentIndex+cards.length)%cards.length;

  // 至少再完整輪一圈，然後自然走到真正抽中的那張卡。
  const steps=cards.length + distance;

  for(let step=1; step<=steps; step++){
    const progress=step/steps;
    // 越接近最後越慢：大約從 110ms 拉長到 700ms。
    const delay=Math.round(110 + 590*Math.pow(progress,2.25));
    currentIndex=(currentIndex+1)%cards.length;
    showCard(currentIndex);
    await new Promise(resolve=>setTimeout(resolve,delay));
  }

  // 理論上此時 currentIndex 就是 targetIndex；再明確鎖定一次結果。
  currentIndex=targetIndex;
  img.classList.remove('rolling');
  img.src=finalCard.image;
  img.alt=finalCard.name;
  void img.offsetWidth;
  img.classList.add('show');

  rollingBadge.hidden=true;
  rollingBadge.textContent='抽卡中…';
  result.textContent=`🎉 恭喜抽到：${finalCard.name}！`;
  launchConfetti();
  claimNotice.hidden=false;
  draw.textContent='再抽一次';
  draw.disabled=false;
  isStopping=false;
}

draw.addEventListener('click',startRoulette);
stop.addEventListener('click',stopRoulette);

const gallery=document.querySelector('#gallery');
cards.forEach(c=>{
  const i=new Image();
  i.src=c.image;
  i.alt=c.name;
  i.loading='lazy';
  gallery.appendChild(i);
});

document.querySelector('#galleryBtn').addEventListener('click',e=>{
  gallery.hidden=!gallery.hidden;
  e.currentTarget.textContent=gallery.hidden?'查看全部卡牌':'收起卡牌圖鑑';
});

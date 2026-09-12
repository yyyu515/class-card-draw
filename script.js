// weight 為抽中權重；目前總和為 100，可直接把數字當百分比理解。
const cards = [
  {name:'DJ卡', image:'images/1.png', weight:14},
  {name:'午休自由卡', image:'images/2.png', weight:9},
  {name:'快速通關卡', image:'images/3.png', weight:15},
  {name:'無敵卡', image:'images/4.png', weight:2},
  {name:'籤王卡', image:'images/5.png', weight:4},
  {name:'免掃地卡', image:'images/6.png', weight:10},
  {name:'能量補充卡', image:'images/7.png', weight:20},
  {name:'北風太陽卡', image:'images/8.png', weight:12},
  {name:'平板卡', image:'images/9.png', weight:8},
  {name:'任性卡', image:'images/10.png', weight:6}
];

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

// 約 5 秒：前段十張卡快速輪播，最後 1～2 秒逐漸減速，再停在真正抽中的卡。
async function playRoulette(finalCard){
  placeholder.style.display='none';
  img.style.display='block';
  rollingBadge.hidden=false;

  const delays=[75,75,80,80,85,85,90,90,95,100,105,110,120,130,145,160,180,210,245,285,330,390,460,560,680];
  let index=Math.floor(Math.random()*cards.length);

  for(let step=0; step<delays.length; step++){
    const delay=delays[step];
    const isLast=step===delays.length-1;
    img.classList.remove('show','rolling');

    // 最後一次輪播直接顯示真正抽中的卡，讓動畫自然停在結果上，
    // 而不是輪播結束後才突然換成結果卡。
    if(isLast){
      img.src=finalCard.image;
      img.alt=finalCard.name;
    }else{
      index=(index+1)%cards.length;
      img.src=cards[index].image;
      img.alt=cards[index].name;
    }

    void img.offsetWidth;
    img.classList.add('rolling');
    await new Promise(resolve=>setTimeout(resolve,delay));
  }

  img.classList.remove('rolling');
  void img.offsetWidth;
  img.classList.add('show');
  rollingBadge.hidden=true;
}

draw.addEventListener('click',async()=>{
  draw.disabled=true;
  result.textContent='抽卡中…';
  const finalCard=weightedDraw(); // 結果先依權重決定，輪播只是動畫，不影響機率。
  await playRoulette(finalCard);
  result.textContent=`恭喜抽到：${finalCard.name}！`;
  draw.textContent='再抽一次';
  draw.disabled=false;
});

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

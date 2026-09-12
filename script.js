const cards = [
  { name: "任性卡", image: "images/10.png", weight: 6 },
  { name: "平板卡", image: "images/9.png", weight: 8 },
  { name: "北風太陽卡", image: "images/8.png", weight: 12 },
  { name: "能量補充卡", image: "images/7.png", weight: 20 },
  { name: "免掃地卡", image: "images/6.png", weight: 10 },
  { name: "籤王卡", image: "images/5.png", weight: 4 },
  { name: "無敵卡", image: "images/4.png", weight: 2 },
  { name: "快速通關卡", image: "images/3.png", weight: 15 },
  { name: "午休自由卡", image: "images/2.png", weight: 9 },
  { name: "DJ卡", image: "images/1.png", weight: 14 }
];

const cardImage = document.getElementById("cardImage");
const resultText = document.getElementById("resultText");
const drawButton = document.getElementById("drawButton");

let currentIndex = 0;
let winningCard = null;
let rollingTimer = null;

let isRolling = false;
let isStopping = false;


// 加權抽卡
function getWeightedRandomCard() {
  const total = cards.reduce((sum, card) => sum + card.weight, 0);

  let random = Math.random() * total;

  for (const card of cards) {
    random -= card.weight;

    if (random < 0) {
      return card;
    }
  }

  return cards[cards.length - 1];
}


// 顯示下一張
function nextCard() {
  currentIndex = (currentIndex + 1) % cards.length;

  cardImage.src = cards[currentIndex].image;
  cardImage.style.display = "block";
}


// 開始抽卡
function startDraw() {

  if (isRolling || isStopping) return;

  // 一開始就先決定最後抽到哪張
  winningCard = getWeightedRandomCard();

  isRolling = true;

  resultText.textContent = "抽卡中……想停就按停止！";

  drawButton.textContent = "停止！";
  drawButton.disabled = false;

  // 馬上先顯示第一張卡
  nextCard();

  // 快速輪播
  rollingTimer = setInterval(() => {
    nextCard();
  }, 90);
}


// 停止
function stopDraw() {

  if (!isRolling || isStopping) return;

  isRolling = false;
  isStopping = true;

  clearInterval(rollingTimer);

  drawButton.disabled = true;
  drawButton.textContent = "即將揭曉…";

  resultText.textContent = "慢慢停下來囉……";

  const winningIndex = cards.findIndex(
    card => card.name === winningCard.name
  );

  // 至少再跑一整圈
  let steps =
    cards.length +
    ((winningIndex - currentIndex + cards.length) % cards.length);

  if (steps < cards.length + 3) {
    steps += cards.length;
  }

  let step = 0;


  function slowDown() {

    step++;

    nextCard();

    if (step >= steps) {

      currentIndex = winningIndex;

      cardImage.src = winningCard.image;

      resultText.textContent =
        `🎉 恭喜抽到：${winningCard.name}！`;

      drawButton.textContent = "再抽一次";
      drawButton.disabled = false;

      isStopping = false;

      return;
    }


    // 前面快，最後越來越慢
    const progress = step / steps;

    const delay =
      100 + Math.pow(progress, 3) * 650;

    setTimeout(slowDown, delay);
  }

  slowDown();
}


// 同一顆按鈕控制「開始」和「停止」
drawButton.addEventListener("click", () => {

  if (isRolling) {
    stopDraw();
  } else if (!isStopping) {
    startDraw();
  }

});

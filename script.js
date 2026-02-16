// ===== Floating Hearts =====
(function createHearts() {
  var container = document.getElementById('hearts-bg');
  var heartSymbols = ['♥', '♡', '❤', '💕', '💗'];

  function spawnHeart() {
    var heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (12 + Math.random() * 16) + 'px';
    heart.style.color = 'rgba(255,' + Math.floor(80 + Math.random() * 80) + ',' + Math.floor(130 + Math.random() * 60) + ',' + (0.15 + Math.random() * 0.25) + ')';
    var duration = 6 + Math.random() * 8;
    heart.style.animationDuration = duration + 's';
    heart.style.animationDelay = '0s';
    container.appendChild(heart);

    setTimeout(function() {
      if (heart.parentNode) heart.parentNode.removeChild(heart);
    }, duration * 1000);
  }

  // Initial burst
  for (var i = 0; i < 12; i++) {
    setTimeout(spawnHeart, i * 300);
  }

  // Continuous spawning
  setInterval(spawnHeart, 800);
})();

// ===== Screen Navigation =====
var currentScreen = 1;

function goToScreen(num) {
  var current = document.getElementById('screen' + currentScreen);
  var next = document.getElementById('screen' + num);

  current.classList.remove('active');

  // Small delay for transition smoothness
  setTimeout(function() {
    next.classList.add('active');
    next.scrollTop = 0;
    currentScreen = num;

    // Init memory game when entering screen 3
    if (num === 3 && !gameInitialized) {
      initGame();
    }
  }, 100);
}

// ===== Screen 2: Reason Cards Toggle =====
function toggleReason(card) {
  var body = card.querySelector('.reason-body');
  var isOpen = card.classList.contains('open');

  if (isOpen) {
    // Collapse: set current height explicitly, then force reflow, then set to 0
    body.style.maxHeight = body.scrollHeight + 'px';
    body.offsetHeight; // force reflow
    body.style.maxHeight = '0';
    card.classList.remove('open');
  } else {
    // Expand: measure scrollHeight and set as max-height
    card.classList.add('open');
    body.style.maxHeight = body.scrollHeight + 'px';

    // After transition ends, switch to none so content can reflow freely
    body.addEventListener('transitionend', function handler() {
      if (card.classList.contains('open')) {
        body.style.maxHeight = 'none';
      }
      body.removeEventListener('transitionend', handler);
    });
  }
}

// ===== Screen 3: Memory Game =====
var gameInitialized = false;
var gameEmojis = ['💕', '💌', '🌹', '🧸', '🎀', '💘', '❤️', '✨'];
var cards = [];
var flippedCards = [];
var matchedPairs = 0;
var moves = 0;
var lockBoard = false;

function initGame() {
  gameInitialized = true;
  matchedPairs = 0;
  moves = 0;
  flippedCards = [];
  lockBoard = false;
  document.getElementById('movesCount').textContent = '0';
  document.getElementById('gameComplete').style.display = 'none';

  // Create pairs and shuffle
  var deck = gameEmojis.concat(gameEmojis);
  shuffle(deck);

  var board = document.getElementById('gameBoard');
  board.innerHTML = '';

  deck.forEach(function(emoji, index) {
    var card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.emoji = emoji;
    card.dataset.index = index;

    card.innerHTML =
      '<div class="game-card-inner">' +
        '<div class="game-card-front">?</div>' +
        '<div class="game-card-back">' + emoji + '</div>' +
      '</div>';

    card.addEventListener('click', function() {
      flipCard(card);
    });

    board.appendChild(card);
  });
}

function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

function flipCard(card) {
  if (lockBoard) return;
  if (card.classList.contains('flipped')) return;
  if (card.classList.contains('matched')) return;
  if (flippedCards.length >= 2) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    document.getElementById('movesCount').textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  var card1 = flippedCards[0];
  var card2 = flippedCards[1];

  if (card1.dataset.emoji === card2.dataset.emoji) {
    // Match!
    card1.classList.add('matched');
    card2.classList.add('matched');
    flippedCards = [];
    matchedPairs++;

    if (matchedPairs === gameEmojis.length) {
      // All pairs found
      setTimeout(function() {
        document.getElementById('gameComplete').style.display = 'block';
      }, 500);
    }
  } else {
    // No match - flip back
    lockBoard = true;
    setTimeout(function() {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      lockBoard = false;
    }, 600);
  }
}

// ===== Screen 4: Memories (ВАРИАНТ А — через массив) =====
// Раскомментируй блок ниже, если хочешь управлять фото из JS.
// Тогда HTML-карточки внутри memoriesGrid будут заменены автоматически.
//
// var memories = [
//   { img: 'img/m1.jpg', caption: 'Наше первое свидание' },
//   { img: 'img/m2.jpg', caption: 'Прогулка в парке' },
//   { img: 'img/m3.jpg', caption: 'Твой день рождения' },
//   { img: 'img/m4.jpg', caption: 'Новый год вместе' },
//   { img: 'img/m5.jpg', caption: 'Поездка на море' },
//   { img: 'img/m6.jpg', caption: 'Просто счастливый день' }
// ];
//
// (function renderMemories() {
//   var grid = document.getElementById('memoriesGrid');
//   grid.innerHTML = '';
//   memories.forEach(function(m) {
//     var card = document.createElement('div');
//     card.className = 'memory-card';
//     card.innerHTML =
//       '<div class="memory-photo">' +
//         '<img src="' + m.img + '" alt="' + m.caption + '">' +
//       '</div>' +
//       '<p class="memory-caption">' + m.caption + '</p>';
//     grid.appendChild(card);
//   });
// })();

// ===== Screen 4: Greeting =====
function showGreeting() {
  var greeting = document.getElementById('greeting');
  greeting.style.display = 'flex';
  document.getElementById('openGreetingBtn').style.display = 'none';
}

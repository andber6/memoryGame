const cardTypes = {
  car: 'car.svg',
  dog: 'dog.svg',
  cat: 'cat.svg',
  umbrella: 'umbrella.svg',
  racket: 'racket.svg',
  truck: 'truck.svg',
  trumpet: 'trumpet.svg',
  telescope: 'telescope.svg',
};

const totalCards = Object.keys(cardTypes).length * 2;
let flippedCardsCount = 0;

let guessCount = 0;
let highscore = localStorage.getItem('highscore') || undefined;

function randomizeArray(array) {
  const copiedArray = [...array];
  for (let i = copiedArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copiedArray[i], copiedArray[j]] = [copiedArray[j], copiedArray[i]];
  }
  return copiedArray;
}

let card1 = null;
let card2 = null;

function generateCards(numberOfCards = totalCards) {
  flippedCardsCount = 0;
  let playingArea = document.getElementById('playingArea');
  playingArea.innerHTML = '';

  numberOfCards = numberOfCards - (numberOfCards % 2);

  document.getElementById('cardCount').textContent = `${numberOfCards}`;

  const selectedTypes = Object.keys(cardTypes).slice(0, numberOfCards / 2);

  const cardList = selectedTypes.flatMap((cardType) => [
    { type: cardType, src: cardTypes[cardType], alt: cardType },
    { type: cardType, src: cardTypes[cardType], alt: cardType },
  ]);

  // Randomiser listen
  const randomizedCardList = randomizeArray(cardList);

  randomizedCardList.forEach(({ type, src, alt }) => {
    let cardElement = document.createElement('div');
    cardElement.id = `${type}-${Math.random().toString(36).substr(2, 9)}`;
    cardElement.classList.add('card', 'turn');

    let cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    let picElement = document.createElement('img');
    picElement.classList.add('card-front');
    picElement.src = `/SVG/${src}`;
    picElement.alt = alt;

    let picElementBack = document.createElement('img');
    picElementBack.classList.add('card-back');
    picElementBack.src = '/SVG/backside.svg'; // Standardbaksidebildet for alle kort
    picElementBack.alt = 'back'; // skjermleserstøtte

    cardInner.appendChild(picElement);
    cardInner.appendChild(picElementBack);

    cardElement.appendChild(cardInner);
    playingArea.appendChild(cardElement);

    cardElement.addEventListener('click', () => {
      cardElement.classList.toggle('turn'); // Vender kortet
    });
    cardElement.addEventListener('click', () => {
      if (!card1) {
        card1 = { id: cardElement.id, type };
        updateGuessCount();
      } else if (!card2 || card2.type !== type) {
        card2 = { id: cardElement.id, type };
        updateGuessCount();
        if (card1.type === card2.type && card1.id !== card2.id) {
          console.log('Samme kort');
          flippedCardsCount += 2;
          document.getElementById(card1.id).classList.add('matched');
          document.getElementById(card2.id).classList.add('matched');
          if (checkGameWon(numberOfCards)) {
            console.log('Game won!');
            updateHighscoreIfGameWon(guessCount, numberOfCards);
          }
          card1 = null;
          card2 = null;
        } else {
          console.log('Ikke samme kort');
          // Kortene matcher ikke, vender begge kortene tilbake
          setTimeout(() => {
            document.querySelector(`#${card1.id}`).classList.add('turn');
            document.querySelector(`#${card2.id}`).classList.add('turn');
            card1 = null;
            card2 = null;
          }, 1000);
        }
      }
    });
  });
}

function checkGameWon(numCardsPlayed) {
  return flippedCardsCount === numCardsPlayed;
}

function updateGuessCount() {
  guessCount++;
  document.getElementById('guessCount').textContent = `Forsøk: ${guessCount}`;
}

function updateHighscoreIfGameWon(guessCount, numCardsPlayed) {
  const highscoreKey = `highscore-${numCardsPlayed}`;
  let currentHighscore = localStorage.getItem(highscoreKey) || Infinity;
  if (checkGameWon(numCardsPlayed) && guessCount < currentHighscore) {
    console.log('New highscore! Guesses:', guessCount);
    currentHighscore = guessCount;
    localStorage.setItem(highscoreKey, guessCount); // Save new highscore to localStorage
    document.getElementById(
      'highscore'
    ).textContent = `Highscore: ${guessCount}`;
  }
}

function resetGame() {
  guessCount = 0;
  document.getElementById('guessCount').textContent = `Forsøk: ${guessCount}`;
  const selectedNumberOfCards = parseInt(
    document.getElementById('cardSelector').value,
    10
  );
  updateHighscoreDisplay(selectedNumberOfCards);
  generateCards(selectedNumberOfCards);
}

function updateHighscoreDisplay(numberOfCards) {
  const highscoreKey = `highscore-${numberOfCards}`;
  let highscore = localStorage.getItem(highscoreKey);
  console.log('highscoreKey: ', highscoreKey, ' and highscore: ', highscore);
  console.log('highscore:', highscore);
  if (highscore === null) {
    // If no highscore exists for the selected number of cards
    document.getElementById('highscore').textContent = '';
  } else {
    document.getElementById(
      'highscore'
    ).textContent = `Highscore: ${highscore}`;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('startKnapp').addEventListener('click', resetGame);
  document.getElementById('guessCount').textContent = `Forsøk: ${guessCount}`;
});

document.addEventListener('DOMContentLoaded', function () {
  const cardSelector = document.getElementById('cardSelector');
  cardSelector.addEventListener('input', () => {
    guessCount = 0;
    document.getElementById('guessCount').textContent = `Forsøk: ${guessCount}`;
    const selectedNumberOfCards = parseInt(cardSelector.value, 10);
    updateHighscoreDisplay(selectedNumberOfCards);
    generateCards(selectedNumberOfCards);
  });

  const initialNumberOfCards = parseInt(cardSelector.value, 10);
  updateHighscoreDisplay(initialNumberOfCards);
  generateCards(initialNumberOfCards);
});

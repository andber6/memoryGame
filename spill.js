const kortTyper = {
  car: 'car.svg',
  dog: 'dog.svg',
  cat: 'cat.svg',
  umbrella: 'umbrella.svg',
  racket: 'racket.svg',
  truck: 'truck.svg',
};

const totalCards = Object.keys(kortTyper).length * 2;
let flippedCardsCount = 0;

let guessCount = 0;
let highscore = localStorage.getItem('highscore') || undefined;

function randomiserArray(array) {
  const kopiertArray = [...array];
  for (let i = kopiertArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopiertArray[i], kopiertArray[j]] = [kopiertArray[j], kopiertArray[i]];
  }
  return kopiertArray;
}

let valgtKort1 = null;
let valgtKort2 = null;

function genererKort(numberOfCards = totalCards) {
  flippedCardsCount = 0;
  let spillområde = document.getElementById('spillområde');
  spillområde.innerHTML = '';

  numberOfCards = numberOfCards - (numberOfCards % 2);

  document.getElementById('cardCount').textContent = `${numberOfCards}`;

  const selectedTypes = Object.keys(kortTyper).slice(0, numberOfCards / 2);

  const kortListe = selectedTypes.flatMap((kortType) => [
    { type: kortType, src: kortTyper[kortType], alt: kortType },
    { type: kortType, src: kortTyper[kortType], alt: kortType },
  ]);

  // Randomiser listen
  const randomisertKortListe = randomiserArray(kortListe);

  randomisertKortListe.forEach(({ type, src, alt }) => {
    let kortElement = document.createElement('div');
    kortElement.id = `${type}-${Math.random().toString(36).substr(2, 9)}`;
    kortElement.classList.add('kort', 'snu');

    let kortInner = document.createElement('div');
    kortInner.classList.add('kort-inner');

    let bildeElement = document.createElement('img');
    bildeElement.classList.add('kort-front');
    bildeElement.src = `/SVG/${src}`;
    bildeElement.alt = alt;

    let bildeElementBak = document.createElement('img');
    bildeElementBak.classList.add('kort-back');
    bildeElementBak.src = '/SVG/backside.svg'; // Standardbaksidebildet for alle kort
    bildeElementBak.alt = 'back'; // skjermleserstøtte

    kortInner.appendChild(bildeElement);
    kortInner.appendChild(bildeElementBak);

    kortElement.appendChild(kortInner);
    spillområde.appendChild(kortElement);

    kortElement.addEventListener('click', () => {
      kortElement.classList.toggle('snu'); // Vender kortet
    });
    kortElement.addEventListener('click', () => {
      if (!valgtKort1) {
        console.log('valgt kort type', type);
        valgtKort1 = { id: kortElement.id, type };
        updateGuessCount();
      } else if (!valgtKort2 || valgtKort2.type !== type) {
        valgtKort2 = { id: kortElement.id, type };
        updateGuessCount();
        if (
          valgtKort1.type === valgtKort2.type &&
          valgtKort1.id !== valgtKort2.id
        ) {
          console.log('Samme kort');
          flippedCardsCount += 2;
          console.log('Flipped cards count:', flippedCardsCount);
          console.log('numberOfCards:', numberOfCards);

          document.getElementById(valgtKort1.id).classList.add('matched');
          document.getElementById(valgtKort2.id).classList.add('matched');
          if (checkGameWon(numberOfCards)) {
            console.log('Game won!');
            updateHighscoreIfGameWon(guessCount, numberOfCards);
          }
          valgtKort1 = null;
          valgtKort2 = null;
        } else {
          console.log('Ikke samme kort');
          // Kortene matcher ikke, vender begge kortene tilbake
          setTimeout(() => {
            document.querySelector(`#${valgtKort1.id}`).classList.add('snu');
            document.querySelector(`#${valgtKort2.id}`).classList.add('snu');
            valgtKort1 = null;
            valgtKort2 = null;
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
  document.getElementById('guessCount').textContent = `Guesses: ${guessCount}`;
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
  document.getElementById('guessCount').textContent = `Guesses: ${guessCount}`;
  const selectedNumberOfCards = parseInt(
    document.getElementById('cardSelector').value,
    10
  );
  updateHighscoreDisplay(selectedNumberOfCards);
  genererKort(selectedNumberOfCards);
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
  document.getElementById('guessCount').textContent = `Guesses: ${guessCount}`;
});

document.addEventListener('DOMContentLoaded', function () {
  const cardSelector = document.getElementById('cardSelector');
  cardSelector.addEventListener('input', () => {
    guessCount = 0;
    document.getElementById(
      'guessCount'
    ).textContent = `Guesses: ${guessCount}`;
    const selectedNumberOfCards = parseInt(cardSelector.value, 10);
    updateHighscoreDisplay(selectedNumberOfCards);
    genererKort(selectedNumberOfCards);
  });

  const initialNumberOfCards = parseInt(cardSelector.value, 10);
  updateHighscoreDisplay(initialNumberOfCards);
  genererKort(initialNumberOfCards);
});

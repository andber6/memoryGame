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
let highscore = localStorage.getItem('highscore') || Infinity;

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

function genererKort() {
  let spillområde = document.getElementById('spillområde');
  spillområde.innerHTML = '';

  // Generer en liste over korttyper
  const kortListe = Object.keys(kortTyper).flatMap((kortType) => [
    { type: kortType, src: kortTyper[kortType], alt: kortType },
    { type: kortType, src: kortTyper[kortType], alt: kortType }, // en ekstra for å lage par
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
        valgtKort1 = { id: kortElement.id, type }; // Lagrer referansen til det første kortet som blir valgt
        updateGuessCount();
        console.log('Valgt kort 1:', valgtKort1);
      } else if (!valgtKort2 || valgtKort2.type !== type) {
        valgtKort2 = { id: kortElement.id, type }; // Lagrer referansen til det andre kortet som blir valgt
        updateGuessCount();
        console.log('Valgt kort 2:', valgtKort2);
        if (
          valgtKort1.type === valgtKort2.type &&
          valgtKort1.id !== valgtKort2.id
        ) {
          console.log('Samme kort');
          flippedCardsCount += 2;
          updateHighscoreIfGameWon();
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

function checkGameWon() {
  return flippedCardsCount === totalCards;
}

function updateGuessCount() {
  guessCount++;
  document.getElementById('guessCount').textContent = `Guesses: ${guessCount}`;
}

function updateHighscoreIfGameWon() {
  if (checkGameWon() && guessCount < highscore) {
    console.log('New highscore!');
    highscore = guessCount;
    localStorage.setItem('highscore', highscore); // Save new highscore to localStorage
    document.getElementById(
      'highscore'
    ).textContent = `Highscore: ${highscore}`;
  }
}

function resetGame() {
  guessCount = 0;
  document.getElementById('guessCount').textContent = `Guesses: ${guessCount}`;
  genererKort();
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('startKnapp').addEventListener('click', resetGame);
  document.getElementById('guessCount').textContent = `Guesses: ${guessCount}`;
  document.getElementById('highscore').textContent = `Highscore: ${
    highscore === Infinity ? 0 : highscore
  }`;
});

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('startKnapp').addEventListener('click', () => {
    genererKort();
  });
});

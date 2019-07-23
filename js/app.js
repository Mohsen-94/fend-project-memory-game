/*
 * Create a list that holds all of your cards
 */
// All cards from HTMLCollection converted to an array.
const cards = Array.from(document.getElementsByClassName('card'));
// Storing the first opened card to compare it later with another clicked card.
let openedCard;
let moves = 0;
let timer = 0;
let timeTicker;
start();
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function start() {
  //shuffle and add cards to page.
  shuffle(cards);
  //go through each card and append it to the deck container
  cards.forEach(card => {
    card.className = 'card';
    document.querySelector('.deck').appendChild(card);
  });
  startTimer();
}
//reset all state
function reset() {
  openedCard = null;
  moves = 0;
  timer = 0;
  stopTimer();
  clearUI();
  start();
}

// function to start our timer
function startTimer() {
  stopTimer(); //clear previous timer
  let removedStars = 0;
  let timerElement = document.querySelector('#timer');
  // this is the function that will run every 1 second
  // it is responsible for the rating as well
  timeTicker = setInterval(function() {
    //update the time in the view
    timerElement.textContent = 'Time: ' + timer;
    timer++;
    //after 25 seconds, take away 1 star
    if (timer > 25 && removedStars === 0) {
      removeStar();
      removedStars++;
    }
    //after 45 seconds, take away 1 star
    if (timer > 45 && removedStars === 1) {
      removeStar();
      removedStars++;
    }
  }, 1000);
}

function stopTimer() {
  // using truthy value to clear any previous timers running
  if (timeTicker) clearInterval(timeTicker);
}

//helper function clears the view
function clearUI() {
  clearMoves();
  document.querySelector('#timer').textContent = 'Time: 0';
  document.querySelector(
    '.stars'
  ).innerHTML = `<li><i class="fa fa-star"></i></li>
  <li><i class="fa fa-star"></i></li>
  <li><i class="fa fa-star"></i></li>`;
}

function removeStar() {
  document
    .querySelector('.stars')
    .removeChild(document.querySelector('.stars').firstElementChild);
}

function incrementMoves() {
  document.querySelector('.moves').textContent = ++moves;
}

function clearMoves() {
  moves = 0;
  document.querySelector('.moves').textContent = moves;
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function show(card) {
  card.classList.add('open');
}

function matched(...cards) {
  cards.forEach(card => {
    card.classList.add('match');
  });
}

function unmatched(...cards) {
  cards.forEach(card => {
    card.classList.remove('open');
  });
}

function displayModal() {
  replay.onclick = () => {
    modal.style.display = 'none';
    reset();
  };
  time.textContent = --timer;
  rating.textContent = document.querySelector('.stars').children.length;
  modal.style.display = 'block';
}

function checkWin() {
  if (cards.every(isMatched)) congrats();
}

function congrats() {
  stopTimer();
  displayModal();
}

function isMatched(card) {
  return card.classList.contains('match');
}

function compareCards(clickedCard) {
  //check if we have a card clicked already
  if (openedCard) {
    incrementMoves();
    //check if this card and the previous clicked card have the same icons
    if (
      openedCard !== clickedCard &&
      openedCard.firstElementChild.className ===
        clickedCard.firstElementChild.className
    ) {
      matched(openedCard, clickedCard); //match the two cards
      openedCard = null; // and clear the previous opened card variable
      checkWin();
    } else {
      unmatched(openedCard, clickedCard);
      openedCard = null;
    }
  }
  // else if this is the first opened card of a pair, store it in this variable
  else {
    openedCard = clickedCard;
  }
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
const deck = document.querySelector('.deck');

deck.addEventListener('click', function listener(ev) {
  //Do nothing if clicking on .deck container
  if (ev.target.nodeName == 'UL') return;
  //Show the clicked card
  show(ev.target);
});

deck.addEventListener('transitionend', function listener(ev) {
  //this transitionend event fires three times for each property: font-size, transform and color
  //gaurded by ev.propertyName !== 'font-size' it only fires once
  if (ev.target.nodeName == 'UL' || ev.propertyName !== 'font-size') return;
  compareCards(ev.target);
});

document.querySelector('.fa-repeat').addEventListener('click', reset);

// Modal script inspired from w3schools
// Get the modal
let modal = document.querySelector('.modal');

// Get the X button that closes the modal
let X = document.querySelector('.close');

// Get the replay button
let replay = document.querySelector('#btn');

// Get the span of the timer
let time = document.querySelector('#modal-timer');

// Get the span with the number representing the rating
let rating = document.querySelector('#modal-stars');

// When the user clicks on (x), close the modal
X.onclick = () => {
  modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = ev => {
  if (ev.target === modal) {
    modal.style.display = 'none';
  }
};

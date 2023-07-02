let dealerSum = 0;
let yourSum = 0;
let count = 0;
let dealerAceCount = 0;
let yourAceCount = 0;
let hidden;
let deck;
let runningCount = 0;
let canHit = true; //allows the player (you) to draw while yourSum <= 21
let streak = 0;

window.onload = function () {
  buildDeck();
  shuffleDeck();
  startGame();
  buttons1();
};

function buildDeck() {
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  let types = ["C", "D", "H", "S"];
  deck = [];
  for (let k = 0; k < 6; k++) {
    // 6 deck shoe
    for (let i = 0; i < types.length; i++) {
      for (let j = 0; j < values.length; j++) {
        deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
      }
    }
    // console.log(deck);
  }
}
function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  //console.log(deck);
}

function startGame() {
  dealerAceCount = 0;
  yourAceCount = 0;
  dealerSum = 0;
  yourSum = 0;

  canHit = true;

  /* include for USA blackjack with hole card
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    let hiddenImg=document.createElement("img");
    hiddenImg.src="./cards/back.png";
    document.getElementById("dealer-cards").append(hiddenImg);
    */

  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  dealerSum += getValue(card);
  dealerAceCount += checkAce(card);
  document.getElementById("dealer-cards").append(cardImg);

  //Deal player two cards
  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);

    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
  }
  document.getElementById("your-sum").innerText = yourSum;
  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("streak").innerText = streak;
  //Check for blackjack
  if (dealerSum == 21 && yourSum !== 21) {
    canHit = false;
    document.getElementById("results").innerText = "Dealer blackjack, you lose";
  }
  if (yourSum == 21 && dealerSum !== 21) {
    canHit = false;
  }
  if (yourSum == 21 && dealerSum == 21) {
    canHit = false;
    document.getElementById("results").innerText = "Push";
  }
  //buttons
}

function hit() {
  let answer = basicStrategy();
  streak += 1;

  if (answer !== "hit") {
    window.alert("Incorrect you should  " + answer);
    streak = 0;
  }
  newHand();
  startGame();
}
function split() {
  let answer = basicStrategy();
  streak += 1;
  if (answer !== "split") {
    window.alert("Incorrect you should  " + answer);
    streak = 0;
  }
  newHand();
  startGame();
}
function double() {
  let answer = basicStrategy();
  streak += 1;
  if (answer !== "double") {
    window.alert("Incorrect you should  " + answer);
    streak = 0;
  }
  newHand();
  startGame();
}

function stand() {
  let answer = basicStrategy();
  streak += 1;
  if (answer !== "stand") {
    window.alert("Incorrect you should  " + answer);
    streak = 0;
  }
  newHand();
  startGame();
}

function getValue(card) {
  let data = card.split("-");
  let value = data[0];

  if (isNaN(value)) {
    // A J Q or K
    if (value == "A") {
      value = 11;
    } else {
      value = 10;
    }
  }

  // Running count -1 0 or +1
  // console.log(parseInt(value));
  if (2 <= parseInt(value) && parseInt(value) <= 6) {
    runningCount += 1;
  } else if (7 <= parseInt(value) && parseInt(value) <= 9) {
    runningCount += 0;
  } else if (parseInt(value) == 10 || parseInt(value) == 11) {
    runningCount -= 1;
  }

  return parseInt(value);
}

function checkAce(card) {
  if (card[0] == "A") {
    return 1;
  } else {
    return 0;
  }
}

function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}
function newHand() {
  var imagex = document.getElementById("dealer-cards");
  imagex.innerHTML = "";
  //imagex.parentNode.removeChild(imagex);

  var imagey = document.getElementById("your-cards");
  imagey.innerHTML = "";
  //imagey.parentNode.removeChild(imagey);
}
function count2() {
  window.alert("The count is " + runningCount);
}
function basicStrategy() {
  var action = 2;
  // see if double down
  if (yourAceCount == 1) {
    if (yourSum >= 13 && yourSum <= 16 && (dealerSum == 5 || dealerSum == 6)) {
      action = "double";
    }
    if ((yourSum == 17 || yourSum == 18) && dealerSum < 7) {
      action = "double";
    }
  } else {
    if (yourSum == 9 && dealerSum < 7) {
      action = "double";
    }
    if (yourSum == 10 && dealerSum < 10) {
      action = "double";
    }
    if (yourSum == 11) {
      action = "double";
    }
  }
  // hit or stand
  if (yourAceCount == 1) {
    if (yourSum < 18) {
      action = "hit";
    }
    if (yourSum > 18) {
      action = "stand";
    }
    if (yourSum < 12) {
      action = "hit";
    }
  }
  if (dealerSum < 7) {
    if (yourSum == 12 && (dealerSum == 2 || dealerSum == 3)) {
      action = "hit";
    } else {
      action = "stand";
    }
  } else {
    if (yourSum < 17) {
      action = "hit";
    } else {
      action = "stand";
    }
  }
  return action;
}

function buttons1() {
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stand").addEventListener("click", stand);
  document.getElementById("double").addEventListener("click", double);
  document.getElementById("count").addEventListener("click", count2);
  document.getElementById("split").addEventListener("click", split);
}

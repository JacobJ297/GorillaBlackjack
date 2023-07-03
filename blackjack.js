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
let isPair = false;
let correctCount = 0;
let playedCount = 0;
let playercards = [];

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
  playercards = [];

  //Deal player two cards
  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    playercards.push(getValue(card));

    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
  }
  console.log(playercards);
  document.getElementById("your-sum").innerText = yourSum;
  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("streak").innerText = streak;
  let percentage = 0;

  if (playedCount !== 0) {
    percentage = Math.floor((correctCount / playedCount) * 100);
  }

  document.getElementById("percentage").innerText = percentage;

  //Check for blackjack
  if (dealerSum == 21 || yourSum == 21) {
    newHand();
    startGame();
  }

  //buttons
}

function hit() {
  let answer = basicStrategy();
  streak += 1;

  if (answer !== "hit") {
    window.alert("Incorrect you should  " + answer);
    streak = 0;
  } else {
    correctCount += 1;
  }
  playedCount += 1;

  newHand();
  startGame();
}
function split2() {
  let answer = basicStrategy();
  streak += 1;
  if (answer !== "split") {
    window.alert("Incorrect you should  " + answer);
    streak = 0;
  } else {
    correctCount += 1;
  }
  playedCount += 1;
  newHand();

  startGame();
}
function double() {
  let answer = basicStrategy();
  streak += 1;
  if (answer !== "double") {
    window.alert("Incorrect you should  " + answer);
    streak = 0;
  } else {
    correctCount += 1;
  }
  playedCount += 1;

  newHand();
  startGame();
}

function stand() {
  let answer = basicStrategy();
  streak += 1;
  if (answer !== "stand") {
    window.alert("Incorrect you should  " + answer);
    streak = 0;
  } else {
    correctCount += 1;
  }
  playedCount += 1;
  newHand();
  startGame();
}
function wait() {
  let answer = basicStrategy();
  streak += 1;

  if (answer !== "wait") {
    window.alert("Incorrect you should  " + answer);
    streak = 0;
  } else {
    correctCount += 1;
  }
  playedCount += 1;
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

function reduceAce(yourSum, playerAceCount) {
  while (yourSum > 21 && playerAceCount > 0) {
    yourSum -= 10;
    playerAceCount -= 1;
  }
  return yourSum;
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
  //pair
  console.log(yourSum);
  console.log(dealerSum);
  if (playercards[0] == playercards[1]) {
    if (yourAceCount == 2) {
      if (dealerAceCount == 1) {
        return "hit";
      } else {
        return "split";
      }
    }
    const pair = {
      4: {
        2: "split",
        3: "split",
        4: "split",
        5: "split",
        6: "split",
        7: "split",
        8: "hit",
        9: "hit",
        10: "hit",
        11: "hit",
      },
      6: {
        2: "split",
        3: "split",
        4: "split",
        5: "split",
        6: "split",
        7: "split",
        8: "hit",
        9: "hit",
        10: "hit",
        11: "hit",
      },
      8: {
        2: "hit",
        3: "hit",
        4: "hit",
        5: "split",
        6: "split",
        7: "hit",
        8: "hit",
        9: "hit",
        10: "hit",
        11: "hit",
      },
      10: {
        2: "double",
        3: "double",
        4: "double",
        5: "double",
        6: "double",
        7: "double",
        8: "double",
        9: "double",
        10: "hit",
        11: "hit",
      },
      12: {
        2: "split",
        3: "split",
        4: "split",
        5: "split",
        6: "split",
        7: "hit",
        8: "hit",
        9: "hit",
        10: "hit",
        11: "hit",
      },
      14: {
        2: "split",
        3: "split",
        4: "split",
        5: "split",
        6: "split",
        7: "split",
        8: "hit",
        9: "hit",
        10: "hit",
        11: "hit",
      },
      16: {
        2: "split",
        3: "split",
        4: "split",
        5: "split",
        6: "split",
        7: "split",
        8: "split",
        9: "split",
        10: "hit",
        11: "hit",
      },
      18: {
        2: "split",
        3: "split",
        4: "split",
        5: "split",
        6: "split",
        7: "wait",
        8: "split",
        9: "split",
        10: "stand",
        11: "stand",
      },
      20: {
        2: "stand",
        3: "stand",
        4: "wait",
        5: "wait",
        6: "wait",
        7: "stand",
        8: "stand",
        9: "stand",
        10: "stand",
        11: "stand",
      },
    };
    let action = pair[yourSum][dealerSum];

    return action;
  }
  // soft total
  if (yourAceCount > 0) {
    const soft = {
      13: {
        2: "hit",
        3: "hit",
        4: "hit",
        5: "double",
        6: "double",
        7: "hit",
        8: "hit",
        9: "hit",
        10: "hit",
        11: "hit",
      },
      14: {
        2: "hit",
        3: "hit",
        4: "hit",
        5: "double",
        6: "double",
        7: "hit",
        8: "hit",
        9: "hit",
        10: "hit",
        11: "hit",
      },
      15: {
        2: "hit",
        3: "hit",
        4: "double",
        5: "double",
        6: "double",
        7: "hit",
        8: "hit",
        9: "hit",
        10: "hit",
        11: "hit",
      },
      16: {
        2: "hit",
        3: "hit",
        4: "double",
        5: "double",
        6: "double",
        7: "hit",
        8: "hit",
        9: "hit",
        10: "hit",
        11: "hit",
      },
      17: {
        2: "double",
        3: "double",
        4: "double",
        5: "double",
        6: "double",
        7: "hit",
        8: "hit",
        9: "hit",
        10: "hit",
        11: "hit",
      },
      18: {
        2: "double",
        3: "double",
        4: "double",
        5: "double",
        6: "double",
        7: "stand",
        8: "stand",
        9: "hit",
        10: "hit",
        11: "hit",
      },
      19: {
        2: "stand",
        3: "stand",
        4: "wait",
        5: "wait",
        6: "wait",
        7: "stand",
        8: "stand",
        9: "stand",
        10: "stand",
        11: "stand",
      },
    };
    let action = soft[yourSum][dealerSum];
    return action;
  }
  //hard totals
  if (yourSum < 8) {
    return "hit";
  }
  if (yourSum >= 17) {
    return "stand";
  }
  const hard = {
    8: {
      2: "hit",
      3: "hit",
      4: "hit",
      5: "wait",
      6: "double",
      7: "hit",
      8: "hit",
      9: "hit",
      10: "hit",
      11: "hit",
    },
    9: {
      2: "double",
      3: "double",
      4: "double",
      5: "double",
      6: "double",
      7: "wait",
      8: "hit",
      9: "hit",
      10: "hit",
      11: "hit",
    },
    10: {
      2: "double",
      3: "double",
      4: "double",
      5: "double",
      6: "double",
      7: "double",
      8: "double",
      9: "double",
      10: "hit",
      11: "hit",
    },
    11: {
      2: "double",
      3: "double",
      4: "double",
      5: "double",
      6: "double",
      7: "double",
      8: "double",
      9: "double",
      10: "wait",
      11: "hit",
    },
    12: {
      2: "wait",
      3: "stand",
      4: "stand",
      5: "stand",
      6: "stand",
      7: "hit",
      8: "hit",
      9: "hit",
      10: "hit",
      11: "hit",
    },
    13: {
      2: "stand",
      3: "stand",
      4: "stand",
      5: "stand",
      6: "stand",
      7: "hit",
      8: "hit",
      9: "hit",
      10: "hit",
      11: "hit",
    },
    14: {
      2: "stand",
      3: "stand",
      4: "stand",
      5: "stand",
      6: "stand",
      7: "hit",
      8: "hit",
      9: "hit",
      10: "hit",
      11: "hit",
    },
    15: {
      2: "stand",
      3: "stand",
      4: "stand",
      5: "stand",
      6: "stand",
      7: "hit",
      8: "hit",
      9: "hit",
      10: "wait",
      11: "hit",
    },
    16: {
      2: "stand",
      3: "stand",
      4: "stand",
      5: "stand",
      6: "stand",
      7: "hit",
      8: "hit",
      9: "wait",
      10: "stand",
      11: "hit",
    },
  };
  let action = hard[yourSum][dealerSum];
  return action;

  // var action = 2;
  // // see if double down
  // if (yourAceCount == 1) {
  //   if (yourSum >= 13 && yourSum <= 16 && (dealerSum == 5 || dealerSum == 6)) {
  //     action = "double";
  //   }
  //   if ((yourSum == 17 || yourSum == 18) && dealerSum < 7) {
  //     action = "double";
  //   }
  // } else {
  //   if (yourSum == 9 && dealerSum < 7) {
  //     action = "double";
  //   }
  //   if (yourSum == 10 && dealerSum < 10) {
  //     action = "double";
  //   }
  //   if (yourSum == 11) {
  //     action = "double";
  //   }
  // }
  // // hit or stand
  // if (yourAceCount == 1) {
  //   if (yourSum < 18) {
  //     action = "hit";
  //   }
  //   if (yourSum > 18) {
  //     action = "stand";
  //   }
  //   if (yourSum < 12) {
  //     action = "hit";
  //   }
  // }
  // if (dealerSum < 7) {
  //   if (yourSum == 12 && (dealerSum == 2 || dealerSum == 3)) {
  //     action = "hit";
  //   } else {
  //     action = "stand";
  //   }
  // } else {
  //   if (yourSum < 17) {
  //     action = "hit";
  //   } else {
  //     action = "stand";
  //   }
  // }
  // return action;
}

function buttons1() {
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stand").addEventListener("click", stand);
  document.getElementById("double").addEventListener("click", double);
  document.getElementById("split").addEventListener("click", split2);
  document.getElementById("wait").addEventListener("click", wait);
}

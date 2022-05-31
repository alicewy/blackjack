// file is for representing the game state and functions that query the game state without changing it

// initialize new game state
function initState(numPlayers) {
  let state = {
    // array of cards. see addDeck() in actions.js
    deck: [],
    hands: [[]], //player 0 is the dealer
    playerTurn: 1,
    events: [],
  }

  //add a hand for each player
  for (let i = 0; i < numPlayers; ++i) {
    state.hands.push([]);
  }
  
  return state;
}

// return the score of player's hand
function handValue(state, player) { 
  let value = 0;
  let numAces = 0;

  // count cards with aces as 11s
  for (let c of state.hands[player]) {
    if (typeof c.face === 'number') {
      value += c.face;
    } else if (c.face === "A") {
      value += 11;
    } else {
      value += 10;
    }

    if (c.face === "A") {
      ++numAces;
    }
  }

  // switch aces to 1 until <= 21
  while (value > 21 && numAces > 0) {
    value -= 10;
    --numAces;
  }

  return value;
}

function didPlayerBust(state, player) {
  if (handValue(state, player) > 21)
    return true;
  return false;
}

//does the player's hand have a blackjack?
function playerBlackJack(state, player)
{
  return handValue(state, player) === 21 && state.hands[player].length === 2;
}

function numPlayers(state) {
  return state.hands.length - 1;
}

module.exports = {
  initState,
  numPlayers,
  handValue,
  didPlayerBust,
  playerBlackJack
}

function initState(numPlayers) {
  let state = {
    deck: [],
    hands: [[]],
    playerTurn: 1,
    events: [],
  }

  for (let i = 0; i < numPlayers; ++i) {
    state.hands.push([])
  }

  return state;
}

function handValue(state, player) {
  let value = 0;
  let numAces = 0;

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

function playerBlackJack(state, player)
{
  return handValue(state, player) === 21 && state.hands[player].length === 2;
}

function numPlayers(state) {
  return state.hands.length - 1;
}

function card(s) {
  const suit = s[s.length - 1];
  let f = s.substring(0, s.length - 1);
  if (["J", "Q", "K", "A"].indexOf(f) === -1) {
    f = parseInt(f);
  }

  return ({
    face: f,
    suit,
  });
}

module.exports = {
  initState,
  numPlayers,
  handValue,
  didPlayerBust,
  playerBlackJack,
  card
}

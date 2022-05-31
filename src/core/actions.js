const { numPlayers, didPlayerBust, playerBlackJack, handValue } = require('./state.js')

//adds a 52 card deck
function addDeck(state) {
  for (let s of ["H", "S", "C", "D"]) {
    for (let i = 2; i <= 10; ++i) {
      state.deck.push({ face: i, suit: s });
    }
    state.deck.push({ face: "J", suit: s });
    state.deck.push({ face: "Q", suit: s });
    state.deck.push({ face: "K", suit: s });
    state.deck.push({ face: "A", suit: s });
  }
}

function shuffleDeck(state) {
  for (let i = state.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.deck[i], state.deck[j]] = [state.deck[j], state.deck[i]];
  }
}

//removes a card from the deck, puts it in the player's hand 
//visible - whether it's face up or face down
function dealTo(state, player, visible) {
  if (state.deck.length < 52) {
    addDeck(state);
    shuffleDeck(state);
  }
  state.hands[player].push({
    ...state.deck.pop(),
    visible,
  });
}

function emptyHands(state) {
  for (let i = 0; i < state.hands.length; ++i) {
    state.hands[i] = [];
  }
}

// call anytime one player's turn ends
function nextTurn(state) {
  state.events.push({ event: "END_TURN", player: state.playerTurn })

  if (state.playerTurn === 0) {
    for (let p = 1; p <= numPlayers(state); ++p) {
      if (didPlayerBust(state, p)) {
        state.events.push({ "event": "LOSE", player: p })
      } else if(playerBlackJack(state, p))  {
        state.events.push({"event": "WIN", player: p })
      } else if (didPlayerBust(state, 0)) {
        state.events.push({ "event": "WIN", player: p })
      } else if (handValue(state, p) > handValue(state, 0)) {
        state.events.push({ "event": "WIN", player: p })
      } else if (handValue(state, p) < handValue(state, 0)) {
        state.events.push({ "event": "LOSE", player: p })
      } else {
        state.events.push({ "event": "PUSH", player: p })
      }
    }

    state.events.push({ event: "NEW_GAME" });
  }
  
  ++state.playerTurn;
  while(state.playerTurn <= numPlayers(state) && playerBlackJack(state, state.playerTurn))
  {
    ++state.playerTurn;
  }
  if (state.playerTurn > numPlayers(state)) {
    state.playerTurn = 0;
    state.hands[0][1].visible = true;
  }

  state.events.push({ event: "BEGIN_TURN", player: state.playerTurn });
}

// Game Actions
function hit(state) {
  dealTo(state, state.playerTurn, true)
  state.events.push({ event: "HIT", player: state.playerTurn });

  if (didPlayerBust(state, state.playerTurn)) {
    state.events.push({ event: "BUST", player: state.playerTurn });
    nextTurn(state);
  }
}

function stand(state) {
  state.events.push({ event: "STAND", player: state.playerTurn });
  nextTurn(state);
}

// perform dealer's move
function dealerMove(state) {
  // Skip if all players are done
  let allBust = true;
  for (let p = 1; p <= numPlayers(state); ++p) {
    if (!(didPlayerBust(state, p) || playerBlackJack(state, p))) {
      allBust = false;
      break;
    }
  }

  if (allBust) {
    nextTurn(state);
  } else {
    if (handValue(state, 0) < 17) {
      hit(state);
    } else {
      stand(state);
    }
  }
}

//deals the cards at the beginning of the round
function deal(state) {
  emptyHands(state);

  dealTo(state, 0, true);
  for (let i = 1; i <= numPlayers(state); ++i) {
    dealTo(state, i, true);
  }

  dealTo(state, 0, false);
  for (let i = 1; i <= numPlayers(state); ++i) {
    dealTo(state, i, true);
  }

  state.playerTurn = 1;
  while (state.playerTurn <= numPlayers(state) && playerBlackJack(state, state.playerTurn)) {
    ++state.playerTurn;
  }
  if (state.playerTurn > numPlayers(state)) {
    state.playerTurn = 0;
  }
}

module.exports = {
  deal,
  hit,
  stand,
  dealerMove,
  addDeck,
  shuffleDeck,
}

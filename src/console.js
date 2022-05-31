const prompt = require('prompt-sync')();

const { initState, numPlayers, didPlayerBust, handValue } = require("./core/state.js")
const { hit, stand, dealerMove, deal } = require("./core/actions.js")

function printHands(state) {
  for (let i = 0; i <= numPlayers(state); ++i) {
    if (i === 0) {
      process.stdout.write("Dealer:\t\t")
    } else {
      process.stdout.write("Player " + i + ":\t")
    }

    let countVisible = true;
    for (let c of state.hands[i]) {
      if (c.visible) {
        process.stdout.write(c.face + c.suit + " ")
      } else {
        countVisible = false;
        process.stdout.write("?? ")
      }
    }

    if (didPlayerBust(state, i)) {
      process.stdout.write("(BUST)")
    } else if (!countVisible) {
      process.stdout.write("(??)")
    } else {
      process.stdout.write("(" + handValue(state, i) + ")")
    }

    process.stdout.write("\n")
  }
}

function printEvents(state) {
  for (let i = 0; i < state.events.length; ++i) {
    const e = state.events[i];

    let nextEvent = null;
    if (i < state.events.length) {
      nextEvent = state.events[i + 1];
    }

    let playerStr = "";
    if (e.player !== null && e.player === 0) {
      playerStr = "Dealer";
    } else if (e.player) {
      playerStr = "Player " + e.player;
    }

    if (e.event === "HIT" && !(nextEvent && nextEvent.event === "BUST")) {
        process.stdout.write(playerStr + " hits\n")

    } else {
      let str = {
        "HIT": "hits",
        "STAND": "stands",
        "BUST": "busts",
        "WIN": "wins",
        "LOSE": "loses",
        "PUSH": "pushes",
      }[e.event];

      if (str !== undefined) {
        process.stdout.write(playerStr + " " + str + "\n")
      }
    }
  }
}

function gameLoop(state) {
  console.clear();
  printHands(state);
  printEvents(state);

  for (const e of state.events) {
    if (e.event === "NEW_GAME") {
      const i = prompt("new game? (y/n): ")

      state.events = [];
      deal(state);

      return i !== "n";
    }
  }

  if (state.playerTurn === 0) {
    dealerMove(state);

  } else {
    const move = prompt("(Player " + state.playerTurn + ") hit or stand? (h/s): ");

    if (move === "h") {
      hit(state);
    } else if (move === "s") {
      stand(state);
    }
  }

  return true;
}

// Game loop
let state = initState(2);
deal(state);

while (gameLoop(state));

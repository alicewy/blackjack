import './App.css';

import React from 'react';

import { initState, handValue, didPlayerBust, playerBlackJack, numPlayers } from './core/state.js';
import { deal, dealerMove, hit, stand } from './core/actions';

import PlayerHand from './components/PlayerHand';
import EventList from './components/EventList';
import PlayerButtons from './components/PlayerButtons';

function deepCopy(o) {
  return JSON.parse(JSON.stringify(o));
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: initState(2),
    };

    deal(this.state.gameState);
  }

  hit() {
    let gameState = deepCopy(this.state.gameState);
    hit(gameState);
    this.setState({ gameState, })
  }

  stand() {
    let gameState = deepCopy(this.state.gameState);
    stand(gameState);
    this.setState({ gameState, })
  }

  removePlayer() {
    if (numPlayers(this.state.gameState) > 1) {
      let gameState = initState(numPlayers(this.state.gameState) - 1)
      deal(gameState);
      this.setState({ gameState, })
    }
  }

  addPlayer() {
    let gameState = initState(numPlayers(this.state.gameState) + 1)
    deal(gameState);
    this.setState({ gameState, })
  }

  dealer() {
    let gameState = this.state.gameState;

    if (gameState.playerTurn === 0) {
      gameState = deepCopy(gameState);
      dealerMove(gameState)
      this.setState({ gameState: gameState, })
    }
  }

  componentDidMount() {
    this.intervalId = setInterval(this.dealer.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  newGame() {
    let gameState = deepCopy(this.state.gameState);
    gameState.events = [];
    deal(gameState);
    this.setState({ gameState });
  }

  renderPlayerHand(i) {
    const h = this.state.gameState.hands[i];

    let valueStr = "??";
    if (i !== 0 && playerBlackJack(this.state.gameState, i))
      valueStr = "BlackJack";
    else if (didPlayerBust(this.state.gameState, i))
      valueStr = "Bust";
    else if (i !== 0 || this.state.gameState.playerTurn === 0 || this.state.gameState.events.some(e => e.event === "NEW_GAME"))
      valueStr = handValue(this.state.gameState, i);

    return (
      <PlayerHand 
            win={(i !== 0 && playerBlackJack(this.state.gameState, i)) || this.state.gameState.events.some(e => e.event === "WIN" && e.player === i)}
            lose={didPlayerBust(this.state.gameState, i) || this.state.gameState.events.some(e => e.event === "LOSE" && e.player === i)}
            value={valueStr}
            turn={this.state.gameState.playerTurn === i}
            player={i}
            hand={h}
            key={i} />); 
  }

  render() {
    return (
      <div className="App">
        { this.renderPlayerHand(0) }
        <div className="playerHands">
          { this.state.gameState.hands.map((h, i) => i !== 0 ? this.renderPlayerHand(i) : null) }
        </div>
        <PlayerButtons
          playerTurn={this.state.gameState.playerTurn}
          addPlayer={() => this.addPlayer()}    
          removePlayer={() => this.removePlayer()}
          hit={() => this.hit()}
          stand={() => this.stand()}
          events={this.state.gameState.events}
          newGame={() => this.newGame()} />
        <EventList
          events={this.state.gameState.events} />
      </div>
    );
  }
};

export default App;
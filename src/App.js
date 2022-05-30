import logo from './logo.svg';
import './App.css';

import { initState, addDeck, shuffleDeck, handValue, didPlayerBust, playerBlackJack, numPlayers } from './core/state.js';
import React from 'react';
import { deal, dealerMove, hit, stand } from './core/actions';

class Card extends React.Component {
  render() {
    if (this.props.visible) {
      const suit = {"S": "♠",	"H": "♥",	"D": "♦",	"C": "♣"}[this.props.suit];
      let className = "playerCard"; 
      if(this.props.suit === "H" || this.props.suit === "D")
      {
        className += " red";
      }
      return (<li className={className}>{this.props.face}{suit}</li>);
    } else {
      return (<li className="playerCard">??</li>);   
    }
  }
}

function playerName(i) {
  if (i === 0) {
    return "Dealer";
  }
  return "Player " + i;
}

class PlayerHand extends React.Component {
  render() {
    let className = "playerHand";
    if (this.props.player === 0) {
      className += " dealer";
    }

    if (this.props.turn) {
      className += " active";
    }

    if (this.props.win) {
      className += " win";
    }

    if (this.props.lose) {
      className += " lose";
    }

    return (<div className={className}>
      <h4>{playerName(this.props.player)} ({this.props.value})</h4>
      <ol style={{padding: 0}}>{this.props.hand.map(c => <Card face={c.face} suit={c.suit} visible={c.visible} />)}</ol>
    </div>)
  }
};

class PlayerControls extends React.Component {
  render() {
    let enabled = this.props.playerTurn !== 0;
    
    if (this.props.events.some(e => e.event === "NEW_GAME")) {
      return (<div>
        <button onClick={this.props.newGame}>new game</button>
      </div>)
    } else {
      return (<div>
      <div>
        <h4>{playerName(this.props.playerTurn)}'s Turn</h4>
        <button disabled={!enabled} onClick={this.props.hit}>hit</button>
        <button disabled={!enabled} onClick={this.props.stand}>stand</button>
      </div>
      <div>
        <button onClick={this.props.addPlayer}>add player</button>
        <button onClick={this.props.removePlayer}>remove player</button>
      </div>
      </div>
      );
    }
  }
}

class EventList extends React.Component {
  render() {
      let showEvents = ["HIT", "STAND", "BUST", "WIN", "LOSE", "PUSH"];
      return (
        <ol>{this.props.events.filter(e => showEvents.indexOf(e.event) >= 0).map(e => {
          if (e.player !== null) {
            let playerStr = e.player === 0 ? "Dealer" : "Player " + e.player;
            const actionStr = e.event;
            return (<li>{playerStr + " " + actionStr}</li>);
          } else {
            return (<li>{e.event}</li>);
          }
        })}</ol>
      )

  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: initState(2),
    };

    deal(this.state.gameState);
  }

  hit() {
    let gameState = structuredClone(this.state.gameState);
    hit(gameState);
    this.setState({ gameState, })
  }

  stand() {
    let gameState = structuredClone(this.state.gameState);
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
      gameState = structuredClone(gameState);
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
    let gameState = structuredClone(this.state.gameState);
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
            hand={h}/>);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          { this.renderPlayerHand(0) }
          <div className="playerHands">
            { this.state.gameState.hands.map((h, i) => i !== 0 ? this.renderPlayerHand(i) : null) }
          </div>
          <PlayerControls
            playerTurn={this.state.gameState.playerTurn}
            addPlayer={() => this.addPlayer()}
            removePlayer={() => this.removePlayer()}
            hit={() => this.hit()}
            stand={() => this.stand()}
            events={this.state.gameState.events}
            newGame={() => this.newGame()} />
          <EventList events={this.state.gameState.events}></EventList>
        </header>
      </div>
    );
  }
};

export default App;

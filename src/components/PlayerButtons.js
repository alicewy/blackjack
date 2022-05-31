import React from 'react';

function playerName(i) {
    if (i === 0) {
        return "Dealer";
    }
    return "Player " + i;
}

export default class PlayerButtons extends React.Component {
    playerNumButtons() {
       return (
        <div>
          <button onClick={this.props.addPlayer}>add player</button>
          <button onClick={this.props.removePlayer}>remove player</button>
        </div>
       );
    }
  
    render() {
      let enabled = this.props.playerTurn !== 0;
      
      if (this.props.events.some(e => e.event === "NEW_GAME")) {
        return (<div>
          <h4>Round Over</h4>
          <button onClick={this.props.newGame}>new game</button>
          { this.playerNumButtons() }
        </div>)
      } else {
        return (<div>
        <div>
          <h4>{playerName(this.props.playerTurn)}'s Turn</h4>
          <button disabled={!enabled} onClick={this.props.hit}>hit</button>
          <button disabled={!enabled} onClick={this.props.stand}>stand</button>
        </div>
        { this.playerNumButtons() }
        </div>
        );
      }
    }
  }
  
import React from 'react';
import Card from './Card';

function playerName(i) {
    if (i === 0) {
        return "Dealer";
    }
    return "Player " + i;
}

export default class PlayerHand extends React.Component {
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
        <ol style={{padding: 0}}>{this.props.hand.map((c, i) => <Card face={c.face} suit={c.suit} visible={c.visible} key={c.face + c.suit + i + c.visible} />)}</ol>
      </div>)
    }
  };
  
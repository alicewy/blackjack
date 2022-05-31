
import React from 'react';

export default class Card extends React.Component {
    render() {
      if (this.props.visible) {
        const suit = {"S": "♠",	"H": "♥",	"D": "♦",	"C": "♣"}[this.props.suit];
        let className = "playerCard"; 
        if(this.props.suit === "H" || this.props.suit === "D") {
          className += " red";
        }
  
        return (<li className={className}>{this.props.face + suit}</li>);
      } else {
        return (<li className="playerCard">??</li>);   
      }
    }
  }
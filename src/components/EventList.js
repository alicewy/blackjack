import React from 'react';

export default class EventList extends React.Component {
    render() {
        let showEvents = ["HIT", "STAND", "BUST", "WIN", "LOSE", "PUSH"];
        return (
          <ol>{this.props.events.filter(e => showEvents.indexOf(e.event) >= 0).map((e, i) => {
            if (e.player !== null) {
              let playerStr = e.player === 0 ? "Dealer" : "Player " + e.player;
              const actionStr = e.event;
              return (<li key={"" + i + e.event + e.player}>{playerStr + " " + actionStr}</li>);
            } else {
              return (<li key={"" + i + e.event}>{e.event}</li>);
            }
          })}</ol>
        )
    }
  };
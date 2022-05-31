# BlackJack

## Setup
- Run `npm install` to install dependencies.

## Running
- Run `node src/console.js` to play in terminal.
- Run `npm start` and go to `http://localhost:3000` to play in web browser.

## Design
The core game logic is encapsulated into `src/core/`. 
`state.js` represents the state of the game at a point in time and `actions.js` contain the rules for changing the state.
The code is written using nodeJS and the web frontend is written using ReactJS
The terminal frontend requires `prompt-sync`.

## Notes
- There may be multiple copies of the same card, because multiple decks are used.

Brief Video Demo


https://user-images.githubusercontent.com/21352000/171295053-e4ba6d01-902c-4aef-a45b-7ca1c7f3dea5.mp4


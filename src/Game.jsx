import React from 'react';
import MainGame from './MainGame';
import './s1.css'; 
// import Header from './Header';
const Game = () => {
  return (
    <div>
      <div className="header">
      {/* {<Header />} */}
        <div className="company-name">Freshword</div>
        <div className="options">
          <button className="option-button">Rules</button>
          <button className="option-button">Start Game</button>
        </div>
      </div>
      <div className="background-container"></div>
      <div className="game-card-game">
        <h1 className="game-title">Freshword</h1>
        {<MainGame/>}
          <div className='main-game'>
          
          </div>
        </div>
    
      </div>
  );
};

export default Game;

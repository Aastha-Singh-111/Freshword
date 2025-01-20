import React from 'react';

import './s1.css'; 
// import Header from './Header';
import { useNavigate } from "react-router-dom";


const Landing = () => {
  const navigate = useNavigate();
  function callGame(){
    navigate("/Freshword/game")
  }
  
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
      <div className="game-card">
        <h1 className="game-title">Freshword</h1>
        <div className="game-logo">
          <p>🎮 Welcome to the Ultimate Game! 🎮</p>
          <div className='dummyimg'>
          
          </div>
        </div>
        <button className="start-button" onClick={callGame}>Start Game</button>
      </div>
    </div>
  );
};

export default Landing;

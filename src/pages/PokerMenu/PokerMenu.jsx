import {React, useContext, useState, useEffect} from "react";
import "./PokerMenu.css";
import { useNavigate } from "react-router-dom";
import { inGameContext } from "../../context/InGameContext";
import { TutorialContext, TutorialProvider } from "../../context/TutorialContext";

export const PokerMenu = () => {
  const navigate = useNavigate();
  const { setInGame } = useContext(inGameContext);
  const { setOption, selectedOption } = useContext(TutorialContext);
  const [showDropdown, setShowDropdown] = useState(false);

  function handleOfflinePoker() {
    navigate(`/poker`);
    setInGame(true);
  }
  

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  const handleGoToTutorial = () => {
    navigate(`/tutorialMenu`);
  }

  return (
    <div className="pokerMenuWrapper">
      <div className="pokerMenu">
        <h2 className="pokerMenuTitle">Do you wish to go through a brief </h2>
        <h2 className="pokerMenuTitle"> tutorial of the game?</h2>
        <heading className="pokerOptions">

          <h2 className="offlinePoker" onClick={handleGoToTutorial}>Yes</h2>

          <h2 className="offlinePoker" onClick={handleOfflinePoker}>
            No
          </h2>
          {/* <div 
            className="tutorial"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >

          </div> */}
        </heading>
      </div>
    </div> 
  );
};

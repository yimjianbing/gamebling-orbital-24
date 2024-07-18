import {React, useContext, useState} from "react";
import "./PokerMenu.css";
import { useNavigate } from "react-router-dom";
import { inGameContext } from "../../context/InGameContext";
import { TutorialContext } from "../../context/TutorialContext";

export const PokerMenu = () => {
  const navigate = useNavigate();
  const { setInGame } = useContext(inGameContext);
  const { setOption } = useContext(TutorialContext);
  const [showDropdown, setShowDropdown] = useState(false);

  function handleOnlinePoker() {
    navigate(`/onlinePoker`);
  }

  function handleOfflinePoker() {
    navigate(`/poker`);
    setInGame(true);
  }

  function handleTutorial(gameName) {
    setOption(gameName);
    navigate(`/tutorial?gameName=${gameName}`);
  }

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  return (
    <div className="pokerMenuWrapper">
      <div className="pokerMenu">
        <h2>Do you want to play online or offline?</h2>
        <heading className="pokerOptions">
          <h2 className="onlinePoker" onClick={handleOnlinePoker}>
            Online 
          </h2>
          <h2 className="offlinePoker" onClick={handleOfflinePoker}>
            Offline
          </h2>
          <div 
            className="tutorial"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <h2>How to Play?</h2>
            {showDropdown && (
              <div className="dropdown">
                <p onClick={() => handleTutorial('Pair')}>Pair</p>
                <p onClick={() => handleTutorial('Double Pair')}>Double Pair</p>
                <p onClick={() => handleTutorial('Three of a Kind')}>Three of a Kind</p>
                <p onClick={() => handleTutorial('Flush')}>Flush</p>
                <p onClick={() => handleTutorial('Straight')}>Straight</p>
                <p onClick={() => handleTutorial('Full House')}>Full House</p>
                <p onClick={() => handleTutorial('Four of a Kind')}>Four of a Kind</p>
              </div>
            )}
          </div>
        </heading>
      </div>
    </div> 
  );
};

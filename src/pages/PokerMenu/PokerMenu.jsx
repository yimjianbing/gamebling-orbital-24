import {React, useContext} from "react";
import "./PokerMenu.css";
import { useNavigate } from "react-router-dom";
import { inGameContext } from "../../context/InGameContext";

export const PokerMenu = () => {
  const navigate = useNavigate();
  const { setInGame } = useContext(inGameContext);

  function handleOnlinePoker() {
    navigate(`/onlinePoker`);
  }

  function handleOfflinePoker() {
    navigate(`/poker`);
    setInGame(true);
  }

  return (
    <div className="pokerMenuWrapper">
      <div className="pokerMenu">
        <h2>Do you want to pay online or offline?</h2>
        <heading className="pokerOptions">
          <h2 className="onlinePoker" onClick={handleOnlinePoker}>
            Online
          </h2>
          <h2 className="offlinePoker" onClick={handleOfflinePoker}>
            Offline
          </h2>
        </heading>
      </div>
    </div>
  );
};

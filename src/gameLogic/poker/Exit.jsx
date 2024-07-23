import React, { useContext } from 'react';
import { inGameContext } from '../../context/InGameContext';
import "./Exit.css";
import { useNavigate } from 'react-router-dom';


const Exit = () => {

    const { setInGame } = useContext(inGameContext);
    const nav = useNavigate();

    const handleExit = () => {
      setInGame(false);
      nav(`/mainmenu`);
    }

    return <button className='exit' onClick={() => handleExit()}> Exit </button>
}

export default Exit;
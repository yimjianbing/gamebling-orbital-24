import { React, useContext } from "react";
import "./TutorialMenu.css";
import { useNavigate } from "react-router-dom";
import { TutorialContext } from "../../context/TutorialContext";

export const TutorialMenu = () => {
    const navigate = useNavigate();
    const { setOption } = useContext(TutorialContext);

    const handleTutorial = (gameName) => {
        console.log("Setting option in Menu:", gameName);
        setOption(gameName);
        setTimeout(() => {
            console.log("Navigating to /tutorial with gameName:", gameName);
            navigate(`/tutorial?gameName=${gameName}`);
        }, 1000); // 1 second delay
    };

    const handleGoToRules = () => {
        navigate(`/rules`);
    };

    


    return (
        <div className="tutorialMenuWrapper">
            <div className="tutorialMenu">
                <div className="bigFont">How to Play</div>
                <div className="tutorialOptions">
                    <h1 className="rules" onClick={handleGoToRules} style={{fontSize: '32px'}}>POKER RULES</h1>
                    <h1> Simulate a poker game with these 7 possible hands</h1>
                    <h1> below by clicking on them!</h1>
                    <div className="tutTopRow">                    
                        <p onClick={() => handleTutorial('Pair')}>Pair</p>
                        <p onClick={() => handleTutorial('Double Pair')}>Double Pair</p>
                        <p onClick={() => handleTutorial('Three of a Kind')}>Three of a Kind</p>
                        <p onClick={() => handleTutorial('Flush')}>Flush</p>
                    </div>
                    <div className="tutBotRow">
                        <p onClick={() => handleTutorial('Straight')}>Straight</p>
                        <p onClick={() => handleTutorial('Full House')}>Full House</p>
                        <p onClick={() => handleTutorial('Four of a Kind')}>Four of a Kind</p>
                    </div>

                </div>
            </div>
        </div>
    );
};
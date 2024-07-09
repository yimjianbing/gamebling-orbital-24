import React, {useState, createContext} from "react";

export const inGameContext = createContext();

export const InGameProvider = ({children}) => {
    const [inGame, setInGame] = useState(false);

    const values = {
        inGame: inGame,
        setInGame: setInGame,
    };

    return (
        <inGameContext.Provider value={values}>
            {children}
        </inGameContext.Provider>
    );
};
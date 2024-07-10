import React, {useState, createContext} from "react";

export const TutorialContext = createContext();

export const TutorialProvider = ({ children }) => {
    const [selectedOption, setSelectedOption] = useState(null);
  
    const setOption = (option) => {
      setSelectedOption(option);
    };
  
    return (
      <TutorialContext.Provider value={{ selectedOption, setOption }}>
        {children}
      </TutorialContext.Provider>
    );
  };
  
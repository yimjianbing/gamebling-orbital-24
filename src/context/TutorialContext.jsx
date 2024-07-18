import React, { useState, createContext, useEffect } from "react";

export const TutorialContext = createContext();

export const TutorialProvider = ({ children }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    console.log("TutorialProvider: selectedOption after set:", selectedOption);
  }, [selectedOption]);

  const setOption = (option) => {
    console.log("TutorialProvider: Setting option:", option);
    setSelectedOption(option);
  };

  console.log("TutorialProvider: selectedOption before render:", selectedOption);

  return (
    <TutorialContext.Provider value={{ selectedOption, setOption }}>
      {children}
    </TutorialContext.Provider>
  );
};
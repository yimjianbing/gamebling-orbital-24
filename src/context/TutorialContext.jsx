import React, { useState, createContext, useEffect } from "react";

export const TutorialContext = createContext();

export const TutorialProvider = ({ children }) => {
  // Function to get initial state from local storage
  const getInitialState = () => {
    const savedOption = localStorage.getItem("selectedOption");
    return savedOption ? JSON.parse(savedOption) : null;
  };

  const [selectedOption, setSelectedOption] = useState(getInitialState());

  useEffect(() => {
    console.log("TutorialProvider: selectedOption after set:", selectedOption);
    if (selectedOption !== null) {
      localStorage.setItem("selectedOption", JSON.stringify(selectedOption));
    }
  }, [selectedOption]);

  const setOption = (option) => {
    if (option !== null) {
      console.log("TutorialProvider: Setting option:", option);
      setSelectedOption(option);
    }
  };

  console.log("TutorialProvider: selectedOption before render:", selectedOption);

  return (
    <TutorialContext.Provider value={{ selectedOption, setOption }}>
      {children}
    </TutorialContext.Provider>
  );
};
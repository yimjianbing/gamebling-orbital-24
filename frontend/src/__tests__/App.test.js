import React from "react";
import { render, act } from "@testing-library/react";
import App from "../App";

describe("App component", () => {
    it("renders without crashing", async () => { 
        await act(async () => {
            render(<App />);
        });
    });

    // Add more tests here based on your requirements
});
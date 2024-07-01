import { React, useContext, useState } from "react";
import { SkinsContext } from "../../context/SkinsContext";
import "./Skins.css";

export const Skins = () => {
    const {setSkinNumber} = useContext(AuthContext);

    const handleSkinChange = (skinNumber) => {
        setSkinNumber(skinNumber);
    }

    return (
        <div className="skinsWrapper">
            <div className="skins">
                <h2>Choose your skin</h2>
                <div className="skinOptions">
                    <h2 className="skin1" onClick={() => handleSkinChange(1)}>Skin 1</h2>
                    <h2 className="skin2" onClick={() => handleSkinChange(2)}>Skin 2</h2>
                    <h2 className="skin3" onClick={() => handleSkinChange(3)}>Skin 3</h2>
                    <h2 className="skin4" onClick={() => handleSkinChange(4)}>Skin 4</h2>
                    <h2 className="skin5" onClick={() => handleSkinChange(5)}>Skin 5</h2>
                    <h2 className="skin6" onClick={() => handleSkinChange(6)}>Skin 6</h2>
                </div>
            </div>
        </div>
    );
}
import { React, useContext, useState } from "react";
import { SkinsContext } from "../../context/SkinsContext";
import "./Skins.css";

export const Skins = () => {
    const {setSkin} = useContext(AuthContext);

    const handleSkinChange = (skin) => {
        setSkin(skinNumber);
    }

    return (
        <div className="skinsWrapper">
            <div className="skins">
                <h2>Choose your skin</h2>
                <div className="skinOptions">
                    <div className="skin1" onClick={() => handleSkinChange("black")}>Skin 1</div>
                    <div className="skin2" onClick={() => handleSkinChange("white")}>Skin 2</div>
                    <div className="skin3" onClick={() => handleSkinChange("pixel")}>Skin 3</div>
                </div>
            </div>
        </div>
    );
}
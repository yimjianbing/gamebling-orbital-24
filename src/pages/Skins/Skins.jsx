import { React, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Skins.css";

export const Skins = () => {
    const {setSkin, skin} = useContext(AuthContext);

    const handleSkinChange = (skin) => {
        setSkin(skin);
    }

    return (
        <div className="skinsWrapper">
            <div className="skins">
                <h1>Choose your poker skin</h1>
                <br />
                <div className="skinOptions">
                    <div className="skin1" onClick={() => handleSkinChange("")}>default</div>
                    <div className="skin2" onClick={() => handleSkinChange("white")}>white</div>
                    <div className="skin3" onClick={() => handleSkinChange("black")}>black</div>
                </div>
            </div>
            <h1 className="currentSkin"> Your Current Skin: <h3 className="skinSelected">{skin === "" ? "default" : skin}</h3></h1>
        </div>
    );
}
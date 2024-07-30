import React, {useContext, useEffect, useState} from 'react';
import './Achievements.css';
import { AuthContext } from '../../context/AuthContext';
import { doc, setDoc, getDoc, onSnapshot} from "firebase/firestore";
import { db } from '../../auth/firebase-config';

const achievementDescriptions = {
    "finishedTutorial": "Completed the tutorial",
    "playFirstGame": "Played your first game",
    "tenGames": "Played 10 games",
    "winFirstGame": "Won your first game"
};

export const Achievements = () => {
    const { currentUserLoggedIn } = useContext(AuthContext);
    const [ achievements, setAchievements ] = useState({});

    useEffect(() => {

        const unsubscribe = onSnapshot(doc(db, "userData", currentUserLoggedIn.uid), (doc) => {
            if (doc.exists()) {
                setAchievements(doc.data().achievements);
            } else {
                console.log("No such document!");
            }
        })
        return unsubscribe;
    }, [currentUserLoggedIn]);

    console.log(achievements)

     return (
        <div className='achievements'>
            <h1>Achievements</h1>
            <div className='achievement-container'>
                {Object.keys(achievements).map((key, index) => (
                    <div className={`achievement ${achievements[key] ? '' : 'darkened'}`} key={index} >
                        <h2 className={`achievement-${index}`} >{key}</h2>
                        <p>{achievements[key] ? <h2>Obtained</h2> : <h2 style={{color: 'aliceblue'}}>Not Obtained Yet!</h2>}</p>
                        <p style={{color: 'aliceblue'}}>{achievementDescriptions[key]}</p>
                        </div>
                ))}
            </div>
        </div>
    );
}
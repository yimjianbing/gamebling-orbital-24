import React, { useState, useEffect } from 'react';

// Define the complete deck of cards
const suits = ['Spades', 'Hearts', 'Clubs', 'Diamonds'];
const ranks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];

const generateDeck = () => {
    const deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push(`${rank} of ${suit}`);
        }
    }
    return deck;
};

// Shuffle the deck
const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
};

// Deal cards to players
const dealCards = (deck, numPlayers, numCards) => {
    const hands = [];
    for (let i = 0; i < numPlayers; i++) {
        const hand = [];
        for (let j = 0; j < numCards; j++) {
            hand.push(deck.pop());
        }
        hands.push(hand);
    }
    return hands;
};

export function Poker() {
    const [deck, setDeck] = useState(generateDeck());
    const [hands, setHands] = useState([]);
    const [pot, setPot] = useState(0);
    const [playerBets, setPlayerBets] = useState([0, 0, 0, 0]);

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const newDeck = generateDeck();
        shuffleDeck(newDeck);
        const newHands = dealCards(newDeck, 4, 5); // 4 players, 5 cards each
        setDeck(newDeck);
        setHands(newHands);
        setPot(0);
        setPlayerBets([0, 0, 0, 0]);
    };

    const handleBet = (playerIndex, amount) => {
        const newPlayerBets = [...playerBets];
        newPlayerBets[playerIndex] += amount;
        setPlayerBets(newPlayerBets);
        setPot(pot + amount);
    };

    return (
        <div>
            <button onClick={startNewGame}>Start New Game</button>
            <div>Pot: ${pot}</div>
            {hands.map((hand, i) => (
                <div key={i}>
                    <h2>Player {i + 1}</h2>
                    <ul>
                        {hand.map((card, j) => (
                            <li key={j}>{card}</li>
                        ))}
                    </ul>
                    <div>Bet: ${playerBets[i]}</div>
                    <button onClick={() => handleBet(i, 10)}>Bet $10</button>
                </div>
            ))}
        </div>
    );
}

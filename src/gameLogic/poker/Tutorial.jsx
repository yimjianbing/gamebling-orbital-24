// import "@babel/polyfill";

// import 'core-js/es6/map';
// import 'core-js/es6/set';

import 'raf/polyfill';

import React, { Component, useContext, useState, useEffect } from 'react';
import './PokerGame.css';
import './poker.css';


import Exit from './Exit.jsx';

import Spinner from './Spinner.js';
import WinScreen from './WinScreen.js'

import Player from "./components/players/Player.jsx";
import ShowdownPlayer from "./components/players/ShowdownPlayer.jsx";
import Card from "./components/cards/Card.jsx";

import { 
  generateDeckOfCards, 
  shuffle, 
  dealPrivateCards,
} from './utils/cards.js';

import { 
  generateTable, 
  beginNextRound,
  checkWin
} from './utils/players.js';

import potImage from '../../../src/assets/pokerGame/pot.svg'
// import tableImage from '../../../src/assets/pokerGame/table-nobg-svg-01.svg'

import { 
  determineBlindIndices, 
  anteUpBlinds, 
  determineMinBet,
  handleBet,
  handleFold, 
} from './utils/bet.js';

import {
  handleAI as handleAIUtil
} from './utils/ai.js';

import {
  renderShowdownMessages,
  renderActionButtonText,
  renderNetPlayerEarnings,
  renderActionMenu
} from './utils/ui.js';

import cloneDeep from 'lodash/cloneDeep';

import { TutorialContext } from '../../context/TutorialContext.jsx';

const Tutorial = () => {
  const { selectedOption } = useContext(TutorialContext);

  const [state, setState] = useState({
    odds: 10.0,
    loading: true,
    winnerFound: null,
    players: null,
    numPlayersActive: null,
    numPlayersFolded: null,
    numPlayersAllIn: null,
    activePlayerIndex: null,
    dealerIndex: null,
    blindIndex: null,
    deck: null,
    communityCards: [],
    pot: null,
    highBet: null,
    betInputValue: null,
    sidePots: [],
    minBet: 20,
    phase: 'loading',
    playerHierarchy: [],
    showDownMessages: [],
    playActionMessages: [],
    playerAnimationSwitchboard: {
      0: { isAnimating: false, content: null },
      1: { isAnimating: false, content: null },
      2: { isAnimating: false, content: null },
      3: { isAnimating: false, content: null },
      4: { isAnimating: false, content: null },
      5: { isAnimating: false, content: null }
    },
  });

  useEffect(() => {
    // Logic from componentDidMount
    const players = generateTable();
    const dealerIndex = Math.floor(Math.random() * Math.floor(players.length));
    const blindIndices = determineBlindIndices(dealerIndex, players.length);
    const playersBoughtIn = anteUpBlinds(players, blindIndices, state.minBet);

    const imageLoaderRequest = new XMLHttpRequest();
    imageLoaderRequest.addEventListener("load", (e) => {
      console.log("Image Loaded!", e);
      setState((prevState) => ({ ...prevState, loading: false }));
    });
    imageLoaderRequest.addEventListener("error", (e) => {
      console.log("Error loading image", e);
    });

    imageLoaderRequest.open("GET", "./assets/table-nobg-svg-01.svg");
    imageLoaderRequest.send();

    setState((prevState) => ({
      ...prevState,
      players: playersBoughtIn,
      numPlayersActive: playersBoughtIn.length,
      numPlayersFolded: 0,
      numPlayersAllIn: 0,
      activePlayerIndex: dealerIndex,
      dealerIndex,
      blindIndex: {
        big: blindIndices.bigBlindIndex,
        small: blindIndices.smallBlindIndex,
      },
      deck: shuffle(generateDeckOfCards()),
      pot: 0,
      highBet: prevState.minBet,
      betInputValue: prevState.minBet,
      phase: 'initialDeal',
    }));

    // Call runGameLoop after state is updated
    runGameLoop();
  }, []);

  const handleBetInputChange = (val, min, max) => {
    if (val === '') val = min;
    if (val > max) val = max;
    setState((prevState) => ({
      ...prevState,
      betInputValue: parseInt(val, 10),
    }));
  };

  const changeSliderInput = (val) => {
    setState((prevState) => ({
      ...prevState,
      betInputValue: val[0],
    }));
  };

  const pushAnimationState = (index, content) => {
    const newAnimationSwitchboard = {
      ...state.playerAnimationSwitchboard,
      [index]: { isAnimating: true, content },
    };
    setState((prevState) => ({
      ...prevState,
      playerAnimationSwitchboard: newAnimationSwitchboard,
    }));
  };

  const popAnimationState = (index) => {
    const persistContent = state.playerAnimationSwitchboard[index].content;
    const newAnimationSwitchboard = {
      ...state.playerAnimationSwitchboard,
      [index]: { isAnimating: false, content: persistContent },
    };
    setState((prevState) => ({
      ...prevState,
      playerAnimationSwitchboard: newAnimationSwitchboard,
    }));
  };

  const handleBetInputSubmit = (bet, min, max) => {
    pushAnimationState(
      state.activePlayerIndex,
      `${renderActionButtonText(state.highBet, state.betInputValue, state.players[state.activePlayerIndex])} ${(bet > state.players[state.activePlayerIndex].bet) ? (bet) : ""}`
    );
    const newState = handleBet(cloneDeep(state), parseInt(bet, 10), parseInt(min, 10), parseInt(max, 10));
    setState(newState, () => {
      if (state.players[state.activePlayerIndex].robot && state.phase !== 'showdown') {
        setTimeout(handleAI, 1200);
      }
    });
  };

  const handleFold = () => {
    const newState = handleFold(cloneDeep(state));
    setState(newState, () => {
      if (state.players[state.activePlayerIndex].robot && state.phase !== 'showdown') {
        setTimeout(handleAI, 1200);
      }
    });
  };

  const handleAI = () => {
    const newState = handleAIUtil(cloneDeep(state), pushAnimationState);
    setState({
      ...newState,
      betInputValue: newState.minBet,
    }, () => {
      if (state.players[state.activePlayerIndex].robot && state.phase !== 'showdown') {
        setTimeout(handleAI, 1200);
      }
    });
  };

  const renderBoard = () => {
    const { players, activePlayerIndex, dealerIndex, clearCards, phase, playerAnimationSwitchboard } = state;
    const reversedPlayers = players.reduce((result, player, index) => {
      const isActive = index === activePlayerIndex;
      const hasDealerChip = index === dealerIndex;

      result.unshift(
        <Player
          key={index}
          arrayIndex={index}
          isActive={isActive}
          hasDealerChip={hasDealerChip}
          player={player}
          clearCards={clearCards}
          phase={phase}
          playerAnimationSwitchboard={playerAnimationSwitchboard}
          endTransition={popAnimationState}
        />
      );
      return result;
    }, []);
    return reversedPlayers.map(component => component);
  };

  const renderCommunityCards = (purgeAnimation) => {
    return state.communityCards.map((card, index) => {
      let cardData = { ...card };
      if (purgeAnimation) {
        cardData.animationDelay = 0;
      }
      return (
        <Card key={index} cardData={cardData} />
      );
    });
  };

  const runGameLoop = () => {
    const newState = dealPrivateCards(cloneDeep(state)); // this is the error
    setState(newState, () => {
      if (state.players[state.activePlayerIndex].robot && state.phase !== 'showdown') {
        setTimeout(handleAI, 1200);
      }
    });
  };

  const renderRankTie = (rankSnapshot) => {
    return rankSnapshot.map(player => renderRankWinner(player));
  };

  const renderRankWinner = (player) => {
    const { name, bestHand, handRank } = player;
    const playerStateData = state.players.find(statePlayer => statePlayer.name === name);
    return (
      <div className="showdown-player--entity" key={name}>
        <ShowdownPlayer
          name={name}
          avatarURL={playerStateData.avatarURL}
          cards={playerStateData.cards}
          roundEndChips={playerStateData.roundEndChips}
          roundStartChips={playerStateData.roundStartChips}
        />
        <div className="showdown-player--besthand--container">
          <h5 className="showdown-player--besthand--heading">
            Best Hand
          </h5>
          <div className='showdown-player--besthand--cards' style={{ alignItems: 'center' }}>
            {
              bestHand.map((card, index) => {
                // Reset Animation Delay
                const cardData = { ...card, animationDelay: 0 }
                return <Card key={index} cardData={cardData} />
              })
            }
          </div>
        </div>
        <div className="showdown--handrank">
          {handRank}
        </div>
        {renderNetPlayerEarnings(playerStateData.roundEndChips, playerStateData.roundStartChips)}
      </div>
    );
  };

  const renderBestHands = () => {
    const { playerHierarchy } = state;

    return playerHierarchy.map(rankSnapshot => {
      const tie = Array.isArray(rankSnapshot);
      return tie ? renderRankTie(rankSnapshot) : renderRankWinner(rankSnapshot);
    });
  };

  const handleNextRound = () => {
    setState({ clearCards: true });
    const newState = beginNextRound(cloneDeep(state));
    // Check win condition
    if (checkWin(newState.players)) {
      setState({ winnerFound: true });
      return;
    }
    setState(newState, () => {
      if (state.players[state.activePlayerIndex].robot && state.phase !== 'showdown') {
        setTimeout(handleAI, 1200);
      }
    });
  };

  const renderOddsBar = () => {
    const { odds } = state;
    return (
      <div className="odds-bar-container">
        <div className="odds-bar" style={{ width: `${odds}%` }}></div>
      </div>
    );
  };

  const renderActionButtons = () => {
    const { highBet, players, activePlayerIndex, phase, betInputValue } = state;
    const min = determineMinBet(highBet, players[activePlayerIndex].chips, players[activePlayerIndex].bet);
    const max = players[activePlayerIndex].chips + players[activePlayerIndex].bet;
    return (players[activePlayerIndex].robot || phase === 'showdown') ? null : (
      <>
        <button className='action-button' onClick={() => handleBetInputSubmit(betInputValue, min, max)}>
          {renderActionButtonText(highBet, betInputValue, players[activePlayerIndex])}
        </button>
        <button className='fold-button' onClick={handleFold}>
          Fold
        </button>
      </>
    );
  };

  const renderShowdown = () => {
    return (
      <div className='showdown-container--wrapper'>
        <h5 className="showdown-container--title">
          Round Complete!
        </h5>
        <div className="showdown-container--messages">
          {renderShowdownMessages(state.showDownMessages)}
        </div>
        <h5 className="showdown-container--community-card-label">
          Community Cards
        </h5>
        <div className='showdown-container--community-cards'>
          {renderCommunityCards(true)}
        </div>
        <button className="showdown--nextRound--button" onClick={handleNextRound}> Next Round </button>
        {renderBestHands()}
      </div>
    );
  };

  const renderGame = () => {
    const { highBet, players, activePlayerIndex, phase } = state;
    return (
      <div className='poker-app--background'>
        <div className="poker-table--container">
          <div className='player-container'>
            {renderBoard()}
          </div>
          <div className='community-card-container'>
            {renderCommunityCards()}
          </div>
          <div className='pot-container'>
            <img style={{ height: 55, width: 55 }} src={potImage} alt="Pot Value" />
            <h4> {`${state.pot}`} </h4>
          </div>
        </div>
        {state.phase === 'showdown' && renderShowdown()}
        <div className='game-action-bar'>
          <div className='action-buttons'>
            {renderActionButtons()}
          </div>
          <div className='odds-calculator'>
            {renderOddsBar()}
          </div>
          <div className='slider-boi'>
            {!state.loading && renderActionMenu(highBet, players, activePlayerIndex, phase, handleBetInputChange)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="Poker">
      <div className='poker-table--wrapper'>
        {
          state.loading ? <Spinner /> :
            state.winnerFound ? <WinScreen /> :
              renderGame()
        }
      </div>
      <div className='poker-table--container'>
        <Exit />
      </div>
    </div>
  );
};

export default Tutorial;
// import "@babel/polyfill";

// import 'core-js/es6/map';
// import 'core-js/es6/set';

import 'raf/polyfill';

import React, { Component } from 'react';
import './PokerGame.css';
import './poker.css';
import { inGameContext } from '../../context/InGameContext.jsx';
import { TutorialContext, TutorialProvider } from '../../context/TutorialContext.jsx';

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
  configureDeck,
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

class Tutorial extends Component {

  static contextType = TutorialContext;

  state = {
    tutorialType: this.context.selectedOption, // pair | doublePair | threeOfAKind | flush | straight | fullHouse
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
    riggedDeck: null,
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
      0: {isAnimating: false, content: null},
      1: {isAnimating: false, content: null},
      2: {isAnimating: false, content: null},
      3: {isAnimating: false, content: null},
      4: {isAnimating: false, content: null},
      5: {isAnimating: false, content: null}
    }

  }

  cardAnimationDelay = 0;
  
  loadTable = () => {

  }

 componentDidMount() {
  
    const players =  generateTable();
    const dealerIndex = Math.floor(Math.random() * Math.floor(players.length));
    const blindIndicies = determineBlindIndices(dealerIndex, players.length);
    
    const playersBoughtIn = anteUpBlinds(players, blindIndicies, this.state.minBet);

    const imageLoaderRequest = new XMLHttpRequest();
    const { selectedOption } = this.context;

    if (selectedOption && !this.state.tutorialType) {
      this.setState({ tutorialType: selectedOption });
      console.log("Tutorial: selectedOption:", selectedOption);
    }

    // this.context.setInGame(true);


imageLoaderRequest.addEventListener("load", e => {
    console.log(`${e.type}`);
    console.log(e);
    console.log("Image Loaded!");
    this.setState({
      loading: false,
    })
});

imageLoaderRequest.addEventListener("error", e => {
    console.log(`${e.type}`);
    console.log(e);
});


imageLoaderRequest.addEventListener("loadstart", e => {
    console.log(`${e.type}`);
    console.log(e);
});

imageLoaderRequest.addEventListener("loadend", e => {
    console.log(`${e.type}`);
    console.log(e);
});

imageLoaderRequest.addEventListener("abort", e => {
    console.log(`${e.type}`);
    console.log(e);
});

imageLoaderRequest.addEventListener("progress", e => {
    console.log(`${e.type}`);
    console.log(e);
});

imageLoaderRequest.open("GET", "./assets/table-nobg-svg-01.svg");
imageLoaderRequest.send();



    this.setState(prevState => ({
      // loading: false,
      tutorialType: this.context.selectedOption,
      players: playersBoughtIn,
      numPlayersActive: playersBoughtIn.length,
      numPlayersFolded: 0,
      numPlayersAllIn: 0,
      activePlayerIndex: dealerIndex,
      dealerIndex,
      blindIndex: {
        big: blindIndicies.bigBlindIndex,
        small: blindIndicies.smallBlindIndex,
      },
      deck: shuffle(generateDeckOfCards()),
      riggedDeck: null,
      pot: 0,
      highBet: prevState.minBet,
      betInputValue: prevState.minBet,
      phase: 'initialDeal',
    }), () => {
      const configuredState = configureDeck(this.state.tutorialType ,this.state); // Configure the deck based on the tutorial type
      this.setState(configuredState, () => {
        console.log("Deck in state:", configuredState.deck);
        console.log("Players in state:", configuredState.players);
        console.log("tutorialType in state:", configuredState.tutorialType);
        console.log("rigged deck in state:", configuredState.riggedDeck);
        this.runGameLoop();
      });
    });
  }


  handleBetInputChange = (val, min, max) => {
    if (val === '') val = min
    if (val > max) val = max
      this.setState({
        betInputValue: parseInt(val, 10),
      });
  }
  
  changeSliderInput = (val) => {
    this.setState({
      betInputValue: val[0]
    })
  }

  pushAnimationState = (index, content) => {
    const newAnimationSwitchboard = Object.assign(
      {}, 
      this.state.playerAnimationSwitchboard,
      {[index]: {isAnimating: true, content}}     
    )
    this.setState({playerAnimationSwitchboard: newAnimationSwitchboard});
  }

  popAnimationState = (index) => {
    const persistContent = this.state.playerAnimationSwitchboard[index].content;
    const newAnimationSwitchboard = Object.assign(
      {}, 
      this.state.playerAnimationSwitchboard,
      {[index]: {isAnimating: false, content: persistContent}}     
    )
    this.setState({playerAnimationSwitchboard: newAnimationSwitchboard});
  }

  handleBetInputSubmit = (bet, min, max) => {
    const {playerAnimationSwitchboard, ...appState} = this.state;
    const { activePlayerIndex } = appState;
    this.pushAnimationState(activePlayerIndex, `${renderActionButtonText(this.state.highBet, this.state.betInputValue, this.state.players[this.state.activePlayerIndex])} ${(bet > this.state.players[this.state.activePlayerIndex].bet) ? (bet) : ""}`);
    const newState = handleBet(cloneDeep(appState), parseInt(bet, 10), parseInt(min, 10), parseInt(max, 10));

      this.setState(newState, () => {
        if((this.state.players[this.state.activePlayerIndex].robot) && (this.state.phase !== 'showdown')) {
          setTimeout(() => {
          
            this.handleAI()
          }, 1200)
        }
      });
  }

  handleFold = () => {
    const {playerAnimationSwitchboard, ...appState} = this.state
    const newState = handleFold(cloneDeep(appState));
      this.setState(newState, () => {
        if((this.state.players[this.state.activePlayerIndex].robot) && (this.state.phase !== 'showdown')) {
          setTimeout(() => {
          
            this.handleAI()
          }, 1200)
        }
      })
  }

  handleAI = () => {
    const {playerAnimationSwitchboard, ...appState} = this.state;
    const newState = handleAIUtil(cloneDeep(appState), this.pushAnimationState)

      this.setState({
            ...newState,
            betInputValue: newState.minBet
      }, () => {
        if((this.state.players[this.state.activePlayerIndex].robot) && (this.state.phase !== 'showdown')) {
          setTimeout(() => {

            this.handleAI()
          }, 1900)
        }
      })
  }

  renderBoard = () => {
    const { 
      players,
      activePlayerIndex,
      dealerIndex,
      clearCards,
      phase,
      playerAnimationSwitchboard
    } = this.state;
    // Reverse Players Array for the sake of taking turns counter-clockwise.
    const reversedPlayers = players.reduce((result, player, index) => {
      
      const isActive = (index === activePlayerIndex);
      const hasDealerChip = (index === dealerIndex);


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
            endTransition={this.popAnimationState}
          />
      )
      return result
    }, []);
    return reversedPlayers.map(component => component);
  }

  renderCommunityCards = (purgeAnimation) => {
    return this.state.communityCards.map((card, index) => {
      let cardData = {...card};
      if (purgeAnimation) {
        cardData.animationDelay = 0;
      }
      return(
        <Card key={index} cardData={cardData}/>
      );
    });
  }

  runGameLoop = () => {
    const newState = dealPrivateCards(cloneDeep(this.state)) // this is the error
    this.setState(newState, () => {
      if((this.state.players[this.state.activePlayerIndex].robot) && (this.state.phase !== 'showdown')) {
        setTimeout(() => {
          this.handleAI()
        }, 1200)
      }
    })
  }

  
  renderRankTie = (rankSnapshot) => {
    return rankSnapshot.map(player => {
      return this.renderRankWinner(player);
    })
  }

  renderRankWinner = (player) => {
    const { name, bestHand, handRank } = player;
    const playerStateData = this.state.players.find(statePlayer => statePlayer.name === name);
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
          <div className='showdown-player--besthand--cards' style={{alignItems: 'center'}}>
            {
              bestHand.map((card, index) => {
                // Reset Animation Delay
                const cardData = {...card, animationDelay: 0}
                return <Card key={index} cardData={cardData}/> 
              })
            }
          </div>
        </div>
        <div className="showdown--handrank">
          {handRank}
        </div>
        {renderNetPlayerEarnings(playerStateData.roundEndChips, playerStateData.roundStartChips)}
      </div>
    )
  }

  renderBestHands = () => {
    const { playerHierarchy } = this.state;

    return playerHierarchy.map(rankSnapshot => {
      const tie = Array.isArray(rankSnapshot);
      return tie ? this.renderRankTie(rankSnapshot) : this.renderRankWinner(rankSnapshot);
    })
  }

  handleNextRound = () => {
    this.setState({clearCards: true})
    const newState = beginNextRound(cloneDeep(this.state))
    // Check win condition
    if(checkWin(newState.players)) {
      this.setState({ winnerFound: true })
      return;
    }
      this.setState(newState, () => {
        if((this.state.players[this.state.activePlayerIndex].robot) && (this.state.phase !== 'showdown')) {
          setTimeout(() => this.handleAI(), 1200)
        }
      })
  }
  renderOddsBar() {
    const { odds } = this.state;
    console.log("odds rendered: ", odds)

    return (
      <div className="odds-bar-container">
        <div className="odds-bar" style={{ width: `${odds}%` }}></div>
      </div>
    );
  }

  renderActionButtons = () => {
    const { highBet, players, activePlayerIndex, phase, betInputValue } = this.state
    const min = determineMinBet(highBet, players[activePlayerIndex].chips, players[activePlayerIndex].bet)
    const max = players[activePlayerIndex].chips + players[activePlayerIndex].bet
    return ((players[activePlayerIndex].robot) || (phase === 'showdown')) ? null : (
      <React.Fragment>
        <button className='action-button' onClick={() => this.handleBetInputSubmit(betInputValue, min, max)}>
          {renderActionButtonText(highBet, betInputValue, players[activePlayerIndex])}
        </button>
        <button className='fold-button' onClick={() => this.handleFold()}>
          Fold
        </button>
      </React.Fragment>
      )
  }

  renderShowdown = () => {
    return(
      <div className='showdown-container--wrapper'>
        <h5 className="showdown-container--title">
          Round Complete!
        </h5>
        <div className="showdown-container--messages">
          { renderShowdownMessages(this.state.showDownMessages)}
        </div>
        <h5 className="showdown-container--community-card-label">
          Community Cards
        </h5>
        <div className='showdown-container--community-cards'>
          { this.renderCommunityCards(true) }
        </div>
        <button className="showdown--nextRound--button" onClick={() => this.handleNextRound()}> Next Round </button>
          { this.renderBestHands() }
      </div>
    )
  }

  renderGame = () => {
    console.log("rendering: ", this.state);
    const { highBet, players, activePlayerIndex, phase } = this.state;
    return (
      <div className='poker-app--background'>
        <div className="poker-table--container">
          {/* <img className="poker-table--table-image" src={tableImage} alt="Poker Table" /> */}
          <div className='player-container'>
          { this.renderBoard() }
          </div>
          <div className='community-card-container' >
            { this.renderCommunityCards() }
          </div>
          <div className='pot-container'>
            <img style={{height: 55, width: 55}} src={potImage} alt="Pot Value"/>
            <h4> {`${this.state.pot}`} </h4>
          </div>
        </div>
        { (this.state.phase === 'showdown') && this.renderShowdown() } 
        <div className='game-action-bar' >
          <div className='action-buttons'>
              { this.renderActionButtons() }
          </div>
          <div className='odds-calculator'>
          { this.renderOddsBar() }
        </div>
          <div className='slider-boi'>
            { (!this.state.loading)  && renderActionMenu(highBet, players, activePlayerIndex, phase, this.handleBetInputChange)}
          </div>
        </div>
      </div>
    )
  }


  
  render() {
    const { selectedOption } = this.context;
    console.log("Tutorial context:", this.context);
 return (
    <inGameContext.Consumer>
      {inGameContext => {
        inGameContext.setInGame(true);
        return (
          <div className="Poker">
            <div className='poker-table--wrapper'>
              {
                this.state.loading ? <Spinner /> : 
                this.state.winnerFound ? <WinScreen /> : 
                this.renderGame() //sort it here.
              }
            </div>
            <div className='poker-table--container'>
              <Exit />
            </div>
          </div>
        );
      }}
    </inGameContext.Consumer>

  );
  }
}

export default Tutorial;

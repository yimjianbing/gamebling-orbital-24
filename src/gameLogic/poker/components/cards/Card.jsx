import React from 'react';
import { 
  renderUnicodeSuitSymbol 
} from '../../utils/ui';
import chipImage from '../../../../assets/pokerGame/bet.svg';
import './Card.css';

const Card = (props) => {
  const { 
    cardData: {
      suit,
      cardFace,
      animationDelay
    },
    applyFoldedClassname
  } = props;
  const cardbg = (`../../../../assets/pokerCards/${suit}${cardFace}.png`);
  // const cardbg = (`../../../../assets/pokerCards/AHeart.png`);
  console.log(cardbg);

  return(
    <div 
      key={`${suit} ${cardFace}`} 
      className={`playing-card cardIn ${(applyFoldedClassname ? ' folded' : '')}`} 
      style={{animationDelay: `${(applyFoldedClassname) ?  0 : animationDelay}ms`}}>
      <h6
        className={`${suit}${cardFace}`}
        style={{
          // color: `${(suit === 'Diamond' || suit === 'Heart') ? 'red' : 'black'}`,
          // backgroundImage: `url(${chipImage})`,
          backgroundSize: 'cover',
          height: '150px',
          width: '105px',
        }} 
        >
        {/* {`${cardFace} ${renderUnicodeSuitSymbol(suit)}` } */}
      </h6>
    </div>
  )
}

export default Card;
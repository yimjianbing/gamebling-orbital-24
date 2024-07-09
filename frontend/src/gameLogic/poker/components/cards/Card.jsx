import {React, useContext} from 'react';
import { 
  renderUnicodeSuitSymbol 
} from '../../utils/ui';
import chipImage from '../../../../assets/pokerGame/bet.svg';
import './defaultCard.css';
import './whiteCard.css'
import './blackCard.css'
import { AuthContext } from '../../../../context/AuthContext';

const Card = (props) => {

  const { skin } = useContext(AuthContext);

  const { 
    cardData: {
      suit,
      cardFace,
      animationDelay
    },
    applyFoldedClassname
  } = props;



  return(
    <div 
      key={`${suit} ${cardFace}`} 
      className={`playing-card cardIn ${(applyFoldedClassname ? ' folded' : '')}`} 
      style={{animationDelay: `${(applyFoldedClassname) ?  0 : animationDelay}ms`}}>
      <h6
        className={`${suit}${cardFace}${skin}`}
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
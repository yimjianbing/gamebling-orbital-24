import { React, useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext';

const HiddenCard = (props) => {

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
      className={`playing-card cardIn robotcard${(applyFoldedClassname ? ' folded' : '')}`} 
      style={{animationDelay: `${(applyFoldedClassname) ?  0 : animationDelay}ms`}}>
    </div>
  )
}

export default HiddenCard;
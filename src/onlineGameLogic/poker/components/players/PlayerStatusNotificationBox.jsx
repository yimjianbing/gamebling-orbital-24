import React, { forwardRef } from 'react';
import { CSSTransition } from 'react-transition-group';

const PlayerStatusNotificationBox = forwardRef(({ index, isActive, content, endTransition }, ref) => (
  <CSSTransition 
    in={isActive} 
    timeout={{
      appear: 0,
      enter: 0,
      exit: 1250,
    }}
    classNames="transitionable-actionBox" 
    onEntered={() => {
      setTimeout(() => {
        endTransition(index);
      }, 25);
    }}
    nodeRef={ref}
  >
    <div ref={ref} className="actionBox">
      {`${content}`}
    </div>
  </CSSTransition>
));

export default PlayerStatusNotificationBox;
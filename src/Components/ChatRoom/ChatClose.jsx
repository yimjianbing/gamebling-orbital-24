import React from "react";
import './ChatClose.css';


const ChatClose = ({setChatOpen}) => {
    return <button onClick={() => setChatOpen(true)} className="chat-close">Open Chat</button>
}


export default ChatClose;
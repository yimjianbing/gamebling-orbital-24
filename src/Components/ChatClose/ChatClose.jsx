import React from "react";
import './ChatClose.css';
import { IoMdChatboxes } from "react-icons/io";


const ChatClose = ({setChatOpen}) => {
    return  <div className="openChatTab" onClick={() => setChatOpen(true)} data-testid="chatClose">
                Open In Game Chat
                <IoMdChatboxes className="openChatIcon" data-testid="openChat"/>
            </div>
}


export default ChatClose;
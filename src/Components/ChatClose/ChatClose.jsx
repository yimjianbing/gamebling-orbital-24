import React from "react";
import './ChatClose.css';
import { IoMdChatboxes } from "react-icons/io";


const ChatClose = ({setChatOpen}) => {
    return  <div className="openChatTab" onClick={() => setChatOpen(true)} >
                Open In Game Chat
                <IoMdChatboxes className="openChatIcon"/>
            </div>
}


export default ChatClose;
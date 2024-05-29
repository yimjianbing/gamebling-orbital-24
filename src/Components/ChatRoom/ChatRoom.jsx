import React, { useState, useEffect, useContext, useRef } from "react";
import { db, auth } from "../../auth/firebase-config.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import "./ChatRoom.css";
import { AuthContext } from "../../context/AuthContext.jsx";
import { IoCloseOutline } from "react-icons/io5";

export const ChatRoom = ({ setChatOpen }) => {
  const {currentUserLoggedIn } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = [];
      snapshot.forEach((doc) => {
        messagesData.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messagesData);
    });
    return unsubscribe;
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      scrollToBottom();
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        user: currentUserLoggedIn.displayName || "Anonymous",
        timestamp: new Date(),
      });
      setNewMessage("");
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="chat-room">
      <nav>
        <IoCloseOutline
          onClick={() => setChatOpen(false)}
          className="closeChatIcon"
        />
      </nav>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <strong>{message.user}:</strong> {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};
export default ChatRoom;

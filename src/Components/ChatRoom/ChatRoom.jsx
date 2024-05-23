import React, { useState, useEffect, useContext } from 'react';
import { db, auth } from '../../auth/firebase-config.js';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import './ChatRoom.css';
import { AuthContext } from '../../auth/AuthContext.jsx';

export const ChatRoom = ({ setChatOpen }) => {
    const { currentUserLoggedIn } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('timestamp'));
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
            await addDoc(collection(db, 'messages'), {
                text: newMessage,
                user: currentUserLoggedIn.displayName || 'Anonymous',
                timestamp: new Date(),
            });
            setNewMessage('');
        }
    };

    return (
        <div>
            <p>
                <button onClick={() => setChatOpen(false)} className="chat-close">Close Chat</button>
            </p>
            <div className="chat-room">
                <div className="messages">
                    {messages.map((message) => (
                        <div key={message.id} className="message">
                            <strong>{message.user}:</strong> {message.text}
                        </div>
                    ))}
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
        </div>
    );
};
export default ChatRoom;

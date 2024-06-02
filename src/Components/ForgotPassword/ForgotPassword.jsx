import React, { useState } from "react";
import { auth } from "../../auth/firebase-config";
import { sendPasswordResetEmail } from "firebase/auth";
import './ForgotPassword.css';
import { IoCloseOutline } from "react-icons/io5";

const ForgotPassword = ({ setShowForgotPassword }) => {
    
    const [email, setEmail] = useState('');

    
    function handleForgotPassword() {
        sendPasswordResetEmail(auth, email)
        .then(() => {
            // Email sent.
            // alert("Password reset email sent!");
        })
        .catch((error) => {
            // An error occurred.
            var errorMessage = error.message;
            alert(errorMessage);
        });
        setShowForgotPassword(false);
    }


    return (
        <div className="forgot-password">
        <div className="forgot-password-container">
            <h1>Forgot Password</h1>
            <p>Enter your email address and we will send you a link to reset your password.</p>
            <IoCloseOutline className="closeForgotPasswordIcon" onClick={() => setShowForgotPassword(false)} />
            <form>
            <input className="emailInput"
                type="email"               
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email" />
            </form>
            <button className='sendForgotPassword'onClick={handleForgotPassword}>Send</button>
        </div>
        </div>
    );
}

export default ForgotPassword;
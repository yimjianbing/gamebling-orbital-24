import React , {useState} from "react";
import "./LoginRegister.css"
import { HiMiniUser, HiMiniKey } from "react-icons/hi2";
import { HiMail } from "react-icons/hi";

const LoginRegister = () => {


    const [action, setAction] = useState('');

    const registerLink = () => {
        setAction(' active');
    }

    const loginLink = () => {
        setAction('');
    }

    

    return (
        <div className ={`wrapper${action}`}>
            <div className="form-box login">
                <form action="">
                    <h1 className="topOfBox">Login</h1>
                    <div className="input-box">
                        <input type="email" placeholder="Email" required />
                        <HiMail className="icon" size={24}/>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" required />
                        <HiMiniKey className="icon" size={24}/>
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" />
                        Remember me</label>
                        <a href="#">Forgot password?</a>
                    </div>

                    <button className="login-register-button" type="submit">Login</button>

                    <div className="register-link">
                        <p className="haveAccount">Don't have an account?
                            <a href="#" onClick={registerLink}> Register</a>
                        </p>
                    </div>
                </form>
            </div>

            <div className="form-box register">
                <form action="">
                    <h1 className="topOfBox">Registration</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Username" required />
                        <HiMiniUser className="icon" size={24}/>
                    </div>
                    <div className="input-box">
                        <input type="email" placeholder="Email" required />
                        <HiMail className="icon" size={24}/>
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" required />
                        <HiMiniKey className="icon" size={24}/>
                    </div>

                    <div className="remember-forgot">
                        <label><input type="checkbox" />
                        I agree to the terms & conditions</label>
                    </div>

                    <button className="login-register-button"type="submit">Register</button>

                    <div className="register-link">
                        <p className="haveAccount">Already have an account?
                            <a href="#" onClick={loginLink}> Login</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginRegister;
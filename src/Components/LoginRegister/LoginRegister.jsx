import React, { useState } from "react";
import "./LoginRegister.css";
import { HiMiniUser, HiMiniKey } from "react-icons/hi2";
import { HiMail } from "react-icons/hi";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "./firebase-config";
import { validateField, validatePassword } from "./validators";

const LoginRegister = () => {
  const [action, setAction] = useState("");

  const registerLink = () => {
    setAction(" active");
  };

  const loginLink = () => {
    setAction("");
  };

  //set up register using firebase auth

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async (e) => {
    e.preventDefault();

    //Validate input fields
    if (validatePassword(password) == false) {
      alert("Invalid email/password!");
      return;
      //bad input
    }

    if (validateField(name) == false) {
      alert("One or more characters is needed for username!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(function () {
        alert("User Created!");
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
      });
  };

  //set up login using firebase auth

  const login = async (e) => {
    e.preventDefault();

    //Validate input fields
    if (validatePassword(password) == false) {
      alert("Invalid email/password!");
      return;
      //bad input
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(function () {
        alert("User Logged in successful!");
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
      });
  };

  return (
    <div className={`wrapper${action}`}>
      <div className="form-box login">
        <form action="">
          <h1 className="topOfBox">Login</h1>
          <div className="input-box">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <HiMail className="icon" size={24} />
          </div>
          <div className="input-box">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <HiMiniKey className="icon" size={24} />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button
            className="login-register-button"
            type="submit"
            onClick={login}
          >
            Login
          </button>

          <div className="register-link">
            <p className="haveAccount">
              Don't have an account?
              <a href="#" onClick={registerLink}>
                {" "}
                Register
              </a>
            </p>
          </div>
        </form>
      </div>

      <div className="form-box register">
        <form action="">
          <h1 className="topOfBox">Registration</h1>
          <div className="input-box">
            <input
              type="text"
              value={name}
              placeholder="Username"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <HiMiniUser className="icon" size={24} />
          </div>
          <div className="input-box">
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <HiMail className="icon" size={24} />
          </div>
          <div className="input-box">
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <HiMiniKey className="icon" size={24} />
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" />I agree to the terms & conditions
            </label>
          </div>

          <button
            className="login-register-button"
            type="submit"
            onClick={register}
          >
            Register
          </button>

          <div className="register-link">
            <p className="haveAccount">
              Already have an account?
              <a href="#" onClick={loginLink}>
                {" "}
                Login
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;

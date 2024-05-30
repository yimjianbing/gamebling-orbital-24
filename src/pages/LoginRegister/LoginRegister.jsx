import React, { useState } from "react";
import "./LoginRegister.css";
import { HiMiniUser, HiMiniKey } from "react-icons/hi2";
import { HiMail } from "react-icons/hi";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from '../../auth/firebase-config';
import { validateField, validatePassword } from "../../utils/validators";
import { useNavigate } from "react-router-dom";


const LoginRegister = () => {
  const navigate = useNavigate();
  const [action, setAction] = useState("");

  const registerLink = () => {
    // console.log("help");
    setAction(" active");
  };

  const loginLink = () => {
    setAction("");
  };

  //set up register using firebase auth

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function navToMainMenu() {
    navigate("/mainmenu")
  }

  const register = async (e) => {
    e.preventDefault();

    //Validata input fields
    if (validatePassword(password) === false) {
      alert("Invalid email/password!");
      return;
      //bad input
    }

    if (validateField(name) === false) {
      alert("One or more characters is needed for username!");
      return;
    }

    await createUserWithEmailAndPassword(auth, email, password)
      .then(function () {
        alert("User Created!");
      }).then(() => {
      }).catch(function (error) {
        // var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
      });

    updateProfile(auth.currentUser, {displayName: name})
    .catch(function (error) {
      // var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    })

  };

  //set up login using firebase auth

  const login = async (e) => {
    e.preventDefault();

    //Validata input fields
    if (validatePassword(password) === false) {
      alert("Invalid email/password!");
      return;
      //bad input
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(function () {
        // alert("User Logged in successful!");
        navToMainMenu();
      })
      .catch(function (error) {
        // var errorCode = error.code;
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
              data-testid="loginEmail"
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
              data-testid="loginPassword"
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
            <div>Forgot password?</div>
          </div>

          <button
            data-testid="loginSubmit"
            className="login-register-button"
            type="submit"
            onClick={login}
          >
            Login
          </button>

          <div className="register-link">
            <p className="haveAccount">
              Don't have an account? 
            </p>
            <p className="regNavBtn" onClick={registerLink}>
                {" "}
                Register
            </p>
          </div>
        </form>
      </div>

      <div className="form-box register">
        <form action="">
          <h1 className="topOfBox">Registration</h1>
          <div className="input-box">
            <input
              data-testid="username"
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
              data-testid="registerEmail"
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
              data-testid="registerPassword"
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
            data-testid="registerSubmit"
            className="login-register-button"
            type="submit"
            onClick={register}
          >
            Register
          </button>

          <div className="register-link">
            <p className="haveAccount">
              Already have an account?
            </p>
            <p className="logNavBtn" onClick={loginLink}>
                {" "}
                Login
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
